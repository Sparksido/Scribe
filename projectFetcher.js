router.get("/home",function(req,res){
    MongoClient.connect(url,function(err,client){
        var db = client.db(dbName);
        
        var proposals = db.collection("projects");
        proposals.find({"approvalStatus":"pending"}, funtion(err, result1){
            proposals.find();//({"approvalStatus":"sponsored"}, function(err,result2){});
                // res.render("homepage",{currentProjects:result2, pendingProjects:result1});
            // });
        });
    })
})