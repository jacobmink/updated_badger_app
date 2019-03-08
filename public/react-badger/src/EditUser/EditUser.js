import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class EditUser extends Component {
    constructor(){
        super();
        this.state = {
            newUsername: '',
            newPassword: '',
            newEmail: '',
            newDisplayName: '',
            newAge: '',
            newGender: '',
            newAbout: '',
            newImg: ''
        }
    }
    handleEditInput = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render(){
        const {user, editUser} = this.props;
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
                <h1>Edit User Profile</h1>
                <section class="main-form">
                    <form onSubmit={editUser}>
                        Username: <input type="text" name="newUsername" value={user.username} onChange={this.handleEditInput}/><br/>
                        Password: <input type="password" name="newPassword" value={user.password} onChange={this.handleEditInput}/><br/>
                        Email: <input type="email" name="newEmail" value={user.email} onChange={this.handleEditInput}/><br/>
                        Age: <select name="newAge" onChange={this.handleEditInput}>
                            {ageDropdown}
                        </select> <br/>
                        Gender: <select name="newGender" onChange={this.handleEditInput}>
                           {genderDropdown}
                            </select><br/>
                        Display Name: <input type="text" name="newDisplayName" value={user.displayName} onChange={this.handleEditInput}/><br/>
                        About: <textarea name="newAbout" onChange={this.handleEditInput}>{user.about}</textarea><br/>
                        Photo: <input type="text" name="newImg" value={user.img} onChange={this.handleEditInput}/><br/>
                        <button type="submit">Update Profile</button>
                    </form>
                </section>
            </div>
    
        )
    }
}
export default withRouter(EditUser);