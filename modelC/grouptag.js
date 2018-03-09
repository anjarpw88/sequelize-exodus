
module.exports = {
  tableName : "grouptag",
  primaryKeys : ["id"],
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : null,
      special : [],
      primaryKey : true
    },
    "groupname" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      defaultValue : null,
      special : [],
      primaryKey : false
    },
    "tags" : {
      _getType : (Sequelize) => Sequelize.JSON,
      allowNull : true,
      defaultValue : null,
      special : [],
      primaryKey : false
    }
  },
  foreignKeys : {
  },
  constraints : {
    "grouptag_pkey" : "PRIMARY KEY",
    "2200_24812_1_not_null" : "CHECK"
  }
}