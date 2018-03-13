const program = require('commander-plus');
const print = console.log;

var consoleOpt = {}
consoleOpt.Reset = "\x1b[0m";
consoleOpt.Bright = "\x1b[1m";
consoleOpt.Dim = "\x1b[2m";
consoleOpt.Underscore = "\x1b[4m";
consoleOpt.Blink = "\x1b[5m";
consoleOpt.Reverse = "\x1b[7m";
consoleOpt.Hidden = "\x1b[8m";
consoleOpt.FgBlack = "\x1b[30m";
consoleOpt.FgRed = "\x1b[31m";
consoleOpt.FgGreen = "\x1b[32m";
consoleOpt.FgYellow = "\x1b[33m";
consoleOpt.FgBlue = "\x1b[34m";
consoleOpt.FgMagenta = "\x1b[35m";
consoleOpt.FgCyan = "\x1b[36m";
consoleOpt.FgWhite = "\x1b[37m";
consoleOpt.BgBlack = "\x1b[40m";
consoleOpt.BgRed = "\x1b[41m";
consoleOpt.BgGreen = "\x1b[42m";
consoleOpt.BgYellow = "\x1b[43m";
consoleOpt.BgBlue = "\x1b[44m";
consoleOpt.BgMagenta = "\x1b[45m";
consoleOpt.BgCyan = "\x1b[46m";
consoleOpt.BgWhite = "\x1b[47m";
consoleOpt.VReset = consoleOpt.Reset +" ";


var printError = function(){
  var args = arguments;
  var str = Object.keys(args).map(key=>args[key]).join(" ");
  print(consoleOpt.FgRed + str + consoleOpt.Reset);
}

var promptAsync = function(message){
  message =  consoleOpt.Bright + consoleOpt.FgYellow + message + consoleOpt.VReset;
  return new Promise((resolve)=>{
    program.prompt(message, (answer)=>{
      resolve(answer.trim());
    });
  });
}

var waitPrompt = async function(message, validator, preprocessor){
  var isValidAnswer = false;
  while(!isValidAnswer){
    var answer = await promptAsync(message);
    if(preprocessor){
      answer = preprocessor(answer);
    }
    isValidAnswer = validator ? validator(answer) : true;
  }
  return answer;
}

const waitOptionPrompt = async function(options){
  print(consoleOpt.Reset);
  var answer = null;
  var selections = Object.keys(options).map(key=>{
    var str = options[key].status || "";
    return str + options[key].description + consoleOpt.Reset;
  });

  var id = await waitChoose("Please choose any of these", selections);
  key =  Object.keys(options)[id];
  print(consoleOpt.Reset);
  return options[key];
}


var waitPass = function(message, mask){
  return new Promise((resolve)=>{
    message = consoleOpt.Bright + consoleOpt.FgYellow + message+consoleOpt.VReset;
    program.password(message, mask, function(pass){
      resolve(pass);
    });
  });
}
var waitChoose = async function(message, selections){
  return new Promise((resolve)=>{
    message = consoleOpt.Bright + consoleOpt.FgYellow + message+consoleOpt.VReset;
    print(message);
    program.choose(selections, function(i){
      resolve(i);
    });
  });
}
var waitConfirm = async function(message){
  return new Promise((resolve)=>{
    message = consoleOpt.Bright + consoleOpt.FgYellow + message+consoleOpt.VReset;
    program.confirm(message, function(ok){
      resolve(ok);
    });
  });
}

module.exports = {
  consoleOpt,
  print,
  printError,
  waitPrompt,
  waitPass,
  waitChoose,
  waitConfirm,
  waitOptionPrompt
}
