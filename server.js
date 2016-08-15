//////////////////////////////////////////////////////////
//                      Requires                        //
//////////////////////////////////////////////////////////
var bodyParser      = require("body-parser");
var express         = require("express");
var path            = require("path");
var app             = express();

//adding database
var pg = require('pg');


pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
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
