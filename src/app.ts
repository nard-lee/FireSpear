import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import ejsLayouts from "express-ejs-layouts";
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';

import passport from './lib/passport.js';
import sessionStore from './lib/session-store.js';
import { csrfSynchronisedProtection } from './lib/csrf.js';
import { locals } from './middlewares/locals.js';
import { errorHandler, notFound } from './middlewares/errHandler.js';
import routes from './routes/index.js';
import { config } from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(ejsLayouts);
app.set("layout", "layout");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use(session({
	store: sessionStore,
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		sameSite: 'lax',
		maxAge: 1000 * 60 * 60 * 24,
	},
}));

app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());

app.use(csrfSynchronisedProtection);
app.use(locals);

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;