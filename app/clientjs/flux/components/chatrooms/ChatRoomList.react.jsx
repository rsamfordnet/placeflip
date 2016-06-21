import React from 'react';
import ChatRoom from './ChatRoom.react.jsx';

let app  = null;
let component = null;

class ChatRoomList extends React.Component
{
    constructor(props)
    {
        super(props);

        component = this;
        this.app  = app  = window.app;
        this.state = {
            availableRooms : app.chat.availableRooms.toArray()
        };

        app.chat.on('onRoomsAvailable', 
            function(){
                component.state.availableRooms = app.chat.availableRooms.toArray();
                component.setState(
                    { availableRooms : component.state.availableRooms}
                );
            }
        ); 
    }

    render()
    {

        return (
            <div>
                {
                    this.state.availableRooms.map(
                        function(room)
                        {
                            return <ChatRoom key={room.roomName} room={room} app={component.app} />
                        }
                    )
                }
            </div>
        );
    }
}

export default ChatRoomList;