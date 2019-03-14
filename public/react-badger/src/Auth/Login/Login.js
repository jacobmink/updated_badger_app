import React, { Component } from 'react';
import Registration from '../Registration/Registration';
import { withRouter } from 'react-router-dom';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            message: ''
        }
    }
    handleChange = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const loginResponse = await fetch(`${process.env.REACT_APP_BACKEND}/auth/login`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(!loginResponse.ok){
                throw Error(loginResponse.statusText);
            }
            const parsed = await loginResponse.json();
            // console.log(parsed.info, ' parsed.info');
            if(parsed.data === 'login successful'){
                // console.log('parsed.data login successful');
                this.setState({
                    message: ''
                })
                this.props.getUserInfo(parsed.info);
                // console.log('redirecting to my profile');
            }else{
                this.setState({
                    message: "Incorrect username or password"
                });
            }
        }catch(err){
            console.log(err);
            return(err);
        }
    }
    render(){
        return(
            <div>
                <h3>Log in</h3>
                {this.state.message}
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={this.handleChange}/>
                    <input type="password" name="password" placeholder="Password" onChange={this.handleChange}/>
                    <button type="submit">Submit</button>
                </form>
                <Registration getUserInfo={this.props.getUserInfo}/>

            </div>
        )
    }
}

export default withRouter(Login);