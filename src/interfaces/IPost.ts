import IMention from './IMention';

interface IPost {
  _id?: number;
  _delete?: boolean;
  value?: string;
  mentions?: IMention[];
}

export default IPost;
