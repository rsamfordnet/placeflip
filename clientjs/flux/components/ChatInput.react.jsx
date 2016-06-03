var $          = require('jquery');
var React      = require('react');
var Actions    = require('../actions/Actions.jsx');
var ChatStore  = require('../stores/ChatStore.jsx');

module.exports = React.createClass(
    {
        getInitialState : function()
        {
            return {
                messages : [],
                currentMessage : ""
            };
        },
        
        componentDidMount : function()
        {
            var component = this;
            
            ChatStore.addChangeListener(
                function(message)
                {
                    var state = ChatStore.getState();
                    
                    component.setState(
                        {
                            messages : state.messages
                        }
                    );
                    
                    component.scrollDown();
                }
            );
        },
        
        onSend : function()
        {
            var userName = $("#sessionContainer").text();
            
            Actions.sendMessage({ message : this.state.currentMessage, user : userName}, true);
            $(".chat-text").val("");
        },
        
        onTextChange : function(ev)
        {
            this.state.currentMessage = ev.target.value;
        },
        
        onEnter : function(ev)
        {
            if (ev.keyCode == 13)
                this.onSend();
        },
        
        scrollDown : function()
        {
            $(".chat-container").animate({scrollTop:$(".chat-container")[0].scrollHeight}, 1000);
        },
        
        render : function()
        {
            return (
                <div className="chat-container">
                    <div className="chat-messages-container">
                        {
                            this.state.messages.map(
                                function(message) 
                                {
                                    return <div className="chat-message"> 
                                        <span><strong>{ message.user }</strong></span>
                                        <div className="chat-message">
                                            <span key={message.message}>{message.message}</span>
                                        </div>
                                    </div>
                                }
                            )
                        }
                    </div>
                    <input type="text" className="chat-text" onChange={ this.onTextChange } onKeyDown={ this.onEnter } />
                    <input type="button" className="chat-button" value="Send" onClick={ this.onSend } />
                </div>
            );
        }
    }
);