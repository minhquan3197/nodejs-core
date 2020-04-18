import app from './app';
import config from './config/constants';
import { connectDB } from './config/connect_database';

// Server environment
const PORT = config.env_server.port;

// Connect database
connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
