class CompactStructure {
  constructor(version){
      this.tables = {};
      this.version = version;
  }
}
CompactStructure.prototype.addTable = function(tableName, tableDescription){
  this.tables[tableName] = tableDescription;
}

module.exports = CompactStructure;
