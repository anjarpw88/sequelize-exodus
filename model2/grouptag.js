
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
    "tags" : {
      _getType : (Sequelize) => Sequelize.JSON,
      allowNull : false,
      defaultValue : { A:1 , B:2 },
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
