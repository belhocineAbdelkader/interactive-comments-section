// import classes
import Counter from "../../classes/Counter";

// *================ vote comment ================

const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');

// Define a map to store initial vote counts for each comment
export const initialVotes: Map<string, number> = new Map();

// Function to initialize initial votes for all comments
export function initializeInitialVotes(comments: comments) {
  comments.forEach(comment => {
    initialVotes.set(comment.id.toString(), comment.score);
    if (comment.replies) {
      comment.replies.forEach(subComment => {
        initialVotes.set(subComment.id.toString(), subComment.score);
      });
    }
  });
}

// Call initializeInitialVotes function when comments are loaded
initializeInitialVotes(comments);

// Modify the commentVote function to use initialVotes map
// localStorage.clear()
export default function commentVote(target: Element) {
  const commentHTML = target.closest('article.comment') as HTMLElement;
  const commentId = commentHTML.dataset.id as string;
  const voteOutput = commentHTML.querySelector('.comment__counter-btns--value output') as HTMLOutputElement;

  const targetComment = comments.find(comment => {
    return comment.id === parseInt(commentId) ||
      (comment.replies && comment.replies.some(subComment => 
          subComment.id === parseInt(commentId)))
  });

  if (!targetComment) return;

  // Get the initial vote count for the comment
  const initialVote = initialVotes.get(commentId) || 0;

  // Set the initial range for the score based on the initial vote count
  const minValue = initialVote - 1;
  const maxValue = initialVote + 1;

  // Create a RangeCounter instance for the score
  const commentCounter = new Counter(targetComment.score, minValue, maxValue);

  if (target.classList.contains('increase')) {
    if (commentCounter.getValue() < maxValue) {
      commentCounter.increment();
      voteOutput.textContent = `${commentCounter.getValue()}`;
      targetComment.score = commentCounter.getValue();
    }
  } else if (target.classList.contains('decrease')) {
    if (commentCounter.getValue() > minValue) {
      commentCounter.decrement();
      voteOutput.textContent = `${commentCounter.getValue()}`;
      targetComment.score = commentCounter.getValue();
    }
  }

  // Update local storage
  localStorage.setItem('comments', JSON.stringify(comments));
}

