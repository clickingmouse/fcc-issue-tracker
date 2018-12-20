/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose=require('mongoose')
var router=require('express').Router()
var Issues=require('../models/issues')
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(function (req, res, next){
    /// show an array of all issues
      var project = req.params.project;
      console.log(">>> "+ req.params.project)
    Issues.find(function(err,data){
    console.log('finding...issues')
      if(err){next(err)}
      console.log(data)
      res.send(data)
    
    })
      
    })
    
    .post(function (req, res,next){
      var project = req.params.project;
    console.log(">>>posting in>>> "+ req.params.project)
    console.log(".....")
    console.log(req.body)
    console.log("================")
    var newIssue = {};
    newIssue.issue_title=req.body.issue_title;
    newIssue.issue_text=req.body.issue_text;
    newIssue.created_by=req.body.created_by;
    newIssue.assigned_to=req.body.assigned_to;
    newIssue.status_text=req.body.status_text; 
    console.log(newIssue)
    // add to data base
    
    var newIssueRecord = new Issues(newIssue)
    console.log('creating record')
    console.log(newIssueRecord)
    
    newIssueRecord.save(function(err,data){
      console.log('saving')
    if(err) {next(err)}
      console.log('saved success!')
      res.json(data)
      //next()
    })
                
    
    })
    
    .put(function (req, res, next){
      var project = req.params.project;
    console.log(">>>updating (put) in>>> "+ req.params.project)
      // get form data
   console.log(req.body)
    //newIssue.issue_text=
    Issues.update({_id:req.body._id},req.body,function(err,data){
    if(err){next(err)}
      console.log('updated')
      res.json(data)
    })
      
      

    //output form data
    })
    
    .delete(function (req, res, done){
      var project = req.params.project;
    console.log(">>>deleting in>>> "+ req.params.project)
    console.log(req.body)
      Issues.deleteMany({_id:req.body._id},function(err){
      if(err){ done(err)}
        
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleted")
        res.json({issue:"deleted"})
      
      })
    });
    
};
