"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCreationTime = /** @class */ (function () {
    function createCreationTime() {
        this._creationTime = this.createCreationTime();
    }
    createCreationTime.prototype.createCreationTime = function (dateString) {
        if (!dateString) {
            var nowDay = new Date();
            var year = nowDay.getFullYear();
            var month = (nowDay.getMonth() + 1).toString().padStart(2, '0');
            var day = nowDay.getDate().toString().padStart(2, '0');
            var hour = nowDay.getHours().toString().padStart(2, '0');
            var minute = nowDay.getMinutes().toString().padStart(2, '0');
            var seconds = nowDay.getSeconds().toString().padStart(2, '0');
            var creationTime_1 = new Date("".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute, ":").concat(seconds, "Z")).toISOString();
            return new Date(creationTime_1);
        }
        var creationTime = new Date(dateString).toISOString();
        return new Date(creationTime);
    };
    createCreationTime.prototype.getElapsedTime = function (dateString) {
        var now = new Date();
        var timeDifference = now.getTime() - this.createCreationTime(dateString).getTime();
        var seconds = Math.floor(timeDifference / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var weeks = Math.floor(days / 7);
        var months = Math.floor(days / 30.44); // Average days in a month
        var years = Math.floor(days / 365);
        if (seconds < 60) {
            return 'a moment ago';
        }
        else if (minutes === 1) {
            return '1 minute ago';
        }
        else if (minutes < 60) {
            return "".concat(minutes, " minutes ago");
        }
        else if (hours === 1) {
            return '1 hour ago';
        }
        else if (hours < 24) {
            return "".concat(hours, " hours ago");
        }
        else if (days === 1) {
            return '1 day ago';
        }
        else if (days < 7) {
            return "".concat(days, " days ago");
        }
        else if (weeks === 1) {
            return '1 week ago';
        }
        else if (weeks < 4.33) {
            return "".concat(weeks, " weeks ago");
        }
        else if (months === 1) {
            return '1 month ago';
        }
        else if (months < 12) {
            return "".concat(months, " months ago");
        }
        else if (years === 1) {
            return '1 year ago';
        }
        else {
            return "".concat(years, " years ago");
        }
    };
    Object.defineProperty(createCreationTime.prototype, "humanDate", {
        get: function () {
            return this.createCreationTime().toISOString();
        },
        enumerable: false,
        configurable: true
    });
    return createCreationTime;
}());
exports.default = createCreationTime;
