
module.exports = function(Sequelize){
  return {
    tableName : "grouptag",
    columns : {
      "id" : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : null,
        special : [],
        primaryKey : true
      },
      "groupname" : {
        type : Sequelize.TEXT,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "tags" : {
        type : ,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      }
    },
    foreignKeys : {
    },
    constraints : {
      "grouptag_pkey" : "PRIMARY KEY",
      "2200_24812_1_not_null" : "CHECK"
    }
  }
}

