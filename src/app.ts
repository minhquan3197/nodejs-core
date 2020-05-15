import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';

import { initRoutes } from './routes/routes';
import { initPassport } from './middlewares/passport';
import ErrorHandler from './middlewares/error-handler';
import Response from './middlewares/Response';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.middlewares();
        initRoutes(this.app);
        initPassport(passport);
    }

    private middlewares = (): void => {
        this.app.use(passport.initialize());
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('combined'));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(Response);
        this.app.use(ErrorHandler);
    };
}

export default new App().app;
