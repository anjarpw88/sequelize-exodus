
var Sequelize = require('sequelize');

function generateDefaultMethodSet(queryInterface){
  return {
    addPrimaryKeys : async function(tableName, constraintName, primaryKeys){
      return await queryInterface.addConstraint(tableName, primaryKeys, {
         type: 'primary key',
         name: constraintName
      });
    },
    addForeignKey: async function(tableName, foreignKeyName, options){
      var field = options.toColumns.map(x=>'"'+x+'"').join(",");
      return await queryInterface.addConstraint(tableName, options.fromColumns, {
        type: 'foreign key',
        name: foreignKeyName,
        references: { //Required field
          table: options.toTable,
          field: field
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    },
    removeConstraint: async function(tableName,constraintName, type){
      return await queryInterface.removeConstraint(tableName,constraintName);
    },
    modifyColumn: async function(tableName, columnName, options){
      return await queryInterface.changeColumn(tableName,columnName, options);
    }
  }
}

function generateCommonMethodSet(queryInterface){
  return {
    addPrimaryKeys: async function(tableName, constraintName, primaryKeys){
      var query = ' \
      ALTER TABLE "${tableName}" \
      ADD CONSTRAINT "${constraintName}" \
      PRIMARY KEY (${primaryKeys})';
      query = query.replace("${tableName}", tableName);
      query = query.replace("${constraintName}", constraintName);
      query = query.replace("${primaryKeys}", primaryKeys.map(u=>'"'+u+'"').join(","));
      return await queryInterface.sequelize.query(query);
    },
    addForeignKey: async function(tableName, foreignKeyName, options){
      var query = ' \
      ALTER TABLE "${tableName}" \
      ADD CONSTRAINT "${foreignKeyName}" \
      FOREIGN KEY (${fromColumns}) REFERENCES "${toTable}" (${toColumns});';
      query = query.replace("${tableName}", tableName);
      query = query.replace("${foreignKeyName}", foreignKeyName);
      query = query.replace("${fromColumns}", options.fromColumns.map(u=>'"'+u+'"').join(","));
      query = query.replace("${toColumns}", options.toColumns.map(u=>'"'+u+'"').join(","));
      query = query.replace("${toTable}", options.toTable);
      return await queryInterface.sequelize.query(query);
    },
    removeConstraintMySql:  async function(tableName,constraintName, type){

      var query = ' \
      ALTER TABLE "${tableName}" \
      DROP ${type} "${constraintName}" CASCADE';
      query = query.replace("${tableName}", tableName);
      query = query.replace("${type}", type);
      query = query.replace("${constraintName}", constraintName);
      return await queryInterface.sequelize.query(query);
    },
    removeConstraint:  async function(tableName,constraintName, type){

      var query = ' \
      ALTER TABLE "${tableName}" \
      DROP CONSTRAINT "${constraintName}" CASCADE';
      query = query.replace("${tableName}", tableName);
      query = query.replace("${constraintName}", constraintName);
      return await queryInterface.sequelize.query(query);
    },

    modifyColumnMySql: async function(tableName, columnName, options){
      var preQuery1 = ' \
      ALTER TABLE "${tableName}" \
      ALTER "${columnName}" ';
      preQuery1 = preQuery1.replace("${tableName}", tableName);
      preQuery1 = preQuery1.replace("${columnName}", columnName);

      var preQuery2 = ' \
      ALTER TABLE "${tableName}" \
      MODIFY "${columnName}" ';
      preQuery2 = preQuery2.replace("${tableName}", tableName);
      preQuery2 = preQuery2.replace("${columnName}", columnName);

      var totalQuery = "";
      if(options.defaultValue){
          query = 'SET DEFAULT \'${defaultValue}\';';
          query = query.replace("${defaultValue}", defaultValue);
          totalQuery += preQuery1 + query;
      }else if(options.defaultValue === null){
          query = 'DROP DEFAULT;';
          totalQuery += preQuery1 + query;
      }
      if(options.allowNull){
          query = 'SET NOT NULL;';
          totalQuery += preQuery1 + query;
      }else if(options.allowNull == false){
          query = 'DROP NOT NULL;';
          totalQuery += preQuery1 + query;
      }
      if(options.type){
        var type = options.type.prototype.toSql();
        query = '${type};';
        query = query.replace("${type}", type);
        totalQuery += preQuery2 + query;
      }
      return await queryInterface.sequelize.query(totalQuery);
    },
    modifyColumn: async function(tableName, columnName, options){
      var preQuery = ' \
      ALTER TABLE "${tableName}" \
      ALTER COLUMN "${columnName}" ';
      preQuery = preQuery.replace("${tableName}", tableName);
      preQuery = preQuery.replace("${columnName}", columnName);

      var totalQuery = "";
      if(options.defaultValue){
          query = 'SET DEFAULT \'${defaultValue}\';';
          query = query.replace("${defaultValue}", defaultValue);
          totalQuery += preQuery + query +" ;";
      }else if(options.defaultValue === null){
          query = 'DROP DEFAULT;';
          totalQuery += preQuery + query+" ;";
      }
      if(options.allowNull){
          query = 'SET NOT NULL;';
          totalQuery += preQuery + query;
      }else if(options.allowNull == false){
          query = 'DROP NOT NULL;';
          totalQuery += preQuery + query;
      }

      if(options.type){
        var type = options.type.prototype.toSql();
        query = 'TYPE ${type} USING "${columnName}"::${type};';
        query = query.replace("${columnName}", columnName);
        query = query.replace("${type}", type);
        query = query.replace("${type}", type);
        totalQuery += preQuery + query;
      }
      return await queryInterface.sequelize.query(totalQuery);
    }
  }
}

const sqlite = function(queryInterface){
  return generateDefaultMethodSet(queryInterface);
}

const mysql = function(queryInterface){
  var methodSet = generateCommonMethodSet(queryInterface);
  methodSet.removeConstraint = methodSet.removeConstraintMySql;
  delete methodSet.removeConstraintMySql;
  methodSet.modifyColumn = methodSet.modifyColumnMySql;
  delete methodSet.modifyColumnMySql;
  return methodSet;
}

const mariadb = mysql

const postgres = function(queryInterface){
  var methodSet = generateCommonMethodSet(queryInterface);
  delete methodSet.removeConstraintMySql;
  delete methodSet.modifyColumnMySql;
  return methodSet;
}

const mssql = function(queryInterface){
  var methodSet = generateCommonMethodSet(queryInterface);
  delete methodSet.removeConstraintMySql;
  delete methodSet.modifyColumnMySql;
  return methodSet;
}


module.exports  = {
  sqlite,
  mysql,
  mariadb,
  postgres,
  mssql
}
