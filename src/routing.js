import {Router} from 'express';
import Database from './database';
import { template } from 'handlebars';

const router = Router();
const database = Database.getInstance();

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
</body>
</html>`;

function render(template, values) {
  return Object.keys(values).reduce((initial, key) =>
    initial.replace(`{{${key}}}`, values[key])
  , template);
}

router.get('/status', (req, res) => {
  res.status(200).json({});
});

router.get('/database', (req, res) => {
  let data = database.query('status', {});
  if(req.headers.accept && req.headers.accept.includes('text/html')) {
    data = JSON.stringify(data, null, 2);
    return res
      .status(200).send(render(HTML_TEMPLATE, {
        title: 'Database Values',
        body: `<pre>${data}</pre>`
      }));
  }
  res.status(200)
    .json(data);
});


export default router;