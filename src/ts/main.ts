// import checkType from "./helpers/checkTypes";

class checkTypes {
  isArray = (val: any): val is Array<any> => Array.isArray(val);

  isObject = (val: any): val is object => val !== null && typeof val === 'object' && !Array.isArray(val);

  isUndefined = (val: any): val is undefined => val === undefined;

  isNull = (val: any): val is null => val === null;

  isTrue = <T>(arg: T): { arg: T, typeofarg: string, is: boolean } => {
    if (Array.isArray(arg) && arg.length)
      return { arg, typeofarg: typeof arg, is: false };
    if (arg !== 'null' || 'undefined' && typeof arg === 'object' && Object.keys(arg as keyof T).length)
      return { arg, typeofarg: typeof arg, is: false };
    return { arg, typeofarg: typeof arg, is: Boolean(arg) };
  }

}
const Type = new checkTypes();

// ============== Types ==============

// ----- Comments -----
type DataComments = {
  [key: string]: currentUser | comments
}
// ----- Current User -----
type currentUser = {
  image: {
    png: string,
    webp: string,
  },
  username: string
}

// ----- comments -----
type comments = comment[];

// ----- comment -----
type comment = {
  id: number,
  content: string,
  createdAt: string,
  score: number,
  user: {
    image: {
      png: string,
      webp: string,
    },
    username: string
  },
  replies: [] | subComment[]
}

// ----- replied comment -----
type subComment = {
  id: number,
  content: string,
  createdAt: string,
  score: number,
  replyingTo: string,
  user: {
    image: {
      png: string,
      webp: string,
    },
    username: string
  },
}

// event listener

// content Loaded
window.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById('app') as HTMLDivElement;

  // create the article to hold all element of comments
  const postComments = document.createElement('article');
  postComments.classList.add('post-comments');
  app.appendChild(postComments);

  // create form element
  const sendForm = form('send');
  app.appendChild(sendForm);

  // fetching comment from server and display them in the web page
  fetchComments(postComments);

  // adding a comment
  const input = (document.getElementById('comment-textarea') as HTMLTextAreaElement);
  sendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addComment(postComments, input);
  });

  // handel key press
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment(postComments, input);
    }
  });

  // Event delegation for comment actions
  postComments.addEventListener('click', (event): void => {
    const target = (event.target as HTMLElement).closest('.btn');

    if (target?.classList.contains('delete')) {
      const commentID = (target.closest('article.comment') as HTMLElement)!.dataset.id as string
      deleteComment(commentID);
    } else if (target?.classList.contains('edit')) {
      const commentID = (target.closest('article.comment') as HTMLElement)!.dataset.id as string
      editComment(commentID);
    } else if (target?.classList.contains('reply')) {
      const commentHTML = (target.closest('article.comment') as HTMLElement)!;
      console.log('commentHTML :', commentHTML);
      replyComment(commentHTML);
    }
  });


})


// ============= Functions =============
//----- functions -----
// function to create html
// form
const form = (type: string) => {
  // create the form container
  const fromContainer = document.createElement('div');
  fromContainer.setAttribute('class', `comment-form-container ${type}`);
  fromContainer.innerHTML = `
      <form class="comment-form-container__form">
        <label for="comment-textarea">
          <span class="only-sr">your comment here</span>
          <textarea class="textarea" name="comment-input" id="comment-textarea" placeholder="Add a comment"></textarea>
        </label>
        <button class="btn ${type}" type="submit">
          <span class="btn-wrap">
            <span class="text capitalize">
              ${type}
            </span>
          </span>
        </button>
        <div class="comment-form-container__form__user-avatar">
          <figure>
            <img class="owner-user__avatar" src="/src/assets/images/avatars/image-juliusomo.png" alt="User Avatar">
          </figure>
        </div>
      </form>`
  return fromContainer
}

// Function to create the current user header
const currentUser = (name: string) => `
  <header hidden class="owner-user">
    <figure>
      <img class="owner-user__avatar" src="/src/assets/images/avatars/image-${name}.png" alt="User Avatar">
    </figure>
    <h1 class="owner-user__name">${name}</h1>
  </header>`
  ;

// Function to create a comment or sub-comment
const createComment = (id: number, content: string, createdAt: string, score: number, user: string, currUser: currentUser["username"], isCurrentUser: boolean = false, isReplyTo?: string) => {

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
  <button type="button" class="btn reply">
    <span class="btn-wrap">
      <span class="icon icon-reply"></span>
      <span class="btn-text">Reply</span>
      <span class="only-sr">reply to comment</span>
    </span>
  </button>

  `;

  return `
    <article class="comment${isCurrentUser ? ' current-user' : ''}" data-id="${id}">
      <div class="comment__wrapper">
        <header class="comment__user">
          <img class="comment__user--avatar" src="/src/assets/images/avatars/image-${user}.webp" alt="User Avatar">
          <h2 class="comment__user--name">${user}</h2>
          <div class="comment__createdAt">
            <time datetime="${createdAt}">${createdAt}</time>
          </div>
        </header>
        <p class="comment__content">
          ${!isReplyTo ? `${content}` : `<span class="replyingTo">@${isReplyTo}</span> ${content}`} 
        </p>
        <div class="comment__counter-btns">
          <button type="button" class="btn counter increase">
            <span class="btn-wrap">
              <span class="icon increase icon-plus"></span>
              <span class="only-sr">increase the comment rate</span>
            </span>
          </button>
          <div class="comment__counter-btns--value">
            <output id="comment-counter-value">${score}</output>
          </div>
          <button type="button" class="btn counter decrease">
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
      </article>`;
}
function currentUserInfo(): currentUser {
  const currentUser = localStorage.getItem('currentUser') as string,
    currentUserInfo = JSON.parse(currentUser)
  return currentUserInfo;
}

function commentObject(id: number, content: string, createdAt: string, score: number, username: string, isSubComment = false, replyingTo: subComment['replyingTo'] = ''): (comment | subComment) {

  const comment: comment = {
    id: id,
    content: content,
    createdAt: createdAt,
    score: score,
    user: {
      image: {
        png: `./images/avatars/image-${username}.png`,
        webp: `./images/avatars/image-${username}.webp`,
      },
      username: username,
    },
    replies: []
  };

  const subComment: subComment = {
    id: id,
    content: content,
    createdAt: createdAt,
    score: 0,
    replyingTo: replyingTo,
    user: {
      image: {
        png: `./images/avatars/image-${username}.png`,
        webp: `./images/avatars/image-${username}.webp`,
      },
      username: username
    },
  }

  if (isSubComment) {
    return subComment
  }
  return comment;
}

// ================ add comment ================

function addComment(container: HTMLElement, input: HTMLTextAreaElement, type: ("comment" | "subComment") = "comment", targetComment?: comment, replyingTo?: string) {
  const content = input.value.trim();
  const currentUser = currentUserInfo();
  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');
  const creationTime = new createCreationTime();


  // Check if the content is empty
  if (!content) {
    displayAlert('danger', 'Please provide comment content first');
    return;
  }
  // for comment (replying)
  // Generate a new comment ID
  const newCommentId = comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;
  // Create a new comment object
  const newComment = commentObject(newCommentId, content, creationTime.humanDate, 0, currentUser.username);

  // Update local storage with the new comment
  localStorage.setItem('comments', JSON.stringify([...comments, newComment]));

  // Refresh the comments display
  refreshComments();

  // Reset the input field
  reset(input);
}

// ================ delete comment ================
// Function to create the delete comment dialog
function createDeleteDialog(): HTMLDialogElement {
  const dialogElem = document.createElement('dialog');
  dialogElem.setAttribute('class', 'dialog');
  dialogElem.innerHTML = `
    <div autofocus>
      <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
    </div>
    <form method="dialog">
      <div class="btn_collection"></div>
      <button class="cancel" type="submit" value="no, cancel">NO, CANCEL</button>
      <button class="delete" type="submit" value="yes, delete" formmethod="dialog">YES, DELETE</button>
    </form>
  `;

  document.body.appendChild(dialogElem);
  return dialogElem;
}
// Function to delete comment from localStorage
function deleteCommentFromLocalStorage(commentId: string) {
  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');

  const updatedComments = comments.filter((cmnt) => {
    if (cmnt.id === Number(commentId)) {
      // Delete the main comment
      return false;
    } else if (cmnt.replies) {
      // Delete a sub-comment
      cmnt.replies = cmnt.replies.filter((subCmnt) => subCmnt.id !== Number(commentId));
    }
    return true;
  });

  localStorage.setItem('comments', JSON.stringify(updatedComments));
}
// Function to handle the delete form submission
function handleDeleteSubmission(e: SubmitEvent, commentId: string, dialogElem: HTMLDialogElement) {
  e.preventDefault();

  const target = e.target as HTMLFormElement | null;

  if (!target) return;

  const buttonValue = (e.submitter as HTMLButtonElement)!.value;

  if (buttonValue === 'no, cancel') {
    // Close the dialog
    dialogElem.close();
    // Remove the created dialog after canceling the deletion
    document.body.removeChild(dialogElem);
  } else if (buttonValue === 'yes, delete') {
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
function deleteComment(id: string) {

  const dialogElem = createDeleteDialog();

  // Show the dialog
  dialogElem.showModal();

  // Handle form submission
  const formDeleteComment = dialogElem.querySelector('form');
  formDeleteComment?.addEventListener('submit', (e) =>
    handleDeleteSubmission(e, id, dialogElem));
}


// ================ edit comment ================
function editComment(commentId: string) {
  
}
// ================ reply comment ================

// handel replay submit
function handelReplaySubmit(commentHTML: HTMLElement, editForm: HTMLDivElement) {
  // Get comment id from dataset
  const commentId = commentHTML?.dataset?.id as string;

  // Retrieve comments from local storage
  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');

  // Find the target comment to be replied
  const targetComment = comments.find(cmnt => {
    if (cmnt.id === Number(commentId) || (cmnt.replies && cmnt.replies.some(subCmnt => subCmnt.id === Number(commentId)))) {
      return true;
    }
    return false;
  });

  // Get the user to be replied and the comment content
  let replyingTo = commentHTML?.querySelector('.comment__user--name')?.textContent as string;
  const replies = targetComment?.replies!;
  const replyInput = editForm.querySelector('#comment-textarea') as HTMLTextAreaElement;

  // Generate a new sub-comment ID
  const currentUser = currentUserInfo().username;
  const creationTime = new createCreationTime().humanDate;
  const newSubCommentId = replies.length > 0 ? `${targetComment?.id}.${replies.length + 1}` : `${targetComment?.id}.1`;
  const content = replyInput.value;

  // Create a new sub-comment object
  const newComment = commentObject(Number(newSubCommentId), content, creationTime, 0, currentUser, true, replyingTo) as never;

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

function replyComment(commentHTML: HTMLElement) {
  // Create a reply form
  const editForm = form('reply');
  
  // Check if the form already exists
  const formExist = commentHTML.nextElementSibling?.classList.contains('comment-form-container') as boolean;

  if (!formExist) {
    commentHTML.insertAdjacentElement('afterend', editForm);
  }

  // Add submit event listener to the form
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handelReplaySubmit(commentHTML, editForm);
  });

  // Add keydown event listener to the reply input
  const replyInput = editForm.querySelector('#comment-textarea') as HTMLTextAreaElement;
  replyInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handelReplaySubmit(commentHTML, editForm);
    }
  });
}


// localStorage.clear();
// reset
function reset(input: HTMLTextAreaElement, reply?: boolean) {
  input.value = '';
  if (reply) {
    const comments = document.querySelector('.comments');
    const editForm = comments?.querySelector('.comment-form-container.reply');
    if (editForm) {
      comments?.removeChild(editForm);
    }
  }
}

// refresh the comment dom after deleting or editing or replying 
function refreshComments() {
  const postComments = document.querySelector('.post-comments') as HTMLElement;
  postComments.innerHTML = '';
  const localData: DataComments = JSON.parse(localStorage.getItem('data') as string);
  displayComments(postComments, localData);
}

// alert

function displayAlert(type: string, msg: string) {

}

// ========== add the existing comments to the dom ========

// fetch data from server
function fetchComments(dataContainer: HTMLElement) {
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      setDataToLocalStorage(data)

      // get the data from local storage
      const localData: DataComments = JSON.parse(localStorage.getItem('data') as string);
      displayComments(dataContainer, localData);
    })
    .catch(error =>
      console.error('Error fetching data:', error)
    );
}

// function to set the fetched data to the storage
function setDataToLocalStorage(data: DataComments) {
  for (const key in data) {
    const value = data[key];
    if (key === "currentUser" && !localStorage.getItem("comments")) {
      localStorage.setItem(`${key}`, JSON.stringify(value))
    } else if (key === "comments" && !localStorage.getItem("comments")) {
      localStorage.setItem(`${key}`, JSON.stringify(value))
    }
  }
}
// Function to display comments on the web page from the local storage
function displayComments(container: HTMLElement, localData: DataComments) {

  const currentUserLocalData: currentUser = JSON.parse(localStorage.getItem("currentUser")!);
  const commentsLocalData: comments = JSON.parse(localStorage.getItem("comments")!);

  localData = {
    currentUser: currentUserLocalData,
    comments: commentsLocalData,
  }

  if (localData) {
    for (const key in localData) {
      const element = localData[key];

      if (Type.isObject(element)) {
        // Display current user header
        const userName = (element as currentUser).username;
        container.innerHTML += currentUser(userName);

      } else if (Type.isArray(element)) {
        // Display comments and sub-comments
        const commentsSection = document.createElement('section');
        commentsSection.classList.add('comments');
        container.appendChild(commentsSection);

        (element as comments).forEach(comment => {
          const currUser: currentUser["username"] = (localData.currentUser as currentUser).username;
          const isCurrentUser = comment.user.username === currUser;

          // Display main comment
          commentsSection.innerHTML += createComment(comment.id, comment.content, comment.createdAt, comment.score, comment.user.username, currUser, isCurrentUser,);

          // Display sub-comments
          if (comment.replies.length !== 0) {
            const subCommentsArr = comment.replies;

            // create sub comment container
            const subCommentsSection = document.createElement('section');
            subCommentsSection.classList.add('comments__sub-comments');

            // append the sub comments to his comment
            const allComment = document.querySelectorAll('.comment') as NodeListOf<HTMLElement>;
            allComment.forEach((cmnt: HTMLElement) => {
              const cmntId = Number(cmnt.dataset!.id);

              if (cmntId === comment.id) {
                cmnt.appendChild(subCommentsSection);
                // append the comments to his sub comments container
                subCommentsArr.forEach(repliedComment => {
                  // update the  isCurrentUser to check the replied Comments if one of them is a Current User
                  const isCurrentUser = repliedComment.user.username === currUser;
                  const isReplyTo = repliedComment.replyingTo;
                  subCommentsSection.innerHTML += createComment(repliedComment.id, repliedComment.content, repliedComment.createdAt, repliedComment.score, repliedComment.user.username, currUser, isCurrentUser, isReplyTo);
                });
              }
            })
          }
        });
      }
    }
  }
}





class createCreationTime {
  _creationTime: Date;
  constructor() {
    this._creationTime = this.createCreationTime();
  }

  createCreationTime() {
    const nowDay = new Date();
    const year = nowDay.getFullYear();
    const month = (nowDay.getMonth() + 1).toString().padStart(2, '0');
    const day = nowDay.getDate().toString().padStart(2, '0');
    const hour = nowDay.getHours().toString().padStart(2, '0');
    const minute = nowDay.getMinutes().toString().padStart(2, '0');
    const seconds = nowDay.getSeconds().toString().padStart(2, '0');
    const creationTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:${seconds}Z`).toISOString();
    return new Date(creationTime);
  }

  getElapsedTime() {
    const now = new Date();
    const timeDifference = now.getTime() - this._creationTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44); // Average days in a month
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'a moment ago';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours === 1) {
      return '1 hour ago';
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return '1 day ago';
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (weeks === 1) {
      return '1 week ago';
    } else if (weeks < 4.33) {
      return `${weeks} weeks ago`;
    } else if (months === 1) {
      return '1 month ago';
    } else if (months < 12) {
      return `${months} months ago`;
    } else if (years === 1) {
      return '1 year ago';
    } else {
      return `${years} years ago`;
    }
  }

  public get humanDate(): string {
    return this.createCreationTime().toISOString()
  }
}


