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
		
		app.get("/pf/picture", 
			requireSession,
			function(req, res){
				return res.render("picture");
			}
		);

		app.post("/pf/picture", 
			requireSession,
			function(req, res)
			{
				var busboy = new Busboy({ headers: req.headers });
				var stream = cloudinary.uploader.upload_stream(
					function(result) 
					{ 
						console.log("FROM CLOUDINARY : " + util.inspect(result)); 

						repository.users.setProfileImage(
							req.user.email,
							{
								large : result.url,
								small : result.eager[0].url
							},
							function()
							{
								if (!req.user.images)
									req.user.images = new Object();

								req.user.images.large = result.url;
								req.user.images.small = result.eager[0].url;
								
								console.log("Profile image updated to " + result.url);

								res.render("picture", req.user);
							}
						);
					}, 
					{
						public_id : 'sample_id', 
						crop	  : 'limit',
						width     : 300,
						height    : 500,
						eager     : [
							{ 
								width: 50, 
								height: 50, 
								crop: 'thumb', 
								gravity: 'face',
								format: 'jpg' 
							}
							/*
							{ 
								width: 100, 
								height: 150, 
								crop: 'fit', 
								format: 'jpg' 
							}
							*/
						],                   
						tags : ['profile']
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
						console.log('Busboy finished! Great job Busboy! :D');
					}
				);


				req.pipe(busboy);
			}
		);
	}
};