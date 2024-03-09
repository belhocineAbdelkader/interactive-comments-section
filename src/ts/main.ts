// import checkType from "./helpers/checkTypes";

// import checkTypes from './helpers/checkTypes';
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

// function to create html

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

// edit options
// let editElement: HTMLElement,
//   editFlag = false,
//   editID = '';

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
  sendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = (document.getElementById('comment-textarea') as HTMLTextAreaElement)
    addComment(postComments, input);
  });

  // Event delegation for comment actions
  postComments.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('delete')) {
      deleteComment(target.closest('.comment') as HTMLElement);
    } else if (target.classList.contains('edit')) {
      editComment(target.closest('.comment') as HTMLElement);
    } else if (target.classList.contains('reply')) {
      replyComment(target.closest('.comment') as HTMLElement);
    }
  });


})


// ============= Functions =============
//----- functions -----
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
    createdAt: 'string',
    score: 0,
    replyingTo: replyingTo,
    user: {
      image: {
        png: `./images/avatars/image-${username}.png`,
        webp: `./images/avatars/image-${username}.webp`,
      },
      username: 'string'
    },
  }

  if (isSubComment) {
    return subComment
  }
  return comment;
}

// add comment
function addComment(container: HTMLElement, input: HTMLTextAreaElement) {
  const content = input.value;
  const currentUser = currentUserInfo();
  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');

  if (!content) {
    displayAlert('danger', 'Please provide comment content first')
    return
  }
  if (comments.length > 0) {
    const newCommentId = comments[comments.length - 1].id + 1;
    const creationTime = new createCreationTime();
    const newComment = commentObject(newCommentId, content, creationTime.humanDate, 0, currentUser.username);
    console.log('newComment :', newComment);

    // container.innerHTML += createComment(newComment.id, newComment.content, newComment.createdAt, newComment.score, newComment.user.username, '');

    // Update local storage with the new comment
    localStorage.setItem('comments', JSON.stringify([...comments, newComment]));
    const postComments = document.querySelector('.post-comments') as HTMLElement;
    postComments.innerHTML = '';
    const localData: DataComments = JSON.parse(localStorage.getItem('data') as string);
    displayComments(postComments, localData);
  }

  reset(input);
}


const creationTime = new Date().toTimeString();

// delete comment
function deleteComment(comment: HTMLElement) {
  // Implement your logic for deleting a comment from the DOM and local storage
}


// edit comment
function editComment(comment: HTMLElement) {
  // Implement your logic for editing a comment in the DOM and local storage
}

// reply comment
function replyComment(comment: HTMLElement) {
  // Implement your logic for replying to a comment in the DOM and local storage
}

// reset
function reset(input: HTMLTextAreaElement) {
  input.value = '';
}

// alert

function displayAlert(type: string, msg: string) {

}

//  local Storage

// add to local Storage

function addToLocalStorage() {

}

// remove from local Storage 

function removeFromLocalStorage() {

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
    }
    if (key === "comments" && !localStorage.getItem("comments")) {
      localStorage.setItem(`${key}`, JSON.stringify(value))
    }
    return
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




function getElapsedTime(creationTime: Date): string {
  const now = new Date();
  const timeDifference = now.getTime() - creationTime.getTime();
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


