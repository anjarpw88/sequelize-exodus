class VirtualStructure {
  constructor(){
      this.tables = {};
  }
}
VirtualStructure.prototype.addTable = function(tableName, tableDescription){
  this.tables[tableName] = tableDescription;
}

module.exports = VirtualStructure;
