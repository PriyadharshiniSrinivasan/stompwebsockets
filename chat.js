$(document).ready(function(){

  var client, destination_send, destination_subscribe;

  $('#connect_form').submit(function() {
    var url = $("#connect_url").val();
    var login = $("#connect_login").val();
    var passcode = $("#connect_passcode").val();
    destination_send = $("#destination_send").val();
	destination_subscribe = $("#destination_subscribe").val();
	var ws = new SockJS(url);
	client = Stomp.over(ws)
    //client = Stomp.client(url);

    // this allows to display debug logs directly on the web page
    debug = function(str) {
      $("#debug").append(str + "\n");
    };
    client.debug = debug;

    // the client is notified when it is connected to the server.
    var onconnect = function(frame) {
      debug("connected to Stomp");
      $('#connect').fadeOut({ duration: 'fast' });
      $('#disconnect').fadeIn();
      $('#send_form_input').removeAttr('disabled');
      
      client.subscribe(destination_subscribe, function(message) {
        $("#messages").append("<p>" + message.body + "</p>\n");
      });
    };
    client.connect(login, passcode, onconnect);

    return false;
  });
  
  $('#disconnect_form').submit(function() {
    client.disconnect(function() {
      $('#disconnect').fadeOut({ duration: 'fast' });
      $('#connect').fadeIn();
      $('#send_form_input').addAttr('disabled');
    });
    return false;
  });
   
  $('#send_form').submit(function() {
    var text = $('#send_form_input').val();
    if (text) {
      client.send(destination_send, {foo: 1}, text);
      $('#send_form_input').val("");
    }
	
    return false;
  });
  
});