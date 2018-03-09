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
      if(group.fromColumns.indexOf(variant.columnName)<0){
        group.fromColumns.push(variant.columnName);
      }
      if(group.toColumns.indexOf(variant.referencedColumnName)<0){
        group.toColumns.push(variant.referencedColumnName);
      }
    });
    var foreignKeyObject = new ForeignKey(key, group.fromTable, group.toTable, group.fromColumns, group.toColumns);
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



const generateVersatileTableModelFromRawSql = function (tableName, rawTableDescription, rawForeignKeys, rawConstraints){

    var columns = {};
    Object.keys(rawTableDescription).forEach(columnName=>{
      var rawColumnDescription=rawTableDescription[columnName];
      rawColumnDescription.concludedType = convertToDataTypes(rawColumnDescription);
      rawColumnDescription.type = rawColumnDescription.concludedType.obj;
      var column = new Column(columnName, rawColumnDescription);
      columns[columnName]=column;
    });
    var foreignKeyObjects = sanitizeRawForeignKeys(rawForeignKeys);

    var constraintObjects = sanitizeRawConstraints(rawConstraints);

    var versatileTableModel = new VersatileTableModel(tableName, columns, foreignKeyObjects, constraintObjects);
    return versatileTableModel;
}

const generateCompactTableModelFromFile = function(filepath){
  var modelFunc = require(filepath);
  var rawTable = modelFunc(Sequelize);
  return rawTable;
}
const convertToCompactTableModel = function(versatileTable){
  var columns = {};
  var foreignKeys = {};
  var constraints = {};
  Object.keys(versatileTable.columns).forEach(key=>{
    var col = versatileTable.columns[key];
    var obj = {
      type : col.type,
      allowNull : col.allowNull,
      defaultValue : col.defaultValue,
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
  return new CompactTableModel(versatileTable.tableName, columns,foreignKeys, constraints);
}

const getCompactStructureFromFiles = function(files){
  var compactStructure = new CompactStructure();
  files.forEach((file)=>{
    var compactTable = generateCompactTableModelFromFile(file);
    compactStructure.addTable(compactTable.tableName,compactTable);
  })
  return compactStructure;
}


const getCompactStructureFromVersatile = function(versatileStructure){
  var compactStructure = new CompactStructure();
  Object.keys(versatileStructure.tables).forEach((key)=>{
    var versatileTable = versatileStructure.tables[key];
    var compactTable = convertToCompactTableModel(versatileTable);
    compactStructure.addTable(compactTable.tableName,compactTable);
  })
  return compactStructure;
}


module.exports ={
  getCompactStructureFromVersatile:getCompactStructureFromVersatile,
  getCompactStructureFromFiles:getCompactStructureFromFiles,
  generateVersatileTableModelFromRawSql:generateVersatileTableModelFromRawSql
}
