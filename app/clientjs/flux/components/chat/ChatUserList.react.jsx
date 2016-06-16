import React from 'react';
import ChatUser from './ChatUser.react.jsx'

class ChatUserList extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    get users(){ return this.props.users; }

    render()
    {
        return (
            <div>
                <strong>Connected Users</strong>
                {
                    (function(users){
                        if (users.length == 0)
                            return <div>You're the only user in this room!</div>
                        })
                    (this.users)
                }
                <ul>
                    {
                        this.users.map(
                            function(user) 
                            {
                                return <li key={user.userName}><ChatUser user = { user } /></li>
                            }
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default ChatUserList;