import axios from "axios";
import errorHandler from "./errorHandler";

const instance = axios.create({
  baseURL: "",
});

instance.interceptors.response.use((response) => response, errorHandler);

export default instance;
