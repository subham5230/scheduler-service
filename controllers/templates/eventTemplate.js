exports.eventTemplate = {
        calendarId: "primary",
        conferenceDataVersion: 1,
        maxAttendees: 100,
        resource: {
          start: {
            dateTime: "2022-08-06T21:00:00+05:30",
            // timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: "2022-08-06T22:00:00+05:30",
            // timeZone: "Asia/Kolkata",
          },
          attendees: [
            // {
            //   email: "gauthamd.das@gmail.com",
            // },
          ],
          reminders: {
            useDefault: false,
            overrides: [
              {
                method: "popup",
                minutes: 30,
              },
            ],
          },
          conferenceData: {
            createRequest: {
              requestId: "HopDr",
            },
          },
          summary: "HopDr",
          description: "HopDr",
        },
      }