
// import component
// html
import form from "../../components/html/form"

// import helper functions
// reset
import reset from "../helpers/reset"


// import delete comment fn
import deleteComment from "../deleteComment";

// *================ edit comment ================
function handelEditSubmit(commentHTML: HTMLElement, editForm: HTMLDivElement, replyingTo: string) {
  const inputForm = editForm.querySelector('#comment-textarea') as HTMLTextAreaElement;

  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');

  const targetCommentId = Number(commentHTML.dataset.id);


  // Iterate through comments to find the target comment and replace the content
  const updatedComments = comments.map(comment => {
    if (comment.id === targetCommentId) {
      comment.content = inputForm.value.trim();
    } else if (comment.replies) {
      comment.replies.forEach(subComment => {
        if (subComment.id === targetCommentId) {
          subComment.content = inputForm.value.trim();
        }
      });
    }
    return comment;
  });

  // Update ui
  scheduler.postTask(() => {
    const p = document.createElement('p');
    p.setAttribute('class', 'comment__content');
    editForm.replaceWith(p);
    p.textContent = `${replyingTo} ${inputForm.value.trim()}`;
  }, { priority: 'user-blocking' });

  // Reset the input field
  scheduler.postTask(() => reset(inputForm), { priority: 'user-blocking' });

  // Update local storage with the new comment
  scheduler.postTask(() => localStorage.setItem('comments', JSON.stringify(updatedComments)), { priority: 'background' });

}

export default function editComment(commentHTML: HTMLElement) {
  const contentElem = commentHTML.querySelector('.comment__content') as HTMLElement;
  const editForm = form('edit');
  const inputForm = editForm.querySelector('#comment-textarea') as HTMLTextAreaElement;

  // Remove unnecessary elements from the new form
  editForm.firstElementChild?.removeChild(editForm.querySelector('.comment-form-container__form__user-avatar') as HTMLElement);

  // Extract the user being replied to
  let replyingTo: string;
  if (contentElem) {
    replyingTo = (contentElem.textContent?.match(/@\S+/) || [''])[0];

    // Display the edit form
    contentElem.replaceWith(editForm);

    // Set existing content to the edit form
    let content = contentElem.textContent?.replace(replyingTo, '')?.trim() || '';
    inputForm.value = content;
  };

  // Handle form submission
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!inputForm.value.trim()) {
      // Handle empty input
      deleteComment(commentHTML);
    } else {
      handelEditSubmit(commentHTML, editForm, replyingTo);
    }
  });

  // Handle click on the edit button
  const outerBtn = commentHTML.querySelector('.comment__action-btns .btn.edit');
  outerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    (editForm.querySelector('.comment-form-container__form') as HTMLFormElement)?.submit();
  });

  // Handle key press
  inputForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!inputForm.value.trim()) {
        // Handle empty input
        deleteComment(commentHTML);
      } else {
        handelEditSubmit(commentHTML, editForm, replyingTo);
      }
    }
  });
}