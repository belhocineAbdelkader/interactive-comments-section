// current User

export default function currentUserInfo(): currentUser {
  const currentUser = localStorage.getItem('currentUser') as string,
    currentUserInfo = JSON.parse(currentUser)
  return currentUserInfo;
}