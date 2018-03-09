let br = "\r\n";
let val = (str)=>JSON.stringify(str);
let q =(str)=>'"'+str+'"';
let printWithIndent = function (indentFormat, func){
  var finalString = "";
  function getIndent(indentCount){
    var str="";
    for(var i=0; i<indentCount; i++){
      str+=indentFormat;
    }
    return str;
  }

  let print = function(args){
    strArr=[];
    Object.keys(args).forEach((key)=>{
      strArr.push(args[key]);
    })
    var str = strArr.join(" ");
    finalString += str;
  }

  let p = function(){
    print(arguments);
  }


  function recursiveFunc(indentCount, f){
    var indent=getIndent(indentCount);
    let pl = function(){
      finalString += br + indent;
      print(arguments);
    }
    let dp = function(df){
      if(df==null){
        return;
      }
      recursiveFunc(indentCount+1, df);
    }
    f(pl,p, dp);
  }

  recursiveFunc(0, func);
  return finalString;
}


let printArrayAction = function(propName, arr, elementPrintActionFunc){
    return (pl, p, dp)=>{
      pl(propName, ":","[");
      arr.forEach((el,idx)=>{
        dp(elementPrintActionFunc(el));
        if(idx<arr.length-1){
          p(",");
        }
      });
      pl("]");
    };
}
let printObjectsAction=function(propName, obj, validPropHandler){
  return (pl, p, dp)=>{
    pl(propName, ":", "{");
    var keys = Object.keys(obj);

    var handledItems = [];
    keys.forEach((key,idx)=>{
      handledItem = validPropHandler(key);
      if(handledItem){
        handledItems.push(handledItem);
      }
    });

    handledItems.forEach((handledItem, idx)=>{
      dp(handledItem);
      if(idx<handledItems.length-1){
        p(",");
      }
    });

    pl("}");
  };
}

let compose = function(tableModel,options){
  let printTables = (pl,p, dp) => {
    pl("tableName",":",q(tableModel.tableName));
    p(",");
    printColumns(pl, p, dp);
    p(",");
    printForeignKeys(pl, p, dp);
    p(",");
    printConstraints(pl, p, dp);
  }

  let printColumns = (pl, p, dp) => {
    var columnHandler = (prop)=>
    {
        return (pl, p, dp) =>{
          pl(q(prop), ":", "{");
          dp(printColumnDetail(tableModel.columns[prop]));
          pl("}");
        };
    }
    printObjectsAction("columns", tableModel.columns,columnHandler)(pl, p, dp);
  }

  let printColumnDetail = function(column){
    var options = column.options;
    return (pl, p, dp) => {
      pl("type",":",options.concludedType.stringRep);
      p(",");
      pl("allowNull",":",val(options.allowNull));
      p(",");
      pl("defaultValue",":",val(options.defaultValue));
      p(",");
      pl("special",":",val(options.special));
      p(",");
      pl("primaryKey",":",val(options.primaryKey));
    }
  }

  let printForeignKeys = (pl, p, dp) =>{
    var fkHandler = (prop)=>
    {
        return (pl, p, dp) =>{
          pl(q(prop), ":", "{");
          dp(printForeignKeyDetail(tableModel.foreignKeys[prop]));
          pl("}");
        };
    }
    printObjectsAction("foreignKeys", tableModel.foreignKeys,fkHandler)(pl, p, dp);
  }

  let printForeignKeyDetail = function(obj){
    return (pl, p, dp) => {
      pl("fromTable",":",val(obj.fromTable));
      p(",");
      pl("toTable",":",val(obj.toTable));
      p(",");
      pl("fromColumns",":",val(obj.fromColumns));
      p(",");
      pl("toColumns",":",val(obj.toColumns));
    }
  }

  let printConstraints = (pl, p, dp) =>{
    var constraintsHandler = (prop)=>
    {
        return (pl, p, dp) =>{
          var constraintObject = tableModel.constraints[prop];
          pl(q(prop),":",val(constraintObject.type));
        };
    }
    printObjectsAction("constraints", tableModel.constraints,constraintsHandler)(pl, p, dp);
  }

  let printOuter = (pl, p, dp) => {
    pl("module.exports = function(Sequelize){");
    dp((pl,p, dp) => {
      pl("return {");
      dp(printTables);
      pl("}");
    });
    pl("}");
  };


  var options = options || {};
  var indentFormat = options.indentFormat || "  ";
  var finalString = printWithIndent(indentFormat,printOuter);
  finalString+=br+br;
  return finalString;
};

module.exports = {
  compose:compose
}
