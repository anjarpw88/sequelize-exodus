
module.exports = {
  tableName : "Card",
  primaryKeys : ["id"],
  foreignKeys : {
  },
  constraints : {
    "Card_pkey" : "PRIMARY KEY",
    "2200_65850_1_not_null" : "CHECK"
  },
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "number16Digit" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    }
  },
}