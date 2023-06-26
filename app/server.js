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
const subjectArray = JSON.parse(subjectData);

const studentData = fs.readFileSync(__dirname + "/" + studentsFileName, opt);
const studentDictionary = JSON.parse(studentData);

const degreeData = fs.readFileSync(__dirname + "/" + degreesFileName, opt);
const degreeArray = JSON.parse(degreeData);

const professorshipData = fs.readFileSync(__dirname + "/" + professorshipFileName, opt);
const professorshipDictionary = JSON.parse(professorshipData);

app.get('/', function (req, res) {
   res
    .status(200)
    .send('Server is running')
    .end();
});

//***  Students CRUD ***//
app.get('/students', function (req, res) {
      console.log( studentDictionary );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(studentDictionary) );
});

app.get('/students/:id', function (req, res) {
   const studentId = req.params.id;
   const student = studentDictionary[studentId];
   if(student) {
      console.log( student );
      res.setHeader('content-type', 'application/json');
      res.end( JSON.stringify(student));
   } else {
      res.status(404);
      res.end(`Student "${studentId}" not found`);
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

app.delete('/students/:id', function (req, res) {
   const studentIdForDeletion = req.params.id;
   console.log( "Deleting a student - Id", studentIdForDeletion );
   
   const aStudent = studentDictionary[studentIdForDeletion];
   if(aStudent) {

      delete studentDictionary[studentIdForDeletion];
      // for (let index = 0; index < array.length; index++) {
      //    const student = array[index];
      //    if (student.id === studentIdForDeletion)
      //    array.splice(i, 1);
      // }
      res.status(204);
      res.end(`Student "${studentIdForDeletion}" deleted`);
   } else {
      res.status(404);
      res.end(`Student "${studentIdForDeletion}" not found`);
   }
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
   console.log( subjectArray );
   res.setHeader('content-type', 'application/json');
   res.end( JSON.stringify(subjectArray) );
});

app.get('/subjects/:id', function (req, res) {
   const subject = subjectArray.find(element => element.id == req.params.id);
   console.log( subject );
   if (subject === undefined) {
      res.status(404);
      res.end( `Subject "${req.params.id}" not found`);
      return;
   }
   
   res.setHeader('content-type', 'application/json');
   res.end( JSON.stringify(subject));
});

//***  Professorship  ***//
app.get('/professorships', function (req, res) {  
   const professorshipArray = convertProfessroshipToArray();

   res.setHeader('content-type', 'application/json');
   res.end( JSON.stringify(professorshipArray) );
});

app.get('/professorships/:id', function (req, res) {   

   const professorshipArray = convertProfessroshipToArray();

   const p = professorshipArray.find(element => element.id == req.params.id);
   if(p === undefined) {
      res.status(404);
      res.end( `Professorship "${req.params.id}" not found`);
      return;
   }

   const subject = subjectArray.find(item => item.id == p.subjectId);
   if (subject) {
      p.subject = subject.name;
   }

   console.log( JSON.stringify(p) );
   res.setHeader('content-type', 'application/json');
   res.end( JSON.stringify(p));
});

app.post('/professorships/', function (req, res) {   
   const newProfessorship = req.body;
   console.log( "Creating a new professorship", newProfessorship );
   
   if( !newProfessorship || !newProfessorship.id) {
      res.status(400);
      res.end("Invalid professorship");
      return;
   }

   const professorshipArray = convertProfessroshipToArray();

   const existingProfessorship = professorshipArray.find(element => element.id == newProfessorship.id);

   if( existingProfessorship !== undefined ) {
      res.status(409);
      res.end(`Professorship "${newProfessorship.id}" already exist`);
      return;
   }

   // Es un ID válido
   
   if (!newProfessorship.subjectId) {
      res.status(400);
      res.end(`Invalid subjectId "${newProfessorship.subjectId}"`);
      return;
   }
   const subject = subjectArray.find(element=> element.id === newProfessorship.subjectId);
   console.log("Subject Found", JSON.stringify(subject));

   if (!newProfessorship.shiftId || !(newProfessorship.shiftId === 1 || newProfessorship.shiftId === 2)) {
      res.status(400);
      res.end(`Invalid shiftId "${newProfessorship.shiftId}"`);
      return;
   }

   const pArray = professorshipDictionary[newProfessorship.subjectId];
   if(pArray) {
     pArray.push(newProfessorship);
     console.log( professorshipDictionary );
      res.setHeader('content-type', 'application/json');
      res.status(201);
      res.end( JSON.stringify(newProfessorship));
   }
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
function convertProfessroshipToArray() {
   const professorshipArray = [];
   Object.keys(professorshipDictionary).map(function (k) {
      const element = professorshipDictionary[k];
      for (let index = 0; index < element.length; index++) {
         const e = element[index];

         const subjectObj = subjectArray.find(item => item.id == e.subjectId);
         if (subjectObj) {
            e.subject = subjectObj.name;
         }
         professorshipArray.push(e);
      }
   });
   return professorshipArray;
}

