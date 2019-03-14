import React from 'react';
import { withRouter, Link } from 'react-router-dom';

const ReviewsContainer = (props)=>{
    // console.log(props, ' props');
    const badge = props.location.state ? props.location.state.badge : '';
    // console.log(badge, ' badge');
    const user = props.location.state ? props.location.state.user : '';
    const eventList = badge !== '' ? badge.events.map((event, i)=>{
        return(
            <li key={i}><img src={event.img} alt={event.img} /><br/>
            {event.description}</li>
        );
    }) : "This badge doesn't exist"
    


    return(
        <div className="review-container">
            <h1>{user.displayName}'s {badge.title} Badge</h1>
            <Link to={{
                pathname: `/myprofile`,
                state: {
                    loggedIn: props.location.state.loggedIn
                }
            }}><button>Back to your profile</button></Link> <br/>
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


export default withRouter(ReviewsContainer);