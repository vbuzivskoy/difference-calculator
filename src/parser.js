import _ from 'lodash';
import yaml from 'js-yaml'
import ini from 'ini';

const iniParser = (iniFileContent) => {
  const decodedIni = ini.parse(iniFileContent);
  const iter = (configValue) => {
    if (_.isObject(configValue)) {
      const keys = Object.keys(configValue);
      return keys.reduce((acc, key) => {
        return {...acc, [key]: iter(configValue[key])}
      }, {});
    }
    if (_.isString(configValue)) {
      const number = Number(configValue);
      return isNaN(number) ? configValue : number;
    }
    return configValue;
  };
  return iter(decodedIni);
};

const parseFile = (file, ext) => {
  let parser;
  switch (ext) {
    case '.json':
      parser = JSON.parse;
      break;
    case '.yaml':
      parser = yaml.safeLoad;
      break;
    case '.ini':
      parser = iniParser;
      break;
    default:
      return null;
  }
  return parser(file);
};

export default parseFile;