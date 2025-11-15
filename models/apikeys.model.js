const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const apiKeySchema = new Schema({
    createdby: {
        type: ObjectId,
        ref: 'User',
        required: true
      },
    
      key: {
        type: String,
        required: true,
        unique: true
      },
    
      active: {
        type: Boolean,
        default: true
      }
    
}, {
    timestamps : true
})


const ApiKeyModel = mongoose.model('apikey', apiKeySchema)

module.exports = {
    ApiKeyModel : ApiKeyModel   
}