module.exports = {
	setup : function(app, repository, passport, requiredSession)
	{
		app.get("/teams", 
            function(req, res){
                repository.mdb.collection("teams").find().toArray(
                    function(error, teams)
                    {
                        console.log(teams.length + " teams.");
                        res.send(teams);
                    }
                );
            }
        );

        app.post("/teams",
            function(req, res){
                repository.mdb.collection("teams").insertOne(
                    req.body, 
                    function(err, result)
                    {}
                );
            }
        );

        app.delete("/teams",
            function(req, res){
                repository.mdb.collection("teams").remove( { name : req.body.name } );
            }
        );
        
	}
};

