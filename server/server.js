var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

var port = process.env.PORT || 3000;
var host = process.env.IP || "127.0.0.1";

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log(req.body);
  if (req.body.result.action == 'checkVote') {
    var age = req.body.result.parameters.age;
    var response = '';
    if (age.amount < 16)
      response = 'No';
    
    if (((age.amount >= 16) && (age.amount < 18)) || (age.amount > 70))
      response = "Yes, but isn't obligatory";
    
    if ((age.amount > 18) && (age.amount <= 70))
      response = "Yes, and in Brazil it's obligatory";

    res.json({
      "speech": response,
      "displayText": response
    });
  } else
  if (req.body.result.action == 'calc'){
    var operation = req.body.result.parameters.Operators;
    var n1 = parseFloat(req.body.result.parameters.number);
    var n2 = parseFloat(req.body.result.parameters.number1);

    var response ;
    if (operation == 'add')
      response = n1 + n2;
    
    if (operation == 'sub')
      response = n1 - n2;

    if (operation == 'mult')
      response = n1 * n2;

    if (operation == 'div'){
      if (n2 == 0){
        response = "Its impossible divide by 0";
      } else {
        response = n1 / n2;
      }
    }

    res.json({
      "speech": response,
      "displayText": response
    });
    
  } else

    if (req.body.result.action == 'weather'){
      var city = req.body.result.parameters.city; 
      var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=e35053d05a2d416283cbe70fcf58d3ad";

      request(url, (err, result, body) => {
        if (err)
          res.json({
            "speech": err,
            "displayText": err
          });
        var temp  = Math.round(JSON.parse(body).main.temp - 273.15);
        var responseText = "Temperature in " + city + " is " + temp + "ºC";

        res.json({
          "speech": responseText,
          "displayText": responseText
        });
      });
    }
});

app.listen(port, host);
