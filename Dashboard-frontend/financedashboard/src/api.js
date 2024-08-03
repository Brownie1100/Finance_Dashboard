import axios from 'axios';

const API_BASE_URL = 'http://localhost:8282/api'; // Your Spring Boot API base URL

export const getHelloMessage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/test`);
    return response.data;
  } catch (error) {
    console.error('Error fetching the hello message:', error);
    throw error;
  }
};
export default getHelloMessage;