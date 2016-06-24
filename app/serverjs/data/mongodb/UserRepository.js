const callback = require('./Callback.js');
const _        = require("underscore");
const util     = require("util");

/* class  */ function UserRepository(mdb)
{
    var lastUserId = 0;

    getLastUserId(
        function(maxUserId)
        {
            lastUserId = maxUserId;
            console.log("Last userId : " + lastUserId);
        }
    );

    function getNextId()
    {
        lastUserId += 1;
        return lastUserId;
    }

    /* public void */ this.signUp = function(user, success, error)
    {
        /* Sets default values for the account. */
        if (!user.images)
            user.images = { 
                profile       : "http://res.cloudinary.com/hhrfxfead/image/upload/v1466707692/sample_id.png",
                profile_small : "http://res.cloudinary.com/hhrfxfead/image/upload/c_scale,w_50/v1466707692/sample_id.png"
            };

        user.userId = getNextId();

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
                {
                    if (!user.images)
                        user.images = { 
                            large : "http://res.cloudinary.com/hhrfxfead/image/upload/v1466707692/sample_id.png",
                            small : "http://res.cloudinary.com/hhrfxfead/image/upload/c_scale,w_50/v1466707692/sample_id.png"
                        };

                    success(user);
                }
                else
                {
                    if (error)
                        error("User not found");
                }
                    
            }
        );
    }

    /* private void */ function getLastUserId(success, error)
    {
        mdb.collection("users").aggregate(
            {
                $group : {
                    _id : '',
                    last: {
                        $max: "$userId"
                    }
                }
            }
            , 
            function(err, sequence){
                if (err) return error ? error(err) : undefined;

                if (sequence.length == 0 || !sequence[0].last)
                    success(1);
                else
                    success(sequence[0].last);

                
            }
        );
    }

    /* public async void */ this.getUsers = function(userIds, success, error)
    {
        mdb
            .collection("users")
            .find(
                { username : { $in: userIds } }
            )
            .toArray(
                function(err, users){
                    if (err && error) return error(err);

                    success(users);
                }
            );
            
    }

    /* public async void */ this.getUser = function(email, success, error)
    {
        var instance = this;

        mdb.collection("users").findOne(
            { email : email }, 
            function(err, user){
                if (err) return error(err); 

                if (!user)
                    return success(null);

                if (!user.images)
                    user.images = { profile : "http://res.cloudinary.com/hhrfxfead/image/upload/v1466707692/sample_id.png" }

                if (!user.friends)
                    user.friends = new Array();

                var friendsArray = 
                    _.reject(
                        user.friends.map(
                            function(friend)
                            {
                                friend.password = null;
                                return friend.username;
                            }
                        ),
                        /*reject */ function(value)
                        {
                            return  (value == undefined);
                        }
                    );

                console.log(util.inspect(friendsArray));

                instance.getUsers(
                    friendsArray,
                    function(fullFriends)
                    {
                        user.friends = fullFriends;
                        success(user);
                    },
                    function(error)
                    {
                        console.log(error);
                    }
                );
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

    /* public void */ this.addFriend = function(invitingUserId, invitedUserId, success, error)
    {
        console.log("_-_-_-_");

        mdb.collection("users").findOne(
            { username : invitingUserId }, 
            function(err, invitingUser){
                console.log("Begin updating inviting user " + invitingUserId);

                if (err) return error(err); 

                console.log(invitingUser);

                if (!invitingUser)
                    throw 'User not found';

                if (!invitingUser.sentFriendRequests)
                    invitingUser.sentFriendRequests = new Array();

                var sentFriendRequest = _.findWhere(
                        invitingUser.sentFriendRequests,
                        {
                            username : invitedUserId
                        }
                    );

                if (!sentFriendRequest)
                    invitingUser.sentFriendRequests.push(
                            {
                                username : invitedUserId,
                                status   : "P"
                            }
                        );

                mdb.collection("users").update(
                    { _id : invitingUser._id}, 
                    invitingUser
                );

                console.log("Inviting user is updated.");

                mdb.collection("users").findOne(
                    { username : invitedUserId }, 
                    function(err, invitedUser){
                        console.log("Updating invited user: " + invitedUserId );

                        if (!invitedUser)
                            throw "Invited user not found";

                        if (!invitedUser.receivedFriendRequests)
                            invitedUser.receivedFriendRequests = new Array();

                        var receivedFriendRequest = _.findWhere(
                            invitedUser.receivedFriendRequests,
                            {
                                username : invitedUserId
                            }
                        );

                        if (!receivedFriendRequest)
                            invitedUser.receivedFriendRequests.push(
                                    {
                                        username : invitingUserId,
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

    /* public void */ this.setProfileImage = function(email, images, success)
    {
        mdb.collection("users").update(
            { email : email }, 
            { 
                $set : 
                    {
                        images : {
                            large : images.large,
                            small : images.small
                        }
                    }
            }
        );

        if (success)
            success();
    }


    /* public void */ this.acceptFriend = function(invitedUserId, invitingUserId, success, error)
    {
        console.log("_-_-_-_");

        mdb.collection("users").findOne(
            { 
                userId : invitingUserId
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
                        userId : invitedUserId
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
                            { 
                                userId : invitingUsername
                            }
                        );

                        console.log(
                            {
                                array : invitedUser.receivedFriendRequests, userId: invitingUserId
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