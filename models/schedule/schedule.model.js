let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const scheduleSchema = new Schema({

  name: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  availableTime: {
    start: {
      datetime: String,
      timeZone: String,
    },
    end: {
      datetime: String,
      timeZone: String,
    },
    duration: String,

    schedule_timings: [
          {
            day: String,
            values: [
              {
                start: String,
                end: String,
              }
            ]
          }
        ],

  },

  exclusions: [
    {
        date: String,
        time: {
            start: String,
            end: String
        }
    }
  ]

}, {timestamps: true});

var scheduleModel = mongoose.model("schedules", scheduleSchema, "schedules");

module.exports = scheduleModel;
