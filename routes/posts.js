
var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var _ = require('lodash');

router.get('/posts', getAllPosts);
router.get('/posts/random/:number', getRandomNumberOfPosts);
router.get('/posts/recent/:number', getTheMostRecentNumberOfPosts);
router.post('/posts', createPost);
router.get('/posts/:id', getPostById);
router.delete('/posts/:id', deletePost);
router.put('/posts/:id', updatePost);

module.exports = router;

function getAllPosts(req, res, next){
  Post.find({}, function(err, foundPosts){
    if(err){
      res.status(500).json({
        msg: err
      })
    } else {
      res.status(200).json({
        posts: foundPosts
      });
    }
  });
}
function createPost(req, res, next){
  var post = new Post({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    created: new Date(),
    updated: new Date()
  });
  post.save(function(err, newPost){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(201).json({
        post: newPost
      });
    }
  });
}
function getPostById(req, res, next){
  Post.findOne({_id: req.params.id}, function(err, foundPost){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        post: foundPost
      });
    }
  });
}
function deletePost(req, res, next){
  Post.findOneAndRemove({_id: req.params.id}, function(err, removedPost){
    if(err){
      res.status(500).json({
        msg: err
      })
    } else {
      res.status(200).json({
        removedPost: removedPost
      })
    }
  });
}
function updatePost(req, res, next){
  Post.findOneAndUpdate({_id: req.params.id},
    req.body,
    function(err, oldPost){
      if(err){
        res.status(500).json({
          msg: err
        });
      } else {
        res.status(200).json({
          oldPost: oldPost
        });
      }
    });
}


/**
 * The purpose of this route handler is to provide the ability to query the database
 * for a :number of recent blog posts based on ordering by date.
 * URL: /posts/recent/:number where :number would be the number that you want to request
 */
function getTheMostRecentNumberOfPosts(req, res, next){
  Post.find({}, function(err, posts){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      var numberOfPostsToGet = req.params.number; //grabbing the number from the url
      //The following variables uses lodash to order the posts array by the
      // create tag in ascending order. Remember the posts variables would be
      // an array that has objects in it that looks like the following:
      // {
      //  title: 'Awesome Post',
      //  body: "I have done some amazing things!",
      //  created: 2016-08-01T14:00:00Z
      //  author: 74iify4i82edujfk,
      //  updated: 2016-08-04T18:00:00Z
      // }
      var postsOrderedByDate = _.orderBy(posts, ['created'], ['asc']);
      // The following function takes the previous array of values and
      // grabs the first :number (for example 10) of posts of the ordered posts
      var firstNumberOfOrderedPosts = _.take(postsOrderedByDate, numberOfPostsToGet);
      //Return the first :number of date ordered posts
      res.status(200).json({
        posts: firstNumberOfOrderedPosts
      });
    }
  });
}


/**
 * getRandomNumberOfPosts - description
 *  The purpose of this function is to obtain all of the posts out of the database
 *  then randomize those posts. After randomizing those posts, then you will 'grab'
 *  the first :number of posts from the random posts.
 *  URL: /posts/random/:number where :number would be the number of posts that
 *    you requested
 */
function getRandomNumberOfPosts(req, res, next){
  Post.find({}, function(err, posts){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {

      var numOfPostsToGet = req.params.number; //grabbing the number from the url
      // The following variable uses lodash to randomize the array output
      var randomizedPosts = _.shuffle(posts);
      //The following function grabs the first :number of posts from the
      // randomized posts array
      var firstNumberOfRandomizedPosts = _.take(randomizedPosts, numOfPostsToGet);
      res.status(200).json({
        posts: firstNumberOfRandomizedPosts
      });
    }
  });
}
