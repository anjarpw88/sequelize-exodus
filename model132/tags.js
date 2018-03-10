
module.exports = {
  tableName : "tags",
  primaryKeys : ["id"],
  foreignKeys : {
  },
  constraints : {
    "tags_pkey" : "PRIMARY KEY",
    "2200_24804_1_not_null" : "CHECK"
  },
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : true,
    },
    "name" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "description" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    }
  },
}