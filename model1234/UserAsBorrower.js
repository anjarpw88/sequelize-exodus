
module.exports = {
  tableName : "UserAsBorrower",
  primaryKeys : ["fk_UserId","CardId"],
  foreignKeys : {
  },
  constraints : {
    "pk" : "PRIMARY KEY",
    "2200_24743_1_not_null" : "CHECK",
    "2200_24743_2_not_null" : "CHECK",
    "2200_24743_10_not_null" : "CHECK"
  },
  columns : {
    "fk_UserId" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      special : [],
      primaryKey : true,
    },
    "firstName" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : false,
      defaultValue : "Sandnes",
      special : [],
      primaryKey : false,
    },
    "lastName" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "dateCreated" : {
      _getType : (Sequelize) => Sequelize.DATE,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "addressNeighbourhood" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "addressDistrict" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "addressCity" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "addressState" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "addressPostalCode" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "CardId" : {
      _getType : (Sequelize) => Sequelize.BIGINT,
      allowNull : false,
      special : [],
      primaryKey : true,
    }
  },
}