var PORT = process.env.PORT;
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function (socket) {
    console.log("User connected");   
    socket.on('disconnect', function() {
        var userData = clientInfo[socket.id];
        if (typeof userData !== 'undefined') {
            socket.leave(clientInfo[socket.id]);
            io.to(userData.room).emit('message', {
               name: "System",
               text: userData.name + ' has left!',
               timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });
    
    socket.on('joinRoom', function(req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
           name: 'System',
           text: req.name + ' has joined the room!',
           timestamp: moment().valueOf()
        });
    });
    
    socket.on('message', function (message) {
        console.log("Message being broadcast: " + message.text);
        
        io.to(clientInfo[socket.id].room).emit("message", message);
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
