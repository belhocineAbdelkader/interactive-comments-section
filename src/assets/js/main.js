// import checkType from "./helpers/checkTypes";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var checkTypes = /** @class */ (function () {
    function checkTypes() {
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
    return checkTypes;
}());
var Type = new checkTypes();
// event listener
// content Loaded
window.addEventListener("DOMContentLoaded", function () {
    var app = document.getElementById('app');
    // create the article to hold all element of comments
    var postComments = document.createElement('article');
    postComments.classList.add('post-comments');
    app.appendChild(postComments);
    // create form element
    var sendForm = form('send');
    app.appendChild(sendForm);
    // fetching comment from server and display them in the web page
    fetchComments(postComments);
    // adding a comment
    var input = document.getElementById('comment-textarea');
    sendForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addComment(postComments, input);
    });
    // handel key press
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addComment(postComments, input);
        }
    });
    // Event delegation for comment actions
    postComments.addEventListener('click', function (event) {
        var target = event.target.closest('.btn');
        if (target === null || target === void 0 ? void 0 : target.classList.contains('delete')) {
            var commentID = target.closest('article.comment').dataset.id;
            deleteComment(commentID);
        }
        else if (target === null || target === void 0 ? void 0 : target.classList.contains('edit')) {
            var commentID = target.closest('article.comment').dataset.id;
            editComment(commentID);
        }
        else if (target === null || target === void 0 ? void 0 : target.classList.contains('reply')) {
            var commentHTML = target.closest('article.comment');
            console.log('commentHTML :', commentHTML);
            replyComment(commentHTML);
        }
    });
});
// ============= Functions =============
//----- functions -----
// function to create html
// form
var form = function (type) {
    // create the form container
    var fromContainer = document.createElement('div');
    fromContainer.setAttribute('class', "comment-form-container ".concat(type));
    fromContainer.innerHTML = "\n      <form class=\"comment-form-container__form\">\n        <label for=\"comment-textarea\">\n          <span class=\"only-sr\">your comment here</span>\n          <textarea class=\"textarea\" name=\"comment-input\" id=\"comment-textarea\" placeholder=\"Add a comment\"></textarea>\n        </label>\n        <button class=\"btn ".concat(type, "\" type=\"submit\">\n          <span class=\"btn-wrap\">\n            <span class=\"text capitalize\">\n              ").concat(type, "\n            </span>\n          </span>\n        </button>\n        <div class=\"comment-form-container__form__user-avatar\">\n          <figure>\n            <img class=\"owner-user__avatar\" src=\"/src/assets/images/avatars/image-juliusomo.png\" alt=\"User Avatar\">\n          </figure>\n        </div>\n      </form>");
    return fromContainer;
};
// Function to create the current user header
var currentUser = function (name) { return "\n  <header hidden class=\"owner-user\">\n    <figure>\n      <img class=\"owner-user__avatar\" src=\"/src/assets/images/avatars/image-".concat(name, ".png\" alt=\"User Avatar\">\n    </figure>\n    <h1 class=\"owner-user__name\">").concat(name, "</h1>\n  </header>"); };
// Function to create a comment or sub-comment
var createComment = function (id, content, createdAt, score, user, currUser, isCurrentUser, isReplyTo) {
    if (isCurrentUser === void 0) { isCurrentUser = false; }
    var CurrentUserBtns = "\n    <button type=\"button\" class=\"btn delete\">\n        <span class=\"btn-wrap\">\n          <span class=\"icon icon-delete\"></span>\n          <span class=\"btn-text\">Delete</span>\n          <span class=\"only-sr\">delete comment</span>\n        </span>\n      </button>\n      <button type=\"button\" class=\"btn edit\">\n        <span class=\"btn-wrap\">\n          <span class=\"icon icon-edit\"></span>\n          <span class=\"btn-text\">Edit</span>\n          <span class=\"only-sr\">edit comment</span>\n        </span>\n    </button>\n  ";
    var regularUserBtns = "\n  <button type=\"button\" class=\"btn reply\">\n    <span class=\"btn-wrap\">\n      <span class=\"icon icon-reply\"></span>\n      <span class=\"btn-text\">Reply</span>\n      <span class=\"only-sr\">reply to comment</span>\n    </span>\n  </button>\n\n  ";
    return "\n    <article class=\"comment".concat(isCurrentUser ? ' current-user' : '', "\" data-id=\"").concat(id, "\">\n      <div class=\"comment__wrapper\">\n        <header class=\"comment__user\">\n          <img class=\"comment__user--avatar\" src=\"/src/assets/images/avatars/image-").concat(user, ".webp\" alt=\"User Avatar\">\n          <h2 class=\"comment__user--name\">").concat(user, "</h2>\n          <div class=\"comment__createdAt\">\n            <time datetime=\"").concat(createdAt, "\">").concat(createdAt, "</time>\n          </div>\n        </header>\n        <p class=\"comment__content\">\n          ").concat(!isReplyTo ? "".concat(content) : "<span class=\"replyingTo\">@".concat(isReplyTo, "</span> ").concat(content), " \n        </p>\n        <div class=\"comment__counter-btns\">\n          <button type=\"button\" class=\"btn counter increase\">\n            <span class=\"btn-wrap\">\n              <span class=\"icon increase icon-plus\"></span>\n              <span class=\"only-sr\">increase the comment rate</span>\n            </span>\n          </button>\n          <div class=\"comment__counter-btns--value\">\n            <output id=\"comment-counter-value\">").concat(score, "</output>\n          </div>\n          <button type=\"button\" class=\"btn counter decrease\">\n            <span class=\"btn-wrap\">\n              <span class=\"icon icon-minus decrease\"></span>\n              <span class=\"only-sr\">decrease the comment rate</span>\n            </span>\n          </button>\n        </div>\n        <div class=\"comment__action-btns\">\n          ").concat(isCurrentUser ? CurrentUserBtns : regularUserBtns, "\n        </div>\n      </div>\n      </article>");
};
function currentUserInfo() {
    var currentUser = localStorage.getItem('currentUser'), currentUserInfo = JSON.parse(currentUser);
    return currentUserInfo;
}
function commentObject(id, content, createdAt, score, username, isSubComment, replyingTo) {
    if (isSubComment === void 0) { isSubComment = false; }
    if (replyingTo === void 0) { replyingTo = ''; }
    var comment = {
        id: id,
        content: content,
        createdAt: createdAt,
        score: score,
        user: {
            image: {
                png: "./images/avatars/image-".concat(username, ".png"),
                webp: "./images/avatars/image-".concat(username, ".webp"),
            },
            username: username,
        },
        replies: []
    };
    var subComment = {
        id: id,
        content: content,
        createdAt: createdAt,
        score: 0,
        replyingTo: replyingTo,
        user: {
            image: {
                png: "./images/avatars/image-".concat(username, ".png"),
                webp: "./images/avatars/image-".concat(username, ".webp"),
            },
            username: username
        },
    };
    if (isSubComment) {
        return subComment;
    }
    return comment;
}
// ================ add comment ================
function addComment(container, input, type, targetComment, replyingTo) {
    if (type === void 0) { type = "comment"; }
    var content = input.value.trim();
    var currentUser = currentUserInfo();
    var comments = JSON.parse(localStorage.getItem('comments') || '[]');
    var creationTime = new createCreationTime();
    // Check if the content is empty
    if (!content) {
        displayAlert('danger', 'Please provide comment content first');
        return;
    }
    // for comment (replying)
    // Generate a new comment ID
    var newCommentId = comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;
    // Create a new comment object
    var newComment = commentObject(newCommentId, content, creationTime.humanDate, 0, currentUser.username);
    // Update local storage with the new comment
    localStorage.setItem('comments', JSON.stringify(__spreadArray(__spreadArray([], comments, true), [newComment], false)));
    // Refresh the comments display
    refreshComments();
    // Reset the input field
    reset(input);
}
// ================ delete comment ================
// Function to create the delete comment dialog
function createDeleteDialog() {
    var dialogElem = document.createElement('dialog');
    dialogElem.setAttribute('class', 'dialog');
    dialogElem.innerHTML = "\n    <div autofocus>\n      <p>Are you sure you want to delete this comment? This action cannot be undone.</p>\n    </div>\n    <form method=\"dialog\">\n      <div class=\"btn_collection\"></div>\n      <button class=\"cancel\" type=\"submit\" value=\"no, cancel\">NO, CANCEL</button>\n      <button class=\"delete\" type=\"submit\" value=\"yes, delete\" formmethod=\"dialog\">YES, DELETE</button>\n    </form>\n  ";
    document.body.appendChild(dialogElem);
    return dialogElem;
}
// Function to delete comment from localStorage
function deleteCommentFromLocalStorage(commentId) {
    var comments = JSON.parse(localStorage.getItem('comments') || '[]');
    var updatedComments = comments.filter(function (cmnt) {
        if (cmnt.id === Number(commentId)) {
            // Delete the main comment
            return false;
        }
        else if (cmnt.replies) {
            // Delete a sub-comment
            cmnt.replies = cmnt.replies.filter(function (subCmnt) { return subCmnt.id !== Number(commentId); });
        }
        return true;
    });
    localStorage.setItem('comments', JSON.stringify(updatedComments));
}
// Function to handle the delete form submission
function handleDeleteSubmission(e, commentId, dialogElem) {
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
        console.log('buttonValue :', buttonValue);
        deleteCommentFromLocalStorage(commentId);
        // Update the DOM
        refreshComments();
        // Close the dialog
        dialogElem.close();
        // Remove the created dialog after completing the deletion
        document.body.removeChild(dialogElem);
    }
}
// delete comment
function deleteComment(id) {
    var dialogElem = createDeleteDialog();
    // Show the dialog
    dialogElem.showModal();
    // Handle form submission
    var formDeleteComment = dialogElem.querySelector('form');
    formDeleteComment === null || formDeleteComment === void 0 ? void 0 : formDeleteComment.addEventListener('submit', function (e) {
        return handleDeleteSubmission(e, id, dialogElem);
    });
}
// ================ edit comment ================
function editComment(commentId) {
}
// ================ reply comment ================
// handel replay submit
function handelReplaySubmit(commentHTML, editForm) {
    var _a, _b;
    // Get comment id from dataset
    var commentId = (_a = commentHTML === null || commentHTML === void 0 ? void 0 : commentHTML.dataset) === null || _a === void 0 ? void 0 : _a.id;
    // Retrieve comments from local storage
    var comments = JSON.parse(localStorage.getItem('comments') || '[]');
    // Find the target comment to be replied
    var targetComment = comments.find(function (cmnt) {
        if (cmnt.id === Number(commentId) || (cmnt.replies && cmnt.replies.some(function (subCmnt) { return subCmnt.id === Number(commentId); }))) {
            return true;
        }
        return false;
    });
    // Get the user to be replied and the comment content
    var replyingTo = (_b = commentHTML === null || commentHTML === void 0 ? void 0 : commentHTML.querySelector('.comment__user--name')) === null || _b === void 0 ? void 0 : _b.textContent;
    var replies = targetComment === null || targetComment === void 0 ? void 0 : targetComment.replies;
    var replyInput = editForm.querySelector('#comment-textarea');
    // Generate a new sub-comment ID
    var currentUser = currentUserInfo().username;
    var creationTime = new createCreationTime().humanDate;
    var newSubCommentId = replies.length > 0 ? "".concat(targetComment === null || targetComment === void 0 ? void 0 : targetComment.id, ".").concat(replies.length + 1) : "".concat(targetComment === null || targetComment === void 0 ? void 0 : targetComment.id, ".1");
    var content = replyInput.value;
    // Create a new sub-comment object
    var newComment = commentObject(Number(newSubCommentId), content, creationTime, 0, currentUser, true, replyingTo);
    if (targetComment) {
        targetComment.replies.push(newComment);
    }
    // Update local storage with the new sub-comment
    localStorage.setItem('comments', JSON.stringify(comments));
    // Refresh comments in the DOM
    refreshComments();
    // Reset the reply input
    reset(replyInput, true);
}
function replyComment(commentHTML) {
    var _a;
    // Create a reply form
    var editForm = form('reply');
    // Check if the form already exists
    var formExist = (_a = commentHTML.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains('comment-form-container');
    if (!formExist) {
        commentHTML.insertAdjacentElement('afterend', editForm);
    }
    // Add submit event listener to the form
    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handelReplaySubmit(commentHTML, editForm);
    });
    // Add keydown event listener to the reply input
    var replyInput = editForm.querySelector('#comment-textarea');
    replyInput === null || replyInput === void 0 ? void 0 : replyInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handelReplaySubmit(commentHTML, editForm);
        }
    });
}
// localStorage.clear();
// reset
function reset(input, reply) {
    input.value = '';
    if (reply) {
        var comments = document.querySelector('.comments');
        var editForm = comments === null || comments === void 0 ? void 0 : comments.querySelector('.comment-form-container.reply');
        if (editForm) {
            comments === null || comments === void 0 ? void 0 : comments.removeChild(editForm);
        }
    }
}
// refresh the comment dom after deleting or editing or replying 
function refreshComments() {
    var postComments = document.querySelector('.post-comments');
    postComments.innerHTML = '';
    var localData = JSON.parse(localStorage.getItem('data'));
    displayComments(postComments, localData);
}
// alert
function displayAlert(type, msg) {
}
// ========== add the existing comments to the dom ========
// fetch data from server
function fetchComments(dataContainer) {
    fetch('data.json')
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
            if (Type.isObject(element)) {
                // Display current user header
                var userName = element.username;
                container.innerHTML += currentUser(userName);
            }
            else if (Type.isArray(element)) {
                // Display comments and sub-comments
                var commentsSection_1 = document.createElement('section');
                commentsSection_1.classList.add('comments');
                container.appendChild(commentsSection_1);
                element.forEach(function (comment) {
                    var currUser = localData.currentUser.username;
                    var isCurrentUser = comment.user.username === currUser;
                    // Display main comment
                    commentsSection_1.innerHTML += createComment(comment.id, comment.content, comment.createdAt, comment.score, comment.user.username, currUser, isCurrentUser);
                    // Display sub-comments
                    if (comment.replies.length !== 0) {
                        var subCommentsArr_1 = comment.replies;
                        // create sub comment container
                        var subCommentsSection_1 = document.createElement('section');
                        subCommentsSection_1.classList.add('comments__sub-comments');
                        // append the sub comments to his comment
                        var allComment = document.querySelectorAll('.comment');
                        allComment.forEach(function (cmnt) {
                            var cmntId = Number(cmnt.dataset.id);
                            if (cmntId === comment.id) {
                                cmnt.appendChild(subCommentsSection_1);
                                // append the comments to his sub comments container
                                subCommentsArr_1.forEach(function (repliedComment) {
                                    // update the  isCurrentUser to check the replied Comments if one of them is a Current User
                                    var isCurrentUser = repliedComment.user.username === currUser;
                                    var isReplyTo = repliedComment.replyingTo;
                                    subCommentsSection_1.innerHTML += createComment(repliedComment.id, repliedComment.content, repliedComment.createdAt, repliedComment.score, repliedComment.user.username, currUser, isCurrentUser, isReplyTo);
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
}
var createCreationTime = /** @class */ (function () {
    function createCreationTime() {
        this._creationTime = this.createCreationTime();
    }
    createCreationTime.prototype.createCreationTime = function () {
        var nowDay = new Date();
        var year = nowDay.getFullYear();
        var month = (nowDay.getMonth() + 1).toString().padStart(2, '0');
        var day = nowDay.getDate().toString().padStart(2, '0');
        var hour = nowDay.getHours().toString().padStart(2, '0');
        var minute = nowDay.getMinutes().toString().padStart(2, '0');
        var seconds = nowDay.getSeconds().toString().padStart(2, '0');
        var creationTime = new Date("".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute, ":").concat(seconds, "Z")).toISOString();
        return new Date(creationTime);
    };
    createCreationTime.prototype.getElapsedTime = function () {
        var now = new Date();
        var timeDifference = now.getTime() - this._creationTime.getTime();
        var seconds = Math.floor(timeDifference / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var weeks = Math.floor(days / 7);
        var months = Math.floor(days / 30.44); // Average days in a month
        var years = Math.floor(days / 365);
        if (seconds < 60) {
            return 'a moment ago';
        }
        else if (minutes === 1) {
            return '1 minute ago';
        }
        else if (minutes < 60) {
            return "".concat(minutes, " minutes ago");
        }
        else if (hours === 1) {
            return '1 hour ago';
        }
        else if (hours < 24) {
            return "".concat(hours, " hours ago");
        }
        else if (days === 1) {
            return '1 day ago';
        }
        else if (days < 7) {
            return "".concat(days, " days ago");
        }
        else if (weeks === 1) {
            return '1 week ago';
        }
        else if (weeks < 4.33) {
            return "".concat(weeks, " weeks ago");
        }
        else if (months === 1) {
            return '1 month ago';
        }
        else if (months < 12) {
            return "".concat(months, " months ago");
        }
        else if (years === 1) {
            return '1 year ago';
        }
        else {
            return "".concat(years, " years ago");
        }
    };
    Object.defineProperty(createCreationTime.prototype, "humanDate", {
        get: function () {
            return this.createCreationTime().toISOString();
        },
        enumerable: false,
        configurable: true
    });
    return createCreationTime;
}());
