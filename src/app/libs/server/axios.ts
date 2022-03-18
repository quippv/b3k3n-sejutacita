import axios from "axios";
import errorHandler from "./errorHandler";

console.log(process.env.REACT_APP_API_URL);

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.response.use((response) => response, errorHandler);

export default instance;
