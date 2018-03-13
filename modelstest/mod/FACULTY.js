
module.exports = {
  tableName : "FACULTY",
  primaryKeys : ["ID"],
  foreignKeys : {
    "INSTITUTION_ID_fkey" : {
      fromTable : "FACULTY",
      toTable : "INSTITUTION",
      fromColumns : ["fk_INSTITUTION_ID"],
      toColumns : ["ID"]
    }
  },
  constraints : {
    "FACULTY_pkey" : "PRIMARY KEY",
    "INSTITUTION_ID_fkey" : "FOREIGN KEY",
    "2200_16472_1_not_null" : "CHECK",
    "2200_16472_2_not_null" : "CHECK",
    "2200_16472_3_not_null" : "CHECK"
  },
  columns : {
    "ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
      autoIncrement : true,
    },
    "NAME" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : false,
      special : [],
      primaryKey : false,
    },
    "fk_INSTITUTION_ID" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : false,
    }
  },
}