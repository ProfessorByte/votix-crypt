import axios from "axios";

export const votixApi = axios.create({
  baseURL: "http://localhost:4000/api",
});
