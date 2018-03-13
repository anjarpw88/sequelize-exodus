var ToolConverters = require("./tool-converters");
var Sequelize = require('sequelize');
const migrationTableName = "__Migration";
const migrationTable = {
  tableName : migrationTableName,
  primaryKeys : ["id"],
  foreignKeys : {
  },
  columns : {
    "CurrentVersion" : {
      type : Sequelize.TEXT,
      allowNull : false,
      special : [],
      autoIncrement : false,
    },
    "FromVersion" : {
      type : Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "MigrationName" : {
      type : Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "Date" : {
      type : Sequelize.DATE,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "Id":{
      type : Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement: true
    }
  },
};
const getCurrentVersionInfo = async function (sequelizeObject){
  const migrationTableModel = ToolConverters.toModel(sequelizeObject, migrationTable);
  await migrationTableModel.sync({force:false});
  var item = await migrationTableModel
    .findOne({
      order: [['CurrentVersion','DESC']]
    })
  var item = item.get({
    plain: true
  });
  return item;
}

const ensureDatabaseExist = async function (sequelizeObject){
  var queryInterface = sequelizeObject.getQueryInterface();
  var tableNames = await queryInterface.showAllTables();
  if(tableNames.indexOf(migrationTable.migrationTableName)<0){
    await queryInterface.createTable(migrationTable.tableName, migrationTable.columns);
  }
}
const setDatabaseVersion = async function (sequelizeObject, migrationScript){
  var queryInterface = sequelizeObject.getQueryInterface();
  var insertedItem = {
    CurrentVersion : migrationScript.currentVersion ,
    FromVersion : migrationScript.fromVersion ,
    MigrationName : migrationScript.migrationName ,
    Date: new Date(),
  };

  const migrationTableModel = ToolConverters.toModel(sequelizeObject, migrationTable);
  await migrationTableModel.sync({force:false});
  await migrationTableModel.create(insertedItem);
}


module.exports = {
  migrationTable,
  migrationTableName,
  ensureDatabaseExist,
  setDatabaseVersion,
  getCurrentVersionInfo
}
