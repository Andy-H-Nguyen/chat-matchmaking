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
    
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to chat-matchmaking',
        timestamp: moment().valueOf()
    });
    
    // Disconnect Event Handler
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
    
    // Join Room Event Handler
    socket.on('joinRoom', function(req) {
        clientInfo[socket.id] = req;
        console.log(clientInfo);
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
           name: 'System',
           text: req.name + ' has joined the room!',
           timestamp: moment().valueOf()
        });
    });
    
    // Message Event Handler
    socket.on('message', function (message) {
        console.log("Message being broadcast: " + message.text);
        
        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);   
        } else {
            io.to(clientInfo[socket.id].room).emit("message", message); 
        }
    });
});

function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];
    
    if (typeof info === 'undefined') {
        return;
    }
    
    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];
        if (info.room == userInfo.room) {
            users.push(userInfo.name);   
        }
    });
    
    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(','),
        timestamp: moment().valueOf()
    });
}

http.listen(PORT, function() {
    console.log("Server starting on " + PORT);
});
