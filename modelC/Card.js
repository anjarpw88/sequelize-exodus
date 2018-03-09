
module.exports = {
  tableName : "Card",
  primaryKeys : ["id"],
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      defaultValue : "nextval(\"Card_id_seq\"::regclass)",
      special : [],
      primaryKey : true
    }
  },
  foreignKeys : {
  },
  constraints : {
    "Card_pkey" : "PRIMARY KEY",
    "2200_24770_1_not_null" : "CHECK"
  }
}