var io;
var gameSocket;
var {generateCode} = require('./roomCode');
var codeArr = ["bitch"];

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */


 exports.initQuizzes = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', {message: "You are connected!" });

    // Host Events
    gameSocket.on('createNewQuiz', createNewQuiz);

    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('playerPushButton', playerPushButton);
    gameSocket.on('enableBuzzer', hostEnableBuzzer);
    gameSocket.on('disableBuzzer', hostDisableBuzzer);
    gameSocket.on('startTimer', hostStartTimer);
    gameSocket.on('stopTimer', hostStopTimer);
    gameSocket.on('checkRoomId', checkRoomId);
    gameSocket.on('newQuestion', sendPlayerQuestion);
    gameSocket.on('gameOver', notifyPlayersGameOver);

}

// CONNECT to Socket and emit 'createNewQuiz', it will return the socket id and the room code
function createNewQuiz() {

	var roomID = generateCode(codeArr);
	codeArr.push(roomID);
	console.log("room created " + roomID);

	this.emit('quizCreated', {roomId: roomID, mySocketId: this.id});
	this.join(roomID);
}

function playerJoinGame(data,fn) {
    console.log('Player ' + data.playerName + ' attempting to join game: ' + data.roomId );

    // A reference to the player's Socket.IO socket object
    var sock = this;

    // Look up the room ID in the Socket.IO manager object.
    //var room = gameSocket.rooms[data.gameId];

    // If the room exists...
    if(codeArr.includes(data.roomId)){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.roomId);

        //console.log('Player ' + data.playerName + ' joining game: ' + data.gameId );

        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.roomId).emit('playerJoinedRoom', data);
        //fn({valid:true});

    } else {
        // Otherwise, send an error message back to the player.
        // this.emit('error',{message: "This room does not exist."} );
        console.log("ROOM: " + data.roomId + " DOES NOT EXIST");
        fn({valid:false});
    }
}

function playerPushButton(data) {
    // console.log('Player ID: ' + data.playerId + ' answered a question with: ' + data.answer);

    // Emit an event with the answer so it can be checked by the 'Host'
    console.log("PLAYER PUSHED BUTTON");
    console.log("Player Name: " + data.playerName + " Room ID: " + data.roomId);
    io.sockets.in(data.roomId).emit('joinQuizQueue', data);
}

function hostEnableBuzzer (roomId){
    console.log("ENABLE BUZZER: " + roomId);
    io.sockets.in(roomId).emit('playerEnableBuzzer', "true");
}

function hostDisableBuzzer (roomId){
    console.log("Disable BUZZER: " + roomId);
    io.sockets.in(roomId).emit('playerDisableBuzzer', "true");
}

function hostStartTimer (roomId){
    console.log("Start Timer: " + roomId);
    io.sockets.in(roomId).emit('playerStartTimer', "true");
}

function hostStopTimer (roomId){
    console.log("Stop Timer: " + roomId);
    io.sockets.in(roomId).emit('playerStopTimer', "true");
}

function checkRoomId(data, fn){
    if(codeArr.includes(data.roomId)){

        fn({valid:true});
    }else{
        fn({valid:false});
    }

}

function sendPlayerQuestion(roomId, question){
    io.sockets.in(roomId).emit('newQuestion', question);
}

function notifyPlayersGameOver (roomId, playerName, points){
    io.sockets.in(roomId).emit('gameOver' + playerName, points);
}







