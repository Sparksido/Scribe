function("/initiationPage", function(req,res){
    if(level == "executive"){
        res.render("initiationPageE",{});
    }else if(level == "manager"){
        res.render("initiationPageM",{})
}
}
})