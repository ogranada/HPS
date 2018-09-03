import { Router } from 'express';
import Database from './database';
import utils from './utils';

export const RootRouter = Router();
export const ApiRouter = Router();

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{title}}</title>
</head>
<body>
  {{body}}
  <script src="/scripts/main.js"></script>
</body>
</html>`;

function render(template, values) {
  return Object.keys(values).reduce((initial, key) =>
    initial.replace(`{{${key}}}`, values[key]), template);
}

RootRouter.get('/', (req, res) => {
  res
    .status(200).send(render(HTML_TEMPLATE, {
      title: 'High Performance Stats',
      body: `<pre>${1}</pre>`
    }));
});

ApiRouter.get('/status', (req, res) => {
  const now = new Date();
  const limit = new Date();
  // limit.setHours(limit.getHours() - 1);
  limit.setMinutes(limit.getMinutes() - 10);
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
      .status(200).send(render(HTML_TEMPLATE, {
        title: 'Database Values',
        body: `<pre>${data}</pre>`
      }));
  } else {
    res.status(200)
      .json(data);
  }
});


export default ApiRouter;