import React from 'react';
import session from '../../../object-model/Session.js';

class Friend extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        var friend = this.props.friend;

        return (
            <div>
                <div>{friend.name}</div>
                <img src={friend.images.small} alt={friend.name} />
            </div>
        );
    }
}

export default Friend;