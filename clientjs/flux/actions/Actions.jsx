var $          = require('jQuery');
var Dispatcher = require('../dispatcher/Dispatcher.jsx');
var Constants  = require('../constants/Constants.jsx');

var socket = window.io();
socket.emit('chat-start', 'hello');

const Actions = {
    sendMessage : function(message, sendThroughSocket)
    {
        if (sendThroughSocket)
            socket.emit('chat-message', message);
        
        Dispatcher.dispatch(
            { 
                actionType : Constants.SENDMESSAGE_EVENT,
                message    : message
            }
        );
    }
};

/* --- */
socket.on(
    'chat-message', 
    function(data) 
    {
        Actions.sendMessage(data, false);
    }
);


module.exports = Actions;