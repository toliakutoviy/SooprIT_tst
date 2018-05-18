const usersController = require('@controllers').Users;
const auth = require('@controllers').auth;
const postsController = require('@controllers').Posts;

module.exports = (app) => {
  // app.all("/api/message", function(req, res, next) {
  //       res.header("Access-Control-Allow-Origin", "*");
  //       res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  //       res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  //       return next();
  //     });
  
  // логин и регистрация
  app.post('/api/auth/register', usersController.register);
  app.post('/api/auth/login', usersController.login);
  
  app.use('/api/me/', auth.passport.authenticate('jwt', { session: false }));
  app.use('/api/users/', auth.passport.authenticate('jwt', { session: false }));
  app.use('/api/posts/', auth.passport.authenticate('jwt', { session: false }));
  
  // посты
  app.get('/api/posts', postsController.getAllPosts);
  app.get('/api/me/posts', postsController.getUserPosts);
  app.post('/api/me/post',postsController.addPost);
  app.post('/api/me/post/:id',postsController.updatePost);
  app.delete('/api/me/post/:id',postsController.deletePost);
  
  // админ
  app.post('/api/posts/:id',auth.checkAdmin,postsController.updatePost);
  app.delete('/api/posts/:id',auth.checkAdmin, postsController.deletePost);
  app.get('/api/users',auth.checkAdmin,usersController.getAllUsers);
  app.delete('/api/users/:id',auth.checkAdmin,usersController.deleteUser);
};