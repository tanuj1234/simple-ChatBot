/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hello and Welcome to Hogwarts...I am the all knowing Sorting Hat and I will decide if you are a budding wizard or just another filthy muggle."); //We start with the introduction;
  setTimeout(timedQuestion, 8000, socket,"Tell me your family name first..."); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Welcome to Hogwarts Dear ' + input;// output response
  waitTime =5000;
  question = 'So ' + input + ',which pet do you prefer - Owl or Cat?';			    	// load next question
  }
  else if (questionNum == 1) {
	if(input.toLowerCase() == 'owl'){
  		answer= "I will gift you Hedwig's cousin but we'll see."// output response
  		waitTime =5000;
  		question = "Tell me how many players are there in a Quidditch Team - 7 or 8?";			    	// load next question
  }
	else if(input.toLowerCase() == 'cat'){
		answer = "Oh Good Lord! Why do you want a Crookshanks?"
		waitTime = 5000;
		question = "Anyway, tell me how many players are there in a Quidditch team - 7 or 8?"
}
	//else { answer = 'Try Again.'; waitTime = 2000; questionNum == questionNum - 1 ;}
}
  else if (questionNum == 2) {
	if(input == '7'){
		 answer= "Ah! You've done your homework.";
 		 waitTime =5000;
 		 question = 'Choose your Sigil- Lion, Badger, Eagle, Snake';			    	// load next question
  }
	else if(input == '8'){
		answer = "You Filthy Mudblood....Avada Kedavra XD";
		waitTime = 0
		question = ''
		socket.emit('changeBG','red');
		socket.emit('changeFont','white');
}
}
  else if (questionNum == 3) {
  	if(input.toLowerCase() == 'lion'){answer = 'Gryffindor!';waitTime = 0; question = ''}
	else if(input.toLowerCase() == 'badger'){answer = 'Hufflepuff!';waitTime = 0; question = ''}
	else if(input.toLowerCase() == 'eagle'){answer = 'Ravenclaw!';waitTime = 0; question = ''}
	else if(input.toLowerCase() == 'snake'){answer = 'Slytherin!';waitTime = 0; question = ''}
	socket.emit('changeFont','white');
	socket.emit('changeBG','orange');
  }
 /* else if (questionNum == 4) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'Perfect!';
      waitTime =2000;
      question = 'Whats your favorite place?';
    }
    else if(input.toLowerCase()==='no'|| input===0){
        socket.emit('changeFont','white'); /// we really should look up the inverse of what we said befor.
        answer=''
        question='How about now?';
        waitTime =0;
        questionNum--; // Here we go back in the question number this can end up in a loop
    }else{
      answer=' I did not understand you. Can you please answer with simply with yes or no.'
      question='';
      questionNum--;
      waitTime =0;
    }
  // load next question
  }
  else{
    answer= 'I have nothing more to say!';// output response
    waitTime =0;
    question = '';
  }
*/

/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
