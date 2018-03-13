
module.exports = {
  tableName : "LOANAPPLICATION",
  primaryKeys : ["ID"],
  foreignKeys : {
    "USER_ID_fkey" : {
      fromTable : "LOANAPPLICATION",
      toTable : "USER",
      fromColumns : ["fk_USER_ID"],
      toColumns : ["ID"]
    },
    "ENROLLMENT_ID_fkey" : {
      fromTable : "LOANAPPLICATION",
      toTable : "ENROLLMENT",
      fromColumns : ["fk_ENROLLMENT_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "LOANAPPLICATION_pkey" : "PRIMARY KEY",
    "ENROLLMENT_ID_fkey" : "FOREIGN KEY",
    "USER_ID_fkey" : "FOREIGN KEY",
    "2200_16444_2_not_null" : "CHECK",
    "2200_16444_4_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "fk_ENROLLMENT_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "temp_INSTITUTION_NAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "track_INSTITUTION_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "track_FACULTY_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "temp_FACULTY_NAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "DATE_START" : {
      _getType : (Sequelize) => Sequelize.DATEONLY,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "DATE_END" : {
      _getType : (Sequelize) => Sequelize.DATEONLY,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "STATUS" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "temp_ENROLLMENT_TYPE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "temp_ENROLLMENT_NAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "AMOUNT" : {
      _getType : (Sequelize) => "MONEY",
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "DATE_SUBMISSION" : {
      _getType : (Sequelize) => Sequelize.DATEONLY,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "fk_USER_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : true,
      special : [],
      primaryKey : false,
    }
  },
}