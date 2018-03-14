var Sequelize = require('sequelize');

class Column {
  constructor(){
    this.allowNull = true;
    this.autoIncrement = false;
    this.special = [];
    this.primaryKey = false;
  }
  thatIsNotNull(){
    this.allowNull = false;
    return this;
  }
  thatIsPrimary(){
    this.allowNull = false;
    this.primaryKey = true;
    return this;
  }
  thatIsIncrementalPrimary(){
    this.allowNull = false;
    this.autoIncrement = true;
    this.primaryKey = true;
    return this;
  }
  ofType(getType){
    this._getType = getType;
    return this;
  }
  thatIsIncremental(){
    this.allowNull = false;
    this.autoIncrement = true;
    return this;
  }
  thatIsSpecial(x){
    this.special = x;
    return this;
  }
  withDefault(defaultValue){
    this.defaultValue = defaultValue;
    return this;
  }
}

const GenericColumns = {
  Column,
  COMPOSITEPRIMARYKEY: new Column().ofType((Sequelize)=>Sequelize.BIGINT).thatIsPrimary(),
  INCREMENTALPRIMARYKEY: new Column().ofType((Sequelize)=>Sequelize.BIGINT).thatIsIncrementalPrimary(),
  Credential:{
    USERNAME: new Column().ofType((Sequelize)=>Sequelize.TEXT).thatIsNotNull(),
    HASHEDPASSWORD:new Column().ofType((Sequelize)=>Sequelize.TEXT).thatIsNotNull()
  },
  FOREIGNKEY:new Column().ofType((Sequelize)=>Sequelize.BIGINT).thatIsNotNull(),
  FLAG:new Column().ofType((Sequelize)=>Sequelize.BOOLEAN).thatIsNotNull(),
  Optional:{
    REFERENCEKEY:new Column().ofType((Sequelize)=>Sequelize.BIGINT),
    DATE:new Column().ofType((Sequelize)=>Sequelize.DATEONLY),
    TEXT:new Column().ofType((Sequelize)=>Sequelize.TEXT),
    BIGINT:new Column().ofType((Sequelize)=>Sequelize.BIGINT),
    INTEGER:new Column().ofType((Sequelize)=>Sequelize.INTEGER),
    MEDIUMINT:new Column().ofType((Sequelize)=>Sequelize.MEDIUMINT),
    TINYINT:new Column().ofType((Sequelize)=>Sequelize.TINYINT),
    SMALLINT:new Column().ofType((Sequelize)=>Sequelize.SMALLINT),
    DECIMAL:new Column().ofType((Sequelize)=>Sequelize.DECIMAL)
  },
  Compulsory:{
    REFERENCEKEY:new Column().ofType((Sequelize)=>Sequelize.BIGINT).thatIsNotNull(),
    DATE: new Column().ofType((Sequelize)=>Sequelize.DATEONLY).thatIsNotNull(),
    TEXT:new Column().ofType((Sequelize)=>Sequelize.TEXT).thatIsNotNull(),
    BIGINT:new Column().ofType((Sequelize)=>Sequelize.BIGINT).thatIsNotNull(),
    INTEGER:new Column().ofType((Sequelize)=>Sequelize.INTEGER).thatIsNotNull(),
    MEDIUMINT:new Column().ofType((Sequelize)=>Sequelize.MEDIUMINT).thatIsNotNull(),
    TINYINT:new Column().ofType((Sequelize)=>Sequelize.TINYINT).thatIsNotNull(),
    SMALLINT:new Column().ofType((Sequelize)=>Sequelize.SMALLINT).thatIsNotNull(),
    DECIMAL:new Column().ofType((Sequelize)=>Sequelize.DECIMAL).thatIsNotNull()
  }
}

module.exports = GenericColumns;
