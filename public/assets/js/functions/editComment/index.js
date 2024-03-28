"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import component
// html
var form_1 = require("../../components/html/form");
// import helper functions
// reset
var reset_1 = require("../helpers/reset");
// import delete comment fn
var deleteComment_1 = require("../deleteComment");
// *================ edit comment ================
function handelEditSubmit(commentHTML, editForm, replyingTo) {
    var inputForm = editForm.querySelector('#comment-textarea');
    var comments = JSON.parse(localStorage.getItem('comments') || '[]');
    var targetCommentId = Number(commentHTML.dataset.id);
    // Iterate through comments to find the target comment and replace the content
    var updatedComments = comments.map(function (comment) {
        if (comment.id === targetCommentId) {
            comment.content = inputForm.value.trim();
        }
        else if (comment.replies) {
            comment.replies.forEach(function (subComment) {
                if (subComment.id === targetCommentId) {
                    subComment.content = inputForm.value.trim();
                }
            });
        }
        return comment;
    });
    // Update ui
    scheduler.postTask(function () {
        var p = document.createElement('p');
        p.setAttribute('class', 'comment__content');
        editForm.replaceWith(p);
        p.textContent = "".concat(replyingTo, " ").concat(inputForm.value.trim());
    }, { priority: 'user-blocking' });
    // Reset the input field
    scheduler.postTask(function () { return (0, reset_1.default)(inputForm); }, { priority: 'user-blocking' });
    // Update local storage with the new comment
    scheduler.postTask(function () { return localStorage.setItem('comments', JSON.stringify(updatedComments)); }, { priority: 'background' });
}
function editComment(commentHTML) {
    var _a, _b, _c, _d;
    var contentElem = commentHTML.querySelector('.comment__content');
    var editForm = (0, form_1.default)('edit');
    var inputForm = editForm.querySelector('#comment-textarea');
    // Remove unnecessary elements from the new form and update the text content of th bt
    (_a = editForm.firstElementChild) === null || _a === void 0 ? void 0 : _a.removeChild(editForm.querySelector('.comment-form-container__form__user-avatar'));
    editForm.firstElementChild.querySelector('span.text').textContent = 'UPDATE';
    // Extract the user being replied to
    var replyingTo;
    if (contentElem) {
        replyingTo = (((_b = contentElem.textContent) === null || _b === void 0 ? void 0 : _b.match(/@\S+/)) || [''])[0];
        // Display the edit form
        contentElem.replaceWith(editForm);
        // Set existing content to the edit form
        var content = ((_d = (_c = contentElem.textContent) === null || _c === void 0 ? void 0 : _c.replace(replyingTo, '')) === null || _d === void 0 ? void 0 : _d.trim()) || '';
        inputForm.value = content;
    }
    ;
    // Handle form submission
    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!inputForm.value.trim()) {
            // Handle empty input
            (0, deleteComment_1.default)(commentHTML);
        }
        else {
            handelEditSubmit(commentHTML, editForm, replyingTo);
        }
    });
    // Handle click on the edit button
    var outerBtn = commentHTML.querySelector('.comment__action-btns .btn.edit');
    outerBtn === null || outerBtn === void 0 ? void 0 : outerBtn.addEventListener('click', function (e) {
        var _a;
        e.preventDefault();
        (_a = editForm.querySelector('.comment-form-container__form')) === null || _a === void 0 ? void 0 : _a.submit();
    });
    // Handle key press
    inputForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!inputForm.value.trim()) {
                // Handle empty input
                (0, deleteComment_1.default)(commentHTML);
            }
            else {
                handelEditSubmit(commentHTML, editForm, replyingTo);
            }
        }
    });
}
exports.default = editComment;
