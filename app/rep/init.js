module.exports = 
{
    callback : function(success, error, params)
    {
        var mongoCallback = function(err, result)
        {
            if (err)
            {
                console.log("There was an error accessing the Mongo database.")
                if (error)
                    error(err);
            }   
            else
            {
                console.log("Mongo DB command complete.")
                if (success)
                    success();
            }
        };
        
        return mongoCallback;
    },
    
    
    create : function(url, mongoClient, connected, error)
    {
        var instance = this;
        
        mongoClient.connect(
            url, 
            function(err, mdb) 
            {   
                instance.mdb = mdb;
                
                if (err)
                {
                    console.log("There was an error connecting to MongoDB")
                    error(err);
                }
                else
                {
                    console.log("Connected correctly to server");
                    connected();
                }               
            }
        );
        
        return instance;
    }
}