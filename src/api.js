import axios from "axios";
import { Judge0Credentials, LANGUAGE_IDS } from "./constants";

const API = axios.create({
  baseURL: "https://judge0-ce.p.rapidapi.com", // Uses Judge0 API
  headers: {
    "Content-Type": "application/json",
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "x-rapidapi-key": Judge0Credentials.rapidApiKey,
  },
});

export const executeCode = async (language, sourceCode, stdin = "") => {
  const language_id =
    LANGUAGE_IDS[language.toLowerCase()] || LANGUAGE_IDS["python"];

  const payload = { language_id, source_code: sourceCode, stdin };
  console.log("Judge0 payload:", payload);

  try {
    const response = await API.post(
      "/submissions",
      payload,
      {
        params: {
          base64_encoded: false,
          wait: true,
          fields: "*",
        },
      }
    );
    return response.data;
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Unknown error";
    console.error("Judge0 API error:", msg);
    throw new Error(msg);
  }
};
