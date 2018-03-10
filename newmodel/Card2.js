
module.exports = {
  tableName : "Card2",
  primaryKeys : ["id"],
  foreignKeys : {
  },
  constraints : {
    "Card2_pkey" : "PRIMARY KEY",
    "2200_40969_1_not_null" : "CHECK"
  },
  columns : {
    "id" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      defaultValue : "nextval(\"Card2_id_seq\"::regclass)",
      special : [],
      primaryKey : true,
    }
  },
}