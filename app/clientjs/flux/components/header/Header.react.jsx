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
            </div>
        );
    }

}

export default Header;