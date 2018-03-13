class VersatileStructure {
  constructor(version){
      this.tables = {};
      this.version = version;

  }
}
VersatileStructure.prototype.addTable = function(tableName, tableDescription){
  this.tables[tableName] = tableDescription;
}

module.exports = VersatileStructure;
