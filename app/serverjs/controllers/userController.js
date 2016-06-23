var Busboy = require('busboy');
var fs	 = require("fs");
var http = require('http');
var util = require('util');
var cloudinary = require("cloudinary");

cloudinary.config({ 
  cloud_name: 'hhrfxfead', 
  api_key: '256916526976278', 
  api_secret: 'dYmCplLTK0iBsb-9b2sQV3zgad4' 
});

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

		app.get("/pf/picture", 
			function(req, res){
				return res.render("picture");
			}
		);

		app.post("/pf/picture",
			function(req, res)
			{
				var busboy = new Busboy({ headers: req.headers });
				var stream = cloudinary.uploader.upload_stream(function(result) { console.log("FROM CLOUDINARY : " + util.inspect(result)); }, 
					{
						public_id : 'sample_id', 
						crop	  : 'limit',
						width     : 2000,
						height    : 2000,
						eager     : [
							{ 
								width: 200, 
								height: 200, 
								crop: 'thumb', 
								gravity: 'face',
								radius: 20, 
								effect: 'sepia' 
							},
							{ 
								width: 100, 
								height: 150, 
								crop: 'fit', 
								format: 'jpg' 
							}
						],                   
						tags      : ['profile']
					}      
  				);

				busboy.on(
					'file', 
					function(fieldname, file, filename, encoding, mimetype) 
					{
						console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

						file.on(
							'data', 
							function(data) 
							{
								console.log('File [' + fieldname + '] got ' + data.length + ' bytes');

								console.log('Writing to stream.');
								stream.write(data);
							}
						);

						file.on(
							'end', 
							function() 
							{
								console.log('File [' + fieldname + '] Finished');
								stream.end();
							}
						);
					}
				);

				busboy.on(
					'field', 
					function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) 
					{
						console.log('Field [' + fieldname + ']: value: ' + inspect(val));
					}
				);

				busboy.on(
					'finish', 
					function() 
					{
						console.log('Done parsing form!');
						res.writeHead(303, { Connection: 'close', Location: '/' });
						res.end();
					}
				);


				req.pipe(busboy);
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