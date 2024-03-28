// *================ delete comment ================

// Function to create the delete comment dialog
function createDeleteDialog(): HTMLDialogElement {
  const dialogElem = document.createElement('dialog');
  dialogElem.setAttribute('class', 'dialog');
  dialogElem.innerHTML = `
    <h2>Delete comment</h2>
    <div autofocus>
      <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
    </div>
    <form method="dialog">
      <div class="btn_collection">
        <button class="btn btn-dialog cancel" type="submit" value="no, cancel">
          <span class="btn-wrap">
            <span class="text capitalize">
              NO, CANCEL
            </span>
          </span>
        </button>
        <button class="btn btn-dialog delete" type="submit" value="yes, delete" formmethod="dialog">
          <span class="btn-wrap">
            <span class="text capitalize">
              YES, DELETE
            </span>
          </span>
        </button>
      </div>
    </form>
  `;

  document.body.appendChild(dialogElem);
  return dialogElem;
}
// Function to delete comment from localStorage
function deleteCommentFromLocalStorage(commentHTML: HTMLElement) {
  const comments: comments = JSON.parse(localStorage.getItem('comments') || '[]');

  const targetCommentId = Number(commentHTML?.dataset.id);

  const updatedComments = comments.filter((cmnt) => {
    if (cmnt.id === Number(targetCommentId)) {

      // Delete the main comment
      return false;

    } else if (cmnt.replies) {
      // Delete a sub-comment
      cmnt.replies = cmnt.replies.filter((subCmnt) => subCmnt.id !== Number(targetCommentId));
    }
    return true;
  });
  localStorage.setItem('comments', JSON.stringify(updatedComments));
}
// Function to handle the delete form submission
function handleDeleteSubmission(e: SubmitEvent, commentHTML: HTMLElement, dialogElem: HTMLDialogElement) {

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
    // update ui
    scheduler.postTask(() => deleteCommentFromLocalStorage(commentHTML), { priority: 'user-blocking' });
    // Update the DOM
    scheduler.postTask(() => commentHTML.remove(), { priority: 'user-blocking' });
    // dealing with dialog
    scheduler.postTask(() => {
      // Close the dialog
      dialogElem.close();
      // Remove the created dialog after completing the deletion
      document.body.removeChild(dialogElem)
    },
      { priority: 'background' }
    );

  }
}

// delete comment
export default function deleteComment(CommentHTML: HTMLElement) {

  const dialogElem = createDeleteDialog();

  // Show the dialog
  dialogElem.showModal();

  // Handle form submission
  const formDeleteComment = dialogElem.querySelector('form');

  formDeleteComment?.addEventListener('submit', (e) =>
    handleDeleteSubmission(e, CommentHTML, dialogElem)
  );

  // Close the dialog when clicking outside
  document.addEventListener("click", (e) => {
    if (dialogElem && e.target === dialogElem) {
      dialogElem.close();
    }
  });

}