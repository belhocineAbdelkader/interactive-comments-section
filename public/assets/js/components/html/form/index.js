"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// form
function form(type) {
    // create the form container
    var fromContainer = document.createElement('div');
    fromContainer.setAttribute('class', "comment-form-container ".concat(type));
    fromContainer.innerHTML = "\n      <form class=\"comment-form-container__form\">\n        <label for=\"comment-textarea\">\n          <span class=\"only-sr\">your comment here</span>\n          <textarea class=\"textarea\" name=\"comment-input\" id=\"comment-textarea\" placeholder=\"Add a comment\"></textarea>\n        </label>\n        <button class=\"btn btn-primary ".concat(type, "\" id=\"").concat(type, "\" type=\"submit\">\n          <span class=\"btn-wrap\">\n            <span class=\"text capitalize\">\n              ").concat(type, "\n            </span>\n          </span>\n        </button>\n        <div class=\"comment-form-container__form__user-avatar\">\n          <figure>\n            <img class=\"owner-user__avatar\" src=\"/assets/images/avatars/image-juliusomo.webp\" alt=\"User Avatar\">\n          </figure>\n        </div>\n      </form>");
    return fromContainer;
}
exports.default = form;
