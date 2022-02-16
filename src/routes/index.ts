import express, { Request, Response } from 'express';
import _ from 'lodash';

import { HttpStatus } from '../utils/constants';
import * as services from '../services/subdoc_array_mutations.service';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const { document, mutation } = req.body;

  if (_.isEmpty(document)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: 'Document is required',
    });
  }

  if (_.isEmpty(mutation)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: 'Mutation is required',
    });
  }

  const statement = services.generateUpdateStatement(document, mutation);
  return res.status(HttpStatus.OK).json(statement);
});

export default router;
