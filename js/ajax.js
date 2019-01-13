(function (exports) {

    'use strict';

    var token = storage.fetchDevice().token;

    var ajaxAuthHandler = function (options) {
        var sendOptions = $.extend({}, options, { headers: { 'Authorization': 'Bearer ' + token }, suppressGlobalErrors: false });
        return $.ajax(sendOptions);
    };

    exports.ajax = {
        getJson: function (uri) {
            var defaultOptions = { type: 'GET', dataType: 'json', url: uri };
            return ajaxAuthHandler(defaultOptions);
        },
        postJson: function (uri, data) {
            var defaultOptions = { type: 'POST', dataType: 'json', url: uri, data: data };
            return ajaxAuthHandler(defaultOptions);
        },
        updateJson: function (uri, data) {
            var defaultOptions = { type: 'PUT', dataType: 'json', url: uri, data: data };
            return ajaxAuthHandler(defaultOptions);
        },
        deleteJson: function (uri, data) {
            var defaultOptions = { type: 'DELETE', url: uri, data: data };
            return ajaxAuthHandler(defaultOptions);
        }
    };

})(window);