'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');

app.use(cors());
app.use(express.static(`${__dirname}/dist`));

app.get('/*', function(req, res) {   
  res.sendFile(path.join(__dirname, '/dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});