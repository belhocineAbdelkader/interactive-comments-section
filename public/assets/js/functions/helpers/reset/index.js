"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ================ reset 
function reset(input, reply) {
    input.value = '';
    if (reply) {
        var replyForms = document.querySelectorAll('.comment-form-container.reply');
        replyForms.forEach(function (form) { var _a; return (_a = form.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(form); });
    }
}
exports.default = reset;
