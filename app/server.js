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

const degreeData = fs.readFileSync(__dirname + "/" + degreesFileName, opt);
const degreeArray = JSON.parse(degreeData);

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
   const newStudent = req.body;
   console.log( "Creating a new student", newStudent );
   
   if( !newStudent || !newStudent.id) {
      res.status(400);
      res.end("Invalid student");
      return;
   } 

   if( studentDictionary[newStudent.id] !== undefined ) {
      res.status(409);
      res.end(`Student "${newStudent.id}" already exist`);
      return;
   }
   
   studentDictionary[newStudent.id] = newStudent;
   console.log( studentDictionary );
   res.setHeader('content-type', 'application/json');
   res.status(201);
   res.end( JSON.stringify(newStudent));
});

app.put('/students/:id', function (req, res) {
   const aStudent = req.body;
   console.log( "Updating a student", aStudent );
   
   if( !aStudent || !aStudent.id) {
      res.status(400);
      res.end("Invalid student");
      return;
   } 

   if( studentDictionary[aStudent.id] === undefined ) {
      res.status(400);
      res.end(`Student "${aStudent.id}" does not exist`);
      return;
   }
   
   studentDictionary[aStudent.id] = aStudent;
   console.log( studentDictionary );
   res.setHeader('content-type', 'application/json');
   res.status(200);
   res.end( JSON.stringify(aStudent));
});

//***  Degrees  ***//
app.get('/degrees', function (req, res) {
   console.log(degreeArray);
   res.setHeader('content-type', 'application/json');
   res.end( JSON.stringify(degreeArray) );
});

app.get('/degrees/:id', function (req, res) {
      const degree = degreeArray.find(element => element.id == req.params.id);
      if (!degree) {
         res.status(404);
         res.end(`Degree "${req.params.id}" not found`);
         return;
      }
      console.log( degree );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(degree));
});

app.post('/degrees', function (req, res) {
   const newDegree = req.body;
   console.log( "Creating a new degree", newDegree );
   
   if( !newDegree || !newDegree.id) {
      res.status(400);
      res.end("Invalid degree");
      return;
   }

   const degree = degreeArray.find(element => element.id == newDegree.id);

   if( degree !== undefined ) {
      res.status(409);
      res.end(`Degree "${newDegree.id}" already exist`);
      return;
   }
   
   degreeArray[newDegree.id] = newDegree;
   console.log( degreeArray );
   res.setHeader('content-type', 'application/json');
   res.status(201);
   res.end( JSON.stringify(newDegree));
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
