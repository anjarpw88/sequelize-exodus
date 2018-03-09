
module.exports = {
  tableName : "tags",
  primaryKeys : ["id"],
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : null,
      special : [],
      primaryKey : true
    },
    "name" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      defaultValue : null,
      special : [],
      primaryKey : false
    },
    "description" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      defaultValue : null,
      special : [],
      primaryKey : false
    }
  },
  foreignKeys : {
  },
  constraints : {
    "tags_pkey" : "PRIMARY KEY",
    "2200_24804_1_not_null" : "CHECK"
  }
}