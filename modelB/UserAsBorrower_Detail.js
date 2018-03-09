
module.exports = function(Sequelize){
  return {
    tableName : "UserAsBorrower_Detail",
    primaryKeys : ["DetailId"],
    columns : {
      "DetailId" : {
        type : Sequelize.BIGINT,
        allowNull : false,
        defaultValue : "nextval(\"UserAsBorrower_Detail_DetailId_seq\"::regclass)",
        special : [],
        primaryKey : true
      },
      "CardId" : {
        type : Sequelize.BIGINT,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      },
      "UserId" : {
        type : Sequelize.BIGINT,
        allowNull : true,
        defaultValue : null,
        special : [],
        primaryKey : false
      }
    },
    foreignKeys : {
      "fk" : {
        fromTable : "UserAsBorrower_Detail",
        toTable : "UserAsBorrower",
        fromColumns : ["CardId","UserId"],
        toColumns : ["CardId","fk_UserId"]
      }
    },
    constraints : {
      "UserAsBorrower_Detail_pkey" : "PRIMARY KEY",
      "fk" : "FOREIGN KEY",
      "2200_24786_1_not_null" : "CHECK"
    }
  }
}

