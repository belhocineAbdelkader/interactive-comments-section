// form
export default function form  (type: string)  {
  // create the form container
  const fromContainer = document.createElement('div');
  fromContainer.setAttribute('class', `comment-form-container ${type}`);
  fromContainer.innerHTML = `
      <form class="comment-form-container__form">
        <label for="comment-textarea">
          <span class="only-sr">your comment here</span>
          <textarea class="textarea" name="comment-input" id="comment-textarea" placeholder="Add a comment"></textarea>
        </label>
        <button class="btn btn-primary ${type}" id="${type}" type="submit">
          <span class="btn-wrap">
            <span class="text capitalize">
              ${type}
            </span>
          </span>
        </button>
        <div class="comment-form-container__form__user-avatar">
          <figure>
            <img class="owner-user__avatar" src="/assets/images/avatars/image-juliusomo.webp" alt="User Avatar">
          </figure>
        </div>
      </form>`
  return fromContainer
}