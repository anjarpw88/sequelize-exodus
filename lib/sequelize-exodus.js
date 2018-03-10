const Sequelize = require('sequelize');
const VersatileStructure = require('./versatile-structure');
const VersatileTableModel = require('./versatile-table-model');
const ToolConverters = require('./tool-converters');
const DiffChecker = require('./diff-checker');
const FileRW = require("./file-rw");
const QueryAction = require("./query-action");
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
  return await FileRW.saveCompactStructureFromImport(dir, versatileStructure);
}

SequelizeExodus.prototype.compareTwoCompactStructures = async function(newDir, oldDir){
  var newCompactStructure = await FileRW.readDirectory(newDir);
  var oldCompactStructure = await FileRW.readDirectory(oldDir);
  return DiffChecker.checkDifferences(newCompactStructure, oldCompactStructure);
}

SequelizeExodus.prototype.compareVersatileStructureWithDb=async function(newDir){
  var newCompactStructure = await FileRW.readDirectory(newDir);
  var oldVersatileStructure = await sequenceExodus.importVersatileStructureFromDb();
  var oldCompactStructure = ToolConverters.getCompactStructureFromVersatile(oldVersatileStructure);
  return DiffChecker.generateMigrationCommands(newCompactStructure, oldCompactStructure);
}

SequelizeExodus.prototype.saveComparisonIntoMigrationFile= async function(comparisonObject, migrationProperties, filePath){
  var actions = DiffChecker.generateMigrationCommands(comparisonObject);
  await FileRW.generateMigrationScript(filePath, migrationProperties, actions);


}

SequelizeExodus.prototype.migrateWithMigrationFiles=function(filePath){
  var migrationScript = FileRW.readMigrationFile(filePath);
  var QueryActionRunner = QueryAction.getQueryActionRunner(this.sequelizeObject);
  migrationScript.up(QueryActionRunner);
}






module.exports = SequelizeExodus;
