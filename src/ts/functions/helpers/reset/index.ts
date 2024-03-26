// ================ reset 
export default function reset(input: HTMLTextAreaElement, reply?: boolean) {
  input.value = '';

  if (reply) {
    const replyForms = document.querySelectorAll('.comment-form-container.reply');
    replyForms.forEach(form => form.parentNode?.removeChild(form));
  }
}