router.post("/createProject", function(req,res){
    var name = req.body.name;
    var date = Date.Now();
    var stage = "initiation";

    var venture = {};
    venture["name"] = name;
    venture["date"] = date;
    venture["stage"] = stage;
    venture["id"] = idgen(8);

    MongoClient.connect(url, function(client){
        var db = client.db;

        var projects = db.collection("projects");
        projects.insert(venture, function(err, result){
                res.render("initiationPage",{project:result});
        });
    });
});
