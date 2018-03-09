const Sequelize = require('sequelize');

/**

STEP1 (FIND DIFFERENCE):
  compare existence of tables
  result:
    -tables to add     :TA
    -tables to remove  :TR
    -tables to modify  :TM

  for each TM, find:
    -columns to add     :CA
    -columns to remove  :CR
    -columns to modify  :CM
    -constraints to remove:CoR
    -primaryKey to add    :PKA
    -primaryKey to remove :PKR
    -foreignKey to add    :FKA
    -foreignKey to remove :FKR
*/

const compareTwoTableSets = function(newTables,oldTables){
  var toAdd = {};
  var toRemove = {};
  var toModifyPairs = {};

  Object.keys(oldTables).forEach((key)=>{
    if(!newTables[key]){
      toRemove[key]=oldTables[key];
    }else{
      var comparedColumnSets = compareTwoColumnSets(newTables[key], oldTables[key]);
      var comparedConstraintSets = compareTwoConstraintSets(newTables[key], oldTables[key]);
      if(comparedColumnSets.isDifferent ||  comparedColumnSets.isDifferent){
        toModifyPairs[key] = {
            comparedColumnSets:comparedColumnSets,
            comparedConstraintSets:comparedConstraintSets,
        }

      }
    }
  });

  Object.keys(newTables).forEach((key)=>{
    if(!oldTables[key]){
      toAdd[key]=newTables[key];
    }
  });

  Object.keys(toModifyPairs).forEach((key)=>{
      var toModifyPair = toModifyPairs[key];
  });
  return {
    toAdd:toAdd,
    toModifyPairs:toModifyPairs,
    toRemove:toRemove
  }
}

const compareTwoConstraintSets=function(newTable, oldTable){
  var differences = {
    toRemoveConstraints:{},
    toAddForeignKeys:{},
    toRemoveForeignKeys:{},
    isDifferent:false,
  }
  Object.keys(oldTable.constraints).forEach((key)=>{
    if(!newTable.constraints[key]){
      differences.toRemoveConstraints[key] = oldTable.constraints[key];
      differences.isDifferent = true;
    }
  });
  Object.keys(oldTable.foreignKeys).forEach((key)=>{
    if(!newTable.foreignKeys[key]){
      differences.toRemoveForeignKeys[key] = oldTable.foreignKeys[key];
      differences.isDifferent = true;
    }else{
      var diff = JSON.stringify(newTable.foreignKeys[key]) != JSON.stringify(oldTable.foreignKeys[key]);
      if(diff){
        differences.toRemoveForeignKeys[key] = oldTable.foreignKeys[key];
        differences.toAddForeignKeys[key] = newTable.foreignKeys[key];
        differences.isDifferent = true;
      }
    }
  });
  Object.keys(newTable.foreignKeys).forEach((key)=>{
    if(!oldTable.foreignKeys[key]){
      differences.toAddForeignKeys[key] = newTable.foreignKeys[key];
      differences.isDifferent = true;
    }
  });
  if(JSON.stringify(newTable.primaryKeys) != JSON.stringify(oldTable.primaryKeys)){
    differences.newPrimaryKeys = newTable.primaryKeys;
    differences.oldPrimaryKeys = oldTable.primaryKeys;
    differences.isDifferent = true;
  }
  return differences;
}

const compareTwoColumns = function(newCol, oldCol){
    var differences = {
      isDifferent:false,
      newColumn:{

      },
      oldColumn:{

      }
    };

    if(oldCol.allowNull != newCol.allowNull){
      differences.newColumn.allowNull = newCol.allowNull;
      differences.oldColumn.allowNull = oldCol.allowNull;
      differences.isDifferent = true;
    }
    if(oldCol.primaryKey != newCol.primaryKey){
      differences.newColumn.primaryKey = newCol.primaryKey;
      differences.oldColumn.primaryKey = oldCol.primaryKey;
      differences.isDifferent = true;
    }
    if(JSON.stringify(oldCol.special) != JSON.stringify(newCol.special)){
      differences.newColumn.special = newCol.special;
      differences.oldColumn.special = oldCol.special;
      differences.isDifferent = true;
    }
    if(oldCol._getType(Sequelize).toString() !=  newCol._getType(Sequelize).toString()){
      differences.newColumn._getType = newCol._getType;
      differences.oldColumn._getType = oldCol._getType;
      differences.isDifferent = true;
    }
    return differences;
}


const compareTwoColumnSets=function(newTable, oldTable){
  var newColumns = newTable.columns;
  var oldColumns = oldTable.columns;
  var toAdd = {};
  var toRemove = {};
  var toModifyPairs = {};

  Object.keys(oldColumns).forEach((key)=>{
    if(!newColumns[key]){
      toRemove[key]=oldColumns[key];
    }else{
      var comparedColumns = compareTwoColumns(newColumns[key],oldColumns[key]);
      if(comparedColumns.isDifferent){
        toModifyPairs[key] = comparedColumns;
      }
    }
  });

  Object.keys(newColumns).forEach((key)=>{
    if(!oldColumns[key]){
      toAdd[key]=newColumns[key];
    }
  });
  var isDifferent = (Object.keys(toAdd).length + Object.keys(toRemove).length) > 0
    || Object.keys(toModifyPairs).length>0;
  return {
    toAdd:toAdd,
    isDifferent:isDifferent,
    toRemove:toRemove,
    toModifyPairs:toModifyPairs
  }
}


const checkDifferences = function(newStructure, oldStructure){
    var differences = compareTwoTableSets(newStructure.tables, oldStructure.tables);
    return {
      differences:differences,
      newStructure:newStructure,
      oldStructure:oldStructure
    };

}
/*

STEP2 (GENERATE MIGRATIONS)
  TM:
    -remove modified PKR
    -remove modified FKR

  TR:
    -find dependencies of all TR
    -remove foreign keys that refer to TR
    -remove TR

  TM:
    -find dependencies of all CR
    -remove foreign keys that refer to CR
    -remove CoR
    -remove CR

  TA:
    -add TA, without foreign keys!

  TM:
    -modify CM
    -add CA
    -add modified PKA in TM
    -add modified FKA in TM

  TA:
    -add TA's foreignKeys

*/

// find dependencies of all TR
// find dependencies of all TM -> CR

const findForeignKeyInfosImpactedByRemovedTablesAndRemovedColumns = function(oldTables, differences){
  var removedTableNames = Object.keys(differences.toRemove);
  var removedColumnInfos =[];
  Object.keys(differences.toModifyPairs).forEach((tableName) => {
    var toRemove = differences.toModifyPairs[tableName].comparedColumnSets.toRemove;
    Object.keys(toRemove).forEach((columnName)=>{
      removedColumnInfos.push({
        columnName:columnName,
        tableName:tableName
      })
    });
  });
  var oldForeignKeyInfoArray = [];
  Object.keys(oldTables).forEach((tableName) => {
      var foreignKeys = oldTables[tableName].foreignKeys;
      Object.keys(foreignKeys).forEach((foreignKeyName) => {
          oldForeignKeyInfoArray.push({
            tableName:tableName,
            foreignKeyName:foreignKeyName,
            options:foreignKeys[foreignKeyName]
          });
      });
  });

  var toBeRemovedForeignKeyInfoArray = [];
  removedTableNames.forEach((tableName)=>{
    oldForeignKeyInfoArray.forEach((fKey)=>{
      if(fKey.options.toTable == tableName || fKey.options.fromTable == tableName){
        toBeRemovedForeignKeyInfoArray.push(fKey);
      }
    });
  });

  removedColumnInfos.forEach((colInfo)=>{
    oldForeignKeyInfoArray.forEach((fKey)=>{
      if(fKey.options.toTable == colInfo.tableName && fKey.options.toColumns.indexOf(colInfo.columnName)>=0){
        toBeRemovedForeignKeyInfoArray.push(fKey);
      }
      if(fKey.options.fromTable == colInfo.tableName && fKey.options.fromColumns.indexOf(colInfo.columnName)>=0){
        toBeRemovedForeignKeyInfoArray.push(fKey);
      }
    });
  });
  return toBeRemovedForeignKeyInfoArray;

}

const generateMigrationCommands = function (comparisonObject){
  var actions = [];
  var differences = comparisonObject.differences;
  var oldStructure = comparisonObject.oldStructure;

  /*
    -remove modified PKR
    -remove modified FKR
  */
  Object.keys(differences.toModifyPairs).forEach((tableName) => {


    var set = differences.toModifyPairs[tableName].comparedConstraintSets;

    Object.keys(set.toRemoveConstraints).forEach((constraintName)=>{
      var action = (q) => q.removeConstraint(tableName, constraintName);
      actions.push(action);
    });

    Object.keys(set.toRemoveForeignKeys).forEach((foreignKeyName)=>{
      var action = (q) => q.removeForeignKey(tableName, foreignKeyName, set.toRemoveForeignKeys[foreignKeyName]);
      actions.push(action);
    });

    if(set.oldPrimaryKeys != set.newPrimaryKeys){
      var action = (q) => q.removePrimaryKeys(tableName, set.oldPrimaryKeys);
      actions.push(action);
    };

  });


  /*
  TR:
    -find dependencies of all TR
  TM:
    -find dependencies of all CR
  */
  var toBeRemovedForeignKeyInfos = findForeignKeyInfosImpactedByRemovedTablesAndRemovedColumns(oldStructure.tables, differences);
  /*
  TR:
    -remove foreign keys that refer to TR
  TM:
    -remove foreign keys that refer to CR
  */
  toBeRemovedForeignKeyInfos.forEach((fkeyInfo)=>{
      var action = (q) => q.removeForeignKey(fkeyInfo.tableName, fkeyInfo.foreignKeyName, fkeyInfo.options);
      actions.push(action);
  });

  /*
  TR:
    -remove TR
  */
  Object.keys(differences.toRemove).forEach((tableName)=>{
    var action = (q) => q.removeTable(differences.toRemove[tableName]);
    actions.push(action);
  });

  /*
  TM:
    -remove CR
  */
  Object.keys(differences.toModifyPairs).forEach((tableName) => {
    var toRemoveColumns = differences.toModifyPairs[tableName].comparedColumnSets.toRemove;
    Object.keys(toRemoveColumns).forEach((columnName)=>{
      var action = (q) => q.removeColumn(tableName, columnName, toRemoveColumns[columnName]);
      actions.push(action);
    });
  });

  /*
  TA:
    -add TA, without foreign keys!
  */
  Object.keys(differences.toAdd).forEach((tableName)=>{
    var newObj = Object.assign({},differences.toAdd[tableName]);
    delete newObj.foreignKeys;
    delete newObj.constraints;
    var action = (q) => q.addTable(newObj);
    actions.push(action);
  });

  /*
  TM:
    -modify CM
    -add CA
    -add modified PKA in TM
    -add modified FKA in TM
  */
  Object.keys(differences.toModifyPairs).forEach((tableName) => {
    var toModifyPairs = differences.toModifyPairs[tableName].comparedColumnSets.toModifyPairs;
    Object.keys(toModifyPairs).forEach((columnName)=>{
      var columnPair=toModifyPairs[columnName];
      var newObj = Object.assign({},columnPair);
      if(newObj._getType==undefined){
          delete newObj._getType;
      }
      if(newObj.allowNull==undefined){
          delete newObj.allowNull;
      }
      if(newObj.defaultValue==undefined){
          delete newObj.defaultValue;
      }
      if(newObj.special==undefined){
          delete newObj.special;
      }
      var action = (q) => q.modifyColumn(tableName, columnName,newObj);
      actions.push(action);
    });

    var toAdd = differences.toModifyPairs[tableName].comparedColumnSets.toAdd;
    Object.keys(toAdd).forEach((columnName)=>{
      var column=toAdd[columnName];
      var action = (q) => q.addColumn(tableName, columnName,column);
      actions.push(action);
    });

    var set = differences.toModifyPairs[tableName].comparedConstraintSets;

    Object.keys(set.toAddForeignKeys).forEach((foreignKeyName)=>{
      var action = (q) => q.addForeignKey(tableName, foreignKeyName, set.toAddForeignKeys[foreignKeyName]);
      actions.push(action);
    });

    if(set.oldPrimaryKeys != set.newPrimaryKeys){
      var action = (q) => q.addPrimaryKeys(tableName, set.newPrimaryKeys);
      actions.push(action);
    };
  });


  /*
  TA:
    -add TA's foreignKeys
  */
  Object.keys(differences.toAdd).forEach((tableName)=>{
    var foreignKeys = differences.toAdd[tableName].foreignKeys;
    Object.keys(foreignKeys).forEach((foreignKeyName)=>{
      var action = (q) => q.addForeignKey(tableName, foreignKeyName, foreignKeys[foreignKeyName]);
      actions.push(action);
    });
  });

  return actions;

}

module.exports = {
  checkDifferences:checkDifferences,
  generateMigrationCommands:generateMigrationCommands
}
