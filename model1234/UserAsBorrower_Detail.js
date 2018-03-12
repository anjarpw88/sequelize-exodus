
module.exports = {
  tableName : "UserAsBorrower_Detail",
  primaryKeys : ["DetailId"],
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
  },
  columns : {
    "DetailId" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      defaultValue : "nextval(\"UserAsBorrower_Detail_DetailId_seq\"::regclass)",
      special : [],
      primaryKey : true,
    },
    "CardId" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "UserId" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : true,
      special : [],
      primaryKey : false,
    }
  },
}