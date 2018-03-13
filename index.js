#!/usr/bin/env node
console.log('Sequelize Exodus!');
const FileRW = require('./lib/file-rw');
const program = require('commander-plus');
var SequelizeExodus = require('./lib/sequelize-exodus');
const Actions = require('./actions');
const path = require('path');
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

function relativePath(str){
  return path.join(process.cwd(),str);
}


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
    var outputDir = relativePath(env.outputDir);

    if(FileRW.isValidDirectory(outputDir)){
      printError("\tCannot generate directory");
      printError('\t\t"'+outputDir+'"', ". The directory exists.");
      return;
    }

    try{
      var conn = extractDbConn(env);
      await Actions.doLoginDb(conn);
      await Actions.doImportDb(outputDir);
    }catch(e){
      console.log(e);
    }
    process.exit();
  });

addLoginOptions(program.command('migrate'))
  .option('--path <path>', 'migration path')
  .action(async function(env){
    try{
      var envPath = relativePath(env.path);

      if(!FileRW.isValidFile(envPath)){
        printError("\tMigration script at location");
        printError('\t\t"'+envPath+'"', "cannot be found");
        return;
      }

      var conn = extractDbConn(env);
      await Actions.doLoginDb(conn);
      await Actions.doMigrateDb(envPath);
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
      var refDir = relativePath(env.refDir);
      var outputPath = relativePath(env.outputPath);

      if(!FileRW.isValidDirectory(refDir)){
        printError("\tStructure directory (new models) at location");
        printError('\t\t"'+refDir+'"', "does not exist");
        isBadParameter = true;
      }
      if(FileRW.isValidFile(outputPath)){
        printError("\tCannot generate script at ");
        printError('\t\t"'+outputPath+'"', ". There is an existing file");
        isBadParameter = true;
      }
      if(isBadParameter){
        return;
      }

      var conn = extractDbConn(env);
      await Actions.doLoginDb(conn);
      await Actions.doCompareDb(refDir, outputPath, env.migrationName);
    }catch(e){
      console.log(e);
    }
    process.exit();
  });


addMigrationSettingOptions(program.command('compare-local'))
  .option('--old-dir <oldDir>', 'directory of old structure')
  .option('--new-dir <newDir>', 'directory of new structure')
  .action(async function(env){
    try{
      var isBadParameter = false;
      var newDir = relativePath(env.newDir);
      var oldDir = relativePath(env.oldDir);
      var outputPath = relativePath(env.outputPath);
      if(!FileRW.isValidDirectory(newDir)){
        printError("\tStructure directory (new models) at location");
        printError('\t\t"'+newDir+'"', "does not exist");
        isBadParameter = true;
      }
      if(!FileRW.isValidDirectory(oldDir)){
        printError("\tStructure directory (old models) at location");
        printError('\t\t"'+oldDir+'"', "does not exist");
        isBadParameter = true;
      }
      if(FileRW.isValidFile(outputPath)){
        printError("\tCannot generate script at ");
        printError('\t\t"'+outputPath+'"', ". There is an existing file");
        isBadParameter = true;
      }
      if(isBadParameter){
        return;
      }
      await Actions.doCompareLocal(newDir, oldDir,  outputPath, env.migrationName);
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
