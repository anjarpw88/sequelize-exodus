

class VersatileTableModel{

  constructor(tableName, columns,primaryKeys, foreignKeys, constraints){
    this.tableName = tableName;
    this.columns = columns;
    this.foreignKeys = foreignKeys;
    this.constraints = constraints;
    this.primaryKeys = primaryKeys;

  }
}


module.exports = VersatileTableModel;
