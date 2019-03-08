import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Registration extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            message: ''
        }
    }
    handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/auth/registration`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                throw Error(response.statusText);
            }
            const parsed = await response.json();
            if(parsed.data === 'registration successful'){
                this.setState({
                    message: ''
                })
                this.props.history.push('/books');
            }else{
                this.setState({
                    message: 'This username is already taken!'
                })
            }
        }catch(err){
            console.log(err);
            return err;
        }
    }
    handleChange = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render(){
        return(
            <div>
                <h3>Sign up</h3>
                {this.state.message}
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" onChange={this.handleChange} placeholder="Create a username"/>
                    <input type="password" name="password" onChange={this.handleChange} placeholder="Create a password"/>
                    <button type="submit">Register your account</button>
                </form>
            </div>
        )
    }
}

export default withRouter(Registration);