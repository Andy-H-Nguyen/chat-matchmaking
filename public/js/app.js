$( document ).ready(function() {
   var name = getQueryVariable('name') || 'Anonymous';
   var room = getQueryVariable('room')
   var socket = io();
   
   console.log(name + ' is requesting to join room ' + room);
   jQuery('.room-title').text(room);
   
   // Connection Event Handler
   socket.on('connect' , function() {
      console.log('Connected to server'); 
      socket.emit('joinRoom', {
            name: name,
            room: room
         });
   });
   
   // Message Event Handler
   socket.on('message', function(message) {
      var timestamp = moment.utc(message.timestamp);
      var $messages = jQuery('.messages');
      $messages.append('<p><strong>' + message.name + ' ' + timestamp.local().format('h:mma') + ' ' + '</strong></p>');
      $messages.append('<p>' + message.text + '</p>');
      
   });
   
   // Form Submission Event Handler
   var $form = jQuery('#message-form');
   
   $form.on('submit', function(event) {
      event.preventDefault();
      var $chatText = $form.find('input[name=message]').val();
      socket.emit('message', {
         name: name,
         text: $chatText
      });
      $form.find('input[name=message]').val('');
   });
});