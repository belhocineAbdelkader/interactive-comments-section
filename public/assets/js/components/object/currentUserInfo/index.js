"use strict";
// current User
Object.defineProperty(exports, "__esModule", { value: true });
function currentUserInfo() {
    var currentUser = localStorage.getItem('currentUser'), currentUserInfo = JSON.parse(currentUser);
    return currentUserInfo;
}
exports.default = currentUserInfo;
