// comment Object
export default function commentObject(id: number, content: string, createdAt: string, score: number, username: string, isSubComment = false, replyingTo: subComment['replyingTo'] = ''): (comment | subComment) {

  const comment: comment = {
    id: id,
    content: content,
    createdAt: createdAt,
    score: score,
    user: {
      image: {
        png: `./images/avatars/image-${username}.webp`,
        webp: `./images/avatars/image-${username}.webp`,
      },
      username: username,
    },
    replies: []
  };

  const subComment: subComment = {
    id: id,
    content: content,
    createdAt: createdAt,
    score: 0,
    replyingTo: replyingTo,
    user: {
      image: {
        png: `./images/avatars/image-${username}.webp`,
        webp: `./images/avatars/image-${username}.webp`,
      },
      username: username
    },
  }

  if (isSubComment) {
    return subComment
  }
  return comment;
}