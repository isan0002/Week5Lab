let express = require('express');
let app = express();

let bodyParser = require('body-parser');

let db = [];

let viewsPath = __dirname + "/views/";

app.use(express.static('images'));
app.use(express.static('css'));

app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get("/", function(req, res) {
    let fileName = viewsPath + "/index.html";
    res.sendFile(fileName);
});

app.get("/addNewTask", function(req, res){
    let fileName = viewsPath + "/addTask.html";
    res.sendFile(fileName);
});

app.get("/getAllTasks", function(req,res){
    let fileName = viewsPath + "/getAllTasks.html";
    res.render(fileName, {tasks: db});
});

app.post("/addNewTask", function(req,res){
        console.log(req.body);
        db.push(req.body);
        res.redirect("/getAllTasks");
});

app.listen(8080);