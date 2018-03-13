
module.exports = {
  tableName : "PROVISIONALOFFER_DISBURSEMENT",
  primaryKeys : ["ID"],
  foreignKeys : {
    "PROVISIONALOFFER_ID_fkey" : {
      fromTable : "PROVISIONALOFFER_DISBURSEMENT",
      toTable : "PROVISIONALOFFER",
      fromColumns : ["fk_PROVISIONALOFFER_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "PROVISIONALOFFER_DISBURSEMENT_pkey" : "PRIMARY KEY",
    "PROVISIONALOFFER_ID_fkey" : "FOREIGN KEY",
    "2200_16672_1_not_null" : "CHECK",
    "2200_16672_2_not_null" : "CHECK",
    "2200_16672_3_not_null" : "CHECK",
    "2200_16672_4_not_null" : "CHECK",
    "2200_16672_5_not_null" : "CHECK",
    "2200_16672_6_not_null" : "CHECK",
    "2200_16672_7_not_null" : "CHECK"
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