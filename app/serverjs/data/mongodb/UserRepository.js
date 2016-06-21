/* function */ const callback = require('./Callback.js');

/* class  */ function UserRepository(mdb)
{
    /* public void */ this.signUp = function(user, success, error)
    {
        mdb.collection("users").insertOne(
            user,
            callback(success, error)
        ); 
    }

    /* public void */ this.validate = function(email, password, success, error)
    {
        mdb.collection("users").findOne(
            { email : email }, 
            function(err, user){
                if (user && user.password == password)
                    success(user);
                else
                {
                    if (error)
                        error("User not found");
                }
                    
            }
        );
    }

    /* public void */ this.getUser = function(email, success, error)
    {
        mdb.collection("users").findOne(
            { email : email }, 
            function(err, user){
                if (err) error(err); else success(user);
            }
        );
    }
}

// =>
module.exports = UserRepository;