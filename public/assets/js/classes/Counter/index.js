"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Counter = /** @class */ (function () {
    function Counter(initialValue, minValue, maxValue) {
        this.value = initialValue;
        this.minValue = minValue;
        this.maxValue = maxValue;
    }
    Counter.prototype.increment = function () {
        if (this.value < this.maxValue) {
            this.value++;
        }
    };
    Counter.prototype.decrement = function () {
        if (this.value > this.minValue && this.value > 0) {
            this.value--;
        }
    };
    Counter.prototype.getValue = function () {
        return this.value;
    };
    return Counter;
}());
exports.default = Counter;
