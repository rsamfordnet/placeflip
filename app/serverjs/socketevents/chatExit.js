module.exports = function(e)
{
    var room = e.args;

    var roomName = room.roomName;
    var userName = room.userName;
    
    var userSocket = e.context.userSockets[e.caller.id];
    e.socket.roomName = null;
    
    e.socket
        .broadcast
        .in(room.roomName)
        .emit('chat-leave', userSocket.userName);
    
    console.log(userName + ' left ' + roomName);
    e.socket.leave(roomName);
};