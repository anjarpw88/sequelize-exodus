/**
"QueryAction.removeConstraint(constraintName)",
"QueryAction.removeForeignKey(tableName,foreignKeyName)",
"QueryAction.removeTable(tableName)",
"QueryAction.removeColumn(tableName,columnName)",
"QueryAction.addTable(tableDetail)",
"QueryAction.addColumn(tableName,columnName,options)",
"QueryAction.modifyColumn(tableName,columnName,options)",
"QueryAction.addForeignKey(tableName,foreignKeyName, options)",
"QueryAction.addPrimaryKeys(tableName, primaryKeys)",

*/

const DialectGenerator = require("./dialect-generator-extended");

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

var getQueryActionRunner = function(sequelize){
  var queryInterface = sequelize.getQueryInterface();
  var knownDialect = sequelize.getDialect();
  var methodSet = DialectGenerator[knownDialect](queryInterface);

  return {
    removeConstraint: async function(tableName,constraintName, type){
      return await methodSet.removeConstraint(tableName,constraintName, type);
    },
    removeForeignKey: async function(tableName,constraintName){
      return await methodSet.removeConstraint(tableName,constraintName, "FOREIGN KEY");
    },
    removePrimaryKeys: async function(tableName,constraintName){
      return await methodSet.removeConstraint(tableName,constraintName, "PRIMARY KEY");
    },
    removeTable: async function(tableName){
      return await queryInterface.dropTable(tableName);
    },
    removeColumn: async function(tableName, columnName){
      return await queryInterface.removeColumn(tableName, columnName);
    },
    addTable: async function(tableDetail){
      var columns = {};
      Object.keys(tableDetail.columns).forEach((key)=>{
        var column = Object.assign({},tableDetail.columns[key]);
        column.type = column._getType(Sequelize);
        delete column._getType;
        columns[key]=column;
      });

      return await queryInterface.createTable(tableDetail.tableName, columns);
    },
    addColumn: async function(tableName, columnName, originalColumn){
      column = Object.assign({},originalColumn);
      column.type = column._getType(Sequelize);
      delete column._getType;
      return await queryInterface.addColumn(tableName, columnName, column);
    },

    addForeignKey: async function(tableName, foreignKeyName, options){
      await methodSet.addForeignKey(tableName, foreignKeyName, options);
    },
    modifyColumn:async function(tableName, columnName, originalColumn){
      var column = Object.assign({},originalColumn);
      if(column._getType){
        column.type = column._getType(Sequelize);
        delete column._getType;
      }
      await methodSet.modifyColumn(tableName, columnName, column);
    },

    addPrimaryKeys:async function(tableName, constraintName, primaryKeys){
      await methodSet.addForeignKey(tableName, constraintName, primaryKeys);
    }
  }
}

var ScriptComposerForTable = require("./script-composer-for-table");
var scriptComposer = new ScriptComposerForTable();
var q = (str)=>'"'+str+'"';
var val = (str)=> JSON.stringify(str);
var queryActionTextComposer = {
  removeConstraint: function(tableName,constraintName, type){
    var template = "QueryActionRunner.removeConstraint(tableName, constraintName, type)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("constraintName", q(constraintName));
    template = template.replace("type", q(type));
    return template;
  },
  removeForeignKey: function(tableName,foreignKeyName, ){
    var template = "QueryActionRunner.removeForeignKey(tableName,foreignKeyName)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("foreignKeyName", q(foreignKeyName));
    return template;
  },
  removeTable: function(tableName){
    var template = "QueryActionRunner.removeTable(tableName)";
    template = template.replace("tableName", q(tableName));
    return template;
  },
  removeColumn: function(tableName, columnName){
    var template = "QueryActionRunner.removeColumn(tableName, columnName)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("columnName", q(columnName));
    return template;
  },
  removePrimaryKeys: function(tableName, constraintName){
    var template = "QueryActionRunner.removePrimaryKeys(tableName,constraintName)";
    template = template.replace("constraintName", q(constraintName));
    template = template.replace("tableName", q(tableName));
    return template;
  },
  addForeignKey: function(tableName,foreignKeyName,options){
    var template = "QueryActionRunner.addForeignKey(tableName,foreignKeyName,options)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("foreignKeyName", q(foreignKeyName));
    template = template.replace("options", scriptComposer.composeForeignDetailText(options, "  "));
    return template;
  },
  addTable: function(tableDetail){
    var template = "QueryActionRunner.addTable(tableDetail)";
    template = template.replace("tableDetail", scriptComposer.composeTableText(tableDetail,"  "));
    return template;
  },
  addColumn: function(tableName,columnName,options){
    var template = "QueryActionRunner.addColumn(tableName,columnName,options)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("columnName", q(columnName));
    template = template.replace("options", scriptComposer.composeColumnDetailText(options,"  "));
    return template;
  },
  addPrimaryKeys: function(tableName,constraintName, primaryKeys){
    var template = "QueryActionRunner.addPrimaryKeys(tableName,constraintName, primaryKeys)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("constraintName", q(constraintName));
    template = template.replace("primaryKeys", val(primaryKeys));
    return template;
  },
  modifyColumn: function(tableName,columnName,options){
    var template = "QueryActionRunner.modifyColumn(tableName,columnName,options)";
    template = template.replace("tableName", q(tableName));
    template = template.replace("columnName", q(columnName));
    template = template.replace("options", scriptComposer.composeColumnDetailText(options,"  "));
    return template;
  }
}

var pairedQueryActionComposer = {
  removeConstraint:function(tableName, constraintName, constraintType){
    return {
      up:[
        queryActionTextComposer.removeConstraint(tableName, constraintName, constraintType)
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
  removePrimaryKeys:function(tableName,constraintName, primaryKeys){
    return {
      up:[
        queryActionTextComposer.removePrimaryKeys(tableName, constraintName)
      ],
      down:[
        queryActionTextComposer.addPrimaryKeys(tableName,constraintName, primaryKeys)
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
    var constraintName = tableName +"("+primaryKeys.join(",")+")_PK";
    return {
      up:[
        queryActionTextComposer.addPrimaryKeys(tableName,constraintName,primaryKeys)
      ],
      down:[
        queryActionTextComposer.removePrimaryKeys(tableName,constraintName)
      ]
    }
  },
  modifyColumn:function(tableName,columnName, newColumn, oldColumn){
    return {
      up:[
        queryActionTextComposer.modifyColumn(tableName,columnName, newColumn)
      ],
      down:[
        queryActionTextComposer.modifyColumn(tableName,columnName, oldColumn)
      ]
    }
  }
}
module.exports = {
    pairedQueryActionComposer:pairedQueryActionComposer,
    queryActionTextComposer:queryActionTextComposer,
    getQueryActionRunner:getQueryActionRunner
}
