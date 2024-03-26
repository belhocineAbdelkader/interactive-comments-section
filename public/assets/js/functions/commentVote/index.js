"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeInitialVotes = exports.initialVotes = void 0;
// import classes
var Counter_1 = require("../../classes/Counter");
// *================ vote comment ================
var comments = JSON.parse(localStorage.getItem('comments') || '[]');
// Define a map to store initial vote counts for each comment
exports.initialVotes = new Map();
// Function to initialize initial votes for all comments
function initializeInitialVotes(comments) {
    comments.forEach(function (comment) {
        exports.initialVotes.set(comment.id.toString(), comment.score);
        if (comment.replies) {
            comment.replies.forEach(function (subComment) {
                exports.initialVotes.set(subComment.id.toString(), subComment.score);
            });
        }
    });
}
exports.initializeInitialVotes = initializeInitialVotes;
// Call initializeInitialVotes function when comments are loaded
initializeInitialVotes(comments);
// Modify the commentVote function to use initialVotes map
// localStorage.clear()
function commentVote(target) {
    var commentHTML = target.closest('article.comment');
    var commentId = commentHTML.dataset.id;
    var voteOutput = commentHTML.querySelector('.comment__counter-btns--value output');
    var targetComment = comments.find(function (comment) {
        return comment.id === parseInt(commentId) ||
            (comment.replies && comment.replies.some(function (subComment) {
                return subComment.id === parseInt(commentId);
            }));
    });
    if (!targetComment)
        return;
    // Get the initial vote count for the comment
    var initialVote = exports.initialVotes.get(commentId) || 0;
    // Set the initial range for the score based on the initial vote count
    var minValue = initialVote - 1;
    var maxValue = initialVote + 1;
    // Create a RangeCounter instance for the score
    var commentCounter = new Counter_1.default(targetComment.score, minValue, maxValue);
    if (target.classList.contains('increase')) {
        if (commentCounter.getValue() < maxValue) {
            commentCounter.increment();
            voteOutput.textContent = "".concat(commentCounter.getValue());
            targetComment.score = commentCounter.getValue();
        }
    }
    else if (target.classList.contains('decrease')) {
        if (commentCounter.getValue() > minValue) {
            commentCounter.decrement();
            voteOutput.textContent = "".concat(commentCounter.getValue());
            targetComment.score = commentCounter.getValue();
        }
    }
    // Update local storage
    localStorage.setItem('comments', JSON.stringify(comments));
}
exports.default = commentVote;
