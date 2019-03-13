import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { PromiseProvider } from 'mongoose';

const Header = (props)=>{
    return(
        <div className="header">
            <h1>Badger</h1>
            <ul>
                <li>  <Link to="/myprofile"><button>My Profile</button></Link></li>
                <li>  <Link to="/swipe"><button>Start Swiping!</button></Link></li>
                <li><button onClick={props.logout}>Logout</button></li>
            </ul>
            
        </div>
    )
}

export default withRouter(Header);
