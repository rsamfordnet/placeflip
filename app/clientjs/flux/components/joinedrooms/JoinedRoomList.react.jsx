import React from 'react';

class JoinedRoomList extends React.Component
{
    constructor(props)
    {
        super(props);

        var chat = props.app.chat;
        var component = this;

        chat.on("onJoiningRoom", function(){ component.setState(); });
        chat.on("onLeaveRoom", function(){ component.setState(); });
    }
        
    get rooms(){ return this.props.app.chat.joinedRooms.toArray(); }

    render()
    {
        return (
            <ul>
                <li>142857</li>
                {
                    this.rooms.map(
                        function(room)
                        {
                            return <li>{room.roomName}</li>
                        }
                    )
                }
            </ul>
        );
    }
}

export default JoinedRoomList;