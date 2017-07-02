var express = require("express");
var app = express();

app.get("/", function(req, res){
    res.send("This will be the landing page");

});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Has Started!");
});


