var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var idgen = require("idgen");
var config = require("./config");

var dbName = "endevour";
var url = config.url;

/* GET home page. */
router.get('/', function(req, res) {
    res.render("loginPage", {});
});

router.post("/loginAcceptor", function(req,res){
    console.log("THE REQUEST BODY IS");
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    

    console.log("THE USERNAME FROM THE FORM IS");
    console.log(username);

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client){
        var db = client.db(dbName);
        var personnel = db.collection("employees");

        personnel.findOne({"username":username}, function(err, result){

            console.log("THE RESULT OBTAINED IS");
            console.log(result);
            if(result.username != username){
                res.render("loginPage", {});
            }else if(result.username == username){

                //Fetching data from the database
                var projects = db.collection("projects");
                projects.find({}).toArray(function(err, tasks){
                    if(err){
                        console.log("err");
                    }else{
                        res.cookie("level",result.level);
                        console.log("THE LEVEL THAT WAS SIGNED UP IS");
                        console.log(result.level);
                        res.cookie("userId",result.id);
                        res.render("homepage", {tasks:tasks});
                    }
                });
                

                //Using assembled test data
                // var tasks = [{
                //     "name": "Electric Car Build",
                //     "stage": "Execution",
                //     "initiator": "Tlhalefo Ketsididi",
                //     "budget": "P2 000 000 000"
                // },{
                //     "name": "Cloud Storage Service",
                //     "stage": "Planning",
                //     "initiator": "Malebogo Kemmonye",
                //     "budget": "P9 000 000"
                // },{
                //     "name":"Neural Network Engine",
                //     "stage": "initiation",
                //     "initiator": "Mopati Bogatsu",
                //     "budget": "P20 000 000"
                // }];

                // res.cookie("level",result.level);
                // res.cookie("userId",result.id);
                // res.render("homepage", {tasks:tasks});
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
    venture["managerId"] = "";
    res.cookie("projectId", venture["id"]);

    MongoClient.connect(url, function(err, client){
        var db = client.db(dbName);

        var projects = db.collection("projects");
        projects.insertOne(venture, function(err, result){
                console.log("I passed here");
                res.render("initiationPageM",{project:result, user:"manager", approval:""});
        });
    });
});

router.get("/initiationPage", function(req,res){
    MongoClient.connect(url, function(err, client){
            var db = client.db(dbName);

            var endevours = db.collection("projects");

            endevours.findOne({"id":req.cookies.projectId}, function(err, result){
                console.log("THE ID IS");
                console.log(req.cookies.projectId);

                var approval = "";
                if(result.managerId == ""){
                    approval = "";
                }else if(result.managerId == res.cookie.userId){
                    approval = "positive";
                }

                if(level == "executive"){
                    if(approval == ""){

                        var potentials = db.collection("employees");
                        employees.find({"level":"management"}).toArray(function(err,result){
                            if(err){console.log(err);} else{
                                res.render("initiationPageE",{approval:"", choices:"result"});
                            }
                        })
                    }else{

                        res.render("initiationPageE",{approval:"positive"});
                    }

                }else if(level == "manager"){

                    res.render("initiationPageM",{approval:approval});
                }
            });
    });
})

router.get("/project/:projId", function(req,res){
    var projectId = req.params.projId;
    console.log("THE PROJECT ID IS");
    console.log(projectId);

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client){

        if(err){
            console.log("THE DATABASE CONNECTION ERROR IS");
            console.log(err);
        }
        var db = client.db(dbName);

        var currentProject = db.collection("projects");

        currentProject.findOne({"id":projectId},function(err, result){

            console.log("THE RESULT IS");
            console.log(result);
            if(result.managerId == ""){
                approval = "";

                console.log("THE LEVEL IN THIS PAGE IS ");
                console.log(req.cookies.level);
                if(req.cookies.level == "executive"){
                    var potentials = db.collection("employees");

                    console.log(approval + "executive");

                    var employees = db.collection("employees");

                    employees.find({"level":"management"}).toArray(function(err,leaders){
                        if(err){console.log(err);} else{
                            console.log("THE LIST OF MANAGERS IS");
                            console.log(leaders);
                            res.render("initiationPageE",{approval:"", managers:leaders});
                        }
                    })
                }else{

                    console.log(approval + "management");
                    res.render("initiationPageM",{approval:approval});
                }
            }else if(result.managerId == res.cookie.userId){
                approval = "positive";

                if(req.cookies.level== "executive"){
                    res.render("initiationPageE",{approval:"positive"});
                }else{
                    res.render("initiationPageM",{approval:approval});
                }
            }

            // if(req.cookies.level == "executive"){
            //     if(approval == ""){

            //         console.log("THE SECOND IF STATEMENT");

            //         var potentials = db.collection("employees");
            //         employees.find({"level":"management"}).toArray(function(err,result){
            //             if(err){console.log(err);} else{
            //                 res.render("initiationPageE",{approval:"", choices:"result"});
            //             }
            //         })
            //     }else{

            //         res.render("initiationPageE",{approval:"positive"});
            //     }

            // }else if(req.cookies.level == "manager"){

            //     res.render("initiationPageM",{approval:approval});
            // }
        });
    });
});

module.exports = router;
