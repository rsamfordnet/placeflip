module.exports = {
	setup : function(app, repository, requireSession, userSockets)
	{
		var passport = requireSession.passport;
		
		app.get("/chatrooms/:roomName", requireSession,			   
			function(req, res, next)
			{
				var roomName = req.params.roomName;
				var users = [];
				var temp = {};

				for (socketId in userSockets)
				{
					temp[userSockets[socketId].userName] = userSockets[socketId];
				}

				for (userName in temp)
				{
					if (temp[userName].roomName == roomName)
						users.push(userName);
				}

				return res.send(users);
			}
		);

		app.post('/rooms', 
			function(req, res){
				repository.chat.createRoom(
					req.body,
					function()
					{
						res.sendStatus(200);
					}
				);
			}
		);

		app.get("/rooms", requireSession,			   
			function(req, res, next){
				repository.chat.getRooms(
					function(rooms)
					{
						return res.send(rooms);
					}
				);
			}
		);
	}
};