import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class UsersContainer extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        }
    }
    getUsers = async (id)=>{
        try{
            const foundUser = await fetch(`${process.env.REACT_APP_BACKEND}/users`, {
            method: 'GET',
            credentials: 'include'
            })
            if(!foundUser.ok){
                throw Error(foundUser.statusText);
            }
            const parsed = await foundUser.json();
            console.log(parsed);
            // this.setState({
            //     users: parsed
            // })
        }catch(err){
            console.log(err);
            return err;
        }
    }
    componentDidMount(){
        this.getUsers();
    }
    render(){
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
            'ski/snowboard',
            'bar games',
            'boardgames',
            'running',
            'international travel',
            'calligraphy',
            'exercise',
            'vegan',
            'volunteering',
            'team sports',
            'reading',
            'coding',
            'trivia',
            'movie buff'
        ];
        const badgeArr = [];
        for(let i = 0; i < badges.length; i++) { 
            badgeArr.push(<div>
                <input type="checkbox" name="badgesWanted" value={badges[i]}/> {badges[i]} <br/>
                </div>
            );
        }
        const ages = [];
        for(let i = 18; i < 100; i++) { 
            ages.push(
                <option value={i}>{i}</option>
            )
        }

        // users.forEach((otherUser)=>{ 
        //     if(otherUser !== user) 
        //     <li><a href="/users/<%= otherUser._id %>"><%= otherUser.displayName %></a> <br/>
        //         <%= otherUser.gender %> <br/>
        //         Age: <%= otherUser.age %> <br/>
        //         Badges: <% otherUser.badgeList.forEach((badge)=>{ 
        //         <%= badge.title %>
        //      }) <br/>
        //     <img src="<%= otherUser.img %>">
        //     </li>

        // <% }) %>
        
        return(
            <div>
                <h1>These are the users</h1>
                <button class="filter-button">Filters</button>
                <section class="filters">
                    
                    <form action="/users" class="filter-form">
                        <div>
                            <h3>Gender:</h3>
                            <input type="checkbox" name="gender" value="Male"/> Male<br/>
                            <input type="checkbox" name="gender" value="Female"/> Female<br/>
                            <input type="checkbox" name="gender" value="Other"/> Other<br/>
                        </div>
                        
                        <div>
                            <h3>Age: </h3>
                            <select name="minAge">
                                {ages}
                            </select>
                            <small>-</small>
                            <select name="maxAge">
                                {ages}
                            </select>
                        </div>
                        
                        <div>
                            <h3>Badges</h3>
                            {badgeArr}
                        </div><br/>
                        
                        <button type="submit">Submit</button>
                    </form>

                </section>
                <section>
                    <ul>
                       
                    </ul>
                </section> 

                
            </div>
        )
    }
}

export default UsersContainer;

