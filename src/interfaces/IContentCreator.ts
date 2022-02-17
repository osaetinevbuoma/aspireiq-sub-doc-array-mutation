import IPost from './IPost';

interface IContentCreator {
  _id: number;
  name: string;
  posts: IPost[];
}

export default IContentCreator;
