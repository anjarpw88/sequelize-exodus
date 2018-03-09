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
      console.log(compactStructure);
      await sequenceExodus.saveCompactStructureFromImport("./modelB",versatileStructure);
      await sequenceExodus.saveCompactStructureFromImport("./modelA",versatileStructure);
      await sequenceExodus.compareTwoCompactStructures("./modelB", "./modelA");
  });
});
