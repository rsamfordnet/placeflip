/* namespace */ import Observable from 'observables';
/* namespace */ import Events     from 'events';
/* class */     import Room       from './Room.js';
/* class */     import Message    from './Message.js';
/* class */     import User       from './User.js';
/* object */    import global     from './Global.js';
/* object */    import session    from './Session.js';
/* object */    import ajax       from 'ajax';

/* class Chat.prototype = */
/* inherits from Events.EventEmitter.prototype; */
class Chat extends Events.EventEmitter
{
	/* base Events.EventEmitter.call(this); */
    constructor()
    {
        super();

        /* Properties --> */
        /* public Observable.Dictionary<Room> */ this.joinedRooms    = new Observable.Dictionary(Room);
        /* public Observable.Dictionary<Room> */ this.availableRooms = new Observable.Dictionary(Room);
        /* public Room                        */ this.currentRoom    = null;
        /* public Socket                      */ this.socket         = null;
        /* <-- */

        this.start();
    }
    
    /* Methods --> */
    /* public void [emits->onJoin, onMessage] */ 
    start()
    {
        var instance = this;
        var socket = window.io();
         
        socket.emit('chat-start', session.name);
        
        
        socket.on(
            'chat-join', 
            (data) =>  
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
            (data) => 
            {
                console.log("chat-message:" + data);
                
                /* Creates message */
                var message = new Message(data.text, data.userName);
                
                /* Brokes the message to the right room. */
                var room = instance.joinedRooms[data.roomName];
                room.addMessage(message);
                
                /* Notifies the message only if the selected room is open. */
                if (instance.currentRoom.roomName == data.roomName)
                {
                    instance.emit('onMessage', message);    
                }
            }
        );

        socket.on(
            'chat-typing', 
            (data) => {
                instance.emit('onTyping', data)
            }
        );
        
        socket.on(
            'chat-leave', 
            (userName) => {
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

    createRoom(roomName)
    {
        var instance = this;

        ajax.post("/rooms", 
            { roomName : roomName },
            () =>
            {
                instance.emit("onRoomCreated");
                instance.findAvailableRooms();
            }
        );
    }

    /* public async [emits->onShowRoom] */ 
    findAvailableRooms()
    {
        var instance = this;
        
        ajax.get('/rooms', 
            {}, 
            (rooms) => 
            {
                for (var index in rooms)
                {
                    var room = rooms[index];
                    instance
                        .availableRooms
                        .add(room.roomName, Room.fromObject(room));
                }
                instance.emit('onRoomsAvailable');
            }
        );
        /*
        this.availableRooms.add("Fun Jokes", new Room("Fun Jokes"));
        this.availableRooms.add("Tech Stuff", new Room("Tech Stuff"));
        */
    }
    
    /* public void [emits->onShowRoom] */
    switchRoom(roomName)
    {
        var instance = this;
        this.currentRoom = this.joinedRooms[roomName];
        
        ajax.get(
            '/chatrooms/' + roomName, 
            {}, 
            (users) => 
            {
                /* Overrides the users with whatever is in the server. */
                instance.currentRoom.users.clear();
                instance.joinedRooms.forEach((room) => { room.unselect(); })

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
                instance.currentRoom.show();
            }
        );
    }
    
    /* public void [emits->onMessageSent, onMessage] */ 
    sendMessage(text, userName)
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
    }

    /* public void [] */
    sendTyping(hastext)
    {
        if (this.currentRoom == null)
            return;

        this.currentRoom.sendTyping(hastext);
    }
    
    /* public void [emits->onShowRoom] */ 
    joinRoom(roomName)
    {
        this.joinedRooms.add(roomName, this.availableRooms[roomName]);
        this.switchRoom(roomName);
        this.currentRoom.sendJoin(roomName);
    }
    /* <-- */
}

export default Chat;