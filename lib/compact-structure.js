class CompactStructure {
  constructor(){
      this.tables = {};
  }
}
CompactStructure.prototype.addTable = function(tableName, tableDescription){
  this.tables[tableName] = tableDescription;
}

module.exports = CompactStructure;
