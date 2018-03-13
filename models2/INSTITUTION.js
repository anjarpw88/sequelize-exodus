
module.exports = {
  tableName : "INSTITUTION",
  primaryKeys : ["ID"],
  foreignKeys : {
  },
  constraints : {
    "INSTITUTION_pkey" : "PRIMARY KEY",
    "2200_16460_2_not_null" : "CHECK",
    "2200_16460_3_not_null" : "CHECK"
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
    }
  },
}