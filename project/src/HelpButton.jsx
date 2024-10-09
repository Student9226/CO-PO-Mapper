import { useState, useRef, useEffect } from "react";
import './styles/chatHelp.css'

export const HelpButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatWindowRef = useRef(null);
  const helpButtonRef = useRef(null); 
  const inputRef = useRef(null); 
  const startX = useRef(null);
  const startY = useRef(null);
  const dragRef = useRef(null);
  const urls = [
    "https://glowing-train-j6765xw6x762qj75-5000.app.github.dev/ask", 
    "https://copomapper.surge.sh/ask",
    "https://5000-student9226-flaskapi-x0mkd9lr56h.ws-us116.gitpod.io/ask"
  ];

  const handleClick = () => {
    setIsChatOpen(prevState => !prevState); 
  };

  const handleSubmit = async () => {
    if (!question) {
      alert("Please enter a question");
      return;
    }
    
    setChatHistory(prev => [...prev, { role: "user", content: question }]);
    setQuestion(""); 

    for (let url of urls) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (response.ok) {
          // Add AI response to chat history
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: data.answer },
          ]);
          break; // Exit loop on successful response
        } else {
          setChatHistory(prev => [
            ...prev,
            { role: "assistant", content: "Error: " + data.error },
          ]);
        }
      } catch (error) {
        console.error("Error:", error);
        setChatHistory(prev => [
          ...prev,
          { role: "assistant", content: "Error connecting to the server" },
        ]);
        // Break the loop if there is a connectivity error
        break;
      }
    }
  };

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus(); 
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
        setIsChatOpen(false);
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
    dragRef.current = false; // Reset dragging state
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    dragRef.current = true; // Set dragging state to true
    startX.current = e.clientX;
    startY.current = e.clientY;

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