const UserModel = require("../models/user/user.model");
const Schedule = require("../models/schedule/schedule.model");
const { eventTemplate } = require("./templates/eventTemplate");
const { google } = require("googleapis");
const moment = require("moment/moment");
const MeetModel = require("../models/meet/meet.model");

exports.createMeet = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  let eventData = req.body;
  let event = eventTemplate;

  event.resource.conferenceDataVersion = 1;
  event.resource.start.dateTime =
    eventData.date + "T" + eventData.startTime + "+00:00";
  event.resource.end.dateTime =
    eventData.date + "T" + eventData.endTime + "+00:00";
  event.resource.summary = eventData.summary;
  event.resource.description = eventData.description;
  event.resource.attendees = [
    {
      email: eventData.email,
    },
    {
      email: `subhamyml@gmail.com`,
    },
  ];

  const createEventModel = (event) => {
    return new MeetModel({
      id: event.data.id,
      htmlLink: event.data.htmlLink,
      summary: event.data.summary,
      description: event.data.description,
      creator: event.data.creator,
      attendees: event.data.attendees,
      date: eventData.date,
      start: {
        dateTime: moment.utc(event.data.start.dateTime).format(),
      },
      end: {
        dateTime: moment.utc(event.data.end.dateTime).format(),
      },
      conferenceData: {
        name: event.data.conferenceData?.conferenceSolution.name,
        iconUri: event.data.conferenceData?.conferenceSolution.iconUri,
        meetType: event.data.conferenceData?.conferenceSolution.key.type,
        uri: event.data?.hangoutLink,
        conferenceId: event.data.conferenceData?.conferenceId,
      },
      reminders: event.data.reminders.overrides[0],
    });
  };

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.CALLBACK_URL
    );
    const calendar = google.calendar({ version: "v3" });
    const yml_admin = await UserModel.findOne({
      email: `subham@yellomonkey.com`,
    });
    oAuth2Client.setCredentials({ refresh_token: yml_admin.meta.refreshToken });
    calendar.events.insert(
      {
        auth: oAuth2Client,
        ...event,
      },
      async function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return res.send(
            "There was an error contacting the Calendar service: "
          );
        }

        const eventData = createEventModel(event);

        let eventResp = await eventData.save();

        return res.json({ success: true, event: eventResp });
      }
    );
  } catch (e) {
    res.send(e);
  }
};

exports.getMeetSlots = async (req, res) => {
  // console.log(req.user)
  // if (req.user.role !== "USER") {
  //   return res.json({
  //     success: false,
  //     message: "You are not authorized to fetch all slots",
  //   });
  // }

  let reqData = req.body;
  // let user = await User.findOne({ email: req.user.email }).exec();
  let schedule = await Schedule.findOne({
    isActive: true,
  }).exec();

  // get day from the date
  // let day = moment(reqData.date,'DDMMYYYY').format("e") // 0-6
  let day = moment(reqData.date, "DDMMYYYY").format("dddd"); // Sunday - Saturday")
  // console.log(day)

  let dayCode = day.toLowerCase().slice(0, 3);

  let eventDuration = schedule.availableTime.duration;
  // find day in the days
  let dayElem = schedule.availableTime.schedule_timings.find(
    (day) => day.day === dayCode
  );
  // console.log(dayElem)
  // sort based on start time string
  let dayValues = dayElem.values.sort((a, b) => {
    return a.start > b.start;
  });

  // console.log(dayValues)

  // get booked slots from events
  // let bookedSlots = appointment.events.filter(event => {
  //   return moment(event.start.datetime).format('MM-DD-YYYY') === moment(reqData.date,'DDMMYYYY').format('MM-DD-YYYY')
  // }
  // ).map(event => {
  //   return {
  //     start: moment(event.start.datetime).format('HH:mm'),
  //     end: moment(event.end.datetime).format('HH:mm'),
  //   }
  // }
  // )

  // console.log(appResp.length)
  let businessEvents = [];
  // find all the events for the business
  let eventResp = await MeetModel.find({
    date: moment(reqData.date, "DDMMYYYY").format("YYYY-MM-DD"),
    // $eq: new Date(moment(reqData.date,'DDMMYYYY').format('DD-MM-YYYY')),
  }).exec();
  // console.log(eventResp.length)
  eventResp.forEach((eventElem) => {
    // console.log(eventElem)
    let slotElem = {
      // ...eventElem
      start: moment.utc(eventElem._doc.start.dateTime).format("HH:mm"),
      end: moment.utc(eventElem._doc.end.dateTime).format("HH:mm"),
    };
    businessEvents.push(slotElem);
  });

  // console.log('BUSINESS EVENTS =>', businessEvents)

  // console.log(businessEvents)
  // not completed
  // let bookedSlots = []
  // let bookedSlots = [
  //   {
  //     start: "12:00",
  //     end: "12:30",
  //   },
  //   {
  //     start: "14:30",
  //     end: "17:00",
  //   },
  //   {
  //     start: "19:30",
  //     end: "20:00",
  //   },
  // ]
  // console.log(bookedSlotsArr)

  function isInclusive(timeSlot, bookedSlots) {
    for (let i = 0; i < bookedSlots.length; i++) {
      if (
        moment(bookedSlots[i].end, "HH:mm").format("HH:mm") <=
          moment(timeSlot.start, "HH:mm").format("HH:mm") ||
        moment(bookedSlots[i].start, "HH:mm").format("HH:mm") >=
          moment(timeSlot.end, "HH:mm").format("HH:mm")
      ) {
        continue;
      } else if (
        moment(bookedSlots[i].start, "HH:mm").format("HH:mm") <
          timeSlot.start &&
        moment(bookedSlots[i].end, "HH:mm").format("HH:mm") > timeSlot.start
      ) {
        return true;
      } else if (
        moment(bookedSlots[i].start, "HH:mm").format("HH:mm") >=
          timeSlot.start &&
        moment(bookedSlots[i].start, "HH:mm").format("HH:mm") < timeSlot.end
      ) {
        return true;
      }
      // console.log(1)
    }
    // console.log(2)
    return false;
  }

  // console.log(2)

  // create an array of time slots
  let timeSlots = [];

  // console.log(dayValues)
  for (let i = 0; i < dayValues.length; i++) {
    let tempTimeSlot = dayValues[i].start;
    // console.log('TEMP TIME SLOT ===>', tempTimeSlot)
    // console.log(moment(dayValues[i].end, "HH:mm"))
    while (true) {
      if (
        moment(tempTimeSlot, "HH:mm").add(eventDuration, "m") >
        moment(dayValues[i].end, "HH:mm")
      )
        break;

      const slot = `${reqData.date} ${tempTimeSlot}`;

      // if(!moment.utc(slot, 'DDMMYYYY HH:mm:ss').isAfter(moment())){
      //   tempTimeSlot = moment(tempTimeSlot, "HH:mm")
      //   .add(eventDuration, "m")
      //   .format("HH:mm");

      //   continue
      // }

      let timeSlot = {
        start: moment(tempTimeSlot, "HH:mm").format("HH:mm"),
        end: moment(tempTimeSlot, "HH:mm")
          .add(eventDuration, "m")
          .format("HH:mm"),
      };

      // console.log(timeSlot)
      // update tempTimeSlot with duration
      tempTimeSlot = moment(tempTimeSlot, "HH:mm")
        .add(eventDuration, "m")
        .format("HH:mm");

      if (isInclusive(timeSlot, businessEvents)) {
        // if (isInclusive(timeSlot,bookedSlots)){
        // console.log(timeSlot)
        continue;
      }
      // console.log(timeSlot)

      timeSlots.push(timeSlot);
    }
  }

  res.json({ success: true, slots: timeSlots });
};
