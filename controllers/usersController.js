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
const Review = require('../models/reviews');


const genderList = ['male','female','other'];
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
    'bar_games',
    'boardgames',
    'running',
    'international_travel',
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

router.route('/')
    // index
    .get(async (req,res)=>{
        try{
            // console.log(req.query, ' req.query');
            const loggedIn = await User.findOne({'username': req.session.username});
            if(JSON.stringify(req.query) == "{}"){
                const allUsers = await User.find({ 'username': {$ne: req.session.username} });
                console.log(allUsers, ' raw allUsers');
                res.json({
                    status: 200,
                    data: allUsers
                })
            }else{
                let filteredUsers = await User.find({ 
                    $and: [
                        { 'username': {$ne: loggedIn.username} }
                    ]
                });
                console.log(filteredUsers, ' raw filteredUsers');
                // filter by age
                filteredUsers = (req.query.minAge && req.query.maxAge) ? filteredUsers.filter((user)=>{
                    return (user.age >= req.query.minAge && user.age <=  req.query.maxAge);
                }) : filteredUsers;
                // filter by gender
                if(req.query.gender){
                    if(!Array.isArray(req.query.gender)){
                        req.query.gender = [req.query.gender];
                    }
                    filteredUsers = filteredUsers.filter((user)=>{
                        return req.query.gender.indexOf(user.gender) > -1;
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
                console.log(req.query, ' req.query');
                console.log(filteredUsers, ' filteredUsers');
                res.json({
                    status: 200,
                    data: filteredUsers
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
        console.log(req.params.id, req.session.userId)
        if(req.session.userId.toString() === req.params.id.toString()){
            console.log('do they match?')
            try{
                await User.findByIdAndDelete(req.params.id);
                req.session.destroy((err)=>{
                    console.log('trying to destroy session')
                    if(err){
                        res.send(err);
                    }
                    res.json({
                        status: 200,
                        data: 'Successfully deleted user and logout successful'
                    })
                })
            }catch(err){
                res.send(err);
            }
        }
    })

router.route('/:id/connections')
    .post(async (req,res)=>{
        try{
            const foundUser = await User.findById(req.params.id);
            const likedUser = await User.findById(req.body.id);
            foundUser.likedUsers.addToSet(likedUser._id);
            if(likedUser.likedUsers.includes(String(foundUser._id))){
                console.log(likedUser.likedUsers, ' likedUser.likedUsers');
                foundUser.matchedUsers.addToSet(String(likedUser._id));
                likedUser.matchedUsers.addToSet(String(foundUser._id));
                await likedUser.save();
                await foundUser.save();
            }
            await foundUser.save();
            res.json({
                status: 200,
                data: foundUser
            })
        }catch(err){
            console.log(err);
            return err;
        }
    })

router.route('/:id/badges')
    // post new badge
    .post(async (req,res)=>{
        console.log(req.body, ' new badge req.body');
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

router.route('/:id/reviews')
    // post new review
    .post(async (req,res)=>{
        console.log(req.body, ' new review req.body');
        try{
            const reviewer = await User.findById(req.params.id);
            const reviewee = await User.findById(req.body.reviewee_id);
            const newReview = await Review.create({
                text: req.body.text,
                reviewee_id: req.body.reviewee_id,
                stars: req.body.stars
            });
            reviewer.reviewsWritten.push(newReview);
            reviewee.reviewsReceived.push(newReview);
            await reviewer.save();
            await reviewee.save();
            const allUsers = await User.find({ 
                'username': {$ne: req.session.username}
            });
            res.json({
                status: 200,
                reviewer: reviewer,
                users: allUsers
            });
        }catch(err){
            console.log(err);
            res.send(err);
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