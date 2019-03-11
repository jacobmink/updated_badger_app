import React from 'react';
import { withRouter } from 'react-router-dom';

const BadgeContainer = (props)=>{
    console.log(props);
    const badge = props.location.state ? props.location.state.badge : '';
    const user = props.location.state ? props.location.state.user : '';
    const eventList = badge !== '' ? badge.events.forEach((event)=>{
        return(
            <li><img src={event.img} alt={event.img} /><br/>
            {event.description}</li>
        );
    }) : "This badge doesn't exist"
    


    return(
        <div>
            <h1>{user.displayName}'s {badge.title} Badge</h1>
            <ul>
                {eventList}
            </ul>
            <button onClick={props.deleteBadge.bind(null, badge._id)}>Delete this badge</button>
                
                
        </div>
    )
}


export default withRouter(BadgeContainer);

