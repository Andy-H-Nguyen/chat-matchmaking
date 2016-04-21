$( document ).ready(function() {
   var name = getQueryVariable('name');
   var room = getComputedStyle('room')
   var socket = io();
   
   console.log(name + ' is requesting to join room ' + room);
   
   socket.on('connect' , function() {
      console.log('Connected to server'); 
   });
   
   socket.on('message', function(message) {
      var timestamp = moment.utc(message.timestamp);
      console.log('New message:');
      console.log(message.text);
      jQuery('.messages').append('<p><strong>' + timestamp.local().format('h:mma') + '</strong>'+ ' ' + message.text + '</p>');
   });
   
   // Insert Code To Handle Messages
   var $form = jQuery('#message-form');
   
   $form.on('submit', function(event) {
      event.preventDefault();
      var chatText = $form.find('input[name=message]').val();
      socket.emit('message', {
         text: chatText
      });
      $form.find('input[name=message]').val('');
   });
});