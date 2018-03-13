let {
  consoleOpt,
  print,
  printError,
  waitPrompt,
  waitPass,
  waitChoose,
  waitConfirm,
  waitOptionPrompt
} = require("./extended-prompt");
const Actions = require('./actions');

const FileRW = require('./lib/file-rw');

var needLogin = ()=>{
  print(consoleOpt.FgRed+"You are required to login before accessing this menu"+consoleOpt.Reset);
  loginDb();
}



const loginDb = async function(){
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
      await Actions.doLoginDb({
        database,
        username,
        password,
        dialect,
        host,
        port
      });
      changeToLoggedInState();
      isTrying=false;
    }catch(e){
      print("Unable to login to database");
      var isTrying = await waitConfirm("Retry (Y/N)?");
    }
  }
  await chooseMainAction();
}
const importDb = async ()=>{
  var outputDir = await waitPrompt("In which folder do you want to store it?", (val) => {
    if(FileRW.isValidDirectory(val)){
      printError("\tCannot generate directory");
      printError('\t\t"'+val+'"', ". The directory exists.");
      return false;
    }
    return true;
  });
  await Actions.doImportDb(outputDir);
  await chooseMainAction();
}
const compareDb = async ()=>{
  var referredDir = await waitPrompt("In which directory is the new version?",(val) => {
    if(!FileRW.isValidDirectory(val)){
      printError("\tStructure directory (new models) at location");
      printError('\t\t"'+val+'"', "does not exist");
      return false;
    }
    return true;
  });
  var outputPath = await waitPrompt("In which path do you want to store the migration script?", (val) => {
    if(FileRW.isValidFile(val)){
      printError("\tCannot generate script at ");
      printError('\t\t"'+val+'"', ". There is an existing file");
      return false;
    }
    return true;
  });
  var migrationName = await getMigrationName();
  await Actions.doCompareDb(referredDir, outputPath, migrationName);
  await chooseMainAction();
}

const migrateDb = async ()=>{
  var path = await waitPrompt("Where is the path to the migration script?", (val) => {
    if(!FileRW.isValidFile(val)){
      printError("\tMigration script at location");
      printError('\t\t"'+val+'"', "cannot be found");
      return false;
    }
    return true;
  });
  await Actions.doMigrateDb(path);
  await chooseMainAction();
}
const getMigrationName = async ()=>{
  var migrationName = await waitPrompt("How are you going to call this migration?");
  return migrationName;
}


const changeToLoggedInState = async function(){
  mainOptions.importDb.todo = importDb;
  mainOptions.compareDb.todo = compareDb;
  mainOptions.migrateDb.todo = migrateDb;
  mainOptions.importDb.status = "";
  mainOptions.compareDb.status = "";
  mainOptions.migrateDb.status = "";
  delete mainOptions.loginDb;
}

const compareLocal = async function(){
  var newDir = await waitPrompt("In which directory is the new version?",(val) => {
    if(!FileRW.isValidDirectory(val)){
      printError("\tStructure directory (new models) at location");
      printError('\t\t"'+val+'"', "does not exist");
      return false;
    }
    return true;
  });
  var oldDir = await waitPrompt("In which directory is the old version?",(val) => {
    if(!FileRW.isValidDirectory(val)){
      printError("\tStructure directory (old models) at location");
      printError('\t\t"'+val+'"', "does not exist");
      return false;
    }
    return true;
  });
  var outputPath = await waitPrompt("In which path do you want to store the migration script?", (val) => {
    if(FileRW.isValidFile(val)){
      printError("\tCannot generate script at ");
      printError('\t\t"'+val+'"', ". There is an existing file");
      return false;
    }
    return true;
  });
  var migrationName = await getMigrationName();
  await Actions.doCompareLocal(newDir, oldDir, outputPath, migrationName);
  await chooseMainAction(mainOptions);
}
const chooseMainAction = async function(){
  var item = await waitOptionPrompt(mainOptions);
  return item.todo();
}




var mainOptions = {
    loginDb:{
      todo:loginDb,
      description:"LOGIN DB, to database and unlock menus",
      status: consoleOpt.Bright + consoleOpt.FgGreen
    },
    compareLocal:{
      todo: compareLocal,
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


module.exports = {
  mainOptions,
  changeToLoggedInState,
  chooseMainAction
}
