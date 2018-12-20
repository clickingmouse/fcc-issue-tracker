const mongoose=require('mongoose')
var Schema = mongoose.Schema
var shortid=require('shortid')

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
  assigned_to:String,
  status:Boolean,
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
    index:true
    }
  })

var Issues = mongoose.model('Issues',issuesSchema)
module.exports = Issues

