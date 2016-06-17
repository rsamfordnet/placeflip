import Event from 'events'
import Chat  from './Chat.js'

class App extends Event.EventEmitter
{
    constructor()
    {
        super();

        this.chat = new Chat(this);

        /* Starts the chat. */
        this.chat.start();
        this.showAvailableRooms();
    }

    createRoom(roomName)
    {
        this.chat.createRoom(roomName);
    }

    sendMessage(message, sendThroughSocket)
    {
        this.chat.sendMessage(message.text, message.user);
    }

    sendTyping(data)
    {
        this.chat.sendTyping(data.hasText);
    }
    
    joinRoom(roomName)
    {
        this.chat.joinRoom(roomName);
    }
    
    showAvailableRooms()
    {
        this.chat.findAvailableRooms()
    }

    exitRoom(roomName)
    {
        this.chat.exitRoom(roomName);
    }
}

export default App;