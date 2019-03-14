import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { PromiseProvider } from 'mongoose';

const Header = (props)=>{
    return(
        <div className="header">
            <h3>Badger</h3>
            <ul>
                <li>  <Link to="/myprofile"><img className="profile-icon" src="/profile_icon.jpg" alt="profile icon"/></Link></li>
                <li>  <Link to="/swipe"><img className="heart-icon" src="/heart_icon.png" alt="heart"/></Link></li>
                
            </ul>
            
        </div>
    )
}

export default withRouter(Header);
