import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import MessageList from "./components/MessageList/MessageList";
import ChatInput from "./components/ChatInput/ChatInput";

import {
  getConversations,
  sendMessage,
  getErrorMessage,
} from "./api/chatApi";

import "./App.css";

function App() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  // GET conversations
  const loadConversations = useCallback(async () => {
    try {
      const result = await getConversations();

      if (result.success) {
        setConversations(
          result.data.conversations
        );
        setError("");
      }
    } catch (fetchError) {
      console.error(
        "Error fetching conversations:",
        fetchError
      );

      setError(getErrorMessage(fetchError));
    }
  }, []);

  // Load conversations when application starts
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading, scrollToBottom]);

  // POST question
  const handleSendMessage = async (question) => {
    if (!question.trim() || isLoading) {
      return;
    }

    // Temporary user message
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: question,
    };

    // Show user message immediately
    setConversations((prev) => [
      ...prev,
      tempUserMessage,
    ]);

    setIsLoading(true);
    setError("");

    try {
      const result = await sendMessage(question);

      if (result.success) {
        const {
          userConversation,
          assistantConversation,
        } = result.data;

        // Replace temporary message
        setConversations((prev) => {
          const filtered = prev.filter(
            (message) =>
              message.id !== tempUserMessage.id
          );

          return [
            ...filtered,
            userConversation,
            assistantConversation,
          ];
        });
      }
    } catch (sendError) {
      console.error(
        "Error posting conversation:",
        sendError
      );

      setError(getErrorMessage(sendError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="chat">
        <ChatHeader />

        {error ? (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button
              type="button"
              className="error-banner__retry"
              onClick={() => loadConversations()}
            >
              Retry
            </button>
          </div>
        ) : null}

        <MessageList
          conversations={conversations}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
