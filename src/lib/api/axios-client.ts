import axios from "axios";

export const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  // In Axios, we can tell it NOT to throw errors for 400s
  // if we want to handle them via our Zod Discriminated Union.
  validateStatus: (status) => status < 500,
});

api.interceptors.response.use(
  (response) => {
    if (response.status >= 400) {
      // Throwing here stops profile.service.ts from reaching the Zod check
      throw response;
    }
    return response;
  },
  (error) => Promise.reject(error)
);
