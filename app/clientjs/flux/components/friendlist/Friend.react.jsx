import React from 'react';
import session from '../../../object-model/Session.js';

class Friend extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    startConversation()
    {
        var app = window.app;
        app.startConversationWith(this.props.friend.userId);
    }

    render()
    {
        var friend = this.props.friend;

        return (
            <div onClick={this.startConversation}>
                <div>{friend.name}</div>
                <img src={friend.images.small} alt={friend.name} />
            </div>
        );
    }
}

export default Friend;