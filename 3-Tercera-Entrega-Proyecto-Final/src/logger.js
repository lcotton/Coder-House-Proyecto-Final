import log4js from "log4js";

log4js.configure({
  appenders: {
    consola: { type: "console" },
    archivoWarnings: { type: "file", filename: "warn.log" },
    archivoErrrores: { type: "file", filename: "error.log" },
    loggerConsola: {
      type: "logLevelFilter",
      appender: "consola",
      level: "info",
    },
    loggerArchivoWarnings: {
      type: "logLevelFilter",
      appender: "archivoWarnings",
      level: "warn",
    },
    loggerArchivoErrrores: {
      type: "logLevelFilter",
      appender: "archivoErrrores",
      level: "error",
    },
  },
  categories: {
    default: {
      appenders: [
        "loggerConsola",
        "loggerArchivoWarnings",
        "loggerArchivoErrrores",
      ],
      level: "all",
    },
  },
});

const logger = log4js.getLogger();

export default logger;
