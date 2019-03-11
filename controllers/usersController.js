const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const paginate = require('paginate')({
    mongoose: mongoose
});

const User = require('../models/users');
const Badge = require('../models/badges');
const EventModel = require('../models/events');


const genderList = ['Male','Female','Other'];
const ageList = [];
for(let i = 18; i < 100; i++){
    ageList.push(i);
}
const badgeTitles = [
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

router.route('/')
    // index
    .get(async (req,res)=>{
        const loggedIn = await User.findOne({'username': req.session.username});
        try{
            if(JSON.stringify(req.query) == "{}"){
                const allUsers = await User.find({
                    'username': {$ne: req.session.username}
                });
                const parsed = await allUsers.json();
                console.log(parsed, ' parsed users');
                res.json({
                    status: 200,
                    data: parsed
                })
                // res.render('users/index.ejs', {
                //     users: allUsers,
                //     user: loggedIn,
                //     genderList: genderList,
                //     badges: badgeTitles,
                //     sessionId: req.session.userId
                // })
            }else{
                let filteredUsers = await User.find({'username': {$ne: req.session.username}});
                // filter by age
                filteredUsers = filteredUsers.filter((user)=>{
                    return (user.age >= req.query.minAge && user.age <=  req.query.maxAge);
                });
                // filter by gender
                if(req.query.gender){
                    if(!Array.isArray(req.query.gender)){
                        req.query.gender = [req.query.gender];
                    }
                    filteredUsers = filteredUsers.filter((user)=>{
                        return req.query.gender.includes(user.gender);
                    });
                }
                // filter by badges wanted
                if(req.query.badgesWanted){
                    if(!Array.isArray(req.query.badgesWanted)){
                        req.query.badgesWanted = [req.query.badgesWanted];
                    }
                    filteredUsers = filteredUsers.filter((user)=>{
                        return req.query.badgesWanted.every((badgeName)=>{
                            let badgeTitleList = user.badgeList.map((badge)=> badge.title)
                            return badgeTitleList.includes(badgeName);
                        });
                    });
                }
                console.log(req.query);
                res.render('users/index.ejs', {
                    users: filteredUsers,
                    user: loggedIn,
                    genderList: genderList,
                    badges: badgeTitles,
                    sessionId: req.session.userId
                })
            }
        }catch(err){
            console.log(err);
            res.send(err);
        }
    })
    // post
    .post(async (req,res)=>{
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        const userDbEntry = {};
        userDbEntry.username = req.body.username;
        userDbEntry.password = hashedPassword;
        userDbEntry.email = req.body.email;
        userDbEntry.displayName = req.body.displayName;
        userDbEntry.age = req.body.age;
        userDbEntry.gender = req.body.gender
        userDbEntry.about = req.body.about;
        try{
            const userExists = await User.findOne({'username': userDbEntry.username});
            if(!userExists){
                req.session.message = '';
                const createdUser = await User.create(userDbEntry);
                req.session.userId = createdUser._id;
                req.session.username = createdUser.username;
                req.session.logged = true;
                res.redirect(`/users/${createdUser._id}`);
            }else{
                req.session.message = 'USER ALREADY EXISTS, PLEASE MAKE A DIFFERENT ACCOUNT';
                res.redirect('/auths/createuser');
            }
            
        }catch(err){
            console.log(err);
            res.send(err);
        }
    });

router.route('/:id')
    // show profile
    .get(async (req,res)=>{
        try{
            const foundUser = await User.findById(req.params.id);
            res.json({
                status: 200,
                data: foundUser
            })
        }catch(err){
            res.send(err);
        }
    })
    // post new badge
    .post(async (req,res)=>{
        console.log(req.body)
        try{
            const foundUser = await User.findById(req.params.id);
            const newBadge = await Badge.create({
                title: req.body.title,
                events: req.body.events
            });
            foundUser.badgeList.push(newBadge);
            await foundUser.save();
            res.json({
                status: 200,
                data: foundUser
            });
        }catch(err){
            console.log(err);
            res.send(err);
        }
    })
    // update profile
    .put(async (req,res)=>{
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.json({
                status: 200,
                data: updatedUser
            })
        }catch(err){
            res.send(err);
        }
    })
    // delete account
    .delete(async (req,res)=>{
        if(req.session.userId === req.params.id){
            try{
                await User.findByIdAndDelete(req.params.id);
                res.json({
                    status: 200,
                    data: 'Successfully deleted user'
                })
            }catch(err){
                res.send(err);
            }
        }else{
            res.send("AH AH AH, YOU DIDN'T SAY THE MAGIC WORD");
        }
    })

router.route('/:id/badges/:badgeId')
    .get(async (req,res)=>{
        try{
            const foundUser = await User.findById(req.params.id);
            if(foundUser){
                const foundBadge = foundUser.badgeList.id(req.params.badgeId);
                res.json({
                    status: 200,
                    data: foundBadge
                })
            }
        }catch(err){
            console.log(err);
            return err;
        }
    })
    .delete(async (req,res)=>{
        try{
            const foundUser = await User.findOne({'badgeList._id': req.params.badgeId});
            foundUser.badgeList.id(req.params.badgeId).remove();
            await foundUser.save();
            res.json({
                status: 200,
                data: foundUser
            });
        }catch(err){
            console.log(err);
            return err;
        }
        
    })

module.exports = router;