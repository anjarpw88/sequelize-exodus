
module.exports = {
  currentVersion : "1.0" ,
  fromVersion : "0.0" ,
  migrationName : "test" ,
  up : async function(QueryAction){
    await QueryAction.removePrimaryKeys("User","User_pkey");
    await QueryAction.removeForeignKey("UserAsBorrower","cardId_fk");
    await QueryAction.removeForeignKey("UserAsBorrower","UserAsBorrower_User_id_fkey");
    await QueryAction.removeTable("Card");
    await QueryAction.removeColumn("User", "id");
    await QueryAction.addTable({
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
    await QueryAction.addColumns("User","uid",{
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : "nextval(\"User_id_seq\"::regclass)",
      special : [],
      primaryKey : true
    });
    await QueryAction.addPrimaryKeys("User","User(uid)_PK", ["uid"]);
    await QueryAction.modifyColumns("grouptag","tags",{
      allowNull : true
    });
    await QueryAction.addColumns("grouptag","groupname",{
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false
    });
  },
  down : async function(QueryAction){
    await QueryAction.removeColumn("grouptag", "groupname");
    await QueryAction.modifyColumns("grouptag","tags",{
      allowNull : false
    });
    await QueryAction.removePrimaryKeys("User","User(uid)_PK");
    await QueryAction.removeColumn("User", "uid");
    await QueryAction.removeTable("Card2");
    await QueryAction.addColumns("User","id",{
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : "nextval(\"User_id_seq\"::regclass)",
      special : [],
      primaryKey : true
    });
    await QueryAction.addTable({
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
    await QueryAction.addForeignKey("UserAsBorrower","UserAsBorrower_User_id_fkey",{
      fromTable : "UserAsBorrower",
      toTable : "User",
      fromColumns : ["fk_UserId"],
      toColumns : ["id"]
    });
    await QueryAction.addForeignKey("UserAsBorrower","cardId_fk",{
      fromTable : "UserAsBorrower",
      toTable : "Card",
      fromColumns : ["CardId"],
      toColumns : ["id"]
    });
    await QueryAction.addPrimaryKeys("User","User_pkey", ["id"]);
  },
}
