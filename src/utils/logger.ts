import { Logger, createLogger, format, transports } from "winston";
import { LOGGER } from '../helper/constants'
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp}) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger:Logger = createLogger({
    level: LOGGER.LEVEL,
    format: combine(
      format.colorize(),
      timestamp({ format: "HH:mm:ss" }),
      myFormat
    ),
    transports: [new transports.Console()],
  });

export default logger;
