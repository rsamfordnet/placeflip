/* namespace */ const Observable = require('observables');
/* namespace */ const Events     = require('events');
/* class */     const Room       = require('./Room.js');
/* class */     const Message    = require('./Message.js');
/* class */     const User       = require('./User.js');
/* object */    const global     = require('./Global.js');
/* object */    const session    = require('./Session.js');
/* object */    const ajax       = require('ajax');

/* class */ Chat.prototype =
/* inherits from */ Events.EventEmitter.prototype;
function Chat()
{
	/* base */ Events.EventEmitter.call(this);
    
    /* this -> */
	var instance = this;
    
    /* Properties --> */
    /* public Observable.Dictionary<Room> */ this.joinedRooms    = new Observable.Dictionary(Room);
    /* public Observable.Dictionary<Room> */ this.availableRooms = new Observable.Dictionary(Room);
    /* public Room                        */ this.currentRoom    = null;
    /* public Socket                      */ this.socket         = null;
    /* <-- */
    
    /* Methods --> */
    
    /* public void [emits->onJoin, onMessage] */ 
    this.start = function()
    {
        var socket = window.io();
         
        socket.emit('chat-start', session.name);
        
        
        socket.on(
            'chat-join', 
            function(data) 
            {
                var room = instance.availableRooms[data.roomName];
                if (room == null)
                    return; /* The room is not available. */
                var user = new User(data.userName);
                room.addUser(user);

                instance.emit('onJoin', user);
            }
        );
        
        socket.on(
            'chat-message', 
            function(data) 
            {
                console.log("chat-message:" + data);
                
                /* Creates message */
                var message = new Message(data.text, data.userName);
                
                /* Brokes the message to the right room. */
                var room = instance.joinedRooms[data.roomName];
                room.messages.add(message);
                
                /* Notifies the message only if the selected room is open. */
                if (instance.currentRoom.roomName == data.roomName)
                    instance.emit('onMessage', message);    
            }
        );

        socket.on(
            'chat-typing', 
            function(data){
                instance.emit('onTyping', data)
            }
        );
        
        socket.on(
            'chat-leave', 
            function(userName)
            {
                instance
                    .availableRooms
                    .forEach(
                        function(room){
                            room.removeUser(userName);
                        }
                    );                

                instance.emit('onLeave', userName);
            }
        );
        
        
        global.socket = socket;
    };
    
    /* public void [emits->onRoomsAvailable] */ 
    this.findAvailableRooms = function()
    {
        this.availableRooms.add("Fun Jokes", new Room("Fun Jokes"));
        this.availableRooms.add("Tech Stuff", new Room("Tech Stuff"));
        
        this.emit('onRoomsAvailable');
    };
    
    /* public void [emits->onShowRoom] */
    this.switchRoom = function(roomName)
    {
        this.currentRoom = this.joinedRooms[roomName];
        
        ajax.get(
            '/chatrooms/' + roomName, 
            {}, 
            function(users){
                /* Overrides the users with whatever is in the server. */
                instance.currentRoom.users.clear();

                /* Loads connected users from server. */
                for (var i in users)
                {
                    var userName = users[i];
                    if (userName == session.name)
                        continue;

                    instance.currentRoom.addUser(
                        new User(userName)
                    );
                }

                instance.emit('onShowRoom');
            }
        );
    };
    
    /* public void [emits->onMessageSent, onMessage] */ 
    this.sendMessage = function(text, userName)
    {
        if (this.currentRoom == null)
        {
            this.emit('onError', 'Must select a room.');
            return;
        }
            
            
        var newMessage = new Message(text, userName);
        this.currentRoom.send(newMessage);
        
        this.emit('onMessageSent');
        this.emit('onMessage', newMessage);
    };

    /* public void [] */
    this.sendTyping = function(hastext)
    {
        if (this.currentRoom == null)
            return;

        this.currentRoom.sendTyping(hastext);
    };
    
    /* public void [emits->onShowRoom] */ 
    this.joinRoom = function(roomName)
    {
        this.joinedRooms.add(roomName, this.availableRooms[roomName]);
        this.switchRoom(roomName);
        this.currentRoom.join(roomName);
    }
    /* <-- */
}
//=>
module.exports = new Chat();