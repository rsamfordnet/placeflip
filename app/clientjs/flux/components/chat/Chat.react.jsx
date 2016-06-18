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

        chat.on('onNoRoomToShow', 
            function()
            {
                var state = component.state;
                
                state.currentRoomName = "";
                state.messages        = [];
                state.connectedUsers  = [];

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
    
    componentDidUpdate()
    {      
        if (window.onResize)
            window.onResize();
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

    showSmallRoom()
    {
        window.showSmallRoom();
    }
    
    render()
    {
        var headerPanel = null;
        var footerPanel = null;
        var middlePanel = null;

        if (chat.currentRoom)
        {
            headerPanel = <div>
                <h1>{chat.currentRoom ? chat.currentRoom.roomName : ""}</h1>
                <div className="if-small">
                    <div className="padded button" onClick={this.showSmallRoom}>Show available rooms</div>
                </div>
                <ChatUserList 
                    users = { this.state.connectedUsers } />
                <div className="chat-typing"></div>
            </div>;

            middlePanel = <div className="chat-messages-container">
                <ChatMessageList
                    messages = { this.state.messages  } />
            </div>;

            footerPanel = <ChatInput
                onTextChange     = { this.onTextChange }
                onTyping         = { this.onTyping }
                onTypingComplete = { this.onTypingComplete }
                onSend           = { this.onSend }
            />;
        }
        else
        {
            headerPanel = <div></div>;

            middlePanel = <div className="chat-messages-container chat-noMessages">
                <div className="big white">No room is selected</div>
                <div className="if-small">
                    <div className="padded button" onClick={this.showSmallRoom}>Show available rooms</div>
                </div>
            </div>;
            footerPanel = <div></div>;
        }

        return (
            <div className="b">
                <div className="chat-table">
                    <div className="r1 if-notlandscape">
                        <div className="c">
                            {headerPanel}
                        </div>
                    </div>
                    <div className="r2">
                        <div className="c">
                            {middlePanel}
                        </div>
                    </div>
                    <div className="r3">
                        <div className="c">
                            {footerPanel}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;