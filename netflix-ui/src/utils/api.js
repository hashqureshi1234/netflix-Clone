import axios from "axios";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "./firebase-config";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // Server returned 401 OR server is completely unreachable (network error)
    if (status === 401 || !error.response) {
      await signOut(firebaseAuth).catch(() => {});
      window.location.replace("/signup");
    }

    return Promise.reject(error);
  }
);

export default api;
