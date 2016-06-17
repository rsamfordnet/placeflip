/* namespace */ import Observable from 'observables';
/* class */		import User    	  from './User.js';
/* class */ 	import Message    from './Message.js';
/* object */    import session    from './Session.js';
/* object */    import global     from './Global.js';
/* namespace */ import Events     from 'events';

class Room extends Events.EventEmitter
{
	constructor(roomName)
	{
		super();

		if (roomName == undefined)
			throw 'roomName cannot be undefined.';
		
		/* public Room 							 */ this.roomName 		= roomName;
		/* public Observable.Dictionary<User> 	 */ this.users    		= new Observable.Dictionary(User);
		/* public Observable.Collection<Message> */ this.messages 		= new Observable.Collection(Message);
		/* public bool							 */ this.isTyping 		= false;
		/* public bool							 */ this.selected 		= false;
		/* public bool							 */ this.joined   		= false;
		/* public int 							 */ this.unseenMessages = 0;
	}
	
	/* public void */
	addUser(/* User */ user )
	{
		this.users.add(user.userName, user);
	}

	addMessage( /* Message*/ message)
	{
		if (!this.selected)
			this.unseenMessages += 1;
		else
			this.unseenMessages = 0;

		this.messages.add(message);
		this.emit("onMessage", message);
	}

	show()
	{
		this.emit("onShow");
	}

	unselect()
	{
		this.emit("onUnselected");
	}

	/* public void */
	removeUser(/* string */ userName)
	{
		this.users.remove(userName);
	}

	/* public void */ 
	send(message)
	{
		if (!(message instanceof Message))
			throw 'Invalid message type';
            
        message.roomName = this.roomName;
        global.socket.emit('chat-message', message);

        this.sendTyping(false);
		this.messages.add(message);
	}

	sendExit()
	{
		this.isTyping = false;
		this.selected = false;
		this.joined   = false;
		
		global.socket.emit(
			'chat-exit', 
			{ 
				userName : session.name, 
				roomName : this.roomName 
			}
		);
	}

	/* public void */
	sendTyping(hasText)
	{
		if (!this.isTyping && hasText)
		{
			this.isTyping = true;

			global.socket.emit(
				'chat-typing', 
				{ 
					userName : session.name, 
					hasText  : true, 
					roomName : this.roomName 
				}
			);
		}

		if (this.isTyping && !hasText)
		{
			this.isTyping = false;

			global.socket.emit(
				'chat-typing', 
				{ 
					userName : session.name, 
					hasText  : false, 
					roomName : this.roomName 
				}
			);
		}
	}
    
    /* public void */ 
	sendJoin()
    {
        global.socket.emit(
			'chat-join', 
			{
				userName : session.name,
				roomName : this.roomName
			}
		);

		this.joined = true;
		this.unseenMessages = 0;
    }
}

/* public static Room */ Room.fromObject = function(obj)
{
	var room = new Room(obj.roomName);
	
	return room;
}

//=>
module.exports = Room;