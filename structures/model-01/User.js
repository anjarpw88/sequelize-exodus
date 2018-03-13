
module.exports = {
  tableName : "User",
  primaryKeys : ["id"],
  foreignKeys : {
  },
  constraints : {
    "User_pkey" : "PRIMARY KEY",
    "2200_65880_1_not_null" : "CHECK"
  },
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "name" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    }
  },
}