var guid = require('./Guid.js');

/* class */ function Message(text, userName, roomName)
{
	/* public string */ this.id = guid(); 
	/* public string */ this.text = text;
	/* public string */ this.userName = userName;
    /* public string */ this.roomName = roomName; 
}
//=>
module.exports = Message;