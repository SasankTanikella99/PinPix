var express = require('express');
var router = express.Router();
const User = require('./users')
const Post = require('./posts');
const passport = require('passport');
const upload = require("./multer")



//accessing passport local for user login, registration
const localStrategy = require('passport-local').Strategy
passport.use(new localStrategy(User.authenticate()))



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// route for regiser page
router.get('/register', function(req, res, next) {
  res.render('register');
});


//19. creating a route for login
router.get("/login", (req,res, next) => {
  // console.log(req.flash('error'))

  // 22. Since flashFailure: true that implies that, when there is a failure in login page, the message should be displayed here.

  // this displays an error message when there is an error.
  res.render('login', {error: req.flash('error')})
})

// 20. creating a route for profile page
router.get('/feed', (req, res, next) => {
  res.render('feed')
})

//18. creating a route for profile
router.get('/profile', isLoggedIn, async (req,res, next) => {
  const user = await User.findOne({
    username: req.session.passport.user
  }).populate('posts')
  console.log(user);
  //passing newUser  from your route handler to ejs
  res.render('profile', {user})
})

// 23. creating a route for uploading files via multer
// is loggedIn middleware is used because, when a user is logged in then only file is uploaded
router.post('/upload', isLoggedIn, upload.single('file'), async(req, res) => {
  if(!req.file){
    return res.status(400).send("No files were uploaded")
  }
  
  // 24. file uploaded successfully, but it is not saved in db. post id is given to user and userid is given to post.

  const user = await User.findOne({
    username: req.session.passport.user
  })
  const post = await Post.create({
    image: req.file.filename,
    post_text: req.body.post_caption,
    user: user._id
  })

  user.posts.push(post._id)
  await user.save()
  res.redirect("/profile")
})


// //5. create a route that creates a user
// router.get('/createuser', async (req, res, next) => {
//   const newUser = await User.create({
  // manual entry instead of using req.body
//     username: 'Naruto',
//     password: "rasengan",
//     posts:[],
//     profile_picture: "",
//     email: "uzumakin@example.com",
//     fullName: "Naruto Uzumaki",
//   })

//   res.send(newUser)
// })

// //6. create a route that creates a post
// router.get("/createpost", async (req, res, next) => {
//   const newPost = await Post.create({
//     post_text: "Hidden Leaf's hokage",
//     user:"663652786479faa0e8fa2659",
//     //created_At is set at default,
//     //likes is default:0
//   })

//   // 8. finding the user via id
//   const user = await User.findOne({_id: "663652786479faa0e8fa2659"})

//   // 9. user has a posts array and pushing post's id
//   user.posts.push(newPost._id)

//   //10. saving the id
//   await user.save()
  
//   res.send("done")
// })

// // 11. creating a route to get allposts
// router.get('/allposts', async (req,res,next) => {
//   //12. populate is used to convert the stored id into the posts data, we want only 'posts' so we pass what we want in populate method. If populate is not applied, we can only see posts's ids
//   const allposts = await User.findOne({_id:"663652786479faa0e8fa2659"}).populate('posts')
//   res.send(allposts)
// })

// 14. creating a route for registering users
router.post('/register', async(req, res) => {
  // we are creating users, so these fields are mandatory
  const userData = await new User({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  })

  /*
  or
  const {username, email, fullname} = req.body;
  const userData = new User({username, email, fullname});
  */

  // as soon as a user registers, that user is redirected to profile page
  User.register(userData, req.body.password)
  .then(() => {
    passport.authenticate("local")(req,res, () => {
      res.redirect('/profile')
    })
  })
})

// 15. creating a route for user login
router.post('/login', passport.authenticate("local", {
  successRedirect:'/profile' ,
  failureRedirect : '/login',
  // 21. installing flash messages so that, if the password is wrong or username is wrong a message is shown
  failureFlash:true
}), (req, res) =>{

}
)

//16. creating a route for logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if(err){
      return next(err)
    }
    res.redirect('/login')
  })
})

// 17. middleware for successful authentication
function isLoggedIn(req, res, next){
  // if the user logs in and login is successful => next() ,else redirected to login page
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}




module.exports = router;
