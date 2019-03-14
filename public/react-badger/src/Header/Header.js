import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Header = (props)=>{
    return(
        <div className="header">
            <img src="/badger_icon3.png" alt="badger icon" className="badger-icon"/>
            <ul>
                <li>  <Link to="/myprofile"><img className="header-icon" src="/profile_icon.jpg" alt="profile icon"/></Link></li>
                <li>  <Link to="/swipe"><img className="header-icon" src="/heart_icon.png" alt="heart"/></Link></li>
                <li>  <Link to={{
                    pathname: "/matches",
                    state: {
                        loggedIn: props.loggedIn
                    }}}><img className="header-icon" src="/match_icon.png" alt="matches"/></Link></li>
                
            </ul>
            
        </div>
    )
}

export default withRouter(Header);
