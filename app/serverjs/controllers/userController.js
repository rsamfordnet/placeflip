module.exports = {
	setup : function(app, repository, requireSession, userSockets)
	{
		var passport = requireSession.passport;
		
		app.get("/users/:username",
			function(req, res)
			{
				if (req.params.username == "me")
				{
					if (!req.user)
						return res.send({ message : "unauthenticated"});

					console.log("Converting 'me' to " + req.user.email);
					req.params.username = req.user.email;
				}

				repository.users.getUser(
					req.params.username,
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

		app.get("/users/many/:usernames",
			function(req, res)
			{
				repository.users.getUsers(
					req.params.usernames.split(","),
					function(users)
					{
						console.log("/users/many/:usernames >>")
						console.log(users);

						return res.send(
							users.map(
								function(user)
								{
									user.password = null;
									return user;
								}
							)
						);
					}
				);
			} 
		);

		app.get("/users/addfriend/:username", 
			requireSession,
			function(req, res)
			{
				console.log(req.user);
				repository.users.addFriend(
					req.user.username,
					req.params.username,
					function()
					{
						return res.sendStatus(200);
					}
				);
			}
		);

		app.get("/users/acceptfriend/:username", 
			requireSession,
			function(req, res)
			{
				console.log(req.user);
				repository.users.acceptFriend(
					req.user.username,
					req.params.username,
					function()
					{
						return res.send(200);
					}
				);
			}
		);
	}
};