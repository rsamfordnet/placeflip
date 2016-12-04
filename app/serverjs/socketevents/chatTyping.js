module.exports = function(e)
{
    var data = e.args;
    
    socket.broadcast.in(data.roomName).emit('chat-typing', data);
    console.log(data);
}