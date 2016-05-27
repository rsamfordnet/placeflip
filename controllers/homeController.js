module.exports = {
	setup : function(app, repository, passport, requiredSession)
	{
		app.get("/hello", requiredSession,			   
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
					successRedirect: '/hello',
                    failureRedirect: '/login',
                    failureFlash: true 
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
	}
};