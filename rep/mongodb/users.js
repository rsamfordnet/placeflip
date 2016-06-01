module.exports = {
    in : function(repository){
        repository.users = {
            
            /* Creates a new user in MongoDB. */
            signUp : function(user, success, error)
            {
                repository.mdb.collection("users").insertOne(
                    user,
                    repository.callback(success, error)
                ); 
            },
            
            validate : function(email, password, success, error)
            {
                repository.mdb.collection("users").findOne(
                    { email : email }, 
                    function(err, user){
                        if (user && user.password == password)
                            success(user);
                        else
                        {
                            if (error)
                                error("user not found");
                        }
                            
                    }
                );
            }
        };
    }
};
