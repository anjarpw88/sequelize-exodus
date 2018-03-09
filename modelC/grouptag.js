
module.exports = {
  tableName : "grouptag",
  primaryKeys : ["id"],
  foreignKeys : {
  },
  constraints : {
    "grouptag_pkey" : "PRIMARY KEY",
    "2200_24812_1_not_null" : "CHECK"
  }
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : true
    },
    "groupname" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false
    },
    "tags" : {
      _getType : (Sequelize) => Sequelize.JSON,
      allowNull : true,
      special : [],
      primaryKey : false
    }
  },
}