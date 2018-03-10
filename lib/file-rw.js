const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const CompactTableModel = require('./compact-table-model');
const CompactStructure = require('./compact-structure');
const ToolConverters = require('./tool-converters');

const ScriptComposerForMigration = require('./script-composer-for-migration');
var scriptComposer = new ScriptComposerForMigration();

require("array-async-tools");

class FileRW{
  constructor(){

  }
}

const getCompactStructureFromFiles = function(files){
  var compactStructure = new CompactStructure();
  files.forEach((file)=>{
    var compactTable = require(file);
    compactStructure.addTable(compactTable.tableName,compactTable);
  })
  return compactStructure;
}

FileRW.generateMigrationScript = async function(filePath, migrationProperties, actions){
  var dir = path.dirname(filePath);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  var composedString = scriptComposer.composeFile(migrationProperties,actions);

  var p = new Promise((resolve,reject) => {
    fs.writeFile(filePath, composedString, function(err) {
      if(err) {
          return console.log(err);
      }
      resolve();
    });
  });
  await p;
}

FileRW.saveCompactStructureFromImport = async function(dir, versatileStructure){
  const ScriptComposerForTable = require('./script-composer-for-table');
  var scriptComposer = new ScriptComposerForTable();
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  await Object.keys(versatileStructure.tables).awaitAll((tableName)=>{
    filePath = path.join(dir, tableName);
    var versatileTableModel= versatileStructure.tables[tableName];

    return new Promise((resolve,reject) => {
      var composedString = scriptComposer.composeFile(versatileTableModel);
      fs.writeFile(filePath+".js", composedString, function(err) {
        if(err) {
            return console.log(err);
        }
        resolve();
      });
    });
  });
}

FileRW.readDirectory = function(dir){

  var dir = path.join(__dirname, "..", dir);
  return new Promise(async (resolve, reject)=>{
    fs.readdir( dir, async function( err, files ) {
      if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
      }

      var filePaths = [];
      await files.awaitAll( async (file,index) => {
        var fromPath = path.join( dir,file);
        filePaths.push(fromPath);
      });
      var compactStructure = getCompactStructureFromFiles(filePaths);
      resolve(compactStructure);

    });
  });
}

FileRW.readMigrationFile = function(filePath){
  var dirName = path.dirname(filePath);
  var fileNameWithoutExtension = path.basename(filePath);
  var newFilePath = path.join(__dirname, "..", dirName, fileNameWithoutExtension);
  var migrationScript = require(newFilePath);
  console.log("migrationScript",migrationScript);
  return migrationScript;
}

module.exports = FileRW;
