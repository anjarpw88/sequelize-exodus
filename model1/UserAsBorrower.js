
module.exports = function(Sequelize){
  return {
    tableName : "UserAsBorrower",
    columns : {
      "fk_UserId" : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : null,
        special : [],
        primaryKey : true
      },
      "firstName" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "lastName" : {
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
      "addressNeighbourhood" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "addressDistrict" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "addressCity" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "addressState" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "addressPostalCode" : {
        type : Sequelize.STRING,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "CardId" : {
        type : Sequelize.BIGINT,
        allowNull : false,
        defaultValue : null,
        special : [],
        primaryKey : true
      }
    },
    foreignKeys : {
      "cardId_fk" : {
        fromTable : "UserAsBorrower",
        toTable : "Card",
        fromColumns : ["CardId"],
        toColumns : ["id"]
      },
      "UserAsBorrower_User_id_fkey" : {
        fromTable : "UserAsBorrower",
        toTable : "User",
        fromColumns : ["fk_UserId"],
        toColumns : ["id"]
      }
    },
    constraints : {
      "UserAsBorrower_User_id_fkey" : "FOREIGN KEY",
      "cardId_fk" : "FOREIGN KEY",
      "pk" : "PRIMARY KEY",
      "2200_24743_1_not_null" : "CHECK",
      "2200_24743_10_not_null" : "CHECK"
    }
  }
}

