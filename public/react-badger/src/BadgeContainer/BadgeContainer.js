import React from 'react';
import { withRouter, Link } from 'react-router-dom';

const BadgeContainer = (props)=>{
    console.log(props, ' props');
    const badge = props.location.state ? props.location.state.badge : '';
    console.log(badge, ' badge');
    const user = props.location.state ? props.location.state.user : '';
    const eventList = badge !== '' ? badge.events.map((event)=>{
        return(
            <li><img src={event.img} alt={event.img} /><br/>
            {event.description}</li>
        );
    }) : "This badge doesn't exist"
    


    return(
        <div className="badge-container">
            <h1>{user.displayName}'s {badge.title} Badge</h1>
            <Link to={{
                pathname: `/profile/${user._id}`,
                state: {
                    user: user,
                    loggedIn: props.location.state.loggedIn
                }
            }}><button>Back to {props.location.state.user.username}'s profile</button></Link> <br/>
            Events
            <ul>
                {eventList}
            </ul>
            {props.location.state.user._id === props.location.state.loggedIn._id ? <div>
                <button onClick={props.deleteBadge.bind(null, badge._id)}>Delete this badge</button>
                
            </div>
            
             : null
            }
            
                
                
        </div>
    )
}


export default withRouter(BadgeContainer);

