let express = require('express');
let app = express();

const mongoose = require('mongoose');
let bodyParser = require('body-parser');

const Task = require('./models/Task');
const Developer = require('./models/Developer');

let viewsPath = __dirname + "/views/";

app.use(express.static('images'));
app.use(express.static('css'));

app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");

app.use(bodyParser.urlencoded({
    extended: false
}));

let url='mongodb://localhost:27017/Week7DB';

mongoose.connect('mongodb://localhost:27017/Week7DB', function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');

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
    let task = new Task({
        _id: new mongoose.Types.ObjectId,
        taskName: taskDetails.taskName,
        assignedTo: taskDetails.assignedTo,
        dueDate: taskDetails.dueDate,
        taskStatus: taskDetails.taskStatus, 
        description: taskDetails.description,
    });
    task.save(function (err) {
        if (err) throw err;
        console.log('Task added to DB');
    });
    res.redirect('/getAllTasks'); 
});

app.get("/addNewDeveloper", function(req, res){
    let fileName = viewsPath + "/addDeveloper.html";
    res.sendFile(fileName);
});

app.post('/addNewDeveloper', function (req, res) {
    let developerDetails = req.body;
    let developer = new Developer({
        _id: new mongoose.Types.ObjectId,
        name:{
            firstName: developerDetails.firstName,
            lastName: developerDetails.lastName,
        },
        level: developerDetails.level,
        address:{
            state: developerDetails.state,
            suburb: developerDetails.suburb,
            street: developerDetails.street,
            unit: developerDetails.unit
        } 
    });
    developer.save(function (err) {
        if (err) throw err;
        console.log('Developer added to DB');
    });
    res.redirect('/getAllTasks'); 
});

// app.get("/addManyTasks", function(req, res){
//     let fileName = viewsPath + "/addManyTasks.html";
//     res.sendFile(fileName);
// });

// app.post('/addManyTasks', function (req, res) {
//     let taskDetails = req.body;
//     let tasksToAdd=[];
//     for(let i=0; i<taskDetails.count; i++){
//         tasksToAdd[i]={ taskName: taskDetails.taskName, dueDate: taskDetails.dueDate, taskStatus: taskDetails.taskStatus, description: taskDetails.description };
//     }
//     db.collection('week6').insertMany(tasksToAdd);
//     res.redirect('/getAllTasks'); 
// });

app.get("/getAllTasks", function(req,res){
    Task.find({}).exec(function (err, data) {
        res.render('getAllTasks', { tasks: data });
    });
});

app.get("/getAllDevelopers", function(req,res){
    Developer.find({}).exec(function (err, data) {
        res.render('getAllDevelopers', { developers: data });
    });
});

app.get('/deleteTask', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTask.html');
});

app.post('/deleteTask', function (req, res) {
    let taskDetails = req.body;
    let filter = { _id: mongoose.Types.ObjectId(taskDetails._id) };
    Task.deleteOne(filter,function(err,doc){});
    res.redirect('/getAllTasks');
});

app.get('/deleteCompleted', function (req, res) {
    let taskDetails = req.body;
    let filter = { taskStatus: taskDetails.taskStatus ="Complete" };
    Task.deleteMany(filter, function(err,doc){});
    res.redirect('/getAllTasks');
});

app.get('/updateTask', function (req, res) {
    res.sendFile(__dirname + '/views/updateTask.html');
});

app.post('/updateTask', function (req, res) {
    let taskDetails = req.body;
    let filter = { _id: mongoose.Types.ObjectId(taskDetails._id) };
    let theUpdate = { $set: { taskStatus: taskDetails.taskStatus } };
    Task.updateOne(filter, theUpdate, function(err,doc){});
    res.redirect('/getAllTasks');
})

app.listen(8080);
});