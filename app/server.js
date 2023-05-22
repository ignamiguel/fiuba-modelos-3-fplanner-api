var express = require('express');
var app = express();
var cors = require('cors')
var fs = require("fs");

app.use(cors());

app.get('/', function (req, res) {
   res
    .status(200)
    .send('Server is running')
    .end();
});

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
});

var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
};

app.post('/addUser', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      data["user4"] = user["user4"];
      console.log( data );
      res.end( JSON.stringify(data));
   });
});

app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id] 
      console.log( user );
      res.end( JSON.stringify(user));
   });
})

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "::";

console.log("************* host", HOST);
console.log("************* port", PORT);

var server = app.listen(PORT, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("************* host", host);
   console.log("************* port", port);

   console.log("App listening at http://%s:%s", host, port)
});
