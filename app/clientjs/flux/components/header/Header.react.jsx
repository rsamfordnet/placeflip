import React from 'react';

class Header extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <div>
                <h1>Placeflip</h1>
                <hr />
                <div>
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