
module.exports = {
  tableName : "PROVISIONALOFFER",
  primaryKeys : ["ID"],
  foreignKeys : {
    "LOANAPPLICATION_ID_fkey" : {
      fromTable : "PROVISIONALOFFER",
      toTable : "LOANAPPLICATION",
      fromColumns : ["fk_LOANAPPLICATION_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "PROVISIONALOFFER_pkey" : "PRIMARY KEY",
    "LOANAPPLICATION_ID_fkey" : "FOREIGN KEY",
    "2200_16575_1_not_null" : "CHECK",
    "2200_16575_2_not_null" : "CHECK",
    "2200_16575_3_not_null" : "CHECK",
    "2200_16575_4_not_null" : "CHECK",
    "2200_16575_5_not_null" : "CHECK",
    "2200_16575_6_not_null" : "CHECK",
    "2200_16575_7_not_null" : "CHECK",
    "2200_16575_8_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "fk_LOANAPPLICATION_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "INTEREST_ANNUAL" : {
      _getType : (Sequelize) => Sequelize.DOUBLE,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "INTEREST_MONTHLY" : {
      _getType : (Sequelize) => Sequelize.DOUBLE,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "LOAN_PERIOD" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "PAYMENT_LAST" : {
      _getType : (Sequelize) => Sequelize.DATEONLY,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "PAYMENT_FIRST" : {
      _getType : (Sequelize) => Sequelize.DATEONLY,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "LOAN_AMOUNT" : {
      _getType : (Sequelize) => "MONEY",
      allowNull : false,
      special : [],
      primaryKey : false,
    }
  },
}