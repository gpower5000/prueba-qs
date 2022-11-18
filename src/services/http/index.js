import axios from 'axios';

export * from './user.service';

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});
