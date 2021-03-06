const chalk = require('chalk');

const defaultIdColor = chalk.gray;

const logLevels = {
// LogLevel enum
// ref https://docs.microsoft.com/en-us/javascript/api/@aspnet/signalr/loglevel

  Trace: 0,
  // Log level for very low severity diagnostic messages.

  Debug: 1,
  // Log level for low severity diagnostic messages.

  Information: 2,
  // Log level for informational diagnostic messages.

  Warning: 3,
  // Log level for diagnostic messages that indicate a non-fatal problem.

  Error: 4,
  // Log level for diagnostic messages that indicate a failure in the current operation.

  Critical: 5,
  // Log level for diagnostic messages that indicate a failure that will terminate the entire application.

  None: 6,
};

const levelAliase = {
  Info: 'Information',
}

const capitilizeString = (id='') => typeof id === 'string' && id.length > 0 ? id.charAt(0)
  .toUpperCase() + id.toLowerCase().slice(1) : id;

const isNumber = x => typeof x === 'number' || !isNaN(parseInt(x, 10));
const getLevelNumber = (x) => {
  if (isNumber(x)) { return x; }
  return Object.keys(logLevels).indexOf(capitilizeString(x));
};

const getLevelId = (x) => {
  if (!isNumber(x) && getLevelNumber(x) === -1) { return; }
  return Object.keys(logLevels)[x];
};

Object.freeze(logLevels); // make the object immutable

const logIds = [
  't', // 'Trace',
  'd', // 'Debug',
  'i', // 'Information',
  'w', // 'Warning',
  'e', // 'Error',
  'c', // 'Critical',
];

const logColors = [
// Colors for each log level to use (can be selected by the level value as index)
// ref: https://www.npmjs.com/package/chalk

  chalk.gray, // Trace: 0,
  chalk.blue, // Debug: 1,
  chalk.green, // Information: 2,
  chalk.yellow, // Warning: 3,
  chalk.red, // Error: 4,
  chalk.bold.red, // Critical: 5,
  // None: 6,
];

function Logger(loggerId = '', idColor, logLvl) {
  let _logLevel = logLevels.Information;
  // All of the messages with logLevel >= _logLevel will be shown

  const _logEnabled = true; // true || false,
  // The while log is disabled while it is false
  // ignored while _onLogMessage contains a function reference

  let _onLogMessage = (logLevel, ...msg) => {
  // All of the messages will be passed to this handler instead of the console output, while it is redefined

    if (logLevel < _logLevel) { return; }
    if (!_logEnabled) { return; }
    const _idColor = idColor ? chalk.keyword(idColor) : defaultIdColor;
    // eslint-disable-next-line no-console
    console.log(
      logColors[logLevel](logIds[logLevel]),
      _idColor(`[${loggerId}]`), ...msg);
  };

  this.setLogLevel = (ll='') => {
    const _ll = levelAliase[capitilizeString(ll)] || ll;
    const ln = getLevelNumber(_ll)
    if(ln === -1){
      this.warn(chalk.yellow(`logLevel invalid value: ${ll}, using "${getLevelId(_logLevel)}" instead`))
      return
    }
    _logLevel = ln;
  };

  this.getLogLevel = () => _logLevel;

  this.setOnLogMessage = (olm) => { _onLogMessage = olm; };

  this.trace = (...msg) => _onLogMessage(logLevels.Trace, ...msg);

  this.debug = (...msg) => _onLogMessage(logLevels.Debug, ...msg);

  this.iformation = (...msg) => _onLogMessage(logLevels.Information, ...msg);

  this.warning = (...msg) => _onLogMessage(logLevels.Warning, ...msg);

  this.error = (...msg) => _onLogMessage(logLevels.Error, ...msg);

  this.critical = (...msg) => _onLogMessage(logLevels.Critical, ...msg);

  this.info = this.iformation;
  this.warn = this.warning;
  this.err = this.error;

  Object.freeze(this);

  if(logLvl){ this.setLogLevel(logLvl) }
}

Logger.logLevels = logLevels;
Logger.getLevelNumber = getLevelNumber;
Logger.getLevelId = getLevelId;

Object.freeze(Logger);

module.exports = Logger;
