var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));

app.get("/api/users/:id", function(req, res){
    var id = req.params.id;
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    var user = null;
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            user = users[i];
            break;
        }
    }
    if(user){
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});

app.post("/api/users", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    var userName = req.body.name;
    var user = {name: userName, email: userEmail, password: userPassword};

    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);

    var id = Math.max.apply(Math,users.map(function(o){return o.id;}))
    user.id = id+1;
    users.push(user);
    var data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    res.send(user);
});

app.post("/api/photos", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    var photoURL = req.body.URL;
    var photoTag = req.body.tag;
    var photo = {URL: photoURL, tag: photoTag};

    var data = fs.readFileSync("photos.json", "utf8");
    var photos = JSON.parse(data);

    var id = Math.max.apply(Math,photos.map(function(o){return o.id;}))
    photo.id = id+1;
    photos.push(photo);
    var data = JSON.stringify(photos);
    fs.writeFileSync("photos.json", data);
    res.send(photo);
});

app.listen(8000, function(){
});
