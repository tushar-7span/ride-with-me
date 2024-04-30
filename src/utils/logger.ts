import { createLogger, format, transports, Logger } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger: Logger = createLogger({
  level: "info",
  format: combine(
    format.colorize(),
    timestamp({ format: "HH:mm:ss" }),
    myFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
