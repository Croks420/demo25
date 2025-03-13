import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import logRouter from './router/logRoute.mjs';
import authRouter from './router/userRoutes.mjs';
import HTTP_CODES from './utils/httpCodes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS } from './modules/log.mjs';
import cors from 'cors';
import path from 'path';
import open from 'open';

const FileStoreInstance = FileStore(session);
const server = express();
server.use(cors());
const port = process.env.PORT || 8000;

const logger = log(LOGG_LEVELS.VERBOSE);
server.set('port', port);
server.use(logger);
server.use(express.static('public', { index: false }));
server.use(express.json());

server.use(session({
    store: new FileStoreInstance({ path: './sessions', retries: 1 }),
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

server.get('/', (req, res) => {
    res.redirect('/login'); // sends you to login
});

server.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

server.get('/session', (req, res) => {
    if (!req.session.sessionId) {
        req.session.sessionId = uuidv4();
    }
    res.status(HTTP_CODES.SUCCESS.OK).send({ sessionId: req.session.sessionId });
});

// Register
server.use('/api', logRouter);
server.use('/api/user', authRouter);

// Start the server
server.listen(port, async () => {
    console.log('Server running on port', port);
    await open(`http://localhost:${port}/login`); // opens with login page
});
