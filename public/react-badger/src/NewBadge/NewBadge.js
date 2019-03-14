import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class NewBadge extends Component{
    constructor(props){
        super(props);
        this.state = {
            message: '',
            title: this.props.badgeTitles[0],
            img1: '',
            img2: '',
            img3: '',
            description1: '',
            description2: '',
            description3: ''
        }
    }
    handleInput = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        const newBadge = {
            title: this.state.title,
            events: [{img: this.state.img1, description: this.state.description1},
                    {img: this.state.img2, description: this.state.description2},
                    {img: this.state.img3, description: this.state.description3}]
        }
        if(newBadge.events.filter((event)=>{
            return event.description === '';
        }).length > 0){
            this.setState({
                message: 'Please fill in all boxes'
            })
        }else{
            this.props.addBadge(newBadge);
        }
        
    }
    render(){
        // console.log(this.state);
        const badgeTitleList = this.props.badgeTitles.map((title, i)=>{
            return(
                <option value={title} key={i}>{title}</option>
            )
        })

        return(
            <div>
                <h1>Add Badge</h1>
                <div className="error-window">{this.state.message}</div>
                <form id="badgeform" onSubmit={this.handleSubmit}>
                    <h3>Enter Badge Title</h3>
                    <select id="badges" name="title" onChange={this.handleInput}>
                        {badgeTitleList}
                    </select>

                    <h4>First Event</h4>

                    Image:        <input type="url" name="img1" placeholder="img" onChange={this.handleInput} /><br/>
                    Description:  <textarea name="description1" onChange={this.handleInput}></textarea><br/>
              
                    <h4>Second Event</h4>
                    Image:        <input type="url" name="img2" placeholder="img" onChange={this.handleInput}/><br/>
                    Description:  <textarea name="description2" onChange={this.handleInput}></textarea><br/>
                
                    <h4>Third Event</h4>
                    Image:        <input type="url" name="img3" placeholder="img" onChange={this.handleInput}/><br/>
                    Description:  <textarea name="description3" onChange={this.handleInput}></textarea><br/>

                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default withRouter(NewBadge);