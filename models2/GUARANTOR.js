
module.exports = {
  tableName : "GUARANTOR",
  primaryKeys : ["ID"],
  foreignKeys : {
  },
  constraints : {
    "GUARANTOR_pkey" : "PRIMARY KEY",
    "2200_16552_1_not_null" : "CHECK",
    "2200_16552_2_not_null" : "CHECK",
    "2200_16552_3_not_null" : "CHECK"
  },
  columns : {
    "FULLNAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "IDENTITYCARD" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    }
  },
}