
module.exports = {
  currentVersion : "1.0" ,
  fromVersion : "0.0" ,
  migrationName : "test" ,
  up : function(QueryAction){
    QueryAction.removePrimaryKeys("User");
    QueryAction.removeForeignKey("UserAsBorrower","cardId_fk");
    QueryAction.removeForeignKey("UserAsBorrower","UserAsBorrower_User_id_fkey");
    QueryAction.removeTable("Card");
    QueryAction.removeColumn("User", "id");
    QueryAction.addTable({
      tableName : "Card2",
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
    });
    QueryAction.addColumns("User","uid",{
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : "nextval(\"User_id_seq\"::regclass)",
      special : [],
      primaryKey : true
    });
    QueryAction.addPrimaryKeys("User",["uid"]);
    QueryAction.modifyColumns("grouptag","tags",{
      allowNull : true
    });
    QueryAction.addColumns("grouptag","groupname",{
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false
    });
  },
  down : function(QueryAction){
    QueryAction.removeColumn("grouptag", "groupname");
    QueryAction.modifyColumns("grouptag","tags",{
      allowNull : false
    });
    QueryAction.removePrimaryKeys("User");
    QueryAction.removeColumn("User", "uid");
    QueryAction.removeTable("Card2");
    QueryAction.addColumns("User","id",{
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : "nextval(\"User_id_seq\"::regclass)",
      special : [],
      primaryKey : true
    });
    QueryAction.addTable({
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
    });
    QueryAction.addForeignKey("UserAsBorrower","UserAsBorrower_User_id_fkey",{
      fromTable : "UserAsBorrower",
      toTable : "User",
      fromColumns : ["fk_UserId"],
      toColumns : ["id"]
    });
    QueryAction.addForeignKey("UserAsBorrower","cardId_fk",{
      fromTable : "UserAsBorrower",
      toTable : "Card",
      fromColumns : ["CardId"],
      toColumns : ["id"]
    });
    QueryAction.addPrimaryKeys("User",["id"]);
  },
}