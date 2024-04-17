import createCreationTime from "../../../classes/createCreationTime";

// comment Object
export default function createComment (id: number, content: string, createdAt: string, score: number, user: string, isCurrentUser: boolean = false, isReplyTo?: string, isReplyToId?: string) {

  const CurrentUserBtns = `
    <button type="button" class="btn delete">
        <span class="btn-wrap">
          <span class="icon icon-delete"></span>
          <span class="btn-text">Delete</span>
          <span class="only-sr">delete comment</span>
        </span>
      </button>
      <button type="button" class="btn edit">
        <span class="btn-wrap">
          <span class="icon icon-edit"></span>
          <span class="btn-text">Edit</span>
          <span class="only-sr">edit comment</span>
        </span>
    </button>
  `;
  const regularUserBtns = `
  <button type="button" class="btn reply-comment">
    <span class="btn-wrap">
      <span class="icon icon-reply"></span>
      <span class="btn-text">Reply</span>
      <span class="only-sr">reply to comment</span>
    </span>
  </button>

  `;
  // dealing with Elapsed Time
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  const validDate = regex.test(createdAt);
  const setElapsedTime = (date:string) => {
    return new createCreationTime().getElapsedTime(date);
  }

  const article = document.createElement('article');

  article.classList.add(`comment`);
  if (isCurrentUser) {
    article.classList.add(`current-user`);
  }

  article.setAttribute('data-id', `${id}`);
  article.setAttribute('id', `${id}`);
  article.insertAdjacentHTML('beforeend', `
  <div class="comment__wrapper">
        <header class="comment__user">
          <img class="comment__user--avatar" src="/assets/images/avatars/image-${user}.webp" alt="User Avatar">
          <h2 class="comment__user--name">${user} ${isCurrentUser ? "<span class='you'>You</span>" : ''}</h2>
          <div class="comment__createdAt">
            <time class="time-createdAt" datetime="${createdAt}">${validDate ? setElapsedTime(createdAt) : createdAt}</time>
          </div>
        </header>
        <p class="comment__content">
          ${!isReplyTo ? `${content}` : `<a href="#${isReplyToId}" class="replyingTo">@${isReplyTo}</a> ${content}`} 
        </p>
        <div class="comment__counter-btns">
          <button type="button" class="btn vote increase">
            <span class="btn-wrap">
              <span class="icon increase icon-plus"></span>
              <span class="only-sr">increase the comment rate</span>
            </span>
          </button>
          <div class="comment__counter-btns--value">
            <output id="comment-counter-value" value="${score}">${score}</output>
          </div>
          <button type="button" class="btn vote decrease">
            <span class="btn-wrap">
              <span class="icon icon-minus decrease"></span>
              <span class="only-sr">decrease the comment rate</span>
            </span>
          </button>
        </div>
        <div class="comment__action-btns">
          ${isCurrentUser ? CurrentUserBtns : regularUserBtns}
        </div>
      </div>
  `);

  return article;
}