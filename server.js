var PORT = process.env.PORT;
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("User connected"); 
    
    socket.on('message', function (message) {
        console.log("Message being broadcast: " + message.text);
        
        socket.broadcast.emit("message", message);
    });
    
    socket.emit('message', {
        text: 'Welcome to chat-matchmaking'
    });
});

http.listen(PORT, function() {
    console.log("Server starting on " + PORT);
});
