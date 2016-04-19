$( document ).ready(function() {
   var socket = io();
   var now = moment();
   
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