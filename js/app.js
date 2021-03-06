(function (exports) {

    'use strict';

    var textSetAlarm = 'Set Alarm';
    var textUpdating = 'Updating...';

    var timeRegexPattern = /([01][0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}/;

    exports.app = new Vue({

        // the root element that will be compiled
        el: '.sunriseuiapp',

        // app initial state
        data: {
            device: storage.fetchDevice(),
            deviceIsOnline: false,
            deviceLastStatus: new Date().toLocaleTimeString(),
            ajaxRequestError: false,

            timerDeviceStatus: '',
            timerOnlineCheck: '',
            timerLastChecked: '',

            globalAlarmStatus: false,
            globalDstStatus: false,
            sunriseDuration: '',
            lightOffOffset: '',

            weekdayAlarmTime: '',
            weekdayAlarmStatus: false,
            weekendAlarmTime: '',
            weekendAlarmStatus: false,

            button: {
                weekday: textSetAlarm,
                weekend: textSetAlarm
            }
        },

        created: function () {
            this.checkDeviceOnlineStatus();
            this.timerOnlineCheck = window.setInterval(this.checkDeviceOnlineStatus, 5000);
            //this.timerDeviceStatus = window.setInterval(this.updateDeviceStatus, 10000);
        },

        mounted: function () {
            //this.updateDeviceStatus();
        },

        beforeDestroy: function () {
            window.clearInterval(this.onlineCheckTimer);
            window.clearInterval(this.timerDeviceStatus);
        },

        // watch for changes
        watch: {
            deviceIsOnline: function () {
                if (this.deviceIsOnline) this.updateDeviceStatus();
            },

            globalAlarmStatus: function () {
                var self = this;
                deviceRepository.setGlobalAlarm(this.device.id, this.globalAlarmStatus)
                    .fail(function (res) { self.ajaxRequestError = true })
                    .done(function (res) {
                        self.ajaxRequestError = false;
                        self.updateDeviceStatus();
                    });
            },

            globalDstStatus: function () {
                var self = this;
                deviceRepository.setGlobalDst(this.device.id, this.globalDstStatus)
                    .fail(function (res) { self.ajaxRequestError = true })
                    .done(function (res) {
                        self.ajaxRequestError = false;
                        self.updateDeviceStatus();
                    });
            }
        },

        // computed properties
        // http://vuejs.org/guide/computed.html
        computed: {
            weekdayTimeIsValid: function () {
                return timeRegexPattern.test(this.weekdayAlarmTime);
            },

            weekendTimeIsValid: function () {
                return timeRegexPattern.test(this.weekendAlarmTime);
            },

            weekdayApiDataCmd: function () {
                var cmd = '00000';
                if (this.weekdayAlarmStatus) cmd = '11111'
                return cmd + this.apiDataTime(this.weekdayAlarmTime);
            },

            weekendApiDataCmd: function () {
                var cmd = '00';
                if (this.weekendAlarmStatus) cmd = '11'
                return cmd + this.apiDataTime(this.weekendAlarmTime);
            }
        },

        // methods that implement data logic.
        // note there's no DOM manipulation here at all.
        methods: {

            updateDeviceStatus: function () {
                if (!this.deviceIsOnline) return;

                var self = this;
                deviceRepository.status(this.device.id)
                    .fail(function (res) { self.ajaxRequestError = true })
                    .done(function (res) {
                        self.deviceLastStatus = new Date().toLocaleTimeString();

                        self.ajaxRequestError = false;
                        self.globalAlarmStatus = res.data.gs == 1;
                        self.globalDstStatus = res.data.dst == 1;
                        self.sunriseDuration = res.data.srd / 1000 / 60;
                        self.lightOffOffset = res.data.off;

                        if (res.data.wds) {
                            self.weekdayAlarmStatus = res.data.wds.d === '11111';
                            self.weekdayAlarmTime = res.data.wds.t;
                        }

                        if (res.data.wes) {
                            self.weekendAlarmStatus = res.data.wes.d === '11';
                            self.weekendAlarmTime = res.data.wes.t;
                        }
                    });
            },

            weekdaySave: function () {
                var self = this;
                if (this.weekdayTimeIsValid) {
                    self.button.weekday = textUpdating;
                    deviceRepository.setWeekdayAlarm(this.device.id, this.weekdayApiDataCmd)
                        .fail(function (res) { self.ajaxRequestError = true })
                        .done(function (res) {
                            self.ajaxRequestError = false;
                            self.button.weekday = textSetAlarm;
                            self.updateDeviceStatus();
                        });
                }
            },

            weekendSave: function () {
                var self = this;
                if (this.weekendTimeIsValid) {
                    self.button.weekend = textUpdating;
                    deviceRepository.setWeekendAlarm(this.device.id, this.weekendApiDataCmd)
                        .fail(function (res) { self.ajaxRequestError = true })
                        .done(function (res) {
                            self.ajaxRequestError = false;
                            self.button.weekend = textSetAlarm;
                            self.updateDeviceStatus();
                        });
                }
            },

            checkDeviceOnlineStatus: function () {
                var self = this;
                deviceRepository.ping(this.device.id)
                    .fail(function (res) { self.ajaxRequestError = true })
                    .done(function (res) {
                        self.ajaxRequestError = false;
                        self.deviceIsOnline = res.data.online;
                    })
                    .always(function () {
                        self.timerLastChecked = new Date().toLocaleTimeString();
                    });
            },

            apiDataTime: function (time) {
                return time.replace(':', '');
            }
        }

    });

})(window);
