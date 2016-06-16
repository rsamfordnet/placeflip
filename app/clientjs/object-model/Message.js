import guid from './Guid.js';
 
class Message
{
	constructor(text, userName, roomName)
	{
		/* public string */ this.id = guid(); 
		/* public string */ this.text = text;
		/* public string */ this.userName = userName;
		/* public string */ this.roomName = roomName;
	}
}
//=>
export default Message;