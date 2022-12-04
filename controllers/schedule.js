const Schedule = require('../models/schedule/schedule.model')
const moment = require("moment");

exports.createSchedule = async (req, res) => {
    // console.log(req.user)
    // var uT = uuid.v4();
    // return res.json({success:true, ...req.body})
    // if (req.user.user.role !== "BUSINESS") {
    //   return res.json({
    //     success: false,
    //     message: "You are not authorized to create an appointment",
    //   });
    // }
  
    let reqData = req.body;
  
    // let business = await User.findOne({ id: req.user.user.id }).exec();
    // // console.log(business._id)
    let daysElem = [];
    let allDays = Object.keys(reqData.slots);
    for (let i = 0; i < allDays.length; i++) {
      let dayElem = {
        day: allDays[i],
        values: [
          {
            ...reqData.slots[allDays[i]],
          },
        ],
      };
      daysElem.push(dayElem);
    }
  
    let schedule = new Schedule({
      name: reqData.name,
      isActive: reqData.isActive,
      availableTime: {
        start: {
          datetime: reqData.startDate,
          timeZone: reqData.timezone,
        },
        end: {
          datetime: reqData.endDate,
          timeZone: reqData.timezone,
        },
        duration: reqData.duration,
  
        schedule_timings: daysElem
      },
    });
    
    await schedule.save()
  
    // genTok: while (true) {
    //   var uT = generateApiKey({
    //     method: "string",
    //     length: 6,
    //     pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    //     // length: 2,
    //     // pool: 'ab',
    //   });
    //   console.log(uT);
    //   var connTok = new connectToken({
    //     bussiness_id: business._id,
    //     token: uT,
    //     expiry: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    //   });
    //   try {
    //     var { _id } = await connTok.save();
    //   } catch (e) {
    //     // console.log(e)
    //     continue genTok;
    //   }
    //   // console.log(_id)
    //   if (!_id) continue genTok;
    //   break;
    // }
    // // findandupdate the appointment with the connect token
    // await Appointment.findOneAndUpdate(
    //   { _id: appt._id },
    //   { $set: { connectionToken: uT } }
    // ).exec();
    // // console.log(a)
    // // res.json({success: true, token: uT})
    res.json({ success: true, schedule: schedule});
}

exports.getActiveSchedule = async (req, res) => {
    const schedule = await Schedule.findOne({isActive: true})

    let dates = {
        excludeDays: [],
        availableTime: {
          start: moment(schedule.availableTime.start.datetime).format(
            "MM-DD-YYYY"
          ),
          end: moment(schedule.availableTime.end.datetime).format("MM-DD-YYYY"),
          duration: schedule.availableTime.duration,
        },
      };
    
      schedule.availableTime.schedule_timings.forEach((day) => {
        // console.log(dayMM-DD0].start)
        if (day.values[0].start === undefined) {
          // convert mon to sun into 0 to 6
          let dayNum = moment(day.day, "dddd").day();
          dates.excludeDays.push(dayNum);
        }
      });
    
      res.json({ success: true, dates: dates })
}