"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkType = /** @class */ (function () {
    function checkType() {
        this.isArray = function (val) { return Array.isArray(val); };
        this.isObject = function (val) { return val !== null && typeof val === 'object' && !Array.isArray(val); };
        this.isUndefined = function (val) { return val === undefined; };
        this.isNull = function (val) { return val === null; };
        this.isTrue = function (arg) {
            if (Array.isArray(arg) && arg.length)
                return { arg: arg, typeofarg: typeof arg, is: false };
            if (arg !== 'null' || 'undefined' && typeof arg === 'object' && Object.keys(arg).length)
                return { arg: arg, typeofarg: typeof arg, is: false };
            return { arg: arg, typeofarg: typeof arg, is: Boolean(arg) };
        };
    }
    return checkType;
}());
exports.default = checkType;
