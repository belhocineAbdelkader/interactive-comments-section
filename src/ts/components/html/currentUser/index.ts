// current user
const currentUser = (name: string) => `
  <header hidden class="owner-user">
    <figure>
      <img class="owner-user__avatar" src="/assets/images/avatars/image-${name}.webp" alt="User Avatar">
    </figure>
    <h1 class="owner-user__name">${name}</h1>
  </header>`
  ;

  export default currentUser;