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
                large : "http://res.cloudinary.com/hhrfxfead/image/upload/v1466707692/sample_id.png",
                small : "http://res.cloudinary.com/hhrfxfead/image/upload/c_scale,w_50/v1466707692/sample_id.png"
            };

        user.userId = getNextId();

        mdb.collection("users").insertOne(
            user,
            callback(success, error)
        ); 
    }

    /* public void */ this.validate = function(email, password, success, error)
    {
        console.log(util.inspect(arguments));

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
                { userId : { $in: userIds } }
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
                                return friend.userId;
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

    /* public void */ this.addFriend = function(invitingUserId, invitedUserId, success, error)
    {
        console.log("_-_-_-_");

        mdb.collection("users").findOne(
            { userId : invitingUserId }, 
            function(err1, invitingUser){
                console.log("Begin updating inviting user " + invitingUserId);
                if (err1) return error ? error(err1) : undefined; 

                console.log(invitingUser);

                if (!invitingUser)
                    if (error) return error('User not found');

                if (!invitingUser.sentFriendRequests)
                    invitingUser.sentFriendRequests = new Array();

                var sentFriendRequest = _.findWhere(
                        invitingUser.sentFriendRequests,
                        {
                            userId : invitedUserId
                        }
                    );

                if (!sentFriendRequest)
                    invitingUser.sentFriendRequests.push(
                            {
                                userId : invitedUserId,
                                status   : "P"
                            }
                        );

                mdb.collection("users").update(
                    { _id : invitingUser._id}, 
                    invitingUser
                );

                console.log("Inviting user is updated.");

                mdb.collection("users").findOne(
                    { userId : invitedUserId }, 
                    function(err2, invitedUser){
                        if (err2) return error ? error(err2) : undefined; 

                        console.log("Updating invited user: " + invitedUserId );

                        if (!invitedUser)
                            if (error) return error("Invited user not found");

                        if (!invitedUser.receivedFriendRequests)
                            invitedUser.receivedFriendRequests = new Array();

                        var receivedFriendRequest = _.findWhere(
                            invitedUser.receivedFriendRequests,
                            {
                                userId : invitedUserId
                            }
                        );

                        if (!receivedFriendRequest)
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
                        success();
                    }
                );
            }
        );
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

                if (err1) return error ? error(err1) : undefined; 

                console.log(invitingUser);

                if (!invitingUser)
                    if (error) return error('Inviting user not found');

                if (!invitingUser.sentFriendRequests)
                    if (error) return error('Nothing to mark as accepted');

                var sentFriendRequest = _.findWhere(
                        invitingUser.sentFriendRequests,
                        {
                            userId : invitedUserId
                        }
                    );

                if (!sentFriendRequest)
                    if (error) return error("There isn't any invitation sent to that user (" + invitedUserId + ").");

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
                console.log("Now searching for userId: " + invitedUserId);

                mdb.collection("users").findOne(
                    { 
                        userId : invitedUserId
                    }, 
                    function(err2, invitedUser)
                    {
                        console.log( "Updating invited user: " + invitedUserId );
                        console.log(invitedUser);

                        if (err2) return error ? error(err2) : undefined; 

                        if (!invitedUser)
                            if (error) return error("Invited user not found");

                        if (!invitedUser.receivedFriendRequests)
                            invitedUser.receivedFriendRequests = new Array();

                        var receivedFriendRequest = _.findWhere(
                            invitedUser.receivedFriendRequests, 
                            { 
                                userId : invitingUserId
                            }
                        );

                        console.log(
                            {
                                array : invitedUser.receivedFriendRequests, userId: invitingUserId
                            }
                        );

                        if (!receivedFriendRequest)
                            if (error) return error('No friend request received from ' + invitingUserId);

                        receivedFriendRequest.status = "A";

                        if (!invitedUser.friends)
                            invitedUser.friends = new Array();

                        if (!_.findWhere(
                                    invitedUser.friends,
                                    {
                                        userId : invitingUserId
                                    }
                                )
                            )
                        {
                            invitedUser.friends.push(
                                {
                                    userId : invitingUserId
                                }
                            );
                        }
                        else
                        {
                            console.log("Friend already added?")
                        }
                            

                        mdb.collection("users").update(
                            { _id : invitedUser._id}, 
                            invitedUser
                        );

                        console.log("Invited user is updated.");
                        success();
                    }
                );
            }
        );
    }
}

// =>
module.exports = UserRepository;