const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const CompactTableModel = require('./compact-table-model');
const CompactStructure = require('./compact-structure');
const ToolConverters = require('./tool-converters');

require("array-async-tools");

class FileReader{
  constructor(){

  }
}

FileReader.readDirectory = function(dir){

  var dir = path.join(__dirname, "..", dir);
  return new Promise((resolve, reject)=>{
    fs.readdir( dir, async function( err, files ) {
      if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
      }

      var filePaths = [];
      await files.awaitAll( async (file,index) => {
        var fromPath = path.join( dir,file);
        filePaths.push(fromPath);
      });
      var compactStructure = ToolConverters.getCompactStructureFromFiles(filePaths);
      resolve(compactStructure);

    });
  });
}

module.exports = FileReader;
