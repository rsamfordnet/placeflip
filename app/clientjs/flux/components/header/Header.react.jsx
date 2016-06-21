import React from 'react';
import PushNotifications from '../pushnotifications/PushNotifications.react.jsx'


class Header extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <div className="header">
                <h1>Placeflip</h1>
                <hr />
                <div>
                    <PushNotifications></PushNotifications>
                    Placeflip is an experimental chat app built using React/Flux by Jose Yanez
                </div>
                <b>See the code in GitHub:</b>
                <br />
                <a target="_blank" href="https://github.com/joseangelyanez/placeflip">https://github.com/joseangelyanez/placeflip</a>
            </div>
        );
    }

}

export default Header;