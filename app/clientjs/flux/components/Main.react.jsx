/* npm */      import React            from 'react';
/* react  */   import Chat             from '../components/chat/Chat.react.jsx';
/* react  */   import ActivityBox      from '../components/ActivityBox.react.jsx';
/* react  */   import ChatRoomList     from '../components/chatrooms/ChatRoomList.react.jsx';
/* react  */   import Header           from '../components/header/Header.react.jsx';
/* react  */   import JoinedRoomList   from '../components/joinedrooms/JoinedRoomList.react.jsx';
/* react-tabs */ import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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
                    <div className="if-large c1">
                        
                    </div>
                    <div className="c2">
                        <div className="header-container">
                            <Header />
                        </div>
                        <hr />
                        <Tabs>
                            <TabList>
                                <Tab>Rooms</Tab>
                                <Tab>Friends</Tab>
                            </TabList>                            
                            <TabPanel>
                                <div className="chat-room-container">
                                    <ChatRoomList />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div>Hello World</div>
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div className="c3">
                        <Chat />
                    </div>
                </div>
            );
        }
    }
);