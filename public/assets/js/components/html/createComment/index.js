"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCreationTime_1 = require("../../../classes/createCreationTime");
// comment Object
function createComment(id, content, createdAt, score, user, isCurrentUser, isReplyTo) {
    if (isCurrentUser === void 0) { isCurrentUser = false; }
    var CurrentUserBtns = "\n    <button type=\"button\" class=\"btn delete\">\n        <span class=\"btn-wrap\">\n          <span class=\"icon icon-delete\"></span>\n          <span class=\"btn-text\">Delete</span>\n          <span class=\"only-sr\">delete comment</span>\n        </span>\n      </button>\n      <button type=\"button\" class=\"btn edit\">\n        <span class=\"btn-wrap\">\n          <span class=\"icon icon-edit\"></span>\n          <span class=\"btn-text\">Edit</span>\n          <span class=\"only-sr\">edit comment</span>\n        </span>\n    </button>\n  ";
    var regularUserBtns = "\n  <button type=\"button\" class=\"btn reply\">\n    <span class=\"btn-wrap\">\n      <span class=\"icon icon-reply\"></span>\n      <span class=\"btn-text\">Reply</span>\n      <span class=\"only-sr\">reply to comment</span>\n    </span>\n  </button>\n\n  ";
    // dealing with Elapsed Time
    var regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    var validDate = regex.test(createdAt);
    var setElapsedTime = function (date) {
        return new createCreationTime_1.default().getElapsedTime(date);
    };
    var article = document.createElement('article');
    article.classList.add("comment");
    if (isCurrentUser) {
        article.classList.add("current-user");
    }
    article.setAttribute('data-id', "".concat(id));
    article.insertAdjacentHTML('beforeend', "\n  <div class=\"comment__wrapper\">\n        <header class=\"comment__user\">\n          <img class=\"comment__user--avatar\" src=\"/assets/images/avatars/image-".concat(user, ".webp\" alt=\"User Avatar\">\n          <h2 class=\"comment__user--name\">").concat(user, "</h2>\n          <div class=\"comment__createdAt\">\n            <time class=\"time-createdAt\" datetime=\"").concat(createdAt, "\">").concat(validDate ? setElapsedTime(createdAt) : createdAt, "</time>\n          </div>\n        </header>\n        <p class=\"comment__content\">\n          ").concat(!isReplyTo ? "".concat(content) : "<span class=\"replyingTo\">@".concat(isReplyTo, "</span> ").concat(content), " \n        </p>\n        <div class=\"comment__counter-btns\">\n          <button type=\"button\" class=\"btn vote increase\">\n            <span class=\"btn-wrap\">\n              <span class=\"icon increase icon-plus\"></span>\n              <span class=\"only-sr\">increase the comment rate</span>\n            </span>\n          </button>\n          <div class=\"comment__counter-btns--value\">\n            <output id=\"comment-counter-value\" value=\"").concat(score, "\">").concat(score, "</output>\n          </div>\n          <button type=\"button\" class=\"btn vote decrease\">\n            <span class=\"btn-wrap\">\n              <span class=\"icon icon-minus decrease\"></span>\n              <span class=\"only-sr\">decrease the comment rate</span>\n            </span>\n          </button>\n        </div>\n        <div class=\"comment__action-btns\">\n          ").concat(isCurrentUser ? CurrentUserBtns : regularUserBtns, "\n        </div>\n      </div>\n  "));
    return article;
}
exports.default = createComment;
