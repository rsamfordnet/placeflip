/* namespace */ import Observable from 'observables';
/* class */		import User    	  from './User.js';
/* class */ 	import Message    from './Message.js';
/* object */    import session    from './Session.js';
/* object */    import global     from './Global.js';

class Room
{
	constructor(roomName)
	{
		if (roomName == undefined)
			throw 'roomName cannot be undefined.';
		
		/* public Room 							 */ this.roomName = roomName;
		/* public Observable.Dictionary<User> 	 */ this.users    = new Observable.Dictionary(User);
		/* public Observable.Collection<Message> */ this.messages = new Observable.Collection(Message);
		/* public bool							 */ this.isTyping = false;
		/* public bool							 */ this.selected = false;
	}
	
	/* public void */
	addUser(/* User */ user )
	{
		this.users.add(user.userName, user);
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
    }
}

/* public static Room */ Room.fromObject = function(obj)
{
	var room = new Room(obj.roomName);
	
	return room;
}

//=>
module.exports = Room;