(function (exports) {

    'use strict';

    var baseUri = 'https://api.particle.io';
    var apiVersion = '1';

    var
        getApiEndpointUrl = function (endpoint, params) {
            if (!endsWith(baseUri, '/')) {
                baseUri += '/';
            }
            return baseUri + 'v' + apiVersion + '/' + endpoint;
        },
        endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

    exports.deviceRepository = {
        list: function () {
            var uri = getApiEndpointUrl('devices/');
            return ajax.getJson(uri)
                .then(function (res) { return { data: res, endpoint: uri } });
        },
        ping: function (deviceId) {
            var uri = getApiEndpointUrl('devices/' + deviceId + '/ping');
            return ajax.updateJson(uri, '')
                .then(function (res) { return { data: res, endpoint: uri } });
        },
        status: function(deviceId) {
            var uri = getApiEndpointUrl('devices/' + deviceId + '/status');
            return ajax.getJson(uri)
                .then(function (res) { return {  data: JSON.parse(res.result), endpoint: uri } });
        },
        setGlobalAlarm: function (deviceId, cmd) {
            var uri = getApiEndpointUrl('devices/' + deviceId + '/alarmOn');
            var bodyData = 'arg=' + (cmd ? 1 : 0);
            return ajax.postJson(uri, bodyData)
                .then(function (res) { return { data: res, endpoint: uri } });
        },
        setGlobalDst: function (deviceId, cmd) {
            var uri = getApiEndpointUrl('devices/' + deviceId + '/dstOn');
            var bodyData = 'arg=' + (cmd ? 1 : 0);
            return ajax.postJson(uri, bodyData)
                .then(function (res) { return { data: res, endpoint: uri } });
        },
        setWeekdayAlarm: function (deviceId, cmd) {
            var uri = getApiEndpointUrl('devices/' + deviceId + '/wdCmd');
            var bodyData = 'arg=' + cmd;
            return ajax.postJson(uri, bodyData)
                .then(function (res) { return { data: res, endpoint: uri } });
        },
        setWeekendAlarm: function (deviceId, cmd) {
            var uri = getApiEndpointUrl('devices/' + deviceId + '/weCmd');
            var bodyData = 'arg=' + cmd;
            return ajax.postJson(uri, bodyData)
                .then(function (res) { return { data: res, endpoint: uri } });
        }
    };

})(window);