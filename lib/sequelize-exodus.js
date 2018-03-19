const Sequelize = require('sequelize');
const VersatileStructure = require('./versatile-structure');
const VersatileTableModel = require('./versatile-table-model');
const ToolConverters = require('./tool-converters');
const DiffChecker = require('./diff-checker');
const FileRW = require("./file-rw");
const QueryAction = require("./query-action");
require("array-async-tools");

const migrationTable = require("./migration-table");

class SequelizeExodus {
  constructor(){

  }
}

SequelizeExodus.convertToDataTypes = require("./data-type-converter");

SequelizeExodus.prototype.login = async function(prop){
    this.sequelizeObject = new Sequelize(prop.database, prop.username, prop.password, {
      host: prop.host,
      port:prop.port,
      dialect: prop.dialect,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },

      logging: false,
      operatorsAliases: false
  });
  await this.sequelizeObject.authenticate();
  this.queryInterface = this.sequelizeObject.getQueryInterface();
}

SequelizeExodus.prototype.importCompactStructureFromDb=async function(){
  const ToolConverters = require('./tool-converters');
  var versatileStructure = await this.importVersatileStructureFromDb();
  var compactStructure = ToolConverters.getCompactStructureFromVersatile(versatileStructure);
  return compactStructure;
}

SequelizeExodus.prototype.importVersatileStructureFromDb=async function(){
  var migrationTable = require("./migration-table");
  var versionInfo = await migrationTable.getCurrentVersionInfo(this.sequelizeObject);
  var versatileStructure = new VersatileStructure(versionInfo.CurrentVersion);
  var tableNames = await this.queryInterface.showAllTables();
  await tableNames.awaitAll(async tableName=>{
    if(migrationTable.migrationTableName === tableName){
      return;
    }
    var tableDescription = await this.queryInterface.describeTable(tableName);
    var constraints = await this.queryInterface.showConstraint(tableName);
    var foreignKeys = await this.queryInterface.getForeignKeyReferencesForTable(tableName);
    var versatileTableModel = ToolConverters.generateVersatileTableModelFromRawSql(tableName, tableDescription, foreignKeys, constraints);
    versatileStructure.addTable(tableName, versatileTableModel);
  });
  return versatileStructure;
}

SequelizeExodus.prototype.saveCompactStructureFromImport = async function(dir, compactStructure){
  return await FileRW.saveCompactStructureFromImport(dir, compactStructure);
}

SequelizeExodus.prototype.compareTwoCompactStructures = async function(newDir, oldDir){
  var newCompactStructure = await FileRW.readDirectory(newDir);
  var oldCompactStructure = await FileRW.readDirectory(oldDir);
  return DiffChecker.checkDifferences(newCompactStructure, oldCompactStructure);
}

SequelizeExodus.prototype.compareCompactStructureWithDb=async function(newDir){
  var newCompactStructure = await FileRW.readDirectory(newDir);
  var oldCompactStructure = await this.importCompactStructureFromDb();
  return DiffChecker.checkDifferences(newCompactStructure, oldCompactStructure);
}

SequelizeExodus.prototype.generateModelDirectlyFromDirectory = async function(directory, option){
  option  = option || {};
  var structure = await SequelizeExodus.FileRW.readDirectory(directory);
  var models = {};
  await Object.keys(structure.tables).awaitAll(async (key)=>{
    var table= structure.tables[key];
    var model = ToolConverters.toModel(this.sequelizeObject, table);
    await model.sync({force:option.force});
    models[table.tableName] = model;
  });

  if(option.force && option.forceForeignKeys){
    var queryRunner = QueryAction.getQueryActionRunner(this.sequelizeObject);
    await Object.keys(structure.tables).awaitAll(async (tableName)=>{
      var table= structure.tables[tableName];
      await Object.keys(table.foreignKeys).awaitAll(async (fkName)=>{
        try{
          await queryRunner.addForeignKey(tableName, fkName, table.foreignKeys[fkName]);
        }catch(e){
          console.log(e);
        }
      });
    });
  }
  return models;
}

SequelizeExodus.prototype.saveComparisonIntoMigrationFile= async function(comparisonObject, migrationName, filePath){
  var actions = DiffChecker.generateMigrationCommands(comparisonObject);
  await FileRW.generateMigrationScript(filePath, comparisonObject, migrationName, actions);
}

SequelizeExodus.prototype.migrateWithMigrationFiles=async function(filePath){
  var migrationScript = FileRW.readMigrationFile(filePath);
  var QueryActionRunner = QueryAction.getQueryActionRunner(this.sequelizeObject);
  await migrationTable.ensureDatabaseExist(this.sequelizeObject);
  await migrationTable.setDatabaseVersion(this.sequelizeObject, migrationScript);
  await migrationScript.up(QueryActionRunner);
}

SequelizeExodus.ToolConverters = ToolConverters;
SequelizeExodus.FileRW = FileRW;
SequelizeExodus.DiffChecker = DiffChecker;
SequelizeExodus.QueryAction = QueryAction;
SequelizeExodus.GenericColumns = require("./generic-columns");
SequelizeExodus.Sequelize = Sequelize;

module.exports = SequelizeExodus;
