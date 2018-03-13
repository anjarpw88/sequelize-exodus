
module.exports = {
  tableName : "ENROLLMENT",
  primaryKeys : ["ID"],
  foreignKeys : {
    "FACULTY_ID_fkey" : {
      fromTable : "ENROLLMENT",
      toTable : "FACULTY",
      fromColumns : ["fk_FACULTY_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "ENROLLMENT_pkey" : "PRIMARY KEY",
    "FACULTY_ID_fkey" : "FOREIGN KEY",
    "2200_16488_1_not_null" : "CHECK",
    "2200_16488_2_not_null" : "CHECK",
    "2200_16488_3_not_null" : "CHECK",
    "2200_16488_6_not_null" : "CHECK"
  },
  columns : {
    "NAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "fk_FACULTY_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "TYPE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "BATCHTYPE" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "track_INSTITUTIONID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : false,
    }
  },
}