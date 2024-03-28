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

// import helper functions
// reset
import reset from "../helpers/reset"

// deal with new comment voting
import { initialVotes , initializeInitialVotes } from "../commentVote"


// *================ add comment ================
export default function addComment(container: HTMLElement, input: HTMLTextAreaElement) {
  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');
  
  // deal with new comment voting
  initialVotes
  initializeInitialVotes(comments);

  const content = input.value.trim();
  const currentUser = currentUserInfo();
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
  const newCommentObject = commentObject(newCommentId, content, creationTime.humanDate, 0, currentUser.username);
  const newComment = createComment(newCommentObject.id, newCommentObject.content, newCommentObject.createdAt, newCommentObject.score, newCommentObject.user.username, true)

  // update ui
  const commentsSection = container.querySelector('section.comments') as HTMLElement;
  scheduler.postTask(() => commentsSection?.insertAdjacentHTML("beforeend", DOMPurify.sanitize(newComment)), { priority: 'user-blocking' });
  // Reset the input field
  scheduler.postTask(() => reset(input), { priority: 'user-blocking' });
  // Update local storage with the new comment
  scheduler.postTask(() => localStorage.setItem('comments', JSON.stringify([...comments, newCommentObject])), { priority: 'background' });

}