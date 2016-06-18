/* npm */      import React            from 'react';
/* react  */   import Chat             from '../components/chat/Chat.react.jsx';
/* react  */   import ActivityBox      from '../components/ActivityBox.react.jsx';
/* react  */   import ChatRoomList     from '../components/chatrooms/ChatRoomList.react.jsx';
/* react  */   import Header           from '../components/header/Header.react.jsx';

module.exports = React.createClass(
    {
        getInitialState : function()
        {
            return {};
        },

        onNewActivity : function()
        {
            alert("Show activities");
        },

        render : function()
        {
            return (
                <div className="r">    
                    <div className="c1"></div>
                    <div className="c2">
                        <div className="header-container">
                            <Header />
                        </div>
                        <hr />
                        <div className="chat-room-container">
                            <ChatRoomList app={ this.props.app } />
                        </div>
                    </div>
                    <div className="c3">
                        <Chat app={ this.props.app } />
                    </div>
                </div>
            );
        }
    }
);