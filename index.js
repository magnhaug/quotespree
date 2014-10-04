var express = require('express')
var fs = require('fs')
var util = require('util')

var app = express();

function server (app, quotes) {
  app.set('port', (process.env.PORT || 5000))
  app.use(express.static(__dirname + '/public'))
  
  app.get('/', function(request, response) {
    response.send(getRandomQuote(quotes))
  })
  
  app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
  })
}

function getRandomQuote(quotes) {
  var categories = Object.keys(quotes)
  var category = categories[randomInt(categories.length)]

  var subcategories = Object.keys(quotes[category])
  var subcategory = subcategories[randomInt(subcategories.length)]

  var quotes = quotes[category][subcategory]
  var quote = quotes[randomInt(quotes.length)]

  if (category === "jokes") {
    return util.format("Joke of the day: %s", quote.joke);
  } else if (category === "quotes") {
    return util.format("Quote of the day: \"%s\" -- %s", quote.quote, quote.author);
  } else {
    console.log("Unknown category", category);
  }
}

function randomInt(n) {
  return Math.floor(Math.random() * n);
}

fs.readFile('./quotebook.json', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
  quotes = JSON.parse(data);
  server(app, quotes);
});

