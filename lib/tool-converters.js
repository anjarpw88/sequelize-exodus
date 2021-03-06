const Sequelize = require('sequelize');
const VersatileStructure = require('./versatile-structure');
const VersatileTableModel = require('./versatile-table-model');
const CompactTableModel = require('./compact-table-model');
const CompactStructure = require('./compact-structure');
const ForeignKey = require('./foreign-key');
const Constraint = require('./constraint');
const Column = require('./column');
const convertToDataTypes = require("./data-type-converter");
require("array-async-tools");



const sanitizeRawForeignKeys=function(foreignKeys){
  var constraintGroups = {};

  foreignKeys.forEach((fk)=>{
    if(fk.tableName == fk.referencedTableName){
      return;
    }
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

  var newForeignKeys = {};
  Object.keys(constraintGroups).forEach((key)=>{
    var group = constraintGroups[key];
    group.variants.forEach((variant)=>{
      console.log("VARIANT",variant);
      if(group.fromColumns.indexOf(variant.columnName)<0){
        group.fromColumns.push(variant.columnName);
      }
      if(group.toColumns.indexOf(variant.referencedColumnName)<0){
        group.toColumns.push(variant.referencedColumnName);
      }
    });
    var foreignKeyObject = new ForeignKey(key, group.fromTable, group.toTable, group.fromColumns, group.toColumns);
    console.log("MAKING FOREIGN KEY", foreignKeyObject);
    newForeignKeys[key]=foreignKeyObject;
  });
  return newForeignKeys;
}

const sanitizeRawConstraints=function(constraints){
  var constraintObjects = {};
  constraints.forEach((constraint)=>{
    var name = constraint.constraintName;
    var type = constraint.constraintType;
    constraintObjects[name] = new Constraint(name, type);
  });
  return constraintObjects;
}

const concludePrimaryKeys = function(columns){
  var primaryKeys = [];

  Object.keys(columns).forEach(key=>{
    if(columns[key].options.primaryKey){
      primaryKeys.push(key);
    }
  });
  return primaryKeys;
}


const generateVersatileTableModelFromRawSql = function (tableName, rawTableDescription, rawForeignKeys, rawConstraints){

    var columns = {};
    Object.keys(rawTableDescription).forEach(columnName=>{
      var rawColumnDescription=rawTableDescription[columnName];
      rawColumnDescription.concludedType = convertToDataTypes(rawColumnDescription);
      if(rawColumnDescription.primaryKey && rawColumnDescription.defaultValue!=null){
        rawColumnDescription.autoIncrement = true;
        rawColumnDescription.defaultValue = null;
      }
      var column = new Column(columnName, rawColumnDescription);
      columns[columnName]=column;
    });
    var foreignKeyObjects = sanitizeRawForeignKeys(rawForeignKeys);

    var constraintObjects = sanitizeRawConstraints(rawConstraints);
    var primaryKeys = concludePrimaryKeys(columns);
    var versatileTableModel = new VersatileTableModel(tableName, columns, primaryKeys, foreignKeyObjects, constraintObjects);
    return versatileTableModel;
}

const convertToCompactTableModel = function(versatileTable){
  var columns = {};
  var foreignKeys = {};
  var constraints = {};
  Object.keys(versatileTable.columns).forEach(key=>{
    var col = versatileTable.columns[key].options;
    var obj = {
      _getType : col.concludedType.getFunc,
      allowNull : col.allowNull,
      defaultValue : col.defaultValue,
      autoIncrement : col.autoIncrement,
      special : col.special,
      primaryKey : col.primaryKey
    }
    columns[key]=obj;
  });
  Object.keys(versatileTable.foreignKeys).forEach(key=>{
    var fk = versatileTable.foreignKeys[key];
    var obj = {
      fromTable:fk.fromTable,
      fromColumns:fk.fromColumns,
      toTable:fk.toTable,
      toColumns:fk.toColumns
    }
    foreignKeys[key] = obj;
  });
  Object.keys(versatileTable.constraints).forEach(key=>{
    var constraint = versatileTable.constraints[key];
    constraints[key] = constraint.type;
  });

  return new CompactTableModel(versatileTable.tableName, columns,versatileTable.primaryKeys, foreignKeys, constraints);
}

const toModel = function(sequelize, tableDefinition){
  var columns = {};

  Object.keys(tableDefinition.columns).forEach((key)=>{
    var column = Object.assign({},tableDefinition.columns[key]);
    if(column._getType){
      column.type = column._getType(Sequelize);
    }
    delete column._getType;
    columns[key]=column;
  });
  tableDefinition.primaryKeys.forEach((key)=>{
    if(columns[key]){
      columns[key].primaryKey = true;
    }
  });

  var model = sequelize.define(tableDefinition.tableName, columns,{
    timestamps: false,
    tableName:tableDefinition.tableName
  });


  return model;
}


const getCompactStructureFromVersatile = function(versatileStructure){
  var compactStructure = new CompactStructure(versatileStructure.version);
  Object.keys(versatileStructure.tables).forEach((key)=>{
    var versatileTable = versatileStructure.tables[key];
    var compactTable = convertToCompactTableModel(versatileTable);
    compactStructure.addTable(compactTable.tableName,compactTable);
  })

  return compactStructure;
}


module.exports ={
  getCompactStructureFromVersatile,
  toModel,
  generateVersatileTableModelFromRawSql
}
