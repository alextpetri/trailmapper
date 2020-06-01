//Hey Aaron!

const express = require('express')
const app = express();
const path = require('path');
const public = path.join(__dirname, 'public') //This is the path where all static files (html, js, css, assets) will be served from


app.use(express.static(public));

app.get('/', (req, res) => {
  res.sendFile(path.join(public + '/index.html'))
});

app.listen(8000, () => {
  console.log('Spinning up warp drives')
});