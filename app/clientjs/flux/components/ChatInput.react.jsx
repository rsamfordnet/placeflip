/* npm */      var $          = require('jquery');
/* npm */      var React      = require('react');
/* class */    var Actions    = require('../actions/Actions.jsx');
/* class */    var ChatStore  = require('../stores/ChatStore.jsx');
/* class */    var Room       = require('../../object-model/Room.js');
/* class */    var Message    = require('../../object-model/Message.js');
/* object */   var assign     = require('object-assign');
/* object */   var session    = require('../../object-model/Session.js');
/* object */   var chat       = require('../../object-model/Chat.js');

module.exports = React.createClass(
    {
        getInitialState : function()
        {
            return {
                messages : [],
                availableRooms : [],
                currentRoomName : ""
            };
        },
        
        componentDidMount : function()
        {
            var component = this;
            
            chat.on('onRoomsAvailable', 
                function(){
                    var state = component.state;
                    state.availableRooms = chat.availableRooms.toArray();
                    
                    component.setState(state);
                }
            );
            
            
            chat.on('onShowRoom', 
                function()
                {
                    var state = component.state;
                    
                    state.currentRoomName = chat.currentRoom.name;
                    state.messages = chat.currentRoom.messages.toArray();
                    
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
                function(data)
                {
                    alert(data.userName + ' joined the room.');
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
                        $('.chat-typing').text("User " + data.userName + " is typing");
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
            
            /* Starts the chat. */
            chat.start();
            
            Actions.showAvailableRooms();
        },
        
        onSend : function()
        {
            var chatText = $(".chat-text").val();
            
            Actions.sendMessage(
                { 
                    text : chatText, 
                    user : session.name
                }, 
                true
            );
        },
        
        onTextChange : function(ev)
        {
            this.state.currentMessage = ev.target.value;
        },
        
        onTyping : function(ev)
        {
            if (ev.keyCode == 13)
                this.onSend();
        },

        onTypingComplete : function(ev)
        {
            var hasText = $(".chat-text").val().length > 0;

            Actions.sendTyping( { hasText  : hasText } );

            if (ev.keyCode == 13)
                Actions.sendTyping({ hasText  : false });
        },
        
        onRoomChanged : function(ev)
        {
            var selectedRoom = ev.target.value;
            Actions.joinRoom(selectedRoom);
        },
        
        scrollDown : function()
        {
            $(".chat-messages-container").animate(
                {
                    scrollTop : $(".chat-messages-container")[0].scrollHeight
                }, 
                1
            );
        },
        
        render : function()
        {
            return (
                <div className="chat-container">
                    <div className="chat-typing"></div>
                    <select onChange={this.onRoomChanged}>
                        <option>[Select a room]</option>
                        {
                            this.state.availableRooms.map(
                                function(room) 
                                {
                                    return <option key={room.roomName}>{room.roomName}</option>
                                }
                            )
                        }
                    </select>
                    
                    <div className="chat-messages-container">
                        {
                            this.state.messages.map(
                                function(message) 
                                {
                                    return <div className="chat-message" key={ message.id }> 
                                        <span><strong>{ message.userName }</strong></span>
                                        <div className="chat-message">
                                            {message.text}
                                        </div>
                                    </div>
                                }
                            )
                        }
                    </div>
                    <table className="chat-inputs-container">
                        <tbody>
                            <tr>
                                <td className="_-textcell">
                                    <input type="text" className="chat-text" onChange={ this.onTextChange } onKeyDown={ this.onTyping } onKeyUp={ this.onTypingComplete } />
                                </td>
                                <td className="_-buttoncell">
                                    <input type="button" className="chat-button" value="Send" onClick={ this.onSend } />
                                </td>
                            </tr>
                        </tbody>                
                    </table>
                </div>
            );
        }
    }
);