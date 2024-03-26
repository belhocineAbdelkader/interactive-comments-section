"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// comment Object
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
                png: "./images/avatars/image-".concat(username, ".webp"),
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
                png: "./images/avatars/image-".concat(username, ".webp"),
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
exports.default = commentObject;
