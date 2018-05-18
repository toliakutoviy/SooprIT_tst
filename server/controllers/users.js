//const env       = process.env.NODE_ENV || 'development';
//const config    = require('@config')[env];
const Users = require('@model').User;
const auth = require('./auth');
const validator = require('validator');
 

module.exports = {
  login :(req, res) => {
    if(req.body.email && req.body.password){
      let email = req.body.email;
      let password = req.body.password;
      let tmpUser = {};
      Users.findOne({
        where:{
          email:email
        }
      })
        .then(user => {
          if(!user){
            throw new Error('Auth err');
          } else {
            tmpUser = user;
            return user.validPassword(password);
          }
        })
        .then(result => {
          if(result){
            let token = auth.getToken({id: tmpUser.id}); 
            res.json({message: 'ok', token: token});
          }
          else
            throw new Error('Auth err');
        })
        .catch(err => {
          res.status(400).send({'error':err.message});
        });
    }
    else  
      res.status(400).send({error:'Auth error'});
        
  },
  //--------------------------------
  register : (req, res) =>{
    if (req.body.email && req.body.password && validator.isEmail(req.body.email))
      return Users.findOne({
        where:{
          email:req.body.email
        }
      }).then((user) => {
        if(user) throw new Error('not unique email');
        return Users
          .create({
            password:req.body.password,
            email:req.body.email,
            role:'user',
          });
      }) 
        .then(user => res.status(201).send(user))
        .catch((error) => res.status(200).send({error:error.message}));
    else
      res.status(400).send({error: 'invalid arguments'});
  },
  //--------------------------------
  getAllUsers : (req,res) => {
    Users.findAll()
      .then(users => {
        res.status(200).send(users);
      })
      .catch(err => {
        res.status(500).send({error:err.message});
      });
  },
  //--------------------------------
  deleteUser:(req,res) => {
    if(req.params.id && validator.isInt(req.params.id) && (req.params.id != req.user.id))
      Users.findById(req.params.id)
        .then(user=>{
          if(user)
            return user.destroy();
          else
            throw new Error('no user');
        })
        .then(user => {
          res.status(200).send(user);
        })
        .catch(err => {
          res.status(500).send({error:err.message});
        });
    else
      res.status(400).send({error:'wrong id'});
  },
};
