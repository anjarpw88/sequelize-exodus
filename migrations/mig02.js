
module.exports = {
  currentVersion : "v2" ,
  fromVersion : "v1" ,
  migrationName : "mig" ,
  down : async function(QueryActionRunner){
    await QueryActionRunner.removeColumn("Card2", "name");
  },
  up : async function(QueryActionRunner){
    await QueryActionRunner.addColumn("Card2","name",{
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : false,
      special : [],
      primaryKey : false,
    });
  },
}
