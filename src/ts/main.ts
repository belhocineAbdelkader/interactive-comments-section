import DOMPurify from 'dompurify';
import 'scheduler-polyfill';


// import classes
import checkType from "./classes/checkType";
import createCreationTime from "./classes/createCreationTime";

// import component
// html
import createComment from "./components/html/createComment"
import form from './components/html/form';
import currentUser from './components/html/currentUser';

// import main functions for comment
import addComment from "./functions/addComment";
import deleteComment from "./functions/deleteComment";
import editComment from './functions/editComment';
import replyComment from './functions/replyComment';
import commentVote from './functions/commentVote';


// global scope declaration classes
const Type = new checkType();

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
      const commentHTML = target.closest('article.comment') as HTMLElement
      deleteComment(commentHTML);

    } else if (target?.classList.contains('edit')) {
      const commentID = target.closest('article.comment') as HTMLElement
      editComment(commentID);

    } else if (target?.classList.contains('reply-comment')) {
      const commentHTML = (target.closest('article.comment') as HTMLElement)!;
      replyComment(commentHTML);

    } else if (target?.classList.contains('vote')) {
      commentVote(target);
    }
  });
})




// ================ fetch data from server ================
function fetchComments(dataContainer: HTMLElement) {
  fetch('../../public/assets/data/data.json')
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
// ========== add the existing comments to the dom ========
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

      const fragmentComments = document.createDocumentFragment();
      if (Type.isObject(element)) {
        // Display current user header
        const userName = (element as currentUser).username;
        container.insertAdjacentHTML('beforeend', DOMPurify.sanitize(currentUser(userName)));

      } else if (Type.isArray(element)) {
        // Display comments and sub-comments
        const commentsSection = document.createElement('section');
        commentsSection.classList.add('comments');
        container.appendChild(commentsSection);

        (element as comments).forEach(comment => {
          const currUser: currentUser["username"] = (localData.currentUser as currentUser).username;
          const isCurrentUser = comment.user?.username === currUser;
          const cmnt = createComment(comment.id, comment.content, comment.createdAt, comment.score, comment.user?.username, isCurrentUser)

          fragmentComments.appendChild(cmnt);
          // Display main comment
          commentsSection.appendChild(fragmentComments);

          // Display sub-comments
          if (comment.replies?.length !== 0) {
            const subCommentsArr = comment.replies;

            // create sub comment container
            const subCommentsSection = document.createElement('section');
            subCommentsSection.classList.add('comments__sub-comments');
            const fragmentSubComments = document.createDocumentFragment();
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
                  const subCmnt = createComment(repliedComment.id, repliedComment.content, repliedComment.createdAt, repliedComment.score, repliedComment.user.username, isCurrentUser, isReplyTo)
                  fragmentSubComments.appendChild(subCmnt)
                  subCommentsSection.appendChild(fragmentSubComments);
                });
              }
            })
          }
        });
      }
    }
  }

  // deal with passed time of creation of comment
  insertPassedTime();

}

// fn for count the passed time from comment creation
function insertPassedTime() {
  const passedTimeElements = document.querySelectorAll('.time-createdAt') as NodeListOf<HTMLTimeElement>;
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  passedTimeElements.forEach(element => {
    if (regex.test(element.dateTime)) {
      element.textContent = new createCreationTime().getElapsedTime(element.dateTime);
    }
  });
}


