import { useState, useRef, useEffect } from "react";
import './styles/chatHelp.css'

export const HelpButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatWindowRef = useRef(null);
  const helpButtonRef = useRef(null); // Reference for the help button
  const inputRef = useRef(null); // Reference for the input field
  const startX = useRef(null);
  const startY = useRef(null);
  const startWidth = useRef(null);
  const startHeight = useRef(null);
  const dragRef = useRef(null);

  const handleClick = () => {
    setIsChatOpen((prevState) => !prevState); // Toggle chat window visibility
  };

  const handleSubmit = async () => {
    if (!question) {
      alert("Please enter a question");
      return;
    }

    // Add user message to chat history
    setChatHistory([...chatHistory, { role: "user", content: question }]);
    setQuestion(""); // Clear input field

    try {
      const response = await fetch(
        "https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Add AI response to chat history
        setChatHistory([
          ...chatHistory,
          { role: "user", content: question },
          { role: "assistant", content: data.answer },
        ]);
      } else {
        setChatHistory([
          ...chatHistory,
          { role: "user", content: question },
          { role: "assistant", content: "Error: " + data.error },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...chatHistory,
        { role: "user", content: question },
        { role: "assistant", content: "Error connecting to the server" },
      ]);
    }
  };

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus(); // Focus the input when the chat window opens
    }
  }, [isChatOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isChatOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target) &&
        helpButtonRef.current &&
        !helpButtonRef.current.contains(e.target)
      ) {
        setIsChatOpen(false); // Close chat window if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  // Function to handle mouse movement for resizing
  const handleMouseMove = (e) => {
    if (dragRef.current) {
      const { clientX, clientY } = e;
      const chatWindow = chatWindowRef.current;
      const { top, left } = chatWindow.getBoundingClientRect();

      // Resize based on mouse movement
      chatWindow.style.width = `${Math.max(clientX - left, 100)}px`;
      chatWindow.style.height = `${Math.max(clientY - top, 100)}px`;
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startX.current = e.clientX;
    startY.current = e.clientY;
    startWidth.current = chatWindowRef.current.offsetWidth;
    startHeight.current = chatWindowRef.current.offsetHeight;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    startX.current = e.clientX;
    startY.current = e.clientY;
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (chatWindowRef.current) {
      const chatWindow = chatWindowRef.current;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      chatWindow.style.top = `${chatWindow.offsetTop + dy}px`;
      chatWindow.style.left = `${chatWindow.offsetLeft + dx}px`;
      startX.current = e.clientX;
      startY.current = e.clientY;
    }
  };

  const handleDragEnd = () => {
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  return (
    <>
      <button className="help-button" onClick={handleClick} ref={helpButtonRef}>
        ?
      </button>
      
      {isChatOpen && (
        <div
          className="chat-window"
          ref={chatWindowRef}
          onMouseDown={handleDragStart}
        >
          <h3>Hey! How can I assist you today?</h3>
          <div className="chat-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            style={{color:"var(--text-color)"}}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                  handleSubmit();
              }
          }}
            ref={inputRef} 
          />
          <button onClick={handleSubmit}>Send</button>
          <div
            className="resizable-handle top-left"
            onMouseDown={handleMouseDown}
          ></div>
          <div
            className="resizable-handle top-right"
            onMouseDown={handleMouseDown}
          ></div>
          <div
            className="resizable-handle bottom-left"
            onMouseDown={handleMouseDown}
          ></div>
          <div
            className="resizable-handle bottom-right"
            onMouseDown={handleMouseDown}
          ></div>
        </div>
      )}
    </>
  );
};
