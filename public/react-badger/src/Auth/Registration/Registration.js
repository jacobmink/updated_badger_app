import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Registration extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            message: '',
            email: '',
            displayName: '',
            age: '',
            gender: '',
            about: '',
            img: ''
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
            // console.log(response, ' raw register response');
            if(!response.ok){
                throw Error(response.statusText);
            }
            const parsed = await response.json();
            // console.log(parsed, ' created user');
            if(parsed.data){
                this.setState({
                    message: ''
                })
                this.props.getUserInfo(parsed.data);
                // this.props.history.push('/myprofile');
            }else{
                console.log(parsed, ' parsed with error');
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
        // console.log(this.state);
        const ageList = [];
        const genderList = ['male','female','other'];
        for(let i = 18; i < 100; i++){
            ageList.push(i);
        }
        const ageDropdown = ageList.map((age)=>{
           return (
            <option value={age}>{age}</option>
           );
        });
        const genderDropdown =  genderList.map((gender)=>{
           return (
            <option value={gender}>{gender}</option>
           );
        });
        return(
            <div>
                <h3>Create Your Profile</h3>
                <section className="registration-form">
                    {this.state.message}
                    <div className="error-window"></div>
                    <form onSubmit={this.handleSubmit} id="regform">
                        Username: <input type="text" name="username" placeholder="Create username" onChange={this.handleChange}/><br/>
                        Password: <input type="password" name="password" placeholder="Create password" onChange={this.handleChange}/><br/>
                        Email: <input type="email" name="email" placeholder="Enter your email" onChange={this.handleChange}/><br/>
                        Display Name: <input type="text" name="displayName" placeholder="Display Name" onChange={this.handleChange}/><br/>
                        Age: <select name="age" onChange={this.handleChange}>
                            <option value="select age">Select Age</option>
                            {ageDropdown}
                        </select> <br/>
                        Gender: <select name="gender" onChange={this.handleChange}>
                        <option value="gender">Select Gender</option>
                           {genderDropdown}
                            </select><br/>
                        About: <textarea name="about" placeholder="Describe yourself!" onChange={this.handleChange}></textarea><br/>
                        Photo: <input type="text" name="img" placeholder="Add an image URL" onChange={this.handleChange}/><br/>
                        <button type="submit">Register</button>
                    </form>
                </section>
            </div>
        )
    }
}

export default withRouter(Registration);