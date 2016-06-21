import React from 'react';


class PushNotifications extends React.Component
{
	constructor(props)
	{
		super(props);

		this.app = app = window.app;
	}

	componentDidMount()
	{}

	componentDidUpdate()
	{}

	render()
	{
		return <div>Notifications go here<div className="float">Details go here</div></div>;
	}
}

export default PushNotifications;