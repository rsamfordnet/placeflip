import React from 'react';
import session from '../../../object-model/Session.js';

class FriendList extends React.Component
{
    constructor(props)
    {
        super(props);

        var chat = window.app.chat;
        var component = this;
    }
        
    get friends(){ return session.user().friends; }

    render()
    {
        return (
            <ul>
                {
                    this.friends.map(
                        function(friend)
                        {
                            if (friend.username == undefined)
                                return;
                            return <li>{friend.username}</li>
                        }
                    )
                }
            </ul>
        );
    }
}

export default FriendList;