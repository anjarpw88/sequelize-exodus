class TableModel{

  constructor(tableName, columns, foreignKeys, constraints){
    this.tableName = tableName;
    this.columns = columns;
    this.foreignKeys = foreignKeys;
    this.constraints = constraints;
  }
}

module.exports = TableModel;
