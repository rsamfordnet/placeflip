module.exports = function(e)
{
    var message  = e.args;
    var roomName = message.roomName;
    var userName = message.userName;
    
    e.context.userSockets[e.caller.id] = 
        {   
            userName : userName, 
            roomName : roomName 
        };
    
    e.socket.broadcast.in(roomName).emit('chat-join', message)
    
    console.log(userName + ' joined to ' + roomName);
    e.socket.join(roomName);
}