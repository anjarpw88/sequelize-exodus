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
FileRW.isValidFile = function (path){
  try{

    return fs.lstatSync(path).isFile();
  }catch(e){
    return false;
  }
}

FileRW.isValidDirectory = function (path){
  try{

    return fs.lstatSync(path).isDirectory();
  }catch(e){
    return false;
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

const makeDirectory = function(directory){
  var shell = require('shelljs');
  shell.mkdir('-p', directory);
}

FileRW.generateMigrationScript = async function(filePath, comparisonObject, migrationName, actions){
  var dir = path.dirname(filePath);
  makeDirectory(dir);
  var composedString = scriptComposer.composeFile({
    migrationName,
    fromVersion: comparisonObject.oldStructure.version,
    currentVersion: comparisonObject.newStructure.version,
  },actions);

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

FileRW.saveCompactStructureFromImport = async function(dir, compactStructure){
  const ScriptComposerForTable = require('./script-composer-for-table');
  var scriptComposer = new ScriptComposerForTable();
  makeDirectory(dir);
  await new Promise((resolve)=>{
    var filePath = path.join(dir, ".dbver");
    var content = {
        version:compactStructure.version
    };
    fs.writeFile(filePath, JSON.stringify(content, null, "  "), function(err) {
      if(err) {
          return console.log(err);
      }
      resolve();
    });
  });

  await Object.keys(compactStructure.tables).awaitAll((tableName)=>{
    var filePath = path.join(dir, tableName);
    var compactTableModel= compactStructure.tables[tableName];
    return new Promise((resolve,reject) => {
      var composedString = scriptComposer.composeFile(compactTableModel);
      fs.writeFile(filePath+".js", composedString, function(err) {
        if(err) {
            return console.log(err);
        }
        resolve();
      });
    });
  });
}

FileRW.readDirectory = async function(dir){

  var dir = path.join(dir);
  var filePath = path.join(dir, ".dbver");

  var versionInfo = await new Promise((resolve)=>{
    fs.readFile(filePath, function read(err, data) {
      if (err) {
          throw err;
      }
      resolve(JSON.parse(data));
    });
  });

  return new Promise(async (resolve, reject)=>{
    fs.readdir( dir, async function( err, files ) {
      if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
      }

      var filePaths = [];
      files.forEach((file,index) => {
        var fromPath = path.join(process.cwd(), dir,file);
        if(FileRW.isValidFile(fromPath) && path.extname(fromPath) == ".js"){
          filePaths.push(fromPath);
        }
      });
      var compactStructure = getCompactStructureFromFiles(filePaths);
      compactStructure.version = versionInfo.version;
      resolve(compactStructure);
    });
  });
}

FileRW.readMigrationFile = function(filePath){
  var dirName = path.dirname(filePath);
  var fileNameWithoutExtension = path.basename(filePath);
  var newFilePath = path.join(process.cwd(), dirName, fileNameWithoutExtension);
  var migrationScript = require(newFilePath);
  return migrationScript;
}

module.exports = FileRW;
