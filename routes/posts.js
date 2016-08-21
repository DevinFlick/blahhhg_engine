
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
function getTheMostRecentNumberOfPosts(req, res, next){
  Post.find({}, function(err, posts){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      var numberOfPostsToGet = req.params.number;
      var postsOrderedByDate = _.orderBy(posts, ['created'], ['asc']);
      var firstNumberOfOrderedPosts = _.take(postsOrderedByDate, numberOfPostsToGet);
      res.status(200).json({
        posts: firstNumberOfOrderedPosts
      });
    }
  });
}
function getRandomNumberOfPosts(req, res, next){
  Post.find({}, function(err, posts){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      var numOfPostsToGet = req.params.number;
      var randomizedPosts = _.shuffle(posts);
      var firstNumberOfRandomizedPosts = _.take(randomizedPosts, numOfPostsToGet);
      res.status(200).json({
        posts: firstNumberOfRandomizedPosts
      });
    }
  });
}
