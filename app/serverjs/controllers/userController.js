module.exports = {
	setup : function(app, repository, requireSession, userSockets)
	{
		var passport = requireSession.passport;
		
		app.get("/users/:userName",
			function(req, res)
			{
				repository.users.getUser(
					req.params.userName,
					function(user)
					{
						if (user)
						{
							user.password = null;
						}

						return res.send(user);
					}
				);
			} 
		);

		app.get("/users/addfriend/:userName", 
			requireSession,
			function(req, res)
			{
				console.log(req.user);
				repository.users.addFriend(
					req.user.email,
					req.params.userName,
					function()
					{
						return res.send({message : "Friend request sent."});
					}
				);
			}
		);

		app.get("/users/acceptfriend/:userName", 
			requireSession,
			function(req, res)
			{
				console.log(req.user);
				repository.users.acceptFriend(
					req.user.email,
					req.params.userName,
					function()
					{
						return res.send({message : "Friend request accepted."});
					}
				);
			}
		);
	}
};