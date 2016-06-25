import React from 'react';
import Friend from './Friend.react.jsx';
import session from '../../../object-model/Session.js';

class FriendList extends React.Component
{
    constructor(props)
    {
        super(props);

        var chat = window.app.chat;
        var component = this;
    }
    
    render()
    {
        var friends = session.user().friends;

        return (
            <ul>
                {
                    friends.map(
                        function(friend)
                        {
                            if (friend.username == undefined)
                                return;

                            return <Friend key={friend.username} friend={friend}></Friend>
                        }
                    )
                }
            </ul>
        );
    }
}

export default FriendList;