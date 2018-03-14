const Sequelize = require('sequelize');
const _ = require('lodash');

module.exports = function(column){
  var concludedType = {
    raw:column.type,
    getFunc:(Sequelize)=>Sequelize.STRING
  };
  var stringRep = "";
  var type = column.type.toLowerCase();
  if (column.type.indexOf('ENUM') === 0) {
      stringRep = "Sequelize." + column.type;
  } else {
    if (type === "boolean" || type === "bit(1)" || type === "bit") {
      stringRep = "Sequelize.BOOLEAN";
    }
    else if (type.match(/^(smallint|mediumint|tinyint|int)/)) {
      var length = type.match(/\(\d+\)/);
      var val = 'Sequelize.INTEGER' + (!  _.isNull(length) ? length : '');
      var unsigned = type.match(/unsigned/i);
      if (unsigned) val += '.UNSIGNED'
      var zero = type.match(/zerofill/i);
      if (zero) val += '.ZEROFILL'
      stringRep = val;
    }
    else if (type.match(/^bigint/)) {
      stringRep = 'Sequelize.BIGINT';
    }
    else if (type.match(/^smallint/)) {
      stringRep = 'Sequelize.SMALLINT';
    }
    else if (type.match(/^mediumint/)) {
      stringRep = 'Sequelize.MEDIUMINT';
    }
    else if (type.match(/^tinyint/)) {
      stringRep = 'Sequelize.TINYINT';
    }

    else if (type.match(/^varchar/)) {
      var length = type.match(/\(\d+\)/);
      stringRep = 'Sequelize.STRING' + (!  _.isNull(length) ? length : '');
    }
    else if (type.match(/^string|varying|nvarchar/)) {
      stringRep = 'Sequelize.STRING';
    }
    else if (type.match(/^char/)) {
      var length = type.match(/\(\d+\)/);
      stringRep = 'Sequelize.CHAR' + (!  _.isNull(length) ? length : '');
    }
    else if (type.match(/^real/)) {
      stringRep = 'Sequelize.REAL';
    }
    else if (type.match(/text|ntext$/)) {
      stringRep = 'Sequelize.TEXT';
    }
    else if (type.match(/^(date|timestamp)/)) {
      stringRep = 'Sequelize.DATE';
    }
    else if (type==="date"){
      stringRep = 'Sequelize.DATEONLY';
    }
    else if (type.match(/^(time)/)) {
      stringRep = 'Sequelize.TIME';
    }
    else if (type.match(/^(float|float4)/)) {
      stringRep = 'Sequelize.FLOAT';
    }
    else if (type.match(/^decimal/) || type.match(/^numeric/)) {
      stringRep = 'Sequelize.DECIMAL';
    }
    else if (type.match(/^(float8|double precision|numeric)/)) {
      stringRep = 'Sequelize.DOUBLE';
    }
    else if (type.match(/^uuid|uniqueidentifier/)) {
      stringRep = 'Sequelize.UUIDV4';
    }
    else if (type.match(/^jsonb/)) {
      stringRep = 'Sequelize.JSONB';
    }
    else if (type.match(/^json/)) {
      stringRep = 'Sequelize.JSON';
    }
    else if (type.match(/^geometry/)) {
      stringRep = 'Sequelize.GEOMETRY';
    }else if (type.match(/^array/)) {
      stringRep = 'Sequelize.JSON';
    }else {
      stringRep = '"'+column.type+'"';
    }
  }
  concludedType.getFunc = eval("(Sequelize) => " +stringRep);
  return concludedType;
}
