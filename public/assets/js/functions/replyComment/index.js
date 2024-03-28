"use strict";
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
var form_1 = require("../../components/html/form");
// import helper functions
// reset
var reset_1 = require("../helpers/reset");
// *================ reply comment ================
// update ui for reply
// Update UI after reply submission
function updateReplyUI(commentHTML, newComment) {
    var fragmentSubComments = document.createDocumentFragment();
    var subCmnt = (0, createComment_1.default)(newComment.id, newComment.content, newComment.createdAt, newComment.score, newComment.user.username, true, newComment.replyingTo);
    if (commentHTML.closest('.comments__sub-comments')) {
        var commentsSection = commentHTML.closest('.comments__sub-comments');
        commentsSection === null || commentsSection === void 0 ? void 0 : commentsSection.insertAdjacentHTML('beforeend', dompurify_1.default.sanitize(subCmnt));
    }
    else {
        var subCommentsSection = document.createElement('section');
        subCommentsSection.classList.add('comments__sub-comments');
        fragmentSubComments.appendChild(subCmnt);
        subCommentsSection.appendChild(fragmentSubComments);
        commentHTML.insertAdjacentElement('beforeend', subCommentsSection);
    }
}
// handel replay submit
function handelReplaySubmit(commentHTML, editForm) {
    var _a, _b;
    var commentId = (_a = commentHTML === null || commentHTML === void 0 ? void 0 : commentHTML.dataset) === null || _a === void 0 ? void 0 : _a.id;
    console.log('commentId :', commentId);
    if (!commentId)
        return;
    var comments = JSON.parse(localStorage.getItem('comments') || '[]');
    var targetComment = comments.find(function (comment) {
        return comment.id === parseInt(commentId) || (comment.replies && comment.replies.some(function (reply) { return reply.id === parseInt(commentId); }));
    });
    // Get the user to be replied and the comment content
    var replyingTo = ((_b = commentHTML === null || commentHTML === void 0 ? void 0 : commentHTML.querySelector('.comment__user--name')) === null || _b === void 0 ? void 0 : _b.textContent) || '';
    var replyInput = editForm.querySelector('#comment-textarea');
    if (!replyInput || !targetComment)
        return;
    var currentUser = (0, currentUserInfo_1.default)().username;
    var creationTime = new createCreationTime_1.default().humanDate;
    var replies = targetComment === null || targetComment === void 0 ? void 0 : targetComment.replies;
    // Generate a new sub-comment ID
    var newSubCommentId = replies.length > 0 ? "".concat(targetComment === null || targetComment === void 0 ? void 0 : targetComment.id, ".").concat(replies.length + 1) : "".concat(targetComment === null || targetComment === void 0 ? void 0 : targetComment.id, ".1");
    var content = replyInput.value;
    if (!content) {
        (0, displayAlert_1.default)('danger', 'Please provide a valid comment content.');
        return;
    }
    // Create a new sub-comment object
    var newComment = (0, commentObject_1.default)(Number(newSubCommentId), content, creationTime, 0, currentUser, true, replyingTo);
    if (targetComment) {
        targetComment.replies.push(newComment);
    }
    // Update UI
    scheduler.postTask(function () { return updateReplyUI(commentHTML, newComment); }, { priority: 'user-blocking' });
    // Reset the input field
    scheduler.postTask(function () { return (0, reset_1.default)(replyInput, true); }, { priority: 'user-blocking' });
    // Update local storage with the new sub-comment
    scheduler.postTask(function () { return localStorage.setItem('comments', JSON.stringify(comments)); }, { priority: 'background' });
}
function replyComment(commentHTML) {
    var _a;
    // Create a reply form
    var replyFormContainer = (0, form_1.default)('reply');
    var replyForm = replyFormContainer.querySelector('form');
    // Check if the form already exists
    var formExist = (_a = commentHTML.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains('comment-form-container');
    if (!formExist) {
        commentHTML.insertAdjacentElement('afterend', replyFormContainer);
        // !!! commentHTML.insertAdjacentElement('afterend', DOMPurify.sanitize(replyFormContainer));
    }
    // Add submit event listener to the form
    replyForm === null || replyForm === void 0 ? void 0 : replyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handelReplaySubmit(commentHTML, replyForm);
    });
    // Add keydown event listener to the reply input
    var replyInput = replyForm === null || replyForm === void 0 ? void 0 : replyForm.querySelector('#comment-textarea');
    replyInput === null || replyInput === void 0 ? void 0 : replyInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handelReplaySubmit(commentHTML, replyForm);
        }
    });
}
exports.default = replyComment;
