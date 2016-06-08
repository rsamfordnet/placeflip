/* namespace */ const Observable = require('observables');
/* class */		const User    	 = require('./User.js');
/* class */ 	const Message    = require('./Message.js');
/* object */    const session    = require('./Session.js');
/* object */    const global     = require('./Global.js');

/* class */ function Room(roomName)
{
	if (roomName == undefined)
		throw 'roomName cannot be undefined.';
		
    /* public Room 							 */ this.roomName = roomName;
	/* public Observable.Dictionary<User> 	 */ this.users    = new Observable.Dictionary(User);
	/* public Observable.Collection<Message> */ this.messages = new Observable.Collection(Message);
	/* public bool							 */ this.isTyping = false;

	/* public void */
	this.addUser = function(/* User */ user )
	{
		this.users.add(user.userName, user);
	};

	/* public void */
	this.removeUser = function(/* string */ userName)
	{
		this.users.remove(userName);
	};

	/* public void */ 
	this.send = function(message)
	{
		if (!(message instanceof Message))
			throw 'Invalid message type';
            
        message.roomName = this.roomName;
        global.socket.emit('chat-message', message);

        this.sendTyping(false);
		this.messages.add(message);
	};

	/* public void */
	this.sendTyping = function(hasText)
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
	};
    
    /* public void */ 
	this.join = function()
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