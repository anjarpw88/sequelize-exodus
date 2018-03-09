
module.exports = function(Sequelize){
  return {
    tableName : "User",
    columns : {
      "id" : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : "nextval(\"User_id_seq\"::regclass)",
        special : [],
        primaryKey : true
      },
      "username" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "dateCreated" : {
        type : Sequelize.DATE,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "hashedPassword" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      }
    },
    foreignKeys : {
    },
    constraints : {
      "User_pkey" : "PRIMARY KEY",
      "2200_24751_1_not_null" : "CHECK"
    }
  }
}

