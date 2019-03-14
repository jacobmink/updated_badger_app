import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class UsersContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            loggedIn: this.props.user,
            filtersOn: true,
            users: [],
            currentPage: 1,
            usersPerPage: 1,
            minAge: '',
            maxAge: '',
            gender: [],
            badgesWanted: []

        }
    }
    getUsers = async (queries)=>{
        let url = `${process.env.REACT_APP_BACKEND}/users?${queries}`;
        console.log(url);
        try{
            const foundUsers = await fetch(url, {
            method: 'GET',
            credentials: 'include'
            })
            if(!foundUsers.ok){
                throw Error(foundUsers.statusText);
            }
            const parsed = await foundUsers.json();
            console.log(parsed.data, ' foundUsers');
            const notAlreadyLiked = parsed.data.filter((user)=>{
                return !this.state.loggedIn.likedUsers.includes(user._id);
            })
            this.setState({
                users: notAlreadyLiked
            })
        }catch(err){
            console.log(err);
            return err;
        }
    }
    
    // ---------- TODO -------------------
    handleSubmit = (e)=>{
        e.preventDefault();
        const ageRange = this.state.minAge !== '' && this.state.maxAge !== '' ? `minAge=${this.state.minAge}&maxAge=${this.state.maxAge}&` : '';

        const genderQList = this.state.gender.length > 0 ? this.state.gender.map((query)=>{
            return(
                `gender=${query}`
            );
        }).join('&') + '&' : '';
        console.log(genderQList);
        
        const badgesQList = this.state.badgesWanted.length > 0 ? this.state.badgesWanted.map((query)=>{
            return(
                `badgesWanted=${query}`
            );
        }).join('&') : '';
        console.log(badgesQList);
        const queries = ageRange + genderQList + badgesQList;

        this.getUsers(queries);
    }
    // -----------------------------------

    handleInput = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleAge = (e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleGender = (e)=>{
        if(e.target.checked){
            this.setState({
                gender: [...this.state.gender, e.target.value]  
            })
        }else{
            let genderArr = this.state.gender;
            if(genderArr.indexOf(e.target.value) !== -1){
                genderArr.splice(genderArr.indexOf(e.target.value), 1);
                this.setState({
                    gender: genderArr
                })
            }
        }
    }
    handleBadges = (e)=>{
        if(e.target.checked){
            this.setState({
                badgesWanted: [...this.state.badgesWanted, e.target.value]  
            })
        }else{
            let badgeArr = this.state.badgesWanted;
            if(badgeArr.indexOf(e.target.value) !== -1){
                badgeArr.splice(badgeArr.indexOf(e.target.value), 1);
                this.setState({
                    badgesWanted: badgeArr
                })
            }
        }
    }
    toggleFilters = ()=>{
        this.setState({
            filtersOn: !this.state.filtersOn,
            gender: [],
            minAge: '',
            maxAge: '',
            badgesWanted: []
        })
    }
    handlePageClick = (id, e)=>{
        if(e.target.id === "likeButton"){
            this.props.likeUser(id);
        }
        this.setState({
            currentPage: this.state.currentPage + 1
        })
    }
    componentDidMount(){
        this.getUsers('');
    }
    render(){
        console.log(this.state, ' users state');
        const badges = [
            'hike',
            'bike',
            'swim',
            'cook',
            'fish',
            'music',
            'climb',
            'religion',
            'videogame',
            'ski',
            'snowboard',
            'bar_games',
            'boardgames',
            'running',
            'international travel',
            'calligraphy',
            'exercise',
            'vegan',
            'volunteering',
            'team_sports',
            'reading',
            'coding',
            'trivia',
            'movie_buff'
        ];
        const badgeArr = [];
        for(let i = 0; i < badges.length; i++) { 
            badgeArr.push(<div>
                <input type="checkbox" name="badgesWanted" value={badges[i]} onChange={this.handleBadges}/> {badges[i]}
            </div>
                
            );
        }
        const ages = [];
        for(let i = 18; i < 100; i++) { 
            ages.push(
                <option value={i} key={i}>{i}</option>
            )
        }

        // Pagination
        const {users, currentPage, usersPerPage} = this.state;
        const lessUsers = users.filter((user)=>{
            return user.username !== this.state.loggedIn.username
        });
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUser = lessUsers.slice(indexOfFirstUser, indexOfLastUser);

        const renderUsers = currentUser.map((otherUser, index) => {
            return(
                <li key={index}>
                    <Link to={{
                        pathname:`/profile/${otherUser._id}`,
                        state: {
                            user: otherUser,
                            loggedIn: this.state.loggedIn
                        }
                    }}>{otherUser.displayName}</Link> <br/>
                    {otherUser.gender} <br/>
                    Age: {otherUser.age} <br/>
                    Badges: {otherUser.badgeList ? otherUser.badgeList.map((badge)=>{ 
                            return badge.title
                        }): "This user has no badges"} <br/>
                    <img src={otherUser.img} /> <br/>
                    <button onClick={this.handlePageClick.bind(null, otherUser._id)} id="likeButton">Like</button> <button onClick={this.handlePageClick.bind(null, otherUser._id)} id="DislikeButton">Not Like</button>

                </li>
            )
        }); 
        
        return(
            <div>
                <button className="filter-button" onClick={this.toggleFilters}>Filters</button>
                <section className="filters">
                    {this.state.filtersOn ?
                        <form id="filter-form" className="filter-form" onSubmit={this.handleSubmit} >
                        <div className="gender-and-age">
                            <div className="filter-box">
                                <h3>Gender:</h3>
                                <input type="checkbox" name="gender" value="male" onChange={this.handleGender}/> Male<br/>
                                <input type="checkbox" name="gender" value="female" onChange={this.handleGender}/> Female<br/>
                                <input type="checkbox" name="gender" value="other" onChange={this.handleGender}/> Other<br/>
                            </div>
                            <div className="filter-box">
                                <h3>Age: </h3>
                                <select name="minAge" onChange={this.handleAge}>
                                <option value="min">Min</option>
                                    {ages}
                                </select>
                                <small>-</small>
                                <select name="maxAge" onChange={this.handleAge}>
                                <option value="max">Max</option>
                                    {ages}
                                </select>
                            </div>
                        </div>
                        <div className="filter-box badge-filter-box">
                            <h3>Badges</h3>
                            {badgeArr}
                        </div><br/>
                        
                        <button type="submit">Submit</button>
                    </form> : null
                    }
                </section>
                <section className="swipe-users" >
                    <ul>
                       {renderUsers}
                    </ul>
                </section> 
            </div>
        )
    }
}

export default withRouter(UsersContainer);

