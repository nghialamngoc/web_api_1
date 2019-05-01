const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// Model
var User = require('../models/user.model');

module.exports = {
  signUp: function (req, res, next) {
    User.find({ email: req.body.email })
      .exec()
      .then(data => {
        if (data.length >= 1)
          return res.status(409).json({
            message: "Your email is exits"
          })
        else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err)
              return res.status(500).json({
                error: err
              })
            else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(data => {
                  res.status(201).json({
                    message: 'User created',
                    newUser: data
                  })
                })
                .catch(err => {
                  res.status(500).json({
                    error: err
                  })
                })
            }
          })
        }
      })
      .catch(err => {
        return res.json({
          error: err
        })
      })

  },
  login: function (req, res, next) {
    
    User.find({ email: req.body.email })
      .exec()
      .then(result => {
        if(result.length < 1)
          return res.status(401).json({
            message: 'Auth faild'
          })
        
        bcrypt.compare(req.body.password, result[0].password, function(err, success){
          if(err || !success)
            return res.status(401).json({
              message: 'Auth faild'
            })       
          jwt.sign({
            email: result[0].email,
            userId: result[0]._id          
          }, process.env.JWT_KEY, { expiresIn: '1h'}, function(err, token){
            if(err)
              return res.status(500).json({
                message: err
              })
            res.status(200).json({
                token: token,
                message: 'Auth Successful'
            })
          });                  
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  },
  delete: function(req, res ,next){
    User.remove({_id: req.params.userId})
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'User deleted'
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  }
}