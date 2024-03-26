export default class createCreationTime {
  _creationTime: Date;
  constructor() {
    this._creationTime = this.createCreationTime();
  }

  createCreationTime(dateString?: string) {
    if (!dateString) {
      const nowDay = new Date();
      const year = nowDay.getFullYear();
      const month = (nowDay.getMonth() + 1).toString().padStart(2, '0');
      const day = nowDay.getDate().toString().padStart(2, '0');
      const hour = nowDay.getHours().toString().padStart(2, '0');
      const minute = nowDay.getMinutes().toString().padStart(2, '0');
      const seconds = nowDay.getSeconds().toString().padStart(2, '0');
      const creationTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:${seconds}Z`).toISOString();
      return new Date(creationTime);
    }
    const creationTime = new Date(dateString).toISOString();
    return new Date(creationTime);
  }

  getElapsedTime(dateString: string) {
    const now = new Date();
    const timeDifference = now.getTime() - this.createCreationTime(dateString).getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44); // Average days in a month
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'a moment ago';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours === 1) {
      return '1 hour ago';
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return '1 day ago';
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (weeks === 1) {
      return '1 week ago';
    } else if (weeks < 4.33) {
      return `${weeks} weeks ago`;
    } else if (months === 1) {
      return '1 month ago';
    } else if (months < 12) {
      return `${months} months ago`;
    } else if (years === 1) {
      return '1 year ago';
    } else {
      return `${years} years ago`;
    }
  }

  public get humanDate(): string {
    return this.createCreationTime().toISOString();
  }
}