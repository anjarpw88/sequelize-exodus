
module.exports = {
  tableName : "CardUser",
  primaryKeys : ["CardId","UserId"],
  foreignKeys : {
    "CardUser_CardId_fkey" : {
      fromTable : "CardUser",
      toTable : "Card",
      fromColumns : ["CardId"],
      toColumns : ["id"]
    },
    "CardUser_UserId_fkey" : {
      fromTable : "CardUser",
      toTable : "User",
      fromColumns : ["UserId"],
      toColumns : ["id"]
    }
  },
  constraints : {
    "CardUser_pkey" : "PRIMARY KEY",
    "CardUser_CardId_fkey" : "FOREIGN KEY",
    "CardUser_UserId_fkey" : "FOREIGN KEY",
    "2200_65859_1_not_null" : "CHECK",
    "2200_65859_2_not_null" : "CHECK"
  },
  columns : {
    "CardId" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
    },
    "UserId" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
    },
    "Detail" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    }
  },
}