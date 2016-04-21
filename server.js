var PORT = process.env.PORT;
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("User connected"); 
    
    socket.on('message', function (message) {
        console.log("Message being broadcast: " + message.text);
        
        io.emit("message", message);
    });
    
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to chat-matchmaking',
        timestamp: moment().valueOf()
    });
});

http.listen(PORT, function() {
    console.log("Server starting on " + PORT);
});
