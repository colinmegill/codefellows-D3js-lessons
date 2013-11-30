var path = require("path"),
    express = require("express");

var app = express()
            .use(express.static(__dirname));



var port = process.env.PORT || 3000;
app.listen(port);
console.log("Started server on port " + port);