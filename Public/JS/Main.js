//Initilize socket.io connection	
var socket = io(); 
	var i;
	
// GET the user's name and set it in the cookies
function setName()
	{	
		var name= Cookies.get('name');
		if (!name || name == null)
		{
			var name= window.prompt('What is you name?');
		    Cookies.set('name',name);
		}
		socket.emit('io:name',name);
		$('#messageBox').focus();
		
		return name;
} 

function getName(){
	return Cookies.get('name');
}

//Takes time as a parameter and convert it into the string
function getTime(timestamp)
{
	var t,h,m,s;
	t= new Date(timestamp);
	h=t.getHours();
	m=t.getMinutes();
	s=t.getSeconds();
	
	return String(h + ':' + m + ':' + s) ;
}	

//keeps latest message at the bottom of the screen
// http://stackoverflow.com/a/11910887/2870306

function scrollToBottom () {
    $(window).scrollTop($('#messages').height());
  }

  window.onresize = function () {
    scrollToBottom();
  };
  
  
 function rendermessage(msg){
	 var name=getName();
	 for (i in msg) {
			var msgs = name + ":" + msg[i];
			$('#messages').append($('<li>').text(msgs));
		}
 }
	/* Emit the message sended by the user */
	$('form').submit(function() {
		
	 // if input is empty or white space do not send message                                                   
	    if ($('#messageBox').val()
	    .match(/^[\s]*$/) !== null) {
	      $('#messageBox').val('');
	      $('#messageBox').attr('placeholder', 'please enter your message here');
	      $('#messageBox').focus();
	      return false;
	    }
	    //check of the name is set or not
	    if (!Cookies.get('name') || Cookies.get('name').length < 1
	    	      || Cookies.get('name') === 'null') {
	    	      getName();
	    	    } 
	    else{
		socket.emit('chat message', $('#messageBox').val());
		$('#messageBox').val('');
		 $('#messageBox').attr('placeholder', '');
	    }
		return false;
	});
	
	/* 
	 * showing all the messages
	 * poped from the redis
	 */	
	socket.on('all messages', function(Allreply) {	
		 scrollToBottom();
		$('#messages').empty();
		rendermessage(Allreply);
	});

	/*
	 * showing last inserted messages so that user need not to refresh the page
	 * every time the new message sended
	 */
	  /*var reply =JSON.parse(reply);  var name=reply.name ;*/
	
	socket.on('chat message', function(reply) {     
		 scrollToBottom();
		 rendermessage(reply);
	});
