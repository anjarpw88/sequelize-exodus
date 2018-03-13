
module.exports = {
  tableName : "CONTRACTSCHEME_REPAYMENT",
  primaryKeys : ["ID"],
  foreignKeys : {
    "CONTRACTSCHEME_ID_fkey" : {
      fromTable : "CONTRACTSCHEME_REPAYMENT",
      toTable : "CONTRACTSCHEME",
      fromColumns : ["fk_CONTRACTSCHEME_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "CONTRACTSCHEME_REPAYMENT_pkey" : "PRIMARY KEY",
    "CONTRACTSCHEME_ID_fkey" : "FOREIGN KEY",
    "2200_16704_1_not_null" : "CHECK",
    "2200_16704_2_not_null" : "CHECK",
    "2200_16704_3_not_null" : "CHECK",
    "2200_16704_4_not_null" : "CHECK",
    "2200_16704_5_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "fk_CONTRACTSCHEME_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "track_LOANAPPLICATION_ID" : {
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
    }
  },
}