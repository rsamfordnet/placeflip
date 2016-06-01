var $          = require('jQuery');
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
                }
            );
        },
        
        onSend : function()
        {
            var userName = $("#sessionContainer").text();
            
            Actions.sendMessage({ message : this.state.currentMessage, user : userName}, true);
            $(".chat-input").val("");
        },
        
        onTextChange : function(ev)
        {
            this.state.currentMessage = ev.target.value;
        },
        
        render : function()
        {
            return (
                <div>
                    <div>
                        {
                            this.state.messages.map(
                                function(message) 
                                {
                                    return <div> 
                                        <span>{ message.user } : </span>
                                        <span key={message.message}>{message.message}</span>
                                    </div>
                                }
                            )
                        }
                    </div>
                    <input type="text" className="chat-input" onChange={ this.onTextChange } />
                    <input type="button" value="send" onClick={ this.onSend } />
                </div>
            );
        }
    }
);