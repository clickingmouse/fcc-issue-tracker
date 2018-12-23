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
//var Issues=require('../models/issues')
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
var Schema = mongoose.Schema
var shortid=require('shortid')

//var _ObjectId = require('mongodb').ObjectID;
//var ObjectId = mongoose.Schema.Types.ObjectId;
var issuesSchema = new Schema({
  issue_title:{ 
    type: String,
    required: true
    },
  issue_text:{
    type: String,
    required: true
    },
  created_by:{
    type: String,
    required: true
    },
  assigned_to:{type:String, 
               default:"" },
  status_text:{type:String,
               default:"" },
  open:{type: Boolean,
          default: true},
  created_on:{
    type: Date,
    default: Date.now
    },
  updated_on:{
  type: Date,
    default: Date.now
    },
  _id:{
    type: String,
    default:shortid.generate,
    //index:true
    }
  })

module.exports = function (app) {

  
// GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
//I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). 
  //I can pass along as many fields/values as I want.

  
  
  
  app.route('/api/issues/:project')
    .get(function (req, res, next){
    /// show an array of all issues
    var project = req.params.project;
    var projectCollection = mongoose.model(project, issuesSchema);
      //var project = req.params.project;
    var searchQuery=req.query
    
    //  console.log("(GET)>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+ req.params.project)
    //console.log(req.query)
    //console.log(".") 
    projectCollection.find(req.query,function(err,data){
    //console.log('finding...issues')
      if(err){next(err)}
      //console.log(data)
      res.send(data)
    
    })
      
    })
  
  
    
    .post(function (req, res,next){
      var project = req.params.project;
    var projectCollection = mongoose.model(project, issuesSchema);
    //console.log(">>>posting in>>> "+ req.params.project)
    //console.log(".....")
   // console.log(req.body)
    //console.log("================")
    var newIssue = {};
    newIssue.issue_title=req.body.issue_title;
    newIssue.issue_text=req.body.issue_text;
    newIssue.created_by=req.body.created_by;
    newIssue.assigned_to=req.body.assigned_to ;
    newIssue.status_text= req.body.status_text != null ? req.body.status_text : "";  
    newIssue.open=req.body.open; 
    newIssue.updated_on=req.body.updated_on ;
    //newIssue._id=req.body._id
    //console.log("------------------------------------")  
    //console.log(newIssue) 
    // add to data base
    
    var newIssueRecord = new projectCollection(newIssue) 
    //console.log('creating record')
    //console.log(newIssueRecord)
     
    if(!newIssue.issue_title || !newIssue.issue_text || !newIssue.created_by) {
        res.send('missing inputs');
      } else {
    
    newIssueRecord.save(function(err,data){
      //console.log('saving')
    if(err) {next(err)}
      //console.log('saved success!')
      res.json(data)
      //next()
    })
      }//else           
    
    })
    
   //can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. 
  //Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. 
  //If no fields are sent return 'no updated field sent'.
  
    .put(function (req, res, next){
      var project = req.params.project;
    var projectCollection = mongoose.model(project, issuesSchema);
    //console.log(">>>updating (put) in>>> "+ req.params.project)
    //console.log(req.body)
      // get form data 
    var fieldsArr = Object.keys(req.body)
    var fieldsArrNoId = fieldsArr.filter((key)=>key != '_id')
    //console.log("fieldsArr = "+ fieldsArr) 
    //console.log("no id arr = " + fieldsArrNoId) 
    //newIssue.issue_text=
//    if (Object.keys(req.body).length === 0){
    if ( fieldsArrNoId.length == 0){

    //console.log('i see no body')
    //  console.log(req.body) 
    //} else {
    //console.log("body does exists!") 
    res.send('no updated field sent')  
    }  
    
    
    projectCollection.findByIdAndUpdate({_id:req.body._id}, req.body, function(err,data){
    if(err){next(err)}
      //console.log('updated')
      res.send('successfully updated') 
    })
      
      

    //output form data
    })
    
  
  //DELETE /api/issues/{projectname} with a _id to completely delete an issue. 
  //If no _id is sent return '_id error', 
  //success: 'deleted '+_id, 
  //failed: 'could not delete '+_id.
    .delete(function (req, res, done){
      var project = req.params.project;
    var projectCollection = mongoose.model(project, issuesSchema);
    //console.log(">>>deleting in>>> "+ req.params.project)
    //console.log(req)
    //console.log(JSON.stringify(req.query))
    //console.log('id :: ' + req.body._id)
    if (req.query._id == ''){
      //console.log("-----> no id")
res.send('_id error')    
    } else {
      projectCollection.deleteMany({_id:req.query._id},function(err){
      if(err){ 
        res.send('could not delete ' + '_id')
        //done(err) 
      } 
      
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleted")
        res.send('deleted ' +req.query._id )      
      })
    } //else
    
    });
    
};
