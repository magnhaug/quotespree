var express = require('express')
var util = require('util')
var quotebook = require('./quotebook.json')

var app = express()

function server (app, quotes) {
  app.set('port', (process.env.PORT || 5000))
  app.use(express.static(__dirname + '/public'))
  
  var printers = {"json": printJson, "text": printText }

  app.get('/', function(request, response) {
    var bestAccepts = request.accepts(["text", "json"])
    var printer = printers[bestAccepts];
    var quote = getRandomQuote(quotes, printer)
    response.send(quote)
  })
  
  app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
  })
}

function getRandomQuote(quotes, printer) {
  var categories = Object.keys(quotes)
  var category = categories[randomInt(categories.length)]

  var subcategories = Object.keys(quotes[category])
  var subcategory = subcategories[randomInt(subcategories.length)]

  var quotes = quotes[category][subcategory]
  var quote = quotes[randomInt(quotes.length)]

  return printer(category, subcategory, quote);
}

function printJson(category, subcategory, quote) {
  quote.category = category
  quote.subcategory = subcategory
  return quote
}

function printText(category, subcategory, quote) {
  if (category === "jokes") {
    return util.format("Joke of the day: %s", quote.joke)
  } else if (category === "quotes") {
    return util.format("Quote of the day: \"%s\" -- %s", quote.quote, quote.author)
  } else {
    console.log("Unknown category", category)
  }
}

function randomInt(n) {
  return Math.floor(Math.random() * n)
}

server(app, quotebook)

