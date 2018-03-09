class VersatileStructure {
  constructor(){
      this.tables = {};
  }
}
VersatileStructure.prototype.addTable = function(tableName, tableDescription){
  this.tables[tableName] = tableDescription;
}

module.exports = VersatileStructure;
