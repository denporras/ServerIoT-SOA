const Alarm = require("../../../models/alarm");
const schedule = require('node-schedule');

var window1Open;
var window1Close;

var window2Open;
var window2Close;

function createAlarmRoutes(server, mqttSubscriber) {
    server.route([
        {
            method: "GET",
            path: "/api/v1/alarms",
            handler: function (request, reply) {
                return Alarm.find();
            }
        },
        {
            method: "POST",
            path: "/api/v1/alarms/open",
            handler: async (request, reply) => {
                const { window, hour, minutes, days } = request.payload;
                var response = await Alarm.findOneAndUpdate(
                    { window, state: 1},
                    {
                        active: true,
                        hour,
                        minutes,
                        days
                    },
                    { new: true });
                
                var rule = new schedule.RecurrenceRule();
                rule.dayOfWeek = days;
                rule.hour = hour;
                rule.minute = minutes;
                if (window == 1) {
                    if (window1Open != undefined) {
                        window1Open.cancel();
                    }
                    window1Open = schedule.scheduleJob(rule, function () {
                        mqttSubscriber.publish('house/window', JSON.stringify(response));
                    });
                } else {
                    if (window2Open != undefined) {
                        window2Open.cancel();
                    }
                    window2Open = schedule.scheduleJob(rule, function () {
                        mqttSubscriber.publish('house/window', JSON.stringify(response));
                    });
                }
                return reply.response(response);
            }
        },
        {
            method: "POST",
            path: "/api/v1/alarms/close",
            handler: async (request, reply) => {
                const { window, hour, minutes, days } = request.payload;
                var response = await Alarm.findOneAndUpdate(
                    { window, state: 0 },
                    {
                        active: true,
                        hour,
                        minutes,
                        days
                    },
                    { new: true });
                
                var rule = new schedule.RecurrenceRule();
                rule.dayOfWeek = days;
                rule.hour = hour;
                rule.minute = minutes;
                if (window == 1) {
                    if (window1Close != undefined) {
                        window1Close.cancel();
                    }
                    window1Close = schedule.scheduleJob(rule, function () {
                        mqttSubscriber.publish('house/window', JSON.stringify(response));
                    });
                } else {
                    if (window2Close != undefined) {
                        window2Close.cancel();
                    }
                    window2Close = schedule.scheduleJob(rule, function () {
                        mqttSubscriber.publish('house/window', JSON.stringify(response));
                    });
                }
                return reply.response(response);
            }
        },
        {
            method: "POST",
            path: "/api/v1/alarms/close/cancel",
            handler: async (request, reply) => {
                const { window } = request.payload;
                var response = await Alarm.findOneAndUpdate(
                    { window, state: 0 },
                    {
                        active: false,
                    },
                    { new: true });
                
                if (window == 1) {
                    if (window1Close != undefined) {
                        window1Close.cancel();
                    }
                } else {
                    if (window2Close != undefined) {
                        window2Close.cancel();
                    }
                }
                return reply.response(response);
            }
        },
        {
            method: "POST",
            path: "/api/v1/alarms/open/cancel",
            handler: async (request, reply) => {
                const { window } = request.payload;
                var response = await Alarm.findOneAndUpdate(
                    { window, state: 1 },
                    {
                        active: false,
                    },
                    { new: true });
                
                if (window == 1) {
                    if (window1Open != undefined) {
                        window1Open.cancel();
                    }
                } else {
                    if (window1Open != undefined) {
                        window1Open.cancel();
                    }
                }
                return reply.response(response);
            }
        }
    ]);
}

module.exports = createAlarmRoutes;
