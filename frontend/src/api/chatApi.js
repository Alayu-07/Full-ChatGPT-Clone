import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3777/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getConversations = async () => {
  const response = await API.get("/chat/conversations");
  return response.data;
};

export const sendMessage = async (question) => {
  const response = await API.post("/chat/conversations", {
    question,
  });

  return response.data;
};

// Convert an Axios failure into a clear, user-facing
// message. Distinguishes:
//   - HTTP errors (server responded with a status)
//   - Timeouts
//   - Network / CORS / connection-refused failures
export const getErrorMessage = (error) => {
  if (error?.response) {
    return (
      error.response.data?.message ||
      `Request failed with status ${error.response.status}.`
    );
  }

  if (error?.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  return `Cannot reach the server at ${API_BASE_URL}. Make sure the backend is running.`;
};

export default API;
