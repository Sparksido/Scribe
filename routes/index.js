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
                projects.find({"approvalStatus":"sponsored"}).toArray(function(err, tasks){
                    if(err){
                        console.log("err");
                    }else{

                        res.cookie("level",result.level);
                        console.log("THE LEVEL THAT WAS SIGNED UP IS");
                        console.log(result.level);
                        res.cookie("userId",result.id);

                        projects.find({"approvalStatus":"pending"}).toArray(function(error, result2){
                            res.render("homepage2",{currentTasks:tasks, pendingTasks:result2});
                        });

                        // projects.find({"approvalStatus":"pending"}).toArray(funtion(error, result1){
                        //     if(error){

                        //     }
                        // });
                            //proposals.find({"approvalStatus":"sponsored"}, function(err,result2){
                                // res.render("homepage",{currentProjects:tasks, pendingProjects:result1});
                            //});
                        // });
                        // 
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
    venture["approvalStatus"] = "pending";
    res.cookie("projectId", venture["id"]);

    var processs = {};

    processes = [{
        "stage":"Initiating Process",
        "status":"current",
        "projectId":venture["id"]
    },{
        "stage":"Plannign Process",
        "status":"future",
        "projectId":venture["id"]
    },{
        "stage":"Executing Process",
        "status":"future",
        "projectId":venture["id"]
    },{
        "stage":"Monitoring and Controlling Process",
        "status":"future",
        "projectId":venture["id"]
    },{
        "stage":"Closing Process",
        "status":"future",
        "projectId":venture["id"]
    }];

    var subProcesses = [{
        "name":"Develop Project Charter",
        "projectId":venture["id"],
        "processId":"11111111",
        "status":"future"
    },{
        "name":"Identify Stakeholders",
        "projectId":venture["id"],
        "processId":"22222222",
        "status":"future"
    },{
        "name":"Create and Set up Project Environment",
        "projectId":venture["id"],
        "processId":"33333333",
        "status":"future"
    },{
        "name":"Report and Review Performance",
        "projectId":venture["id"],
        "processId":"44444444",
        "status":"future"
    }];

    MongoClient.connect(url, function(err, client){
        var db = client.db(dbName);

        var projects = db.collection("projects");
        projects.insertOne(venture, function(err, result){
            console.log("I passed here");

            var processList = db.collection("processes");
            processList.insertMany(processes, function(err, result3){

                if(err){
                    console.log("THERE IS AN ERROR");
                    console.log(err);
                }else{  
                    var subProcessList = db.collection("subProcesses");
                    subProcessList.insertMany(subProcesses,function(err, result3){
                        //res.render("initiationPageM",{project:result, user:"manager", approval:""});

                        projects.find({"approvalStatus":"sponsored"}).toArray(function(err, tasks){
                            if(err){
                                console.log("err");
                            }else{

                                res.cookie("level",result.level);
                                console.log("THE LEVEL THAT WAS SIGNED UP IS");
                                console.log(result.level);
                                res.cookie("userId",result.id);

                                projects.find({"approvalStatus":"pending"}).toArray(function(error, result2){
                                    res.render("homepage2",{currentTasks:tasks, pendingTasks:result2});
                                });
                            }
                        });
                    })  
                }
            })
        });
    });
});

router.get("/projectAprover/:projId", function(req, res){
    var projectId = req.params.projId;

    MongoClient.connect(url, function(err, client){
        var db = client.db(dbName);

        var projects = db.collection("projects");
        projects.updateOne({"id":projectId}, {$set:{"approvalStatus":"sponsored"}});
        console.log("THE ID OF PROJECT BEING APPROVED IS ");
        console.log(projectId);

        projects.findOne({"id":projectId}, { useNewUrlParser: true}, function(error, result){
            var charterObj = {};
            charterObj["projectName"] = result["name"];
            charterObj["projectOwner"] = result["owner"];
            charterObj["projectSponsor"] = result["sponsor"];
            charterObj["projectManager"] = result[""];
            charterObj["projectId"] = projectId;
            charterObj["startDate"] = result["startDate"];
            charterObj["endDate"] = result["endDate"];

            var charters = db.collection("charters");
            charters.insertOne(charterObj, function(fault, outcome){
                res.cookie("projectId",projectId);
                res.render("processes",{identifier:projectId});
            });
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
                console.log("THE APPROVAL IS " + approval);
            }else if(result.managerId == res.cookie.userId){
                approval = "positive";
                 console.log("THE APPROVAL IS " + approval);
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

router.get("/potentialProject/:projId", function(req,res){
    var projectId = req.params.projId;

    MongoClient.connect(url, function(err, client){
        var db = client.db(dbName);

        var projects = db.collection("projects");
        projects.findOne({"id":projectId}, { useNewUrlParser: true }, function(err, result){
            console.log("THE PROJECT ID IS " + projectId);
            console.log("THE PROJECT FOUND IS ");
            console.log(result);
            res.render("potentialProject", {potentialProject:result});
        });
    });
})

router.get("/projectHome/:projId", function(req,res){
    var projectId = req.params.projId;
    res.cookie("projectId", projectId);
    res.render("processes",{identifier:projectId});
});

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

            // IF STAGE CLICKED IS INITIATING PROCESSES
            console.log("THE MANAGER ID IS: ");
            console.log(result.managerId);
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
                            res.render("initiationPageE",{approval:"", managers:leaders, project:projectId});
                        }
                    })
                }else{

                    console.log(approval + "management");
                    res.render("initiationPageM",{approval:approval});
                }
            }else {
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

router.get("/insertManager/", function(req, res){
    var managerId = req.param("manId");
    var projectId = req.param("projId");

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client){
        var db = client.db(dbName);

        
        var emploji = db.collection("employees");
        emploji.findOne({"id":managerId}, function(fault, result){
            var projects = db.collection("projects");
            projects.updateOne({"id":projectId},{$set:{"managerId":managerId, "managerName":result["name"]}});
            res.render("initiationPageE",{approval:"positive", project:projectId});
        })
    });
})

//ALL SUBSTAGES UNDER INITIATION PROCESSES
router.get("/projectCharter", function(req,res){
    MongoClient.connect(url, { useNewUrlParser: true}, function(err, client){
        var db = client.db(dbName);

        var charters = db.collection("charters");
        charters.findOne({"projectId":req.cookies.projectId}, function(err, result){
            console.log("THE CHARTER SEARCH RESULT IS");
            console.log(result);
            console.log(req.cookies.projectId);

            var messages = db.collection("messages");
            messages.find({"projectId":req.cookies.projectId}).toArray(function(fault,outcome){

                //if they are a manager open the project charter page for managers
                if(req.cookies.level == "management"){
                    console.log("I CAME IN HERE");
                    res.render("projectCharterM",{result:result, messages:outcome});

                //if they are an exec, open the project charter for execs
                }else{ 
                    res.render("projectCharterE",{result:result});
                } 
            });

                
        })         
    })  
});

router.get("/updateBody/:projId",function(req,res){

});

router.post("/projectCharterAcceptor",function(req,res){
    console.log("THE REQUEST BODY IS");
    console.log(req.body);

    var recordedCharter = {};
    recordedCharter = req.body;
    recordedCharter["projectId"] = req.cookies.projectId;

    MongoClient.connect(url, { useNewUrlParser:true }, function(err, client){
        var db = client.db(dbName);

        var charters = db.collection("charters");
        charters.insertOne(req.body, function(err,outcome){
            var results = [req.body];
            res.render("projectCharterM", {result:results}); 
        });
    })
});

router.post("/feedback", function(req,res){
    MongoClient.connect(url, { useNewUrlParser: true}, function(err, client){
        var db = client.db(dbName);

        console.log(req.body);

        var messages = db.collection("messages");
        var chartFeedback = {};
        chartFeedback["message"] = req.body.feedback;
        chartFeedback["projectId"] = req.body.id;
        chartFeedback["sender"] = req.cookies.userId;

        //insert the message into the messages collection
        messages.insertOne(chartFeedback, function(fault, outcome){

            //fetch the project again
            var charters = db.collection("charters");
            charters.findOne({"projectId":req.cookies.projectId}, function(err, result){
                console.log("THE CHARTER SEARCH RESULT IS");
                console.log(result);
                console.log(req.cookies.projectId);

                results = {};

                if(result != null){ // if a project charter exists, save the results
                    results = [result];
                }else{              // if one doesn't exist, save an empty array
                    results = [];
                }

                //if they are a manager open the project charter page for managers
                if(req.cookies.level == "management"){

                    res.render("projectCharterM",{result:result});

                //if they are an exec, open the project charter for execs
                }else{ 
                    res.render("projectCharterE",{result:result});
                }    
            })
        })         
    })  
});

module.exports = router;
