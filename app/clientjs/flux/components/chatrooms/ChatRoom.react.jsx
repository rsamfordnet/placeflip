import React from 'react';

class ChatRoom extends React.Component
{
    constructor(props)
    {
        super(props);
        let app = this.app = this.props.app;
        let component = this;

        this.handleOnClick = this.handleOnClick.bind(this);
        
        this.app.chat.on(
            'onShowRoom', 
            function(){
                window.onResize();
                component.room.selected = 
                    app.chat.currentRoom.roomName == component.room.roomName;

                component.setState({ room : component.room } );
            }
        );
    }

    get room(){ return this.props.room; }

    handleOnClick()
    {
        this.app.joinRoom(this.room.roomName);
    }

    get selectedClass()
    {
        if (this.room.selected)
            return "chat-room-selected";
        else
            return "chat-room";
    }

    render()
    {
        return (
            <div className={ this.selectedClass } onClick={ this.handleOnClick }>
                {this.room.roomName}
            </div>
        );
    }
}

export default ChatRoom;