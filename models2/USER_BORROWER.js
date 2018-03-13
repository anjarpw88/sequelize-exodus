
module.exports = {
  tableName : "USER_BORROWER",
  primaryKeys : ["fk_USER_ID"],
  foreignKeys : {
    "USER_ID_fkey" : {
      fromTable : "USER_BORROWER",
      toTable : "USER_BORROWER",
      fromColumns : ["fk_USER_ID"],
      toColumns : ["fk_USER_ID"]
    }
  },
  constraints : {
    "USER_BORROWER_pkey" : "PRIMARY KEY",
    "USER_ID_fkey" : "FOREIGN KEY",
    "2200_16429_1_not_null" : "CHECK",
    "2200_16429_2_not_null" : "CHECK",
    "2200_16429_4_not_null" : "CHECK",
    "2200_16429_5_not_null" : "CHECK",
    "2200_16429_7_not_null" : "CHECK",
    "2200_16429_8_not_null" : "CHECK",
    "2200_16429_9_not_null" : "CHECK"
  },
  columns : {
    "fk_USER_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
    },
    "FULLNAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "NICKNAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "GENDER" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "ADDRESS_NEIGHBOURHOOD" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "ADDRESS_DISTRICT" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "ADDRESS_CITY" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "ADDRESS_STATE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "ADDRESS_POSTALCODE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    }
  },
}