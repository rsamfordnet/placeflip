module.exports = function(e)
{
    var userSocket = e.context.userSockets[e.caller.id];
    if (userSocket == undefined)
        return;
        
    console.log(userSocket.userName + ' is offline.');
    
    e.socket
        .broadcast
        .in(userSocket.roomName)
        .emit('chat-leave', userSocket.userName);
    
    delete e.context.userSockets[e.caller.id];
}