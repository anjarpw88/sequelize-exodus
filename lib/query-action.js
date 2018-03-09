/**
"QueryAction.removeConstraint(constraintName)",
"QueryAction.removeForeignKey(tableName,foreignKeyName)",
"QueryAction.removeTable(tableName)",
"QueryAction.removeColumn(tableName,columnName)",
"QueryAction.addTable(tableDetail)",
"QueryAction.addColumns(tableName,columnName,options)",
"QueryAction.modifyColumns(tableName,columnName,options)",
"QueryAction.addForeignKey(tableName,foreignKeyName, options)",
"QueryAction.addPrimaryKeys(tableName, primaryKeys)",

*/
var FileComposerForTable = require("./file-composer-for-table");
var fileComposer = new FileComposerForTable();
var q = (str)=>'"'+str+'"';
var val = (str)=> JSON.stringify(str);
var queryActionTextComposer = {
  removeConstraint: function(tableName,constraintName){
    var template = "QueryAction.removeConstraint(tableName, constraintName)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("constraintName", q(constraintName));
    return template;
  },
  removeForeignKey: function(tableName,foreignKeyName, ){
    var template = "QueryAction.removeForeignKey(tableName,foreignKeyName)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("foreignKeyName", q(foreignKeyName));
    return template;
  },
  removeTable: function(tableName){
    var template = "QueryAction.removeTable(tableName)";
    template = template.replace("tableName", q(tableName));
    return template;
  },
  removeColumn: function(tableName, columnName){
    var template = "QueryAction.removeColumn(tableName, columnName)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("columnName", q(columnName));
    return template;
  },
  removePrimaryKeys: function(tableName){
    var template = "QueryAction.removePrimaryKeys(tableName)";
    template = template.replace("tableName", q(tableName));
    return template;
  },
  addForeignKey: function(tableName,foreignKeyName,options){
    var template = "QueryAction.addForeignKey(tableName,foreignKeyName,options)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("foreignKeyName", q(foreignKeyName));
    template = template.replace("options", fileComposer.composeForeignDetailText(options, "  "));
    return template;
  },
  addTable: function(tableDetail){
    var template = "QueryAction.addTable(tableDetail)";
    template = template.replace("tableDetail", fileComposer.composeTableText(tableDetail,"  "));
    return template;
  },
  addColumn: function(tableName,columnName,options){
    var template = "QueryAction.addColumns(tableName,columnName,options)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("columnName", q(columnName));
    console.log(options);
    template = template.replace("options", fileComposer.composeColumnDetailText(options,"  "));
    return template;
  },
  addPrimaryKeys: function(tableName,primaryKeys){
    var template = "QueryAction.addPrimaryKeys(tableName,primaryKeys)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("primaryKeys", val(primaryKeys));
    return template;
  },
  modifyColumn: function(tableName,columnName,options){
    var template = "QueryAction.modifyColumns(tableName,columnName,options)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("columnName", q(columnName));
    template = template.replace("options", fileComposer.composeColumnDetailText(options,"  "));
    return template;
  }
}

var pairedQueryActionComposer = {
  removeConstraint:function(tableName, constraintName){
    return {
      up:[
        queryActionTextComposer.removeConstraint(tableName, constraintName)
      ],
      down:[]
    }
  },
  removeForeignKey:function(tableName, foreignKeyName, options){
    return {
      up:[
        queryActionTextComposer.removeForeignKey(tableName, foreignKeyName)
      ],
      down:[
        queryActionTextComposer.addForeignKey(tableName, foreignKeyName, options)
      ]
    }
  },
  removeTable:function(tableDetail){
    return {
      up:[
        queryActionTextComposer.removeTable(tableDetail.tableName)
      ],
      down:[
        queryActionTextComposer.addTable(tableDetail)
      ]
    }
  },
  removeColumn:function(tableName,columnName, options){
    return {
      up:[
        queryActionTextComposer.removeColumn(tableName,columnName)
      ],
      down:[
        queryActionTextComposer.addColumn(tableName,columnName, options)
      ]
    }
  },
  removePrimaryKeys:function(tableName,primaryKeys){
    return {
      up:[
        queryActionTextComposer.removePrimaryKeys(tableName)
      ],
      down:[
        queryActionTextComposer.addPrimaryKeys(tableName,primaryKeys)
      ]
    }
  },
  addForeignKey:function(tableName, foreignKeyName, options){
    return {
      up:[
        queryActionTextComposer.addForeignKey(tableName, foreignKeyName, options)
      ],
      down:[
        queryActionTextComposer.removeForeignKey(tableName, foreignKeyName)
      ]
    }
  },
  addTable:function(tableDetail){
    return {
      up:[
        queryActionTextComposer.addTable(tableDetail)
      ],
      down:[
        queryActionTextComposer.removeTable(tableDetail.tableName)
      ]
    }
  },
  addColumn:function(tableName,columnName, options){
    return {
      up:[
        queryActionTextComposer.addColumn(tableName,columnName, options)
      ],
      down:[
        queryActionTextComposer.removeColumn(tableName,columnName)
      ]
    }
  },
  addPrimaryKeys:function(tableName,primaryKeys){
    return {
      up:[
        queryActionTextComposer.addPrimaryKeys(tableName,primaryKeys)
      ],
      down:[
        queryActionTextComposer.removePrimaryKeys(tableName)
      ]
    }
  },
  modifyColumn:function(tableName,columnName, toModifyColumnPair){
    return {
      up:[
        queryActionTextComposer.modifyColumn(tableName,columnName, toModifyColumnPair.newColumn)
      ],
      down:[
        queryActionTextComposer.modifyColumn(tableName,columnName, toModifyColumnPair.oldColumn)
      ]
    }
  }
}
module.exports = {
    pairedQueryActionComposer:pairedQueryActionComposer,
    queryActionTextComposer:queryActionTextComposer
}
