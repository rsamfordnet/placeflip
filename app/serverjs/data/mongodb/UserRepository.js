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

    /* public void */ this.addFriend = function(invitingUserId, invitedUserId, success, error)
    {
        mdb.collection("users").findOne(
            { email : invitingUserId }, 
            function(err, user){
                console.log("Begin updating user " + invitingUserId);

                if (err) return error(err); 

                console.log(user);

                if (!user)
                    throw 'User not found';

                if (!user.sentFriendRequests)
                    user.sentFriendRequests = new Array();

                if (user.sentFriendRequests.indexOf(invitedUserId) == -1)
                    user.sentFriendRequests.push(
                            {
                                userId : invitedUserId,
                                status   : "P"
                            }
                        );

                mdb.collection("users").update(
                    { _id : user._id}, 
                    user
                );

                console.log("Inviting user is updated.");

                mdb.collection("users").findOne(
                    { email : invitedUserId }, 
                    function(err, invitedUser){
                        console.log("Updating invited user: " + invitedUserId );

                        if (!invitedUser)
                            throw "Invited user not found";

                        if (!invitedUser.receivedFriendRequests)
                            invitedUser.receivedFriendRequests = new Array();

                        if (invitedUser.receivedFriendRequests.indexOf(invitedUserId) == -1)
                            invitedUser.receivedFriendRequests.push(
                                    {
                                        userId : invitingUserId,
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


    /* public void */ this.acceptFriend = function(invitedUserId, invitingUserId, success, error)
    {
        mdb.collection("users").findOne(
            { 
                email : invitingUserId 
            }, 
            function(err1, invitingUser){
                console.log("Begin updating inviting user " + invitingUserId);

                if (err1) return error(err1); 

                console.log(invitingUser);

                if (!invitingUser)
                    throw 'Inviting user not found';

                if (!invitingUser.sentFriendRequests)
                    throw 'Nothing to mark as accepted';

                var sentFriendRequest = _.findWhere(
                        invitingUser.sentFriendRequests,
                        {
                            userId : invitedUserId
                        }
                    );

                if (!sentFriendRequest)
                    throw "There isn't any invitation sent to that user (" + invitedUserId + ")."

                sentFriendRequest.status = "A";

                if (!invitingUser.friends)
                    invitingUser.friends = new Array();

                if (!_.findWhere(
                            invitingUser.friends,
                            {
                                userId : invitedUserId
                            }
                        )
                    )
                    invitingUser.friends.push(
                            {
                                userId : invitedUserId
                            }
                        );

                mdb.collection("users").update(
                    { _id : invitingUser._id}, 
                    invitingUser
                );

                console.log("Inviting user is updated.");

                mdb.collection("users").findOne(
                    { 
                        email : invitedUserId 
                    }, 
                    function(err2, invitedUser)
                    {
                        console.log( "Updating invited user: " + invitedUserId );
                        console.log(invitedUser);

                        if (err2) return error(err2); 

                        if (!invitedUser)
                            throw "Invited user not found";

                        if (!invitedUser.receivedFriendRequests)
                            invitedUser.receivedFriendRequests = new Array();

                        var receivedFriendRequest = _.findWhere(
                            invitedUser.receivedFriendRequests, 
                            { userId : invitingUserId}
                        );

                        console.log({array : invitedUser.receivedFriendRequests, email: invitingUserId});

                        if (!receivedFriendRequest)
                            throw 'No friend request received';

                        receivedFriendRequest.status = "A";

                        if (!invitedUser.friends)
                            invitedUser.friends = new Array();

                        if (!_.findWhere(
                                    invitedUser.friends,
                                    {
                                        userId : invitedUserId
                                    }
                                )
                            )
                            invitedUser.friends.push(
                                {
                                    userId : invitingUserId
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