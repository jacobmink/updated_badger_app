import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class EditUser extends Component {
    constructor({user}){
        super({user});
        this.state = {
            username: user.username,
            password: user.password,
            email: user.email,
            displayName: user.displayName,
            age: user.age,
            gender: user.gender,
            about: user.about,
            img: user.img
        }
    }
    handleEditInput = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render(){
        console.log(this.state);
        const {user, editUser} = this.props;
        const ageList = [];
        const genderList = ['male','female','other'];
        for(let i = 18; i < 100; i++){
            ageList.push(i);
        }
        const ageDropdown = ageList.map((age, i)=>{
           return (
            <option value={age} key={i}>{age}</option>
           );
        });
        const genderDropdown =  genderList.map((gender, i)=>{
           return (
            <option value={gender} key={i}>{gender}</option>
           );
        });
        return(
            <div>
                <h3>Edit User Profile</h3>
                <section className="main-form">
                    <form onSubmit={editUser.bind(null, this.state)}>
                        Username: <input type="text" name="username" value={this.state.username} onChange={this.handleEditInput}/><br/>
                        Password: <input type="password" name="password" value={this.state.password} onChange={this.handleEditInput}/><br/>
                        Email: <input type="email" name="email" value={this.state.email} onChange={this.handleEditInput}/><br/>
                        Age: <select name="age" onChange={this.handleEditInput}>
                            {ageDropdown}
                        </select> <br/>
                        Gender: <select name="gender" onChange={this.handleEditInput}>
                           {genderDropdown}
                            </select><br/>
                        Display Name: <input type="text" name="displayName" value={this.state.displayName} onChange={this.handleEditInput}/><br/>
                        About: <textarea name="about" onChange={this.handleEditInput} value={this.state.about}></textarea><br/>
                        Photo: <input type="text" name="img" value={this.state.img} onChange={this.handleEditInput}/><br/>
                        <button type="submit">Update Profile</button>
                    </form>
                    <button className="delete-button" onClick={this.props.deleteUser.bind(null, this.props.user._id)} >Delete <br/> your <br/> Account</button>
                </section>
            </div>
    
        )
    }
}
export default withRouter(EditUser);