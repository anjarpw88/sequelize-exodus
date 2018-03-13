#!/usr/bin/env node
console.log('Sequelize Exodus!');
const FileRW = require('./lib/file-rw');
const program = require('commander-plus');
var SequelizeExodus = require('./lib/sequelize-exodus');
const Actions = require('./actions');
module.exports = SequelizeExodus;

let {
  consoleOpt,
  print,
  printError,
  waitPrompt,
  waitPass,
  waitChoose,
  waitConfirm
} = require("./extended-prompt");


let {
 mainOptions,
 changeToLoggedInState,
 chooseMainAction
} = require("./main-options");



var sequelizeExodus = new SequelizeExodus();


function addLoginOptions(cmd){
  return cmd
  .option('-u, --username <username>', 'username')
  .option('-x, --password <password>', 'password')
  .option('-d, --database <database>', 'database')
  .option('-h, --host <host>', 'host')
  .option('-p, --port <port>', 'port')
  .option('-t, --dialect <dialect>', 'dialect');
}

const addMigrationSettingOptions = function(cmd){
  return cmd
  .option('-o, --output-path <outputPath>', 'output path')
  .option('--from-version <fromVersion>', 'from version of structure in the databse')
  .option('--current-version <currentVersion>', 'new version of structure in the directory')
  .option('--migration-name <migrationName>', 'name of this migration');

}


function extractDbConn(env){
  return {
    username:env.username,
    host:env.host,
    port:env.port,
    password:env.password,
    database:env.database,
    dialect: env.dialect
  };
}

addLoginOptions(program.command('import'))
  .option('-o, --output-dir <outputDir>', 'output directory')
  .action(async function(env){
    if(FileRW.isValidDirectory(env.outputDir)){
      printError("\tCannot generate directory");
      printError('\t\t"'+env.outputDir+'"', ". The directory exists.");
      return;
    }

    try{
      var conn = extractDbConn(env);
      await Actions.doLoginDb(conn);
      await Actions.doImportDb(env.outputDir);
    }catch(e){
      console.log(e);
    }
    process.exit();
  });

addLoginOptions(program.command('migrate'))
  .option('--path <path>', 'migration path')
  .action(async function(env){
    try{
      if(!FileRW.isValidFile(env.path)){
        printError("\tMigration script at location");
        printError('\t\t"'+env.path+'"', "cannot be found");
        return;
      }

      var conn = extractDbConn(env);
      await Actions.doLoginDb(conn);
      await Actions.doMigrateDb(env.path);
    }catch(e){
      console.log(e);
    }
    process.exit();
  });

addMigrationSettingOptions(
  addLoginOptions(program.command('compare-db'))
)
  .option('--ref-dir <referredDir>', 'referred directory')
  .action(async function(env){
    try{
      if(!FileRW.isValidDirectory(env.refDir)){
        printError("\tStructure directory (new models) at location");
        printError('\t\t"'+env.refDir+'"', "does not exist");
        isBadParameter = true;
      }
      if(FileRW.isValidFile(env.outputPath)){
        printError("\tCannot generate script at ");
        printError('\t\t"'+env.outputPath+'"', ". There is an existing file");
        isBadParameter = true;
      }
      if(isBadParameter){
        return;
      }

      var conn = extractDbConn(env);
      await Actions.doLoginDb(conn);
      await Actions.doCompareDb(env.refDir, env.outputPath, {
        fromVersion: env.fromVersion,
        currentVersion:env.currentVersion,
        migrationName:env.migrationName
      });
    }catch(e){
      console.log(e);
    }
    process.exit();
  });

addMigrationSettingOptions(program.command('compare-local'))
  .option('-o, --output-path <outputPath>', 'output path')
  .option('--old-dir <oldDir>', 'directory of old structure')
  .option('--new-dir <newDir>', 'directory of new structure')
  .action(async function(env){
    try{
      var isBadParameter = false;
      if(!FileRW.isValidDirectory(env.newDir)){
        printError("\tStructure directory (new models) at location");
        printError('\t\t"'+env.newDir+'"', "does not exist");
        isBadParameter = true;
      }
      if(!FileRW.isValidDirectory(env.oldDir)){
        printError("\tStructure directory (old models) at location");
        printError('\t\t"'+env.oldDir+'"', "does not exist");
        isBadParameter = true;
      }
      if(FileRW.isValidFile(env.outputPath)){
        printError("\tCannot generate script at ");
        printError('\t\t"'+env.outputPath+'"', ". There is an existing file");
        isBadParameter = true;
      }
      if(isBadParameter){
        return;
      }

      await Actions.doCompareLocal(env.newDir, env.oldDir,  env.outputPath, {
        fromVersion: env.fromVersion,
        currentVersion:env.currentVersion,
        migrationName:env.migrationName
      });
    }catch(e){
      console.log(e);
    }
    process.exit();
  });


addLoginOptions(program.command('login'))
  .action(async function(env){
    try{
      var conn = extractDbConn(env);
      await Actions.doLoginDb(conn);
      await changeToLoggedInState();
      await chooseMainAction();
    }catch(e){
      console.log(e);
    }
    process.exit();
  });


program
  .command("interactive", "interactive menu")
  .action(async function(){
    await chooseMainAction()
    .catch((e)=>{
      console.log(e);
    });
  });

program.parse(process.argv);
