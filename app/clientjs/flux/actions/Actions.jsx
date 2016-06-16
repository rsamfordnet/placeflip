import $          from 'jQuery';
import Dispatcher from '../dispatcher/Dispatcher.jsx';
import Constants  from '../constants/Constants.jsx';
/* object */   const  chat = require('../../object-model/Chat.js');

class Actions 
{
    sendMessage(message, sendThroughSocket)
    {
        chat.sendMessage(message.text, message.user);
        
        Dispatcher.dispatch(
            { 
                actionType : Constants.SENDMESSAGE_EVENT,
                message    : message
            }
        );
    }

    sendTyping(data)
    {
        chat.sendTyping(data.hasText);
    }
    
    joinRoom(roomName)
    {
        chat.joinRoom(roomName);
    }
    
    showAvailableRooms()
    {
        chat.findAvailableRooms()
    }
};

// =>
export default new Actions();