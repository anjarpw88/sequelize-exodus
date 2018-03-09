const Sequelize = require('sequelize');
const VersatileStructure = require('./versatile-structure');
const VersatileTableModel = require('./versatile-table-model');
const ToolConverters = require('./tool-converters');
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
  const fileComposer = require('./file-composer');
  var p = new Promise((resolve,reject)=>{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    Object.keys(versatileStructure.tables).forEach((tableName)=>{
      filePath = path.join(dir, tableName);
      var versatileTableModel= versatileStructure.tables[tableName];
      var composedString = fileComposer.compose(versatileTableModel);
      fs.writeFile(filePath+".js", composedString, function(err) {
        if(err) {
            return console.log(err);
        }
        resolve();
      });
    });
  });
  await p;
}

SequelizeExodus.prototype.compareTwoCompactStructures = async function(dir1, dir2){
  var FileReader = require("./file-reader");
  var compactStructure1 = await FileReader.readDirectory(dir1);
  var compactStructure2 = await FileReader.readDirectory(dir2);
}

SequelizeExodus.prototype.compareVersatileStructureWithDb=function(){

}

SequelizeExodus.prototype.saveComparisonIntoMigrationFile=function(){

}

SequelizeExodus.prototype.migrateWithMigrationFiles=function(){

}






module.exports = SequelizeExodus;
