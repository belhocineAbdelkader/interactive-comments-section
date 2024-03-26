"use strict";
// *================ delete comment ================
Object.defineProperty(exports, "__esModule", { value: true });
// Function to create the delete comment dialog
function createDeleteDialog() {
    var dialogElem = document.createElement('dialog');
    dialogElem.setAttribute('class', 'dialog');
    dialogElem.innerHTML = "\n    <h2>Delete comment</h2>\n    <div autofocus>\n      <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>\n    </div>\n    <form method=\"dialog\">\n      <div class=\"btn_collection\">\n        <button class=\"cancel\" type=\"submit\" value=\"no, cancel\">NO, CANCEL</button>\n        <button class=\"delete\" type=\"submit\" value=\"yes, delete\" formmethod=\"dialog\">YES, DELETE</button>\n      </div>\n    </form>\n  ";
    document.body.appendChild(dialogElem);
    return dialogElem;
}
// Function to delete comment from localStorage
function deleteCommentFromLocalStorage(commentHTML) {
    var comments = JSON.parse(localStorage.getItem('comments') || '[]');
    var targetCommentId = Number(commentHTML === null || commentHTML === void 0 ? void 0 : commentHTML.dataset.id);
    var updatedComments = comments.filter(function (cmnt) {
        if (cmnt.id === Number(targetCommentId)) {
            // Delete the main comment
            return false;
        }
        else if (cmnt.replies) {
            // Delete a sub-comment
            cmnt.replies = cmnt.replies.filter(function (subCmnt) { return subCmnt.id !== Number(targetCommentId); });
        }
        return true;
    });
    localStorage.setItem('comments', JSON.stringify(updatedComments));
}
// Function to handle the delete form submission
function handleDeleteSubmission(e, commentHTML, dialogElem) {
    e.preventDefault();
    var target = e.target;
    if (!target)
        return;
    var buttonValue = e.submitter.value;
    if (buttonValue === 'no, cancel') {
        // Close the dialog
        dialogElem.close();
        // Remove the created dialog after canceling the deletion
        document.body.removeChild(dialogElem);
    }
    else if (buttonValue === 'yes, delete') {
        // update ui
        scheduler.postTask(function () { return deleteCommentFromLocalStorage(commentHTML); }, { priority: 'user-blocking' });
        // Update the DOM
        scheduler.postTask(function () { return commentHTML.remove(); }, { priority: 'user-blocking' });
        // dealing with dialog
        scheduler.postTask(function () {
            // Close the dialog
            dialogElem.close();
            // Remove the created dialog after completing the deletion
            document.body.removeChild(dialogElem);
        }, { priority: 'background' });
    }
}
// delete comment
function deleteComment(CommentHTML) {
    var dialogElem = createDeleteDialog();
    // Show the dialog
    dialogElem.showModal();
    // Handle form submission
    var formDeleteComment = dialogElem.querySelector('form');
    formDeleteComment === null || formDeleteComment === void 0 ? void 0 : formDeleteComment.addEventListener('submit', function (e) {
        return handleDeleteSubmission(e, CommentHTML, dialogElem);
    });
    // Close the dialog when clicking outside
    document.addEventListener("click", function (e) {
        if (dialogElem && e.target === dialogElem) {
            dialogElem.close();
        }
    });
}
exports.default = deleteComment;
