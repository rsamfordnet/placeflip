module.exports = {
	setup : function(app, repository, requireSession)
	{
		var passport = requireSession.passport;
		
		app.get("/hello", requireSession,			   
			function(request, response, next)
			{
				response.render('index');
			}
		);
		
		app.get("/welcome", 
			function(req, res){
				res.render("welcome");
			}
		);
		
		app.get("/signup", 
			function(req, res) {
				res.render("signup");
			}
		);
		
		app.get("/login", 
			function(req, res) {
				res.render("login");
			}
		);
		
		app.post("/login", 
			passport.authenticate(
				'local', 
				{ 
					successRedirect: '/',
                    failureRedirect: '/login'
				}
			)
		);
		
		app.post("/signup",
			function(req, res){
				console.log("Creating new account for : " + req.body.name);
				repository.users.signUp(
					req.body, 
					function(){
						res.redirect("welcome");
					}
				);
			}
		);

		app.get("/username",
			 function(req, res){
			 	res.render("username");
			 }
		 );

		app.post("/username",
			 function(req, res){
			 	/* Sets the username on the repository. */
			 	repository.users.setUsername(
			 		req.user.email, 
			 		req.body.username,
			 		function()
			 		{
			 			req.user.username = req.body.username;
			 			res.redirect(302, "/");
			 		}
		 		);
			 }
		 );
		
		app.get("/clean", 
			function(req, res)
			{
				repository.users.setUsername("joseangel.yanez@gmail.com", null, function(){});
				repository.users.setUsername("test@test.com", null, function(){});

				return res.sendStatus(200);
			}
		);

		app.get(['/', "/home"], requireSession,
			function(req, res)
			{
				

				if (req.user.username == null)
					return res.redirect("username");

				console.log("Incoming user: " + req.user.name);

				repository.users.getUser(
					req.user.email, 
					function(fullUser)
					{
						res.render(
							'index', 
							{ 
								data   : 
								{ 
									user     : fullUser,
									userJson : JSON.stringify(fullUser)
								}, 
								layout : false
							}
						);
					}, 
					function(error)
					{
						console.log(error);
					}
				);
				
			}
		);
	}
};