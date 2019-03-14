import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class MatchesContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.loggedIn,
            showReviews: []
        }
    }
    showReviews = (i)=>{
        let showReviewsArray = this.state.showReviews;
        showReviewsArray[i] = !showReviewsArray[i];
        this.setState({
            showReviews: showReviewsArray
        })
    }
    componentDidMount(){
        const showReviewsArray = [];
        this.state.user.matchedUsers.forEach((match, i)=>{
            showReviewsArray.push(false);
        })
        this.setState({
            showReviews: showReviewsArray
        })
    }
    render(){
        console.log(this.state);
        const matchList = this.state.user.matchedUsers.length !== 0 ? this.state.user.matchedUsers.map((match, i)=>{
            return (this.props.users.filter((user, i)=>{
                return user._id === match
            }))
        }) : null;

        const renderMatches = matchList === null ? "You haven't matched with anyone yet..." : matchList.flat().map((otherUser, userIndex)=>{
            const reviewsReceived = otherUser.reviewsReceived.map((review, i)=>{ return(
                <li key={i}>
                    {review.stars} <br/>
                    {review.text}
                </li>
            )
                
            })
            return(
                <li key={userIndex}>
                    <Link to={{
                        pathname:`/profile/${otherUser._id}`,
                        state: {
                            user: otherUser,
                            loggedIn: this.state.user
                        }
                    }}>{otherUser.displayName}
                    </Link>
                    <Link to={{
                        pathname:"/newreview",
                        state: {
                            user: otherUser
                        }}}>
                    <button>Add a review for {otherUser.displayName}</button>
                    </Link>
                    <button onClick={this.showReviews.bind(null, userIndex)}>See reviews for {otherUser.displayName}</button>
                    {this.state.showReviews[userIndex] ? 
                        <ul>
                            {reviewsReceived}
                        </ul> : null}
                </li>
            )
        })

        return(
            <div className="match-container">
                <h3>Your Matches</h3>
                <Link to={{
                    pathname: `/myprofile`,
                    state: {
                        loggedIn: this.state.user
                    }
                }}><button>Back to your profile</button></Link> <br/>
                
                <ul>
                    {renderMatches}
                </ul>
                
                    
                    
            </div>
        )

    }

    
}


export default withRouter(MatchesContainer);