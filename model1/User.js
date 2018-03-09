
module.exports = {
  tableName : "User",
  primaryKeys : ["uid"],
  columns : {
    "uid" : {
      _getType : (Sequelize) => Sequelize.INTEGER,
      allowNull : false,
      defaultValue : "nextval(\"User_id_seq\"::regclass)",
      special : [],
      primaryKey : true
    },
    "username" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      defaultValue : null,
      special : [],
      primaryKey : false
    },
    "dateCreated" : {
      _getType : (Sequelize) => Sequelize.DATE,
      allowNull : true,
      defaultValue : null,
      special : [],
      primaryKey : false
    },
    "hashedPassword" : {
      _getType : (Sequelize) => Sequelize.STRING,
      allowNull : true,
      defaultValue : null,
      special : [],
      primaryKey : false
    }
  },
  foreignKeys : {
  },
  constraints : {
    "User_pkey" : "PRIMARY KEY",
    "2200_24751_1_not_null" : "CHECK"
  }
}
