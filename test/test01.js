const chai = require("chai");
const assert = chai.assert;
const SequenceExodus = require("../lib/sequelize-exodus");
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
        var item = SequenceExodus.convertToDataTypes({
          type:type
        });
      });
  });

  it("Login", async () => {
      var sequenceExodus = new SequenceExodus();
      await sequenceExodus.login(local.dbConnection);
  });

  it("Get Database", async () => {
      var sequenceExodus = new SequenceExodus();
      await sequenceExodus.login(local.dbConnection);
      var versatileStructure = await sequenceExodus.importVersatileStructureFromDb();
      var compactStructure = ToolConverters.getCompactStructureFromVersatile(versatileStructure);
      await sequenceExodus.saveCompactStructureFromImport("./modelC",compactStructure);
  });
  it("Compare", async () => {
      var sequenceExodus = new SequenceExodus();
      var comparison = await sequenceExodus.compareTwoCompactStructures("./model1", "./model2");
      await sequenceExodus.saveComparisonIntoMigrationFile(comparison, {
        currentVersion:"1.0",
        fromVersion:"0.0",
        migrationName:"test"
      }, "./migrations/mig01.js");

      await sequenceExodus.login(local.dbConnection);
      sequenceExodus.migrateWithMigrationFiles("./migrations/mig010.js");
  });
});
