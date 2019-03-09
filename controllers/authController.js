const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');

const genderList = ['Male','Female','Other'];
const ageList = [];
for(let i = 18; i < 100; i++){
    ageList.push(i);
}

// login // signin
router.route('/login')
    .post(async(req, res) => {
        try {
            const foundUser = await User.findOne({'username': req.body.username});
            if(foundUser){
                if(bcrypt.compareSync(req.body.password, foundUser.password)){
                    req.session.message = '';
                    req.session.userId = foundUser._id;
                    req.session.username = foundUser.username;
                    req.session.logged = true;
                    console.log(req.session, ' req.session')
                    res.json({
                        status: 200,
                        data: 'login successful',
                        info: foundUser
                    })
                }else{
                    res.json({
                        status: 200,
                        data: 'Incorrect username or password'
                    })
                }
            }else{
                res.json({
                    status: 200,
                    data: 'User not found'
                })
            }
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

// logout // signout

router.route('/logout')
    .get((req,res)=>{
        req.session.destroy((err)=>{
            if(err){
                res.send(err);
            }
            res.json({
                status: 200,
                data: 'logout successful'
            })
        });
    });

// registration // create account

// router.route('/createuser')
//     .get((req,res)=>{
//         res.render('auths/createuser.ejs', {
//             message: req.session.message,
//             genderList,
//             ageList
//         });
//     })


router.post('/registration', async (req,res)=>{
    try{
        const hashedPass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        req.body.password = hashedPass;
        const createdUser = await User.create(req.body);
        req.session.logged = true;
        req.session.username = req.body.username;
        res.json({
            status: 200,
            data: 'registration successful'
        })
    }catch(err){
        console.log(err);
        res.send(err);
    }
    
    })



module.exports = router;