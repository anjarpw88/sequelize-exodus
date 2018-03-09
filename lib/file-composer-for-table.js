var IndentTextGenerator = require("./indent-text-generator.js");
class FileComposerForTable extends IndentTextGenerator{
  constructor(){
    super();
  }
}




FileComposerForTable.prototype.composeFile = function(tableModel,options){
  var br = this.br;
  var q = this.q;
  var val = this.val;


  let printOuter = (t) => {
    t.pl("module.exports","=","");
    t.printMultilines(tableText);

  };

  var options = options || {};
  var indentFormat = options.indentFormat || "  ";

  var tableText = this.composeTableText(tableModel, indentFormat);


  var finalString = this.printWithIndent(indentFormat,printOuter);

  return finalString;
}

FileComposerForTable.prototype.composeForeignDetailText = function(foreignKeyDetail, indentFormat){
  var br = this.br;
  var q = this.q;
  var val = this.val;


  let printForeignKeyDetail = (t) => {
    t.p("{")
    t.dp((t)=>{
      t.pl("fromTable", ":", val(foreignKeyDetail.fromTable));
      t.p(",");
      t.pl("toTable", ":", val(foreignKeyDetail.toTable));
      t.p(",");
      t.pl("fromColumns", ":", val(foreignKeyDetail.fromColumns));
      t.p(",");
      t.pl("toColumns", ":", val(foreignKeyDetail.toColumns));
    });
    t.pl("}");
  }

  var finalString = this.printWithIndent(indentFormat,printForeignKeyDetail);
  return finalString;

}

FileComposerForTable.prototype.composeColumnDetailText = function(options, indentFormat){
  var br = this.br;
  var q = this.q;
  var val = this.val;
  //console.log("option",options);
  let printColumnDetail = (t) => {
    t.p("{")
    t.dp((t)=>{
      t.pl("_getType", ":", options._getType);
      t.p(",");
      t.pl("allowNull", ":", val(options.allowNull));
      t.p(",");
      t.pl("defaultValue", ":", val(options.defaultValue));
      t.p(",");
      t.pl("special", ":", val(options.special));
      t.p(",");
      t.pl("primaryKey", ":", val(options.primaryKey));
    });
    t.pl("}");
  }
  var finalString = this.printWithIndent(indentFormat,printColumnDetail);
  return finalString;

}

FileComposerForTable.prototype.composeTableText = function(tableModel,indentFormat){
  var br = this.br;
  var q = this.q;
  var val = this.val;

  let printTables = (t) => {
    t.p("{");
    t.dp((t)=>{
      t.pl("tableName",":", q(tableModel.tableName));
      t.p(",");
      t.pl("primaryKeys",":", val(tableModel.primaryKeys));
      t.p(",");
      printColumns(t);
      t.p(",");
      printForeignKeys(t);
      t.p(",");
      printConstraints(t);
    })
    t.pl("}");

  }
  let printColumns = (t) => {
    var columnHandler = (prop)=>
    {
        var composeColumnDetailText = this.composeColumnDetailText(tableModel.columns[prop], indentFormat);
        return (t) =>{
          t.pl(q(prop), ":", "");
          t.printMultilines(composeColumnDetailText);
        };
    }
    this.printObjectsAction("columns", tableModel.columns,columnHandler)(t);
  }


  let printForeignKeys = (t) => {
    var fkHandler = (prop)=>
    {
        return (t) =>{
          var composeForeignKeyDetailText = this.composeForeignDetailText(tableModel.foreignKeys[prop], indentFormat);
          t.pl(q(prop), ":", "");
          t.printMultilines(composeForeignKeyDetailText);
        };
    }
    this.printObjectsAction("foreignKeys", tableModel.foreignKeys,fkHandler)(t);
  }


  let printConstraints = (t) =>{
    var constraintsHandler = (prop)=>
    {
        return (t) =>{
          var constraintType = tableModel.constraints[prop];
          t.pl(q(prop), ":", q(constraintType));
        };
    }
    this.printObjectsAction("constraints", tableModel.constraints,constraintsHandler)(t);
  }
  indentFormat = indentFormat || "  ";
  var finalString = this.printWithIndent(indentFormat,printTables);
  return finalString;
};

var composer = {

}

module.exports = FileComposerForTable;
