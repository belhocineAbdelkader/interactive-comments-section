"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// comment Object
function commentObject(id, content, createdAt, score, username, isSubComment, replyingTo, replyingToId) {
    if (isSubComment === void 0) { isSubComment = false; }
    if (replyingTo === void 0) { replyingTo = ''; }
    if (replyingToId === void 0) { replyingToId = ''; }
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
        replyingToId: "".concat(replyingToId),
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
