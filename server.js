const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 8088;

const PUBLIC_DIRECTORY = path.join(__dirname, './public');

app.use(cors());
app.use((req, res, next) => {
  res.set('Cache-Control', 'public');
  next();
});
app.use(compression());
app.use(express.static(PUBLIC_DIRECTORY));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port: ${port}`);
});
