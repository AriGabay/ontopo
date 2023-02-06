const express = require('express');
const { dataCarousel } = require('./dataCarousel.js');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors({ origin: '*' }));

app.get('/getCarouselData', (req, res) => {
  res.json(dataCarousel);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
