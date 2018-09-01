
import {format, createLogger, transports} from 'winston';
const { combine, timestamp, label, printf } = format;

const hpsFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

function createHDSLogger(){
  const _logger = createLogger({
    level: 'info',
    // format: format.json(),
    format: combine(
      format.colorize(),
      label({ label: 'Hight Performance Status' }),
      timestamp(),
      hpsFormat
    ),
    transports: [
      new transports.File({ filename: 'error-hps.log', level: 'error' }),
      new transports.File({ filename: 'hps.log' })
    ]
  });
  /* istanbul ignore else */
  if(!process.env['TESTING']) {
    _logger.add(new transports.Console());
  }
  return _logger;
}

const logger = createHDSLogger();

export function getLogger(level='info') {
  return {
    log(...args) {
      logger.log(level, ...args);
    }
  };
}
