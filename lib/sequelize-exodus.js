const Sequelize = require('sequelize');
const VirtualStructure = require('./virtual-structure');
const TableModel = require('./table-model');
const ForeignKey = require('./foreign-key');
const Constraint = require('./constraint');
const Column = require('./column');
const _ = require('lodash');
require("array-async-tools");

class SequelizeExodus {
  constructor(){

  }
}

SequelizeExodus.convertToDataTypes = function(column){
  var concludedType = {
    obj:null,
    raw:column.type,
    stringRep:""
  };
  var type = column.type.toLowerCase();
  if (column.type.indexOf('ENUM') === 0) {
      concludedType.stringRep = "Sequelize." + column.type;
  } else {
    if (type === "boolean" || type === "bit(1)" || type === "bit") {
      concludedType.stringRep = "Sequelize.BOOLEAN";
    }
    else if (type.match(/^(smallint|mediumint|tinyint|int)/)) {
      var length = type.match(/\(\d+\)/);
      var val = 'Sequelize.INTEGER' + (!  _.isNull(length) ? length : '');
      var unsigned = type.match(/unsigned/i);
      if (unsigned) val += '.UNSIGNED'
      var zero = type.match(/zerofill/i);
      if (zero) val += '.ZEROFILL'
      concludedType.stringRep = val;
    }
    else if (type.match(/^bigint/)) {
      concludedType.stringRep = 'Sequelize.BIGINT';
    }
    else if (type.match(/^varchar/)) {
      var length = type.match(/\(\d+\)/);
      concludedType.stringRep = 'Sequelize.STRING' + (!  _.isNull(length) ? length : '');
    }
    else if (type.match(/^string|varying|nvarchar/)) {
      concludedType.stringRep = 'Sequelize.STRING';
    }
    else if (type.match(/^char/)) {
      var length = type.match(/\(\d+\)/);
      concludedType.stringRep = 'Sequelize.CHAR' + (!  _.isNull(length) ? length : '');
    }
    else if (type.match(/^real/)) {
      concludedType.stringRep = 'Sequelize.REAL';
    }
    else if (type.match(/text|ntext$/)) {
      concludedType.stringRep = 'Sequelize.TEXT';
    }
    else if (type==="date"){
      concludedType.stringRep = 'Sequelize.DATEONLY';
    }
    else if (type.match(/^(date|timestamp)/)) {
      concludedType.stringRep = 'Sequelize.DATE';
    }
    else if (type.match(/^(time)/)) {
      concludedType.stringRep = 'Sequelize.TIME';
    }
    else if (type.match(/^(float|float4)/)) {
      concludedType.stringRep = 'Sequelize.FLOAT';
    }
    else if (type.match(/^decimal/)) {
      concludedType.stringRep = 'Sequelize.DECIMAL';
    }
    else if (type.match(/^(float8|double precision|numeric)/)) {
      concludedType.stringRep = 'Sequelize.DOUBLE';
    }
    else if (type.match(/^uuid|uniqueidentifier/)) {
      concludedType.stringRep = 'Sequelize.UUIDV4';
    }
    else if (type.match(/^jsonb/)) {
      concludedType.stringRep = 'Sequelize.JSONB';
    }
    else if (type.match(/^json/)) {
      concludedType.stringRep = 'Sequelize.JSON';
    }
    else if (type.match(/^geometry/)) {
      concludedType.stringRep = 'Sequelize.GEOMETRY';
    }
  }
  concludedType.obj = eval(concludedType.stringRep);
  return concludedType;
}

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


const sanitizeForeignKeys=function(foreignKeys){
  var constraintGroups = {};
  foreignKeys.forEach((fk)=>{
    if(!constraintGroups[fk.constraintName]){
      constraintGroups[fk.constraintName]={
        fromTable:fk.tableName,
        toTable:fk.referencedTableName,
        variants:[],
        fromColumns:[],
        toColumns:[],
      };
    }
    var group = constraintGroups[fk.constraintName];
    if(group.fromTable == fk.tableName && group.toTable == fk.referencedTableName){
      constraintGroups[fk.constraintName].variants.push(fk);
    }
  });

  var foreignKeys = [];
  Object.keys(constraintGroups).forEach((key)=>{
    var group = constraintGroups[key];
    group.variants.forEach((variant)=>{
      if(group.fromColumns.indexOf(variant.columnName)<0){
        group.fromColumns.push(variant.columnName);
      }
      if(group.toColumns.indexOf(variant.referencedColumnName)<0){
        group.toColumns.push(variant.referencedColumnName);
      }
    });
    var foreignKeyObject = new ForeignKey(key, group.fromTable, group.toTable, group.fromColumns, group.toColumns);
    foreignKeys.push(foreignKeyObject);
  });
  return foreignKeys;
}

function generateTableStructure(tableName, tableDescription, foreignKeys, constraints){
    var columns = [];
    Object.keys(tableDescription).forEach(columnName=>{
        var column = new Column(columnName, tableDescription[columnName]);
        columns.push(column);
    });
    var foreignKeyObjects = sanitizeForeignKeys(foreignKeys);
    var tableModel = new TableModel(tableName, columns, foreignKeyObjects);
    return tableModel;
}

SequelizeExodus.prototype.importFromDb=async function(){
  var virtualStructure = new VirtualStructure();
  var tableNames = await this.queryInterface.showAllTables();
  await tableNames.awaitAll(async tableName=>{
    var tableDescription = await this.queryInterface.describeTable(tableName);
    var constraints = await this.queryInterface.showConstraint(tableName);
    var foreignKeys = await this.queryInterface.getForeignKeyReferencesForTable(tableName);
    var tableStructure = generateTableStructure(tableName, tableDescription, foreignKeys, constraints);
    virtualStructure.addTable(tableName, tableStructure, constraints);
    console.log(constraints);
  });

  return virtualStructure;
}
SequelizeExodus.prototype.saveVirtualStructureFromImport=function(){

}
SequelizeExodus.prototype.compareTwoVirtualStructures=function(){

}
SequelizeExodus.prototype.compareVirtualStructureWithDb=function(){

}
SequelizeExodus.prototype.saveComparisonIntoMigrationFile=function(){

}
SequelizeExodus.prototype.migrateWithMigrationFiles=function(){

}






module.exports = SequelizeExodus;
