const chai = require("chai");
const assert = chai.assert;
const SequelizeExodus = require("../lib/sequelize-exodus");
const local = require("../env/local");
const Sequelize = require('sequelize');
const ToolConverters = require('../lib/tool-converters');

describe("Converter", () => {

  it("Data Type Converter", async () => {
      var testTemplate = [
        "TEXT",
        "BIGINT",
        "SMALLINT",
        "INTEGER",
        "INTEGER UNSIGNED ZEROFILL",
        "INTEGER UNSIGNED",
        "INTEGER ZEROFILL",
        "CHARACTER VARYING",
        "BOOLEAN"
      ];

      testTemplate.forEach((type)=>{
        var item = SequelizeExodus.convertToDataTypes({
          type:type
        });
      });
  });

  it("Login", async () => {
      var sequelizeExodus = new SequelizeExodus();
      await sequelizeExodus.login(local.dbConnection);
  });

  it("Get Database", async () => {
      var sequelizeExodus = new SequelizeExodus();
      await sequelizeExodus.login(local.dbConnection);
      var compactStructure = await sequelizeExodus.importCompactStructureFromDb();
      await sequelizeExodus.saveCompactStructureFromImport("./modelC",compactStructure);
  });
  it("Compare", async () => {
      var sequelizeExodus = new SequelizeExodus();
      var comparison = await sequelizeExodus.compareTwoCompactStructures("./model1", "./model2");
      await sequelizeExodus.saveComparisonIntoMigrationFile(comparison, {
        currentVersion:"1.0",
        fromVersion:"0.0",
        migrationName:"test"
      }, "./migrations/mig01.js");

  });
  it("Run Migration", async () => {
    var sequelizeExodus = new SequelizeExodus();
    await sequelizeExodus.login(local.dbConnection);
    sequelizeExodus.migrateWithMigrationFiles("./migrations/mig010.js");
  });
});
