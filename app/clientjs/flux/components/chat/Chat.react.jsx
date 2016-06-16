/* npm */       import $                from 'jquery';
/* npm */       import React            from 'react';
/* class */     import Room             from '../../../object-model/Room.js';
/* class */     import Message          from '../../../object-model/Message.js';
/* object */    import assign           from 'object-assign';
/* object */    import session          from '../../../object-model/Session.js';
/* component */ import ChatMessageList  from './ChatMessageList.react.jsx'
/* component */ import ChatInput        from './ChatInput.react.jsx'
/* component */ import ChatUserList     from './ChatUserList.react.jsx'

let app       = null;
let chat      = null;
let component = null;

class Chat extends React.Component
{
    constructor(props)
    {
        super(props);

        /* private variables. */
        component = this;
        app       = this.app  = this.props.app;
        chat      = this.chat = this.props.app.chat;
        
        this.state = {
            messages        : [],
            availableRooms  : [],
            connectedUsers  : [],
            currentRoomName : ""
        };
    }
    
    componentDidMount()
    {      
        chat.on('onShowRoom', 
            function()
            {
                var state = component.state;
                
                state.currentRoomName = chat.currentRoom.roomName;
                state.messages        = chat.currentRoom.messages.toArray();
                state.connectedUsers  = chat.currentRoom.users.toArray();

                component.setState(state);
            }
        );
        
        chat.on('onMessage', 
            function(message)
            {
                var state = component.state;
                /*
                TODO: Add code to avoid roundrobin.
                state.messages.push(
                    new Message(
                        message.text, 
                        message.userName, 
                        message.roomName
                    )
                );
                */
                
                component.setState(state);
                component.scrollDown();
            }
        );
        
        chat.on(
            'onJoin', 
            function()
            {
                component.refreshParticipants();
            }
        );

        chat.on(
            'onLeave',
            function()
            {
                component.refreshParticipants();
            }
        );
        
        chat.on(
            'onMessageSent', 
            function(){
                $(".chat-text").val("");
            }
        );


        chat.on(
            'onTyping',
            function(data)
            {
                if (data.hasText)
                    $('.chat-typing').text(data.userName + " is typing");
                else
                    $('.chat-typing').text("");
            }
        );
        
        chat.on(
            'onError',
            function(error)
            {
                alert(error);
            }
        );

        chat.on(
            'onRoomCreated',
            function()
            {
                $("#roomName").val("");
            }
        );
    }

    refreshParticipants()
    {
        var state = this.state;

        state.connectedUsers =
            chat.currentRoom.users.toArray();

        component.setState(state);
    }
    
    onSend()
    {
        var chatText = $(".chat-text").val();
        
        app.sendMessage(
            { 
                text : chatText, 
                user : session.name
            }, 
            true
        );
    }
    
    onTextChange(ev)
    {
        component.state.currentMessage = ev.target.value;
    }
    
    onTyping(ev)
    {
        if (ev.keyCode == 13)
            component.onSend();
    }

    onTypingComplete(ev)
    {
        var hasText = $(".chat-text").val().length > 0;

        app.sendTyping( { hasText  : hasText } );

        if (ev.keyCode == 13)
            app.sendTyping({ hasText  : false });
    }
    
    onRoomChanged(ev)
    {
        var selectedRoom = ev.target.value;
        app.joinRoom(selectedRoom);
    }
    
    scrollDown()
    {
        $(".chat-messages-container").animate(
            {
                scrollTop : $(".chat-messages-container")[0].scrollHeight
            }, 
            1
        );
    }

    onCreateRoom()
    {
        var roomName = $("#roomName").val();
        app.createRoom(roomName);
    }

    
    render()
    {
        return (
            <table className="chat-table container">
                <tbody>
                    <tr className="chat-table header">
                        <td>
                            <h1>{chat.currentRoom ? chat.currentRoom.roomName : ""}</h1>
                            <ChatUserList 
                                users = { this.state.connectedUsers } />
                        </td>
                    </tr>
                    <tr className="chat-table body">
                        <td>
                            <div className="chat-messages-container">
                                <ChatMessageList
                                    messages = { this.state.messages  } />
                            </div>
                        </td>
                    </tr>
                    <tr className="chat-table footer">
                        <td>
                            <ChatInput
                                onTextChange     = { this.onTextChange }
                                onTyping         = { this.onTyping }
                                onTypingComplete = { this.onTypingComplete }
                                onSend           = { this.onSend }
                            />
                            <div className="chat-typing"></div>          
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Chat;