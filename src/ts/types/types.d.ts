
declare var scheduler: any;

// ============== Types ==============

// ----- Comments -----
declare type DataComments = {
  [key: string]: currentUser | comments
}
// ----- Current User -----
declare type currentUser = {
  image: {
    png: string,
    webp: string,
  },
  username: string
}

// ----- comments -----
declare type comments = comment[];

// ----- comment -----
declare type comment = {
  id: number,
  content: string,
  createdAt: string,
  score: number,
  user: {
    image: {
      png: string,
      webp: string,
    },
    username: string
  },
  replies: [] | subComment[]
}

// ----- replied comment -----
declare type subComment = {
  id: number,
  content: string,
  createdAt: string,
  score: number,
  replyingTo: string,
  user: {
    image: {
      png: string,
      webp: string,
    },
    username: string
  },
}

// position

declare type position = 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend';
