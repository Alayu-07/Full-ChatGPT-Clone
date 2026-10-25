import { useEffect, useState, useRef, useCallback } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import MessageList from "./components/MessageList/MessageList";
import ChatInput from "./components/ChatInput/ChatInput";

import { getConversations, sendMessage, getErrorMessage } from "./api/chatApi";

import "./App.css";

function App() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // =====================================================
  // Scroll to bottom
  // =====================================================

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  // =====================================================
  // GET conversations
  // =====================================================

  const loadConversations = useCallback(async () => {
    try {
      setError("");

      const result = await getConversations();

      console.log("GET conversations response:", result);

      if (result?.success) {
        const conversationData = result?.data?.conversations;

        setConversations(
          Array.isArray(conversationData) ? conversationData : [],
        );
      } else {
        setError(result?.message || "Unable to load conversations.");
      }
    } catch (fetchError) {
      console.error("Error fetching conversations:", fetchError);

      setError(getErrorMessage(fetchError));
    }
  }, []);

  // =====================================================
  // Load conversations when application starts
  // =====================================================

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // =====================================================
  // Scroll whenever messages change
  // =====================================================

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading, scrollToBottom]);

  // =====================================================
  // POST message
  // =====================================================

  const handleSendMessage = async (question) => {
    const cleanQuestion = question?.trim();

    if (!cleanQuestion || isLoading) {
      return;
    }

    // Temporary message shown immediately
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: cleanQuestion,
    };

    setConversations((previous) => [...previous, tempUserMessage]);

    setIsLoading(true);
    setError("");

    try {
      const result = await sendMessage(cleanQuestion);

      console.log("POST conversation response:", result);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to send message.");
      }

      const userConversation = result?.data?.userConversation;

      const assistantConversation = result?.data?.assistantConversation;

      if (!userConversation || !assistantConversation) {
        throw new Error("Invalid response received from the server.");
      }

      // Remove temporary message and replace it
      // with messages returned by the database/API.
      setConversations((previous) => {
        const withoutTemporary = previous.filter(
          (message) => message.id !== tempUserMessage.id,
        );

        return [...withoutTemporary, userConversation, assistantConversation];
      });
    } catch (sendError) {
      console.error("Error posting conversation:", sendError);

      // Remove temporary message if POST failed
      setConversations((previous) =>
        previous.filter((message) => message.id !== tempUserMessage.id),
      );

      setError(getErrorMessage(sendError));
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">
      <Sidebar />

      <main className="chat">
        <ChatHeader />

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>

            <button
              type="button"
              className="error-banner__retry"
              onClick={loadConversations}
            >
              Retry
            </button>
          </div>
        )}

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
