
module.exports = {
  tableName : "Card",
  primaryKeys : ["id"],
  foreignKeys : {
  },
  constraints : {
    "Card_pkey" : "PRIMARY KEY",
    "2200_24770_1_not_null" : "CHECK"
  }
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      defaultValue : "nextval(\"Card_id_seq\"::regclass)",
      special : [],
      primaryKey : true
    }
  },
}