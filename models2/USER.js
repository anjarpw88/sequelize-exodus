
module.exports = {
  tableName : "USER",
  primaryKeys : ["ID"],
  foreignKeys : {
  },
  constraints : {
    "USER_pkey" : "PRIMARY KEY",
    "2200_16403_1_not_null" : "CHECK",
    "2200_16403_2_not_null" : "CHECK",
    "2200_16403_5_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "NAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "PHONE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "EMAIL" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
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