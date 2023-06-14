var express = require('express');
var app = express();
var cors = require('cors')
var fs = require("fs");

app.use(cors());
app.use(express.json()) 


const studentsFileName = "students.json";
const degreesFileName = "degrees.json";
const subjectFileName = "subjects.json";
const professorshipFileName = "professorship.json";


const opt =  { 'enconding': 'utf8'};
const subjectData = fs.readFileSync(__dirname + "/" + subjectFileName, opt);
const subjectList = JSON.parse(subjectData);

const studentData = fs.readFileSync(__dirname + "/" + studentsFileName, opt);
const studentDictionary = JSON.parse(studentData);

app.get('/', function (req, res) {
   res
    .status(200)
    .send('Server is running')
    .end();
});

//***  Students  ***//
app.get('/students', function (req, res) {
      console.log( studentDictionary );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(studentDictionary) );
});

app.get('/students/:id', function (req, res) {
      const student = studentDictionary[req.params.id];
      if(student) {
         console.log( student );
         res.setHeader('content-type', 'application/json');
         res.end( JSON.stringify(student));
      } else {
         res.status(404);
         res.end(`Student "${req.params.id}" not found`);
      }
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

app.get('/degrees/:id', function (req, res) {
   fs.readFile( __dirname + "/" + degreesFileName, 'utf8', function (err, data) {
      const degrees = JSON.parse( data );
      const degree = degrees.find(element => element.id == req.params.id);
      console.log( degree );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(degree));
   });
});

//***  Subjects  ***//
app.get('/subjects', function (req, res) {
   fs.readFile( __dirname + "/" + subjectFileName, 'utf8', function (err, data) {
      console.log( data );
      res.setHeader('content-type', 'application/json');
      res.end( data );
   });
});

app.get('/subjects/:id', function (req, res) {
   fs.readFile( __dirname + "/" + subjectFileName, 'utf8', function (err, data) {
      const subjects = JSON.parse( data );
      const subject = subjects.find(element => element.id == req.params.id);
      console.log( subject );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(subject));
   });
});

//***  Professorship  ***//
app.get('/professorships', function (req, res) {
   console.log('subjectList', JSON.stringify(subjectList));

   fs.readFile( __dirname + "/" + professorshipFileName, 'utf8', function (err, data) {
      console.log( data );
      const professorshipDic = JSON.parse( data );
      const professorshipList = []; 
      Object.keys(professorshipDic).map(function(k) {
         const element = professorshipDic[k];
         console.log("element", JSON.stringify(element));
         
         for (let index = 0; index < element.length; index++) {
            const e = element[index];
            e.subject = subjectList.find(item => item.id == e.subject).name;
            professorshipList.push(e);
         }
     });


      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(professorshipList) );
   });
});

app.get('/professorships/:id', function (req, res) {
   fs.readFile( __dirname + "/" + professorshipFileName, 'utf8', function (err, data) {
      const professorshipDic = JSON.parse( data );
      const professorshipList = professorshipDic[req.params.id];
      const p = professorshipList.find(element => element.id == req.params.id);

      p.subject =  subjectList.find(item => item.id == p.subject).name;

      console.log( JSON.stringify(p) );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(p));
   });
});


var PORT = process.env.PORT || 3001;
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
