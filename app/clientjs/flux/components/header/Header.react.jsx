import React             from 'react';
import PushNotifications from '../pushnotifications/PushNotifications.react.jsx'
import session           from '../../../object-model/Session.js';

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
                <a href="/pf/picture"> 
                    <img src={session.user().images.small} />
                </a>
                <br />
                <strong>
                    Welcome {session.user().username}!
                </strong>
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