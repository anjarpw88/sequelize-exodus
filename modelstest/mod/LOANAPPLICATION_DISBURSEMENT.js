
module.exports = {
  tableName : "LOANAPPLICATION_DISBURSEMENT",
  primaryKeys : ["ID"],
  foreignKeys : {
    "LOANAPPLICATION_ID_fkey" : {
      fromTable : "LOANAPPLICATION_DISBURSEMENT",
      toTable : "LOANAPPLICATION",
      fromColumns : ["fk_LOANAPPLICATION_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "LOANAPPLICATION_ID_fkey" : "FOREIGN KEY",
    "LOANAPPLICATION_DISBURSEMENT_pkey" : "PRIMARY KEY",
    "2200_16519_1_not_null" : "CHECK",
    "2200_16519_2_not_null" : "CHECK",
    "2200_16519_3_not_null" : "CHECK",
    "2200_16519_4_not_null" : "CHECK",
    "2200_16519_5_not_null" : "CHECK",
    "2200_16519_6_not_null" : "CHECK",
    "2200_16519_7_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "track_USER_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "fk_LOANAPPLICATION_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "DATE_DUE" : {
      _getType : (Sequelize) => Sequelize.DATEONLY,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "AMOUNT" : {
      _getType : (Sequelize) => "MONEY",
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "NAME" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "DESCRIPTION" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    }
  },
}