
module.exports = function(Sequelize){
  return {
    tableName : "tags",
    primaryKeys : ["id"],
    columns : {
      "id" : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : null,
        special : [],
        primaryKey : true
      },
      "name" : {
        type : Sequelize.TEXT,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "description" : {
        type : Sequelize.TEXT,
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
}

