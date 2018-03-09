const Sequelize = require('sequelize');
const _ = require('lodash');

module.exports = function(column){
  var concludedType = {
    obj:null,
    raw:column.type,
    stringRep:""
  };
  var type = column.type.toLowerCase();
  if (column.type.indexOf('ENUM') === 0) {
      concludedType.stringRep = "Sequelize." + column.type;
  } else {
    if (type === "boolean" || type === "bit(1)" || type === "bit") {
      concludedType.stringRep = "Sequelize.BOOLEAN";
    }
    else if (type.match(/^(smallint|mediumint|tinyint|int)/)) {
      var length = type.match(/\(\d+\)/);
      var val = 'Sequelize.INTEGER' + (!  _.isNull(length) ? length : '');
      var unsigned = type.match(/unsigned/i);
      if (unsigned) val += '.UNSIGNED'
      var zero = type.match(/zerofill/i);
      if (zero) val += '.ZEROFILL'
      concludedType.stringRep = val;
    }
    else if (type.match(/^bigint/)) {
      concludedType.stringRep = 'Sequelize.BIGINT';
    }
    else if (type.match(/^varchar/)) {
      var length = type.match(/\(\d+\)/);
      concludedType.stringRep = 'Sequelize.STRING' + (!  _.isNull(length) ? length : '');
    }
    else if (type.match(/^string|varying|nvarchar/)) {
      concludedType.stringRep = 'Sequelize.STRING';
    }
    else if (type.match(/^char/)) {
      var length = type.match(/\(\d+\)/);
      concludedType.stringRep = 'Sequelize.CHAR' + (!  _.isNull(length) ? length : '');
    }
    else if (type.match(/^real/)) {
      concludedType.stringRep = 'Sequelize.REAL';
    }
    else if (type.match(/text|ntext$/)) {
      concludedType.stringRep = 'Sequelize.TEXT';
    }
    else if (type==="date"){
      concludedType.stringRep = 'Sequelize.DATEONLY';
    }
    else if (type.match(/^(date|timestamp)/)) {
      concludedType.stringRep = 'Sequelize.DATE';
    }
    else if (type.match(/^(time)/)) {
      concludedType.stringRep = 'Sequelize.TIME';
    }
    else if (type.match(/^(float|float4)/)) {
      concludedType.stringRep = 'Sequelize.FLOAT';
    }
    else if (type.match(/^decimal/)) {
      concludedType.stringRep = 'Sequelize.DECIMAL';
    }
    else if (type.match(/^(float8|double precision|numeric)/)) {
      concludedType.stringRep = 'Sequelize.DOUBLE';
    }
    else if (type.match(/^uuid|uniqueidentifier/)) {
      concludedType.stringRep = 'Sequelize.UUIDV4';
    }
    else if (type.match(/^jsonb/)) {
      concludedType.stringRep = 'Sequelize.JSONB';
    }
    else if (type.match(/^json/)) {
      concludedType.stringRep = 'Sequelize.JSON';
    }
    else if (type.match(/^geometry/)) {
      concludedType.stringRep = 'Sequelize.GEOMETRY';
    }else if (type.match(/^array/)) {
      concludedType.stringRep = 'Sequelize.JSON';
    }else {
      concludedType.stringRep = '"'+column.type+'"';
    }
  }
  concludedType.obj = eval(concludedType.stringRep);
  return concludedType;
}
