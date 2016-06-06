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
	/* public Observable.Collection<User> 	 */ this.users    = new Observable.Collection(User);
	/* public Observable.Collection<Message> */ this.messages = new Observable.Collection(Message);

	/* public void */ 
	this.send = function(message)
	{
		if (!(message instanceof Message))
			throw 'Invalid message type';
            
        message.roomName = this.roomName;
        global.socket.emit('chat-message', message);

		this.messages.add(message);
	}
    
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
//=>
module.exports = Room;