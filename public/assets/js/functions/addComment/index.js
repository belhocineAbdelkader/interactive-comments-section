"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var dompurify_1 = require("dompurify");
// import classes
var createCreationTime_1 = require("../../classes/createCreationTime");
// import component
// object
var currentUserInfo_1 = require("../../components/object/currentUserInfo");
var commentObject_1 = require("../../components/object/commentObject");
// html
var displayAlert_1 = require("../../components/html/displayAlert");
var createComment_1 = require("../../components/html/createComment");
// import helper functions
// reset
var reset_1 = require("../helpers/reset");
// deal with new comment voting
var commentVote_1 = require("../commentVote");
// *================ add comment ================
function addComment(container, input) {
    var comments = JSON.parse(localStorage.getItem('comments') || '[]');
    // deal with new comment voting
    commentVote_1.initialVotes;
    (0, commentVote_1.initializeInitialVotes)(comments);
    var content = input.value.trim();
    var currentUser = (0, currentUserInfo_1.default)();
    var creationTime = new createCreationTime_1.default();
    // Check if the content is empty
    if (!content) {
        (0, displayAlert_1.default)('danger', 'Please provide comment content first');
        return;
    }
    // for comment (replying)
    // Generate a new comment ID
    var newCommentId = comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;
    // Create a new comment object
    var newCommentObject = (0, commentObject_1.default)(newCommentId, content, creationTime.humanDate, 0, currentUser.username);
    var newComment = (0, createComment_1.default)(newCommentObject.id, newCommentObject.content, newCommentObject.createdAt, newCommentObject.score, newCommentObject.user.username, true);
    // update ui
    var commentsSection = container.querySelector('section.comments');
    scheduler.postTask(function () { return commentsSection === null || commentsSection === void 0 ? void 0 : commentsSection.insertAdjacentElement("beforeend", JSON.parse(dompurify_1.default.sanitize(newComment))); }, { priority: 'user-blocking' });
    // Reset the input field
    scheduler.postTask(function () { return (0, reset_1.default)(input); }, { priority: 'user-blocking' });
    // Update local storage with the new comment
    scheduler.postTask(function () { return localStorage.setItem('comments', JSON.stringify(__spreadArray(__spreadArray([], comments, true), [newCommentObject], false))); }, { priority: 'background' });
}
exports.default = addComment;
