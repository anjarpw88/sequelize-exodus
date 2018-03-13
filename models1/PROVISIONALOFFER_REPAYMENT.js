
module.exports = {
  tableName : "PROVISIONALOFFER_REPAYMENT",
  primaryKeys : ["ID"],
  foreignKeys : {
    "PROVISIONALOFFER_ID_fkey" : {
      fromTable : "PROVISIONALOFFER_REPAYMENT",
      toTable : "PROVISIONALOFFER",
      fromColumns : ["fk_PROVISIONALOFFER_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "PROVISIONALOFFER_REPAYMENT_pkey" : "PRIMARY KEY",
    "PROVISIONALOFFER_ID_fkey" : "FOREIGN KEY",
    "2200_16593_1_not_null" : "CHECK",
    "2200_16593_2_not_null" : "CHECK",
    "2200_16593_3_not_null" : "CHECK",
    "2200_16593_4_not_null" : "CHECK",
    "2200_16593_5_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "fk_PROVISIONALOFFER_ID" : {
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