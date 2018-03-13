
module.exports = {
  tableName : "GUARANTOR_LOANAPPLICATION",
  primaryKeys : ["fk_LOANAPPLICATION_ID","fk_GUARANTOR_ID"],
  foreignKeys : {
    "GUARANTOR_ID_fkey" : {
      fromTable : "GUARANTOR_LOANAPPLICATION",
      toTable : "GUARANTOR",
      fromColumns : ["fk_GUARANTOR_ID"],
      toColumns : ["ID"]
    },
    "LOANAPPLICATION_ID_fkey" : {
      fromTable : "GUARANTOR_LOANAPPLICATION",
      toTable : "LOANAPPLICATION",
      fromColumns : ["fk_LOANAPPLICATION_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "GUARANTOR_LOANAPPLICATION_pkey" : "PRIMARY KEY",
    "GUARANTOR_ID_fkey" : "FOREIGN KEY",
    "LOANAPPLICATION_ID_fkey" : "FOREIGN KEY",
    "2200_16535_1_not_null" : "CHECK",
    "2200_16535_2_not_null" : "CHECK",
    "2200_16535_5_not_null" : "CHECK",
    "2200_16535_6_not_null" : "CHECK",
    "2200_16535_7_not_null" : "CHECK",
    "2200_16535_10_not_null" : "CHECK",
    "2200_16535_12_not_null" : "CHECK",
    "2200_16535_13_not_null" : "CHECK",
    "2200_16535_14_not_null" : "CHECK",
    "2200_16535_15_not_null" : "CHECK",
    "2200_16535_16_not_null" : "CHECK",
    "2200_16535_17_not_null" : "CHECK",
    "2200_16535_18_not_null" : "CHECK",
    "2200_16535_19_not_null" : "CHECK",
    "2200_16535_20_not_null" : "CHECK",
    "2200_16535_21_not_null" : "CHECK"
  },
  columns : {
    "fk_LOANAPPLICATION_ID" : {
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
    "fk_GUARANTOR_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
    },
    "RELATIONSHIPWITHBORROWER" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "GENDER" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "EMAIL" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "PHONE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
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
    },
    "HOUSEOWNERSHIP" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "NUMBERDEPENDANT" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "MONTHLYINCOME" : {
      _getType : (Sequelize) => "MONEY",
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "JOB_POSITION" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "JOB_COMPANYNAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "JOB_ADDRESS" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "JOB_PHONE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "JOB_SUPERVISORNAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "JOB_SUPERVISORPOSITION" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "JOB_SUPERVISORPHONE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    }
  },
}