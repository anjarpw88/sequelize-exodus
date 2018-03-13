
module.exports = {
  currentVersion : "v3" ,
  fromVersion : "v0" ,
  migrationName : "mig01" ,
  up : async function(QueryActionRunner){
    await QueryActionRunner.addTable({
      tableName : "Card",
      primaryKeys : ["id"],
      columns : {
        "id" : {
          _getType : (Sequelize) => Sequelize.BIGINT,
          allowNull : false,
          special : [],
          primaryKey : true,
          autoIncrement : true,
        },
        "number16Digit" : {
          _getType : (Sequelize) => Sequelize.TEXT,
          allowNull : true,
          special : [],
          primaryKey : false,
        }
      },
    });
    await QueryActionRunner.addTable({
      tableName : "CardHistory",
      primaryKeys : ["CardId"],
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
          defaultValue : null,
          special : [],
          primaryKey : false,
        }
      },
    });
    await QueryActionRunner.addTable({
      tableName : "CardUser",
      primaryKeys : ["CardId","UserId"],
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
    });
    await QueryActionRunner.addTable({
      tableName : "User",
      primaryKeys : ["id"],
      columns : {
        "id" : {
          _getType : (Sequelize) => Sequelize.BIGINT,
          allowNull : false,
          special : [],
          primaryKey : true,
          autoIncrement : true,
        },
        "name" : {
          _getType : (Sequelize) => Sequelize.TEXT,
          allowNull : true,
          special : [],
          primaryKey : false,
        }
      },
    });
    await QueryActionRunner.addForeignKey("CardUser","CardUser_CardId_fkey",{
      fromTable : "CardUser",
      toTable : "Card",
      fromColumns : ["CardId"],
      toColumns : ["id"]
    });
    await QueryActionRunner.addForeignKey("CardUser","CardUser_UserId_fkey",{
      fromTable : "CardUser",
      toTable : "User",
      fromColumns : ["UserId"],
      toColumns : ["id"]
    });
  },
  down : async function(QueryActionRunner){
    await QueryActionRunner.removeForeignKey("CardUser","CardUser_UserId_fkey");
    await QueryActionRunner.removeForeignKey("CardUser","CardUser_CardId_fkey");
    await QueryActionRunner.removeTable("User");
    await QueryActionRunner.removeTable("CardUser");
    await QueryActionRunner.removeTable("CardHistory");
    await QueryActionRunner.removeTable("Card");
  },
}
