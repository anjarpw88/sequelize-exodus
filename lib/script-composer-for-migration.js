var IndentTextGenerator = require("./indent-text-generator.js");
class ScriptComposerForMigration extends IndentTextGenerator{
  constructor(){
    super();
  }
}
ScriptComposerForMigration.prototype.composeFile = function(historyInfo, actions,options){
  var br = this.br;
  var q = this.q;
  var val = this.val;

  var QueryAction = require("./query-action");
  var downScripts = [];
  var upScript = [];

  actions.forEach((action)=>{
    var q = QueryAction.pairedQueryActionComposer;
    var migrationScript = action(q);
    migrationScript.down.forEach(x=>{
      downScripts.push(x);
    })
    migrationScript.up.forEach(x=>{
      upScript.push(x);
    })
  });
  downScripts.reverse();


  let printOuter = (t) => {
    t.pl("module.exports","=","{");
    t.dp((t)=>{
      t.pl("currentVersion",":",q(historyInfo.currentVersion),",");
      t.pl("fromVersion",":",q(historyInfo.fromVersion),",");
      t.pl("migrationName",":",q(historyInfo.migrationName),",");
      t.pl("up",":","async function(QueryActionRunner){");
      t.dp((t)=>{
        upScript.forEach((scr)=>{
          t.pl("await ");
          t.printMultilines(scr);
          t.p(";");
        })
      });
      t.pl("},");
      t.pl("down",":","async function(QueryActionRunner){");
      t.dp((t)=>{
        downScripts.forEach((scr)=>{
          t.pl("await ");
          t.printMultilines(scr);
          t.p(";");
        });
      })
      t.pl("},");
    });
    t.pl("}");

  };

  var options = options || {};
  var indentFormat = options.indentFormat || "  ";

  var finalString = this.printWithIndent(indentFormat,printOuter);

  return finalString;

}


module.exports = ScriptComposerForMigration;
