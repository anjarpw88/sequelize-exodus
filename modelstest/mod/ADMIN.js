
module.exports = {
  tableName : "ADMIN",
  primaryKeys : ["ID"],
  foreignKeys : {
  },
  constraints : {
    "ADMIN_pkey" : "PRIMARY KEY",
    "2200_16420_1_not_null" : "CHECK",
    "2200_16420_2_not_null" : "CHECK",
    "2200_16420_3_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "USERNAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "HASHEDPASSWORD" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    }
  },
}