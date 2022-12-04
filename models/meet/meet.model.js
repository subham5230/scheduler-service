let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const meetSchema = new Schema({
  id: {
    type: String,
    default: null,
  },
  htmlLink: String,
  summary: String,
  description: String,
  location: String,
  color_id: String,
  creator: {
    id: String,
    email: String,
    displayName: String,
    photoUrl: String,
  },
  attendees: [{
    email: String,
    displayName: String,
    photoUrl: String,
  }],
  date: String,
  start: {
    dateTime: String,
    timeZone: String,
  },
  end: {
    dateTime: String,
    timeZone: String,
  },
  conferenceData: {
    name: String,
    iconUri: String,
    meetType: String,
    uri: String,
    conferenceId: String,
  },
  reminders: {
    method: String,
    minutes: String,
  }
  
}, { timestamps: true });

var meetModel = mongoose.model("meets", meetSchema, "meets");

module.exports = meetModel;
