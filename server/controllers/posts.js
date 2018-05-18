const Posts = require('@model').Posts;
const validator = require('validator');

module.exports = {
  getAllPosts: (req,res) => {
    let options = {};
    if(req.query.query)
      options = { 
        where: {
          text: {
            $like: '%' + req.query.query + '%'
          }
        }
      };
    Posts.findAll(options)
      .then(posts => {
        res.status(200).send(posts);
      })
      .catch(err => {
        res.status(500).send({error:err.message});
      });
  },
  //--------------------------------
  getUserPosts: (req,res) =>{
    Posts.findAll({
      where:{
        userId:req.user.id
      }})
      .then(posts => {
        res.status(200).send(posts);
      })
      .catch(err => {
        res.status(500).send({error:err.message});
      });
  },
  //--------------------------------
  addPost:(req,res) => {
    if(req.body.text)
      return Posts
        .create({
          userId:req.user.id,
          text:req.body.text
        })
        .then(post => res.status(201).send(post))
        .catch(error => res.status(400).send({error:error.message}));
    else
      res.status(400).send({error:'wrong arguments'});
  },
  //--------------------------------
  updatePost:(req,res) => {
    if(req.params.id && validator.isInt(req.params.id) && req.body.text)
      Posts.findById(req.params.id)
        .then(post=>{
          if((req.user.id === post.userId) || (req.user.role === 'admin'))
          {
            post.text = req.body.text;
            return post.save();
          }
          else
            throw new Error('access denied');
        })
        .then(post => {
          res.status(200).send(post);
        })
        .catch(error => res.status(400).send({error:error.message}));
  },
  //--------------------------------
  deletePost:(req,res) => {
    if(req.params.id && validator.isInt(req.params.id) && req.body.text)
      Posts.findById(req.params.id)
        .then(post=>{
          if((req.user.id === post.userId) || (req.user.role === 'admin'))
            return post.destroy();
        })
        .then(post => {
          res.status(200).send(post);
        })
        .catch(error => res.status(400).send({error:error.message}));
  },
};