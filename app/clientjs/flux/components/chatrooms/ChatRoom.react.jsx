import React from 'react';

class ChatRoom extends React.Component
{
    constructor(props)
    {
        super(props);
        let app = this.app = this.props.app;
        let component = this;

        this.handleOnClick = this.handleOnClick.bind(this);
        
        this.room.on(
            'onShow', 
            () => {
                window.onResize();
                component.room.selected = true;
                component.setState({ room : component.room } );
            }
        );

        this.room.on(
            'onUnselected', 
            () => {
                component.room.selected = false;
                component.setState({ room : component.room } );
            }
        );

        this.room.on(
            'onMessage',
            (message) => {
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
        {
            return "chat-room-selected";
        }
        else
        {
            if (this.room.joined)
            {
                if (this.room.unseenMessages > 0 )
                    return "chat-unseenMessages";
                else
                    return "chat-room-joined";
            }
            else
            {
                return "chat-room";
            }
        }
    }

    get unseenMessagesText()
    {
        if (this.room.unseenMessages > 0)
            return "(" + this.room.unseenMessages + ")";
        return "";
    }

    render()
    {
        return (
            <div className={ this.selectedClass } onClick={ this.handleOnClick }>
                {this.room.roomName} {this.unseenMessagesText}
            </div>
        );
    }
}

export default ChatRoom;