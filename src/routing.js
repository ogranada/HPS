import { Router } from 'express';
import Database from './database';
import utils from './utils';

export const RootRouter = Router();
export const ApiRouter = Router();

RootRouter.get('/', (req, res) => {
  res
    .status(200).render('index.html', {
      title: 'High Performance Stats'
    });
});

ApiRouter.get('/status', (req, res) => {
  const now = new Date();
  const limit = new Date();
  limit.setHours(limit.getHours() - 1);
  // limit.setMinutes(limit.getMinutes() - 10);
  let data = Database.getInstance().query('status', {})
    .filter(utils.isMoreRecentThan(limit))
    .reduce(utils.groupBySource, {})
    ;
  res.status(200).json({
    now,
    limit,
    data,
  });
});

ApiRouter.get('/database', (req, res) => {
  const forceJSON = !!req.query['force_json'];
  let data = Database.getInstance().query('status', {});
  if (!forceJSON && req.headers.accept && req.headers.accept.includes('text/html')) {
    data = JSON.stringify(data, null, 2);
    return res
      .status(200).render('database.html', {
        title: 'Database Values',
        body: data
      });
  } else {
    res.status(200)
      .json(data);
  }
});


export default ApiRouter;