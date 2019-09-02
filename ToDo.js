let express = require('express');
let app = express();

let mongodb = require("mongodb");
let bodyParser = require('body-parser');

let db = null;

let viewsPath = __dirname + "/views/";

app.use(express.static('images'));
app.use(express.static('css'));

app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");

app.use(bodyParser.urlencoded({
    extended: false
}));

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
        }
    });

app.get("/", function(req, res) {
    let fileName = viewsPath + "/index.html";
    res.sendFile(fileName);
});

app.get("/addNewTask", function(req, res){
    let fileName = viewsPath + "/addTask.html";
    res.sendFile(fileName);
});

app.post('/addNewTask', function (req, res) {
    let taskDetails = req.body;
    db.collection('week6').insertOne({ taskName: taskDetails.taskName, dueDate: taskDetails.dueDate, taskStatus: taskDetails.taskStatus, description: taskDetails.description });
    res.redirect('/getAllTasks'); 
});

app.get("/getAllTasks", function(req,res){
    db.collection('week6').find({}).toArray(function (err, data) {
        res.render('getAllTasks', { tasks: data });
    });
});

app.get('/deleteTask', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTask.html');
});

app.post('/deleteTask', function (req, res) {
    let taskDetails = req.body;
    let filter = { _id: mongodb.ObjectID(taskDetails._id) };
    db.collection('week6').deleteOne(filter);
    res.redirect('/getAllTasks');
});

app.get('/deleteCompleted', function (req, res) {
    let taskDetails = req.body;
    let filter = { taskStatus: taskDetails.taskStatus ="Complete" };
    db.collection('week6').deleteMany(filter);
    res.redirect('/getAllTasks');
});

app.get('/updateTask', function (req, res) {
    res.sendFile(__dirname + '/views/updateTask.html');
});

app.post('/updateTask', function (req, res) {
    let taskDetails = req.body;
    let filter = { _id: mongodb.ObjectID(taskDetails._id) };
    let theUpdate = { $set: { taskStatus: taskDetails.taskStatus } };
    db.collection('week6').updateOne(filter, theUpdate);
    res.redirect('/getAllTasks');
})

app.listen(8080);