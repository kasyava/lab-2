const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");



    const router = express.Router();

    router.post("/", (req, res) =>{
        const user = new User(req.body);

        user.generateToken();

        user.save()
            .then(user => res.send({username: user.username, token: user.token}))
            .catch(error => res.status(400).send(error));
    });

    router.post('/sessions', async (req, res) =>{

        const user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(400).send({error: 'Username not found'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if(!isMatch){
            return res.status(400).send({error: 'Password is wrong'});
        }



        //res.send(res.something);
        user.generateToken();

        await user.save();

        res.send({username: user.username, token: user.token})


    });



module.exports = router;