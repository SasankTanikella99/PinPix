const mongoose = require('mongoose')

// 3. Post Schema
const PostSchema = new mongoose.Schema({
     post_text: {
          type: String,
          // required: [true, 'Post text is required'] // a message will be displayed if post_text is not given as input
     },
     image:{
          type: String,

     },
     //7. storing user id
     user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'    // letting mongoose know that the id is from User model.
     },
     created_At:{
          type: Date,
          default: Date.now()
     },
     likes:{
          type: Array,   // storing user.id who liked the post
          default: []    
     }
})

//4. creating a post model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;