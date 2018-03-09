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
    -constraints to remove  :CoR
    -constraints to add     :CoA


STEP2 (GENERATE MIGRATIONS)
  TABLE:
    -find dependencies of all TR
    -remove constraints that refer to TR
    -remove TR
    -add TA, without constraints!
  columns in TM:
    -find dependencies of all CR
    -remove constraints that refer to CR
    -remove CoR
    -remove CR
  Remaining: CA, TA, and CoA, and constraints:
    -add CA, without constraints
    -modify CM
    -add TA's constraints
    -add CoA
    -add CA's constraints

*/

const compareTwoTableSets = function(newTables,oldTables){
  var toAdd = {};
  var toRemove = {};
  var toModifyPairs = {};

  Object.keys(oldTables).forEach((key)=>{
    if(!newTables[key]){
      toRemove[key]=oldTables[key];
    }else{
      toModifyPairs[key] = {
          old:oldTables[key],
          new:newTables[key],
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
      toModifyPairs[key].comparedColumnSets = compareTwoColumnSets(toModifyPair.new, toModifyPair.old);
      toModifyPairs[key].comparedConstraintSets = compareTwoConstraintSets(toModifyPair.new, toModifyPair.old);
  });
}

const compareTwoConstraintSets=function(newTable, oldTable){
  var differences = {
    toRemoveConstraints:[],
    toAddForeignKeys:{},
    toRemoveForeignKeys:{},
    primaryKeyChanges:null,
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
    differences.primaryKeys = newTable.primaryKeys;
    differences.isDifferent = true;
  }
  return differences;
}

const compareTwoColumns = function(newCol, oldCol){
    var differences = {
      isDifferent:false
    };

    if(oldCol.allowNull != newCol.allowNull){
      differences.allowNull = newCol.allowNull;
      differences.isDifferent = true;
    }
    if(oldCol.primaryKey != newCol.primaryKey){
      differences.primaryKey = newCol.primaryKey;
      differences.isDifferent = true;
    }
    if(JSON.stringify(oldCol.special) != JSON.stringify(newCol.special)){
      differences.special = newCol.special;
      differences.isDifferent = true;
    }
    if(oldCol.type.toString() !=  newCo1.type.toString()){
      differences.special = newCol.type;
      differences.isDifferent = true;
    }
    return differences;
}

const areTwoColumnsSame = function(col1, col2){
  var checkValues
     = col1.allowNull == col2.allowNull
    && col1.primaryKey == col2.primaryKey
    && JSON.stringify(col1.primaryKey) == JSON.stringify(col2.primaryKey)
    && JSON.stringify(col1.special) == JSON.stringify(col2.special)
    && co11.type.toString() == co12.type.toString();
  return checkValues;
}

const compareTwoColumnSets=function(newTable, oldTable){
  var newColumns = newTable.columns;
  var oldColumns = oldTable.columns;
  var toAdd = {};
  var toRemove = {};
  var toModifyPairs = {};

  Object.keys(oldTables).forEach((key)=>{
    if(!newColumns[key]){
      toRemove[key]=oldColumns[key];
    }else{
      toModifyPairs[key] = {
        old:toRemove[key],
        new:toAdd[key],
        isDifferent:false
      }
      toModifyPairs[key].comparedColumns = compareTwoColumns(newColumns[key],oldColumns[key]);
    }
  });

  Object.keys(newColumns).forEach((key)=>{
    if(!oldColumns[key]){
      toAdd[key]=newColumns[key];
    }
  });
  var isDifferent = (Object.keys(toAdd).length + Object.keys(toRemove).length) > 0
    || toModifyPairs.filter(u=>u.comparedColumns.isDifferent).length>0;
  return {
    toAdd:toAdd,
    isDifferent:isDifferent,
    toRemove:toRemove,
    toModifyPairs:toModifyPairs
  }
}

const checkDifference = function(diff1, diff2){

}

module.exports = {
  checkDifference:checkDifference
}
