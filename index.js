
var SequelizeExodus = require('./lib/sequelize-exodus');

module.exports = SequelizeExodus;

const program = require('commander-plus');

var sequelizeExodus = new SequelizeExodus();
var print = console.log;

var waitPrompt = function(message){
  return new Promise((resolve)=>{
    message =  consoleOpt.Bright + consoleOpt.FgYellow + message + consoleOpt.VReset;
    program.prompt(message, (answer)=>{
      resolve(answer);
    });
  });
}

var waitPass = function(message, mask){
  return new Promise((resolve)=>{
    message = consoleOpt.Bright + consoleOpt.FgYellow + message+consoleOpt.VReset;
    program.password(message, mask, function(pass){
      resolve(pass);
    });
  });
}
var waitChoose = async function(message, selections){
  return new Promise((resolve)=>{
    message = consoleOpt.Bright + consoleOpt.FgYellow + message+consoleOpt.VReset;
    print(message);
    program.choose(selections, function(i){
      resolve(i);
    });
  });
}
var waitConfirm = async function(message){
  return new Promise((resolve)=>{
    message = consoleOpt.Bright + consoleOpt.FgYellow + message+consoleOpt.VReset;
    program.confirm(message, function(ok){
      resolve(ok);
    });
  });
}

var consoleOpt = {}
consoleOpt.Reset = "\x1b[0m";
consoleOpt.Bright = "\x1b[1m";
consoleOpt.Dim = "\x1b[2m";
consoleOpt.Underscore = "\x1b[4m";
consoleOpt.Blink = "\x1b[5m";
consoleOpt.Reverse = "\x1b[7m";
consoleOpt.Hidden = "\x1b[8m";
consoleOpt.FgBlack = "\x1b[30m";
consoleOpt.FgRed = "\x1b[31m";
consoleOpt.FgGreen = "\x1b[32m";
consoleOpt.FgYellow = "\x1b[33m";
consoleOpt.FgBlue = "\x1b[34m";
consoleOpt.FgMagenta = "\x1b[35m";
consoleOpt.FgCyan = "\x1b[36m";
consoleOpt.FgWhite = "\x1b[37m";
consoleOpt.BgBlack = "\x1b[40m";
consoleOpt.BgRed = "\x1b[41m";
consoleOpt.BgGreen = "\x1b[42m";
consoleOpt.BgYellow = "\x1b[43m";
consoleOpt.BgBlue = "\x1b[44m";
consoleOpt.BgMagenta = "\x1b[45m";
consoleOpt.BgCyan = "\x1b[46m";
consoleOpt.BgWhite = "\x1b[47m";
consoleOpt.VReset = consoleOpt.Reset +" ";

const waitOptionPrompt = async function(options){
  print(consoleOpt.Reset);
  var answer = null;
  var selections = Object.keys(options).map(key=>{
    var str = options[key].status || "";
    return str + options[key].description + consoleOpt.Reset;
  });

  var id = await waitChoose("Please choose any of these", selections);
  key =  Object.keys(options)[id];
  print(consoleOpt.Reset);
  return options[key];
}
const doLoginDb = async function(){
  var isTrying  = true;
  while(isTrying){
    var dialectOptions = ["mysql","postgres","mssql"];
    var dialectIdx = await waitChoose("Dialect",dialectOptions);
    var dialect = dialectOptions[dialectIdx];
    var host = await waitPrompt("Host");
    var port = await waitPrompt("Port");
    var database = await waitPrompt("Database Name");
    var username = await waitPrompt("Enter UserName");
    var password = await waitPass("Enter Password","*");
    try{
      var login = await sequelizeExodus.login({
        database,
        username,
        password,
        dialect,
        host,
        port
      });
      isTrying=false;
      console.log("logged in to database\r\n");
      mainOptions.importDb.todo = doImportDb;
      mainOptions.compareDb.todo = doCompareDb;
      mainOptions.migrateDb.todo = doMigrateDb;
      mainOptions.importDb.status = "";
      mainOptions.compareDb.status = "";
      mainOptions.migrateDb.status = "";

    }catch(e){
      print("Unable to login to database");
      var isTrying = await waitConfirm("Retry (Y/N)?");
    }
  }
  chooseAction(mainOptions);
}

const doImportDb = async ()=>{
  var compactStructure = await sequelizeExodus.importCompactStructureFromDb();
  try{
    var directory = await waitPrompt("In which folder do you want to store it?");
    await sequelizeExodus.saveCompactStructureFromImport(directory,compactStructure);
    console.log("data stored successfully");
  }catch(e){
    console.log(e);
  }
  chooseAction(mainOptions);
}
const doCompareDb = async ()=>{
  var compactStructure = await sequelizeExodus.importCompactStructureFromDb();
  var newDir = await waitPrompt("In which directory is the new version?");
  var migrationInfo = await getMigrationInfo();
  var comparison = await sequelizeExodus.compareCompactStructureWithDb(compactStructure);
  var path = await waitPrompt("In which path do you want to store the migration script?");
  await sequelizeExodus.saveComparisonIntoMigrationFile(comparison, migrationInfo, path);
  chooseAction(mainOptions);
}
const doMigrateDb = async ()=>{
  var path = await waitPrompt("Where is the path to the migration script?");
  await sequelizeExodus.migrateWithMigrationFiles(path);
  chooseAction(mainOptions);
}
const getMigrationInfo = async ()=>{
  var currentVersion = await waitPrompt("How are you going to name the new version? ");
  var fromVersion = await waitPrompt("what is the name of old version?");
  var migrationName = await waitPrompt("How are you going to call this migration?");
  return {
    currentVersion,
    fromVersion,
    migrationName
  };
}


const doCompareLocal = async ()=>{
  var sequelizeExodus = new SequelizeExodus();
  var newDir = await waitPrompt("In which directory is the new version?");
  var oldDir = await waitPrompt("In which directory is the old version?");
  var comparison = await sequelizeExodus.compareTwoCompactStructures(newDir, oldDir);
  var migrationInfo = await getMigrationInfo();
  var path = await waitPrompt("In which path do you want to store the migration script?");
  await sequelizeExodus.saveComparisonIntoMigrationFile(comparison, migrationInfo, path);

  chooseAction(mainOptions);
}

var needLogin = ()=>{
  print(consoleOpt.FgRed+"You are required to login before accessing this menu"+consoleOpt.Reset);
  doLoginDb();
}

var mainOptions = {
    loginDb:{
      todo:doLoginDb,
      description:"LOGIN DB, to database and unlock menus",
      status: consoleOpt.Bright + consoleOpt.FgGreen
    },
    compareLocal:{
      todo: doCompareLocal,
      description:"COMPARE LOCAL: between two local model-scripts and generate migration script",
    },
    importDb:{
      todo:needLogin,
      description:"IMPORT DB, Import database schema and save into local directory",
      status: consoleOpt.Dim + consoleOpt.FgRed
    },
    compareDb:{
      todo:needLogin,
      description:"COMPARE DB, against local model-scripts and generate migration script",
      status: consoleOpt.Dim + consoleOpt.FgRed
    },
    migrateDb:{
      todo:needLogin,
      description:"MIGRATE DB, using migration script",
      status: consoleOpt.Dim + consoleOpt.FgRed
    },
    exit:{
      todo:()=>{
        process.exit();
      },
      description:"EXIT",
    }
}
async function chooseAction(options){
  var item = await waitOptionPrompt(options);
  return item.todo();
}

chooseAction(mainOptions)
.catch((e)=>{
  console.log(e);
})
