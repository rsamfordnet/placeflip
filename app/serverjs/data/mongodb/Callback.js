module.exports = 
    function(success, error, params)
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
    };