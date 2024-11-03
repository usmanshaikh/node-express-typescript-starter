import app from './app';
import config from './config/config';

const PORT = config.port || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
