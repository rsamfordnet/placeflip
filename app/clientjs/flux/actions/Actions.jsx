var $          = require('jQuery');
var Dispatcher = require('../dispatcher/Dispatcher.jsx');
var Constants  = require('../constants/Constants.jsx');
var Chat       = require('../../object-model/Chat.js');

const Actions = {
    sendMessage : function(message, sendThroughSocket)
    {
        Chat.sendMessage(message.text, message.user);
        
        Dispatcher.dispatch(
            { 
                actionType : Constants.SENDMESSAGE_EVENT,
                message    : message
            }
        );
    },

    sendTyping : function(data)
    {
        Chat.sendTyping(data.hasText);
    },
    
    joinRoom : function(roomName)
    {
        Chat.joinRoom(roomName);
    },
    
    showAvailableRooms : function()
    {
        Chat.findAvailableRooms()
    }
};

module.exports = Actions;