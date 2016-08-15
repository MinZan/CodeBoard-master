//////////////////////////////////////////////////////////
//                      Requires                        //
//////////////////////////////////////////////////////////
var bodyParser      = require("body-parser");
var express         = require("express");
var path            = require("path");
var app             = express();

//adding database
var pg = require('pg');
var connectionString = "postgres://eezahufkhcehvb:4kBzebQt7dw8BnRQ9Gcy8BT8zz@ec2-23-21-238-76.compute-1.amazonaws.com:5432/d84hah6pkjcarf"

pg.connect(connectionString, function(err, client, done) {
   client.query('SELECT * FROM your_table', function(err, result) {
      done();
      if(err) return console.error(err);
      console.log(result.rows);
   });
});




//Body Parser && Static Folder
app.use(bodyParser.json());
app.use(express.static(__dirname + "/client/static"));

//Routes require
// require('./server/config/mongoose.js');
require('./server/config/routes.js')(app)

////////////////////////////////////////////////////////////
//                     Listen to Port                     //
////////////////////////////////////////////////////////////
var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
    console.log("Hey, Listen! (ROOOOM "+port+")");
})
////////////////////////////////////////////////////////////
//                         Socket                         //
////////////////////////////////////////////////////////////
var io  =   require('socket.io').listen(server);
            require('./server/config/socket.js')(io);
	
var facebook = require('./facebook.js');	
facebook.getFbData('USER_ACCESS_TOKEN', '/me/friends', function(data){
    console.log(data);
});
