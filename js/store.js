(function (exports) {

    'use strict';

    var STORAGE_KEY = 'com.tbmsu.sunriseui';

    var getStorageDataKey = function(key) {
        return STORAGE_KEY + '.' + key;
    }

    exports.storage = {
        fetchDevice: function () {
            return JSON.parse(localStorage.getItem(getStorageDataKey('device')) || '{ "id":"", "token":""}');
        },
        saveDevice: function (data) {
            localStorage.setItem(getStorageDataKey('device'), JSON.stringify(data));
        }
    };

})(window);
