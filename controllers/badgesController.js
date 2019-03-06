const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Badge = require('../models/badges');

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
    .get(async (req,res)=>{
        try{
            const foundUser = await User.findById(req.userId);
            res.render('users/show.ejs', {
                user: foundUser
            });
        }catch(err){
            res.send(err);
        }
    })

router.route('/new')
    .get(async (req,res)=>{
        try{
            const foundUser = await User.findById(req.userId);
            const allBadges = await Badge.find({});
            res.render('badges/newBadge.ejs', {
                user: foundUser,
                allBadges: allBadges,
                badgeTitles: badgeTitles,
                sessionId: req.session.userId
            })
        }catch(err){
            console.log(err);
            res.send(err);
        }
    })

router.route('/:id')
    .get(async (req,res)=>{
        try{
            const foundUser = await User.findById(req.userId);
            const foundBadge = await Badge.findById(req.params.id);
            res.render('badges/show.ejs', {
                badge: foundBadge,
                user: foundUser,
                sessionId: req.session.userId
            });
        }catch(err){
            res.send(err);
        }
    })
    .delete(async (req,res)=>{
        try{
            await Badge.findByIdAndDelete(req.params.id);
            const foundUser = await User.findOne({'badgeList._id': req.params.id});
            foundUser.badgeList.id(req.params.id).remove();
            await foundUser.save();
            res.redirect(`/users/${req.userId}`);
        }catch(err){
            console.log(err);
            res.send(err);
        }
    })

module.exports = router;