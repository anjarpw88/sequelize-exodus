const chai = require("chai");
const assert = chai.assert;
const SequenceExodus = require("../lib/sequelize-exodus");
const local = require("../env/local");

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
        //console.log(item);
      });
  });

  it("Login", async () => {
      var sequenceExodus = new SequenceExodus();
      await sequenceExodus.login(local.dbConnection);
  });

  it("Get Database", async () => {
      var sequenceExodus = new SequenceExodus();
      await sequenceExodus.login(local.dbConnection);
      var virtualStructure = await sequenceExodus.importFromDb();
      console.log(JSON.stringify(virtualStructure.tables.UserAsBorrower_Detail, null,2));

      //done();
  });

});
