
module.exports = {
  tableName : "CardHistory",
  primaryKeys : ["CardId"],
  foreignKeys : {
  },
  constraints : {
    "CardHistory_pkey" : "PRIMARY KEY",
    "2200_65869_1_not_null" : "CHECK",
    "2200_65869_3_not_null" : "CHECK"
  },
  columns : {
    "CardId" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
    },
    "UserId" : {
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "Id" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      defaultValue : "nextval(\"CardHistory_Id_seq\"::regclass)",
      special : [],
      primaryKey : false,
    }
  },
}