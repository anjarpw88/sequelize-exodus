const Sequelize = require('sequelize');
const VersatileStructure = require('./versatile-structure');
const VersatileTableModel = require('./versatile-table-model');
const ToolConverters = require('./tool-converters');
const DiffChecker = require('./diff-checker');
require("array-async-tools");

class SequelizeExodus {
  constructor(){

  }
}

SequelizeExodus.convertToDataTypes = require("./data-type-converter");

SequelizeExodus.prototype.login = async function(prop){
    this.sequelizeObject = new Sequelize(prop.schema, prop.username, prop.password, {
      host: prop.host,
      port:prop.port,
      dialect: prop.dialect,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      operatorsAliases: false
  });
  this.queryInterface = this.sequelizeObject.getQueryInterface();
}

SequelizeExodus.prototype.importVersatileStructureFromDb=async function(){
  var versatileStructure = new VersatileStructure();
  var tableNames = await this.queryInterface.showAllTables();
  await tableNames.awaitAll(async tableName=>{
    var tableDescription = await this.queryInterface.describeTable(tableName);
    var constraints = await this.queryInterface.showConstraint(tableName);
    var foreignKeys = await this.queryInterface.getForeignKeyReferencesForTable(tableName);
    var versatileTableModel = ToolConverters.generateVersatileTableModelFromRawSql(tableName, tableDescription, foreignKeys, constraints);
    versatileStructure.addTable(tableName, versatileTableModel);
  });
  return versatileStructure;
}

SequelizeExodus.prototype.saveCompactStructureFromImport = async function(dir, versatileStructure){
  const fs = require('fs');
  const path = require('path');
  const FileComposerForTable = require('./file-composer-for-table');
  var fileComposer = new FileComposerForTable();
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  await Object.keys(versatileStructure.tables).awaitAll((tableName)=>{
    filePath = path.join(dir, tableName);
    var versatileTableModel= versatileStructure.tables[tableName];

    return new Promise((resolve,reject) => {
      var composedString = fileComposer.composeFile(versatileTableModel);
      fs.writeFile(filePath+".js", composedString, function(err) {
        if(err) {
            return console.log(err);
        }
        resolve();
      });
    });
  });
}

SequelizeExodus.prototype.compareTwoCompactStructures = async function(newDir, oldDir){
  var FileReader = require("./file-reader");
  var newCompactStructure = await FileReader.readDirectory(newDir);
  var oldCompactStructure = await FileReader.readDirectory(oldDir);
  return DiffChecker.checkDifferences(newCompactStructure, oldCompactStructure);
}

SequelizeExodus.prototype.compareVersatileStructureWithDb=async function(newDir){
  var newCompactStructure = await FileReader.readDirectory(newDir);
  var oldVersatileStructure = await sequenceExodus.importVersatileStructureFromDb();
  var oldCompactStructure = ToolConverters.getCompactStructureFromVersatile(oldVersatileStructure);
  return DiffChecker.generateMigrationCommands(newCompactStructure, oldCompactStructure);
}

SequelizeExodus.prototype.saveComparisonIntoMigrationFile= async function(comparisonObject,path){
  const FileComposerForMigration = require('./file-composer-for-migration');
  var fileComposer = new FileComposerForMigration();
  var actions = DiffChecker.generateMigrationCommands(comparisonObject);
  var composedString = fileComposer.composeFile({
    currentVersion:"1.0",
    fromVersion:"0.0",
    migrationName:"test"
  },actions);
  const fs = require('fs');
  return new Promise((resolve,reject) => {
    fs.writeFile(filePath, composedString, function(err) {
      if(err) {
          return console.log(err);
      }
      resolve();
    });
  });

}

SequelizeExodus.prototype.migrateWithMigrationFiles=function(){

}






module.exports = SequelizeExodus;
