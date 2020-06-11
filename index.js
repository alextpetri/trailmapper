//Hey Aaron!

const express = require('express')
const app = express();
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter')


const path = require('path');
const public = path.join(__dirname, 'public') //This is the path where all static files (html, js, css, assets) will be served from


app.use(express.static(public));

app.use(express.json()) //Middleware used for parsing json

app.get('/', (req, res) => {
  res.sendFile(path.join(public + '/index.html'))


  //We need some way of differentiating by url. Some id telling node which trail info to access
  // Do we do this each time a user starts creating a new path, or do we only create a url after they hit save and redirect?
  //I think, keep base url on creation, but if they want to reaccess the data they need to add the id to a new path
});


app.post('/trail', [
  //Here we validate the input of the form using the check api: https://express-validator.github.io/docs/check-api.html
  body('trailname').exists().withMessage("Trail needs a name")
  //check(trailjsonfile).exists() and is file?
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).json({ errors: errors.array() });
  }
  
  Trail.create({
    trailName: req.body.trailname,
    trailDescription: req.body.traildescription
    //Simplest form we can create right now. But later we have to have a way of adding the trail geojson file tothis form??
  }).then(trail => res.json(trail));

});


app.listen(8000, () => {
  console.log('Spinning up warp drives')
});