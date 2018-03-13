var SequelizeExodus = require('./lib/sequelize-exodus');


const doLoginDb = async function(obj){
  var login = await sequelizeExodus.login(obj);
  console.log("logged in to database\r\n");
}

const doImportDb = async (outputDir) => {
  try{
    var compactStructure = await sequelizeExodus.importCompactStructureFromDb();
    await sequelizeExodus.saveCompactStructureFromImport(outputDir,compactStructure);
    console.log("data stored successfully", outputDir);
  }catch(e){
    console.log(e);
  }
}

const doCompareDb = async (referredDir, outputPath, migrationName) => {
  var comparison = await sequelizeExodus.compareCompactStructureWithDb(referredDir);
  console.log(outputPath, migrationName);

  await sequelizeExodus.saveComparisonIntoMigrationFile(comparison, migrationName, outputPath);
}

const doMigrateDb = async (path)=>{
  await sequelizeExodus.migrateWithMigrationFiles(path);
}

const doCompareLocal = async function(newDir, oldDir, outputPath, migrationName){
  var comparison = await sequelizeExodus.compareTwoCompactStructures(newDir, oldDir);
  console.log(outputPath, migrationName);
  await sequelizeExodus.saveComparisonIntoMigrationFile(comparison, migrationName, outputPath);
}

var sequelizeExodus = new SequelizeExodus();



module.exports = {
  doLoginDb,
  doImportDb,
  doCompareDb,
  doMigrateDb,
  doCompareLocal
}
