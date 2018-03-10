
module.exports = {
  tableName : "User",
  primaryKeys : ["uid"],
  foreignKeys : {
  },
  constraints : {
    "User(uid)_PK" : "PRIMARY KEY",
    "2200_24751_5_not_null" : "CHECK"
  },
  columns : {
    "username" : {
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
    "hashedPassword" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      special : [],
      primaryKey : false,
    },
    "uid" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : "nextval(\"User_uid_seq\"::regclass)",
      special : [],
      primaryKey : true,
    }
  },
}