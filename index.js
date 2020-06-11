//Hey Aaron!

const express = require('express')
const app = express();
const path = require('path');
const public = path.join(__dirname, 'public') //This is the path where all static files (html, js, css, assets) will be served from


app.use(express.static(public));

app.get('/', (req, res) => {
  res.sendFile(path.join(public + '/index.html'))


  //We need some way of differentiating by url. Some id telling node which trail info to access
  // Do we do this each time a user starts creating a new path, or do we only create a url after they hit save and redirect?
  //I think, keep base url on creation, but if they want to reaccess the data they need to add the id to a new path
});

app.listen(8000, () => {
  console.log('Spinning up warp drives')
});