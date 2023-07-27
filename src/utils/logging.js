import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino(
  {
    base: {
      pid: false,
    },
  },
  pretty(),
);

export default logger;
