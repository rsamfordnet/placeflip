import React from 'react';

class ChatUser extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    get user(){ return this.props.user; }

    render()
    {
        return (
            <div>{ this.user.userName }</div>
        );
    }
}

export default ChatUser;