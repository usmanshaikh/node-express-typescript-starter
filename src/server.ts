import app from './app';
import config from './config/config';
import logger from './config/logger';

const PORT = config.port || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
