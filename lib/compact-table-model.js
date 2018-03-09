const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
require("array-async-tools");

class CompactTableModel{
  constructor(tableName, columns, primaryKeys, foreignKeys, constraints){
    this.tableName = tableName;
    this.columns = columns;
    this.foreignKeys = foreignKeys;
    this.constraints = constraints
    this.primaryKeys = primaryKeys;
  }
}




module.exports = CompactTableModel;
