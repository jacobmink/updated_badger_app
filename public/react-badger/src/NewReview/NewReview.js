import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class NewReview extends Component{
    constructor(props){
        super(props);
        this.state = {
            // reviewer_id: this.props.loggedIn._id,
            stars: '1 star',
            text: '',
            reviewee_id: this.props.location.state.user._id
        }
    }
    handleInput = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.addReview(this.state);
    }
    render(){
        // console.log(this.state);
        const stars = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];
        const starsList = stars.map((star, i)=>{
            return(
                <option value={star} key={i}>{star}</option>
            )
        })

        return(
            <div>
                <h4>Add review</h4>
                <div className="error-window"></div>
                <form id="reviewform" onSubmit={this.handleSubmit}>
                    <select id="reviews" name="stars" onChange={this.handleInput}>
                        {starsList}
                    </select>

                    Text:  <textarea name="text" onChange={this.handleInput}></textarea><br/>

                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default withRouter(NewReview);