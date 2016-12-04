module.exports = function(e)
{
    var message = e.args;
    e.socket.broadcast.in(message.roomName).emit('chat-message', message);
    console.log(message)
};