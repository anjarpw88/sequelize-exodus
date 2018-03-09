class IndentTextGenerator{
  constructor(){

  }
}


IndentTextGenerator.prototype.shiftRight = function(indent, str){
  return str.split("\r\n").join("\r\n"+indent);
}
IndentTextGenerator.prototype.shiftLeft = function(indent, str){
  return str.split("\r\n"+indent).join("\r\n");
}
IndentTextGenerator.prototype.br = "\r\n";
IndentTextGenerator.prototype.val = (str)=>JSON.stringify(str);
IndentTextGenerator.prototype.q =(str)=>'"'+str+'"';
IndentTextGenerator.prototype.printWithIndent = function (indentFormat, func){
  var br = this.br;
  var q = this.q;
  var val = this.val;
  var self = this;
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


  let recursiveFunc  = (indentCount, f) => {
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
    t={
      pl,
      p,
      dp,
      indentCount,
      getIndent:function(){
        return getIndent(this.indentCount);
      },
      printMultilines:function(str){
        var indent = getIndent(this.indentCount);
        var newString = self.shiftRight(indent, str);
        p(newString);
      }
    }
    f(t);
  }

  recursiveFunc(0, func);
  return finalString;
}


IndentTextGenerator.prototype.printArrayAction = function(propName, arr, elementPrintActionFunc){
    return (t)=>{
      t.pl(propName, ":","[");
      arr.forEach((el,idx)=>{
        t.dp(elementPrintActionFunc(el));
        if(idx<arr.length-1){
          t.p(",");
        }
      });
      t.pl("]");
    };
}
IndentTextGenerator.prototype.printObjectsAction=function(propName, obj, validPropHandler){
  return (t)=>{
    t.pl(propName, ":", "{");
    var keys = Object.keys(obj);

    var handledItems = [];
    keys.forEach((key,idx)=>{
      handledItem = validPropHandler(key);
      if(handledItem){
        handledItems.push(handledItem);
      }
    });

    handledItems.forEach((handledItem, idx)=>{
      t.dp(handledItem);
      if(idx<handledItems.length-1){
        t.p(",");
      }
    });

    t.pl("}");
  };
}

module.exports = IndentTextGenerator;
