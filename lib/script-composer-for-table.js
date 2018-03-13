var IndentTextGenerator = require("./indent-text-generator.js");
class ScriptComposerForTable extends IndentTextGenerator{
  constructor(){
    super();
  }
}

ScriptComposerForTable.prototype.composeFile = function(tableModel,options){
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

ScriptComposerForTable.prototype.composeForeignDetailText = function(foreignKeyDetail, indentFormat){
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

ScriptComposerForTable.prototype.composeColumnDetailText = function(options, indentFormat){
  var br = this.br;
  var q = this.q;
  var val = this.val;
  let printColumnDetail = (t) => {
    t.p("{")
    t.dp((t)=>{
      if(options._getType!=undefined){
        t.pl("_getType", ":", options._getType);
        t.p(",");
      }
      if(options.allowNull!=undefined){
        t.pl("allowNull", ":", val(options.allowNull));
        t.p(",");
      }
      if(options.defaultValue!=undefined){
        t.pl("defaultValue", ":", val(options.defaultValue));
        t.p(",");
      }
      if(options.special!=undefined){
        t.pl("special", ":", val(options.special));
        t.p(",");
      }
      if(options.primaryKey!=undefined){
        t.pl("primaryKey", ":", val(options.primaryKey));
        t.p(",");
      }
      if(options.autoIncrement!=undefined){
        t.pl("autoIncrement", ":", val(options.autoIncrement));
        t.p(",");
      }
    });
    t.pl("}");
  }
  var finalString = this.printWithIndent(indentFormat,printColumnDetail);
  return finalString;

}

ScriptComposerForTable.prototype.composeTableText = function(tableModel,indentFormat){
  var br = this.br;
  var q = this.q;
  var val = this.val;

  let printTables = (t) => {
    t.p("{");
    t.dp((t)=>{
      t.pl("tableName",":", q(tableModel.tableName));
      t.p(",");
      if(tableModel.primaryKeys){
        t.pl("primaryKeys",":", val(tableModel.primaryKeys));
        t.p(",");
      }
      printForeignKeys(t);
      printConstraints(t);
      printColumns(t);
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
    t.p(",");

  }


  let printForeignKeys = (t) => {
    if(!tableModel.foreignKeys){
      return;
    }
    var fkHandler = (prop)=>
    {
        return (t) =>{
          var composeForeignKeyDetailText = this.composeForeignDetailText(tableModel.foreignKeys[prop], indentFormat);
          t.pl(q(prop), ":", "");
          t.printMultilines(composeForeignKeyDetailText);
        };
    }
    this.printObjectsAction("foreignKeys", tableModel.foreignKeys,fkHandler)(t);
    t.p(",");
  }


  let printConstraints = (t) =>{
    if(!tableModel.constraints){
      return;
    }
    var constraintsHandler = (prop)=>
    {
        return (t) =>{
          var constraintType = tableModel.constraints[prop];
          t.pl(q(prop), ":", q(constraintType));
        };
    }
    this.printObjectsAction("constraints", tableModel.constraints,constraintsHandler)(t);
    t.p(",");
  }
  indentFormat = indentFormat || "  ";
  var finalString = this.printWithIndent(indentFormat,printTables);
  return finalString;
};

var composer = {

}

module.exports = ScriptComposerForTable;
