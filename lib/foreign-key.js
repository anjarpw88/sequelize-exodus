var Constraint = require('./constraint');

class ForeignKey extends Constraint{
  constructor(identifier, fromTable, toTable, fromColumns, toColumns){
    super(identifier,"FOREIGN KEY");
    this.fromTable=fromTable;
    this.toTable=toTable;
    this.fromColumns = fromColumns;
    this.toColumns = toColumns;
  }
}

module.exports = ForeignKey;
