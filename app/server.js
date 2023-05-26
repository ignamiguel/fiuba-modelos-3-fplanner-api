var express = require('express');
var app = express();
var cors = require('cors')
var fs = require("fs");

app.use(cors());
app.use(express.json()) 


const studentsFileName = "students.json";
const degreesFileName = "degrees.json";

app.get('/', function (req, res) {
   res
    .status(200)
    .send('Server is running')
    .end();
});


//***  Students  ***//
app.get('/students', function (req, res) {
   fs.readFile( __dirname + "/" + studentsFileName, 'utf8', function (err, data) {
      console.log( data );
      res.setHeader('content-type', 'application/json');
      res.end( data );
   });
});

app.get('/students/:id', function (req, res) {
   fs.readFile( __dirname + "/" + studentsFileName, 'utf8', function (err, data) {
      var students = JSON.parse( data );
      var student = students[req.params.id];
      console.log( student );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(student));
   });
})

app.post('/students', function (req, res) {
   fs.readFile( __dirname + "/" + studentsFileName, 'utf8', function (err, data) {
      const students = JSON.parse( data );

      const newStudent = req.body;
      console.log( newStudent );
      if( newStudent && newStudent.id) {
         students[newStudent.id] = newStudent;
         console.log( students );
         res.setHeader('content-type', 'application/json');
         res.status(201);
         res.end( JSON.stringify(students));
      } else {
         res.status(400);
         res.end("invalid student");
      }
   });
});


//***  Degrees  ***//
app.get('/degrees', function (req, res) {
   fs.readFile( __dirname + "/" + degreesFileName, 'utf8', function (err, data) {
      console.log( data );
      res.setHeader('content-type', 'application/json');
      res.end( data );
   });
});

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
