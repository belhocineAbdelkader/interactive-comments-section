"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// current user
var currentUser = function (name) { return "\n  <header hidden class=\"owner-user\">\n    <figure>\n      <img class=\"owner-user__avatar\" src=\"/assets/images/avatars/image-".concat(name, ".webp\" alt=\"User Avatar\">\n    </figure>\n    <h1 class=\"owner-user__name\">").concat(name, "</h1>\n  </header>"); };
exports.default = currentUser;
