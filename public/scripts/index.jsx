var TeamDropdown = React.createClass(
	{
		getInitialState : function	()
		{
			return { selectedTeam : "" };
		},

		handleTeamChange : function(ev)
		{
			if (this.props.onTeamSelected != null)
				this.props.onTeamSelected(ev.target.value);
		},

		render : function()
		{

			return (
						<select onChange={this.handleTeamChange}>
							{
								this.props.data.teams.map(
									function(team) 
									{
					          			return <option key={team.name}>{team.name}</option>
				        			}
				        		)
					    	}
						</select>
					);
		}
	}
);

var AddTeamButton = React.createClass(
	{
		getInitialState : function()
		{
			return { teamName : "" };
		},

		handleClick : function()
		{
			this.props.onClick(this.props.teamName);
			document.getElementById("teamName").value = "";
		},

		teamNameChanged : function(ev)
		{
			this.props.teamName = ev.target.value;
		},

		handleDeleteClick : function()
		{
			this.props.onTeamRemoved();
		},

		teamNameChanged : function(ev)
		{
			this.props.teamName = ev.target.value;
		},

		render : function()
		{
			return (
				<div>
					<input onClick={this.handleAddClick} type='button' value="Add Team" />
					<input onClick={this.handleDeleteClick} type='button' value="Delete Team" />
					<input id="teamName" onChange={this.teamNameChanged} />
				</div>
			);
		}
	}
);


var App = React.createClass(
		{	
			getInitialState : function()
			{
				return {
					teams : [
						{ "name" : "RM" }
					]
				};
			},

			componentDidMount: function() {
				var x = this;
				$.ajax(
					{
					    type : 'GET',
					    url  : '/teams'
					}
				).done(
					function(result)
					{
						x.setState({ teams : result });
					}
				);		    
			},

			handleAddTeam : function(teamName)
			{
				$.ajax(
					{
					    type : 'POST',
					    url  : '/teams',
					    data : { "name" : teamName }
					}
				).done(
					function()
					{
						this.getTeams();
					}
				);
			},

			handleDeleteTeam : function()
			{
				$.ajax(
					{
					    type : 'DELETE',
					    url  : '/teams',
					    data : { "name" : this.state.selectedTeam }
					}
				).done(
					function()
					{
						this.getTeams();
					}
				);
			},

			onTeamSelected : function(team)
			{
				this.state.selectedTeam = team;
			},

			render : function()
			{
				return (
					<div>
						<span>Select a team:</span> 
						<TeamDropdown data= { this.state } onTeamSelected={this.onTeamSelected} />
						<AddTeamButton 
							onTeamAdded 	= {this.handleAddTeam} 
							onTeamRemoved 	= {this.handleDeleteTeam} 
							name 	 		= "Hello World" 
							teamName 		= ""
						/>

					</div>
				);
			}
		}
	);


React.render(<App  />, document.getElementById("fifaApp"));