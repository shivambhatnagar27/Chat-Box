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
function getTime()
{
	var t,h,m,s;
	t= new Date();
	h=addZero(t.getHours());
	m=addZero(t.getMinutes());	
	s=addZero(t.getSeconds());
	return String(h + ':' + m + ":" + s) ;
}

// add the zero before the number if number is less than 10
function addZero (number) {
return (number < 10) ? '0' + number : number;
}	


//keeps latest message at the bottom of the screen
function scrollToBottom () {
    $(window).scrollTop($('#messages').height());
  }

  window.onresize = function () {
    scrollToBottom();
  };
  
  
 function rendermessage(data){
	 for (i in data) { 
	 	    var obj=JSON.parse(data[i]);
	 	    var name=obj.name;
	 	    var msg= obj.message;
	 	    var time=obj.time;
	 	    if(name == null){
               name = "Anonymous";
	 	    }
//generating the html for render the messages
var html = '<li class=\'row\'>';
    html += '<span class=\'name\'>' + name + ': </span>';
    html += '<span class=\'msg\'>' + msg + '</span>';
    html += '<small class=\'time\ pull-right\'>' + time + ' </small>';
    html += '</li>';
 
			$('#messages').append(html);
			

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
		var msg=$('#messageBox').val();
		socket.emit('chat message', {msg:msg,name:getName(),time:getTime()});
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
