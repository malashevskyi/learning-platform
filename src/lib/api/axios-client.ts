import axios from "axios";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  // In Axios, we can tell it NOT to throw errors for 400s
  // if we want to handle them via our Zod Discriminated Union.
  validateStatus: (status) => status < 500,
});
