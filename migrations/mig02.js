
module.exports = {
  currentVersion : "v4" ,
  fromVersion : "v3" ,
  migrationName : "mig02" ,
  up : async function(QueryActionRunner){
    await QueryActionRunner.addColumn("Card","product-owner",{
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    });
    await QueryActionRunner.modifyColumn("CardHistory","UserId",{
      _getType : (Sequelize) => Sequelize.BIGINT,
    });
    await QueryActionRunner.addColumn("CardHistory","Description",{
      _getType : (Sequelize) => Sequelize.TEXT,
      allowNull : true,
      special : [],
      primaryKey : false,
    });
    await QueryActionRunner.addForeignKey("CardHistory","CardUser_fkey",{
      fromTable : "CardHistory",
      toTable : "CardUser",
      fromColumns : ["CardId","UserId"],
      toColumns : ["CardId","UserId"]
    });
  },
  down : async function(QueryActionRunner){
    await QueryActionRunner.removeForeignKey("CardHistory","CardUser_fkey");
    await QueryActionRunner.removeColumn("CardHistory", "Description");
    await QueryActionRunner.modifyColumn("CardHistory","UserId",{
      _getType : (Sequelize) => Sequelize.TEXT,
    });
    await QueryActionRunner.removeColumn("Card", "product-owner");
  },
}
