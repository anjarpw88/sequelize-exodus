
module.exports = {
  tableName : "CONTRACTSCHEME_DISBURSEMENT",
  primaryKeys : ["ID"],
  foreignKeys : {
    "CONTRACTSCHEME_ID_fkey" : {
      fromTable : "CONTRACTSCHEME_DISBURSEMENT",
      toTable : "CONTRACTSCHEME",
      fromColumns : ["fk_CONTRACTSCHEME_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "CONTRACTSCHEME_DISBURSEMENT_pkey" : "PRIMARY KEY",
    "CONTRACTSCHEME_ID_fkey" : "FOREIGN KEY",
    "2200_16715_1_not_null" : "CHECK",
    "2200_16715_2_not_null" : "CHECK",
    "2200_16715_3_not_null" : "CHECK",
    "2200_16715_4_not_null" : "CHECK",
    "2200_16715_5_not_null" : "CHECK",
    "2200_16715_6_not_null" : "CHECK",
    "2200_16715_7_not_null" : "CHECK"
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