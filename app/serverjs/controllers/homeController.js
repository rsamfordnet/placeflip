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
		
		app.get('/', requireSession,
			function(req, res)
			{
				console.log("Incoming user: " + req.user.name);
				res.render(
					'index', 
					{ 
						data   : req.user, 
						layout : false
					}
				);
			}
		);
	}
};