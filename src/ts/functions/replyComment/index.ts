import DOMPurify from 'dompurify';


// import classes
import createCreationTime from "../../classes/createCreationTime";

// import component
// object
import currentUserInfo from "../../components/object/currentUserInfo"
import commentObject from "../../components/object/commentObject"

// html
import displayAlert from "../../components/html/displayAlert"
import createComment from "../../components/html/createComment"
import form from "../../components/html/form";

// import helper functions
// reset
import reset from "../helpers/reset"


// *================ reply comment ================
// update ui for reply
// Update UI after reply submission
function updateReplyUI(commentHTML: HTMLElement, newComment: subComment) {
  const fragmentSubComments = document.createDocumentFragment();
  const subCmnt = createComment(newComment.id, newComment.content, newComment.createdAt, newComment.score, newComment.user.username, true, newComment.replyingTo);

  if (commentHTML.closest('.comments__sub-comments')) {
    const commentsSection = commentHTML.closest('.comments__sub-comments');
    commentsSection?.insertAdjacentElement('beforeend', JSON.parse(DOMPurify.sanitize(subCmnt)));

  } else {
    const subCommentsSection = document.createElement('section');
    subCommentsSection.classList.add('comments__sub-comments');
    fragmentSubComments.appendChild(subCmnt);
    subCommentsSection.appendChild(fragmentSubComments);
    commentHTML.insertAdjacentElement('beforeend', JSON.parse(DOMPurify.sanitize(subCommentsSection)));
  }
}
// handel replay submit
function handelReplaySubmit(commentHTML: HTMLElement, editForm: HTMLDivElement) {
  const commentId = commentHTML?.dataset?.id;
  if (!commentId) return;


  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');
  const targetComment = comments.find(comment => {
    return comment.id === parseInt(commentId) || (comment.replies && comment.replies.some(reply => reply.id === parseInt(commentId)));
  });

  // Get the user to be replied and the comment content
  const replyingTo = commentHTML?.querySelector('.comment__user--name')?.textContent || '';
  const replyInput = editForm.querySelector('#comment-textarea') as HTMLTextAreaElement;

  if (!replyInput || !targetComment) return;

  const currentUser = currentUserInfo().username;
  const creationTime = new createCreationTime().humanDate;
  const replies = targetComment?.replies!;
  // Generate a new sub-comment ID
  const newSubCommentId = replies.length > 0 ? `${targetComment?.id}.${replies.length + 1}` : `${targetComment?.id}.1`;

  const content = replyInput.value;

  if (!content) {
    displayAlert('danger', 'Please provide a valid comment content.');
    return;
  }

  // Create a new sub-comment object
  const newComment = commentObject(Number(newSubCommentId), content, creationTime, 0, currentUser, true, replyingTo) as subComment;

  if (targetComment) {
    targetComment.replies.push(newComment as never);
  }

  // Update UI
  scheduler.postTask(() => updateReplyUI(commentHTML, newComment), { priority: 'user-blocking' });

  // Reset the input field
  scheduler.postTask(() => reset(replyInput, true), { priority: 'user-blocking' });

  // Update local storage with the new sub-comment
  scheduler.postTask(() => localStorage.setItem('comments', JSON.stringify(comments)), { priority: 'background' });

}

export default function replyComment(commentHTML: HTMLElement) {
  // Create a reply form
  const replyForm = form('reply');

  // Check if the form already exists
  const formExist = commentHTML.nextElementSibling?.classList.contains('comment-form-container') as boolean;

  if (!formExist) {
    commentHTML.insertAdjacentElement('afterend', JSON.parse(DOMPurify.sanitize(replyForm)));
  }

  // Add submit event listener to the form
  replyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handelReplaySubmit(commentHTML, replyForm);
  });

  // Add keydown event listener to the reply input
  const replyInput = replyForm.querySelector('#comment-textarea') as HTMLTextAreaElement;
  replyInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handelReplaySubmit(commentHTML, replyForm);
    }
  });
}