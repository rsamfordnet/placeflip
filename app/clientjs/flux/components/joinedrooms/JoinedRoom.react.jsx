import React from 'react';

class JoinedRoom extends React.Component
{
    constructor(props)
    {
    }
        
    get rooms(){ return this.props.rooms}

    render()
    {
        return (
            <ul>
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

export default JoinedRoom;