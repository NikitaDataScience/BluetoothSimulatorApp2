import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://your-cloud-service-url.com', // Replace with actual cloud service URL
});

export default instance;
