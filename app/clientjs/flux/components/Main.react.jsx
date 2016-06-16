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
                <div>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8">
                                <div class="header-container">
                                    <Header />
                                    <hr />
                                </div>
                                <div className="chat-room-container">
                                    <ChatRoomList app={ this.props.app } />
                                </div>
                                
                                
                                
                            </div>
                            <div className="col-sm-4 app-panel">
                                <Chat app={ this.props.app } />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
);