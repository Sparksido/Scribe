var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var idgen = require("idgen");

var url = 'mongodb://localhost:27017/endevour';
var dbName = "endevour";


/* GET home page. */
router.get('/', function(req, res) {
    res.render("loginPage", {});
});

router.post("/loginAcxeptor", function(req,res){
    var username = req.body.name;
    var password = req.body.password;
    
    MongoClient.connect(url, function(err, client){
        var db = client.db(dbName);
        var personnel = db.collection("employees");

        personnel.find({"username":name}, function(err, result){
            if(result.username != username){
                res.render("loginPage", {});
            }else if(result.username == username){

                //Fetching data from the database
                // MongoClient.connect(url, function(){
                //     var db = Clientdb(db);

                //     var projects = db.collection("projects");
                // });

                //Using assembled test data
                var tasks = [{
                    "name": "Electric Car Build",
                    "stage": "Execution",
                    "initiator": "Tlhalefo Ketsididi",
                    "budget": "P2 000 000 000"
                },{
                    "name": "Cloud Storage Service",
                    "stage": "Planning",
                    "initiator": "Malebogo Kemmonye",
                    "budget": "P9 000 000"
                },{
                    "name":"Neural Network Engine",
                    "stage": "initiation",
                    "initiator": "Mopati Bogatsu",
                    "budget": "P20 000 000"
                }];

                res.cookies("level") = result.level;
                res.render("homepage", {tasks:tasks});
            }
        })
    })
})

router.get("/projectCreator", function(req,res){
    res.render("createProject",{});
});

router.post("/projectAcceptor", function(req,res){
    var name = req.body.name;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var stage = "initiation";

    console.log("THE BODY OF THE FORM IS");
    console.log(req.body);

    var venture = {};
    venture["name"] = name;
    venture["startDate"] = startDate;
    venture["startDate"] = endDate;
    venture["stage"] = stage;
    venture["id"] = idgen(8);

    MongoClient.connect(url, function(err, client){
        var db = client.db(dbName);

        var projects = db.collection("projects");
        projects.insertOne(venture, function(err, result){
                console.log("I passed here");
                res.render("initiationPage",{project:result, user:"manager"});
        });
    });
});

router.get("/initiationPage", function(req,res){
    //if(level == "executive"){
        res.render("initiationPage",{});
    //}else if(level == "manager"){
     //   res.render("initiationPageM",{});
    //}
});

module.exports = router;
