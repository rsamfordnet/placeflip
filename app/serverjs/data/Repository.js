/* object  */ const mongodb        = require('mongodb');
/* object  */ const config         = require('../config/db.js');
/* class   */ const UserRepository = require('./mongodb/UserRepository.js')

/* public class */ function Repository(/* Callback */ ready)
{
    /* Properties --> */
    /* @Instance               */ var instance    = this;
    /* private MongoClient     */ var mongoClient = mongodb.MongoClient;     
    /* private string          */ var url         = config.url;
    /* public  UserRepository  */ this.users      = null;
    /* <-- */

    /* constructor */
    (
        function constructor()
        {
            /* Connects to MongoDB */
            mongoClient.connect(
                url, 
                function(err, mdb) 
                {   
                    
                    if (err)
                    {
                        console.log("There was an error connecting to MongoDB");
                    }
                    else
                    {
                        initializeMongoDbRepositories(mdb);
                        if (ready)
                            ready();
                        console.log("Connected correctly to server");
                    }               
                }
            );

        }
    )();
    
    /* private */ function initializeMongoDbRepositories(connection)
    {
        instance.users = new UserRepository(connection);
        console.log("MongoDb - User Repository initialized.");
    }
}
// =>
module.exports = Repository;