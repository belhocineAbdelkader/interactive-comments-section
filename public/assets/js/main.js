"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dompurify_1 = require("dompurify");
require("scheduler-polyfill");
// import classes
var checkType_1 = require("./classes/checkType");
var createCreationTime_1 = require("./classes/createCreationTime");
// import component
// html
var createComment_1 = require("./components/html/createComment");
var form_1 = require("./components/html/form");
var currentUser_1 = require("./components/html/currentUser");
// import main functions for comment
var addComment_1 = require("./functions/addComment");
var deleteComment_1 = require("./functions/deleteComment");
var editComment_1 = require("./functions/editComment");
var replyComment_1 = require("./functions/replyComment");
var commentVote_1 = require("./functions/commentVote");
// global scope declaration classes
var Type = new checkType_1.default();
// event listener
// content Loaded
window.addEventListener("DOMContentLoaded", function () {
    var app = document.getElementById('app');
    // create the article to hold all element of comments
    var postComments = document.createElement('article');
    postComments.classList.add('post-comments');
    app.appendChild(postComments);
    // create form element
    var sendForm = (0, form_1.default)('send');
    app.appendChild(sendForm);
    // fetching comment from server and display them in the web page
    fetchComments(postComments);
    // adding a comment
    var input = document.getElementById('comment-textarea');
    sendForm.addEventListener('submit', function (e) {
        e.preventDefault();
        (0, addComment_1.default)(postComments, input);
    });
    // handel key press
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            (0, addComment_1.default)(postComments, input);
        }
    });
    // Event delegation for comment actions
    postComments.addEventListener('click', function (event) {
        var target = event.target.closest('.btn');
        if (target === null || target === void 0 ? void 0 : target.classList.contains('delete')) {
            var commentHTML = target.closest('article.comment');
            (0, deleteComment_1.default)(commentHTML);
        }
        else if (target === null || target === void 0 ? void 0 : target.classList.contains('edit')) {
            var commentID = target.closest('article.comment');
            (0, editComment_1.default)(commentID);
        }
        else if (target === null || target === void 0 ? void 0 : target.classList.contains('reply-comment')) {
            var commentHTML = target.closest('article.comment');
            (0, replyComment_1.default)(commentHTML);
        }
        else if (target === null || target === void 0 ? void 0 : target.classList.contains('vote')) {
            (0, commentVote_1.default)(target);
        }
    });
});
// ================ fetch data from server ================
function fetchComments(dataContainer) {
    fetch('../../assets/data/data.json')
        .then(function (response) {
        if (!response.ok) {
            throw new Error("HTTP error: ".concat(response.status));
        }
        return response.json();
    }).then(function (data) {
        setDataToLocalStorage(data);
        // get the data from local storage
        var localData = JSON.parse(localStorage.getItem('data'));
        displayComments(dataContainer, localData);
    })
        .catch(function (error) {
        return console.error('Error fetching data:', error);
    });
}
// ========== add the existing comments to the dom ========
// function to set the fetched data to the storage
function setDataToLocalStorage(data) {
    for (var key in data) {
        var value = data[key];
        if (key === "currentUser" && !localStorage.getItem("comments")) {
            localStorage.setItem("".concat(key), JSON.stringify(value));
        }
        else if (key === "comments" && !localStorage.getItem("comments")) {
            localStorage.setItem("".concat(key), JSON.stringify(value));
        }
    }
}
// Function to display comments on the web page from the local storage
function displayComments(container, localData) {
    var currentUserLocalData = JSON.parse(localStorage.getItem("currentUser"));
    var commentsLocalData = JSON.parse(localStorage.getItem("comments"));
    localData = {
        currentUser: currentUserLocalData,
        comments: commentsLocalData,
    };
    if (localData) {
        var _loop_1 = function (key) {
            var element = localData[key];
            var fragmentComments = document.createDocumentFragment();
            if (Type.isObject(element)) {
                // Display current user header
                var userName = element.username;
                container.insertAdjacentHTML('beforeend', dompurify_1.default.sanitize((0, currentUser_1.default)(userName)));
            }
            else if (Type.isArray(element)) {
                // Display comments and sub-comments
                var commentsSection_1 = document.createElement('section');
                commentsSection_1.classList.add('comments');
                container.appendChild(commentsSection_1);
                element.forEach(function (comment) {
                    var _a, _b, _c;
                    var currUser = localData.currentUser.username;
                    var isCurrentUser = ((_a = comment.user) === null || _a === void 0 ? void 0 : _a.username) === currUser;
                    var cmnt = (0, createComment_1.default)(comment.id, comment.content, comment.createdAt, comment.score, (_b = comment.user) === null || _b === void 0 ? void 0 : _b.username, isCurrentUser);
                    fragmentComments.appendChild(cmnt);
                    // Display main comment
                    commentsSection_1.appendChild(fragmentComments);
                    // Display sub-comments
                    if (((_c = comment.replies) === null || _c === void 0 ? void 0 : _c.length) !== 0) {
                        var subCommentsArr_1 = comment.replies;
                        // create sub comment container
                        var subCommentsSection_1 = document.createElement('section');
                        subCommentsSection_1.classList.add('comments__sub-comments');
                        var fragmentSubComments_1 = document.createDocumentFragment();
                        // append the sub comments to his comment
                        var allComment = document.querySelectorAll('.comment');
                        allComment.forEach(function (cmnt) {
                            var cmntId = Number(cmnt.dataset.id);
                            if (cmntId === comment.id) {
                                console.log('comment :', comment);
                                cmnt.appendChild(subCommentsSection_1);
                                // append the comments to his sub comments container
                                subCommentsArr_1.forEach(function (subComment) {
                                    // update the  isCurrentUser to check the replied Comments if one of them is a Current User
                                    var isCurrentUser = subComment.user.username === currUser;
                                    var isReplyTo = subComment.replyingTo;
                                    var isReplyToId = "".concat(subComment.replyingToId);
                                    var subCmnt = (0, createComment_1.default)(subComment.id, subComment.content, subComment.createdAt, subComment.score, subComment.user.username, isCurrentUser, isReplyTo, isReplyToId);
                                    fragmentSubComments_1.appendChild(subCmnt);
                                    subCommentsSection_1.appendChild(fragmentSubComments_1);
                                });
                            }
                        });
                    }
                });
            }
        };
        for (var key in localData) {
            _loop_1(key);
        }
    }
    // deal with passed time of creation of comment
    insertPassedTime();
}
// fn for count the passed time from comment creation
function insertPassedTime() {
    var passedTimeElements = document.querySelectorAll('.time-createdAt');
    var regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    passedTimeElements.forEach(function (element) {
        if (regex.test(element.dateTime)) {
            element.textContent = new createCreationTime_1.default().getElapsedTime(element.dateTime);
        }
    });
}
