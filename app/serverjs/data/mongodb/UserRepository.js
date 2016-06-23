/* function */ const callback = require('./Callback.js');
/* object */ const _ = require("underscore");

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

    this.setUsername = function(email, username, success, error)
    {
        mdb.collection("users").findOne(
            { email : email },
            function(err, user)
            {
                user.username = username;
                mdb.collection("users").update(
                    { _id : user._id}, 
                    user
                );

                if (err) return error();

                success();
            }
        );
    }

    /* public void */ this.addFriend = function(invitingUsername, invitedUsername, success, error)
    {
        console.log("_-_-_-_");

        mdb.collection("users").findOne(
            { username : invitingUsername }, 
            function(err, invitingUser){
                console.log("Begin updating inviting user " + invitingUsername);

                if (err) return error(err); 

                console.log(invitingUser);

                if (!invitingUser)
                    throw 'User not found';

                if (!invitingUser.sentFriendRequests)
                    invitingUser.sentFriendRequests = new Array();

                var sentFriendRequest = _.findWhere(
                        invitingUser.sentFriendRequests,
                        {
                            username : invitedUsername
                        }
                    );

                if (!sentFriendRequest)
                    invitingUser.sentFriendRequests.push(
                            {
                                username : invitedUsername,
                                status   : "P"
                            }
                        );

                mdb.collection("users").update(
                    { _id : invitingUser._id}, 
                    invitingUser
                );

                console.log("Inviting user is updated.");

                mdb.collection("users").findOne(
                    { username : invitedUsername }, 
                    function(err, invitedUser){
                        console.log("Updating invited user: " + invitedUsername );

                        if (!invitedUser)
                            throw "Invited user not found";

                        if (!invitedUser.receivedFriendRequests)
                            invitedUser.receivedFriendRequests = new Array();

                        var receivedFriendRequest = _.findWhere(
                            invitedUser.receivedFriendRequests,
                            {
                                username : invitedUsername
                            }
                        );

                        if (!receivedFriendRequest)
                            invitedUser.receivedFriendRequests.push(
                                    {
                                        username : invitingUsername,
                                        status : "P"
                                    }
                                );

                        mdb.collection("users").update(
                            { _id : invitedUser._id}, 
                            invitedUser
                        );

                        console.log("Invited user is updated.");
                    }
                );
            }
        );
    }


    /* public void */ this.acceptFriend = function(invitedUsername, invitingUsername, success, error)
    {
        console.log("_-_-_-_");

        mdb.collection("users").findOne(
            { 
                username : invitingUsername
            }, 
            function(err1, invitingUser){
                console.log("Begin updating inviting user " + invitingUsername);

                if (err1) return error(err1); 

                console.log(invitingUser);

                if (!invitingUser)
                    throw 'Inviting user not found';

                if (!invitingUser.sentFriendRequests)
                    throw 'Nothing to mark as accepted';

                var sentFriendRequest = _.findWhere(
                        invitingUser.sentFriendRequests,
                        {
                            username : invitedUsername
                        }
                    );

                if (!sentFriendRequest)
                    throw "There isn't any invitation sent to that user (" + invitedUsername + ")."

                sentFriendRequest.status = "A";

                if (!invitingUser.friends)
                    invitingUser.friends = new Array();

                if (!_.findWhere(
                            invitingUser.friends,
                            {
                                username : invitedUsername
                            }
                        )
                    )
                    invitingUser.friends.push(
                            {
                                username : invitedUsername
                            }
                        );

                mdb.collection("users").update(
                    { _id : invitingUser._id}, 
                    invitingUser
                );

                console.log("Inviting user is updated.");

                mdb.collection("users").findOne(
                    { 
                        username : invitedUsername
                    }, 
                    function(err2, invitedUser)
                    {
                        console.log( "Updating invited user: " + invitedUsername );
                        console.log(invitedUser);

                        if (err2) return error(err2); 

                        if (!invitedUser)
                            throw "Invited user not found";

                        if (!invitedUser.receivedFriendRequests)
                            invitedUser.receivedFriendRequests = new Array();

                        var receivedFriendRequest = _.findWhere(
                            invitedUser.receivedFriendRequests, 
                            { 
                                username : invitingUsername
                            }
                        );

                        console.log(
                            {
                                array : invitedUser.receivedFriendRequests, username: invitingUsername
                            }
                        );

                        if (!receivedFriendRequest)
                            throw 'No friend request received';

                        receivedFriendRequest.status = "A";

                        if (!invitedUser.friends)
                            invitedUser.friends = new Array();

                        if (!_.findWhere(
                                    invitedUser.friends,
                                    {
                                        username : invitedUsername
                                    }
                                )
                            )
                            invitedUser.friends.push(
                                {
                                    username : invitingUsername
                                }
                            );

                        mdb.collection("users").update(
                            { _id : invitedUser._id}, 
                            invitedUser
                        );

                        console.log("Invited user is updated.");
                    }
                );
            }
        );
    }
}

// =>
module.exports = UserRepository;