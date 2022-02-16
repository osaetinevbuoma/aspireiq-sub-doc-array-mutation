import 'dotenv/config';

import compression from 'compression';
import cors from 'cors';
/*

Copyright (c) 2019 - present AppSeed.us

*/
import express from 'express';
import passport from 'passport';

import routes from '../routes/index';

// Instantiate express
const server = express();
server.use(compression());

// Passport Config
server.use(passport.initialize());

// Connect to sqlite
if (process.env.NODE_ENV !== 'test') {
  //
}

server.use(cors());
server.use(express.json());

// Initialize routes middleware
server.use('/api/array-mutation', routes);

export default server;
