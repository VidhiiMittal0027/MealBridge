import React, { useState, useEffect, useRef, useContext } from "react";
import { useUser } from "@clerk/react";
import { MealBridgeContext } from "../context/MealBridgeContext";

export default function FloatingChat() {
  const { user } = useUser();
  const { donations, messages, sendChatMessage } = useContext(MealBridgeContext);
  
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("donor");
  const [selectedDonationId, setSelectedDonationId] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("mealbridge-role");
      if (storedRole) setRole(storedRole);
    }
  }, [user]);

  // Find active listings to chat about
  // If donor, list all their donations. If receiver, list all matching donations.
  const activeDonations = donations;

  // Auto-select first donation thread if not selected
  useEffect(() => {
    if (activeDonations.length > 0 && !selectedDonationId) {
      setSelectedDonationId(activeDonations[0].id);
    }
  }, [activeDonations, selectedDonationId]);

  const activeDonation = donations.find(d => d.id === selectedDonationId) || activeDonations[0];

  // Get messages for the selected donation
  const chatMessages = messages.filter(m => m.donationId === selectedDonationId);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedDonationId) return;

    const senderName = user?.fullName || (role === "donor" ? "Fresh Bites Catering" : "City Hope Kitchen");
    sendChatMessage(selectedDonationId, role, senderName, inputText.trim());
    setInputText("");

    // Simulate typing indicator & quick reply after a short delay to make the AI feel alive!
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const counterRole = role === "donor" ? "receiver" : "donor";
      const counterName = role === "donor" ? "City Hope Kitchen" : "Fresh Bites Catering";
      let replyText = "Received! Let me check the details and get back to you shortly.";
      
      if (inputText.toLowerCase().includes("ready") || inputText.toLowerCase().includes("pickup")) {
        replyText = "Perfect, our volunteer driver is on standby. We will confirm as soon as it is picked up.";
      } else if (inputText.toLowerCase().includes("fresh") || inputText.toLowerCase().includes("packed")) {
        replyText = "Yes, it was freshly prepared today and packed into clean, sealed container bins.";
      }

      sendChatMessage(selectedDonationId, counterRole, counterName, replyText);
    }, 3000);
  };

  if (!user) return null;

  return (
    <div className="floating-chat-container">
      {/* Floating Action Button */}
      <button 
        id="floating-chat-trigger" 
        className={`chat-fab ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-window-header">
            <div className="header-status">
              <span className="online-indicator"></span>
              <div>
                <h4>MealBridge Support Chat</h4>
                <p className="online-label">Active Thread: {activeDonation?.name || "Select item"}</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Thread Selector */}
          <div className="chat-thread-selector">
            <label>Chatting about: </label>
            <select 
              value={selectedDonationId} 
              onChange={(e) => setSelectedDonationId(e.target.value)}
            >
              {activeDonations.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.donorName})</option>
              ))}
            </select>
          </div>

          {/* Messages list */}
          <div className="chat-messages-body">
            {chatMessages.length === 0 ? (
              <div className="chat-empty-state">
                <p>Start a conversation about this food donation.</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.senderId === role ? "me" : "them"}`}>
                  <span className="bubble-sender">{msg.senderName}</span>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <span className="bubble-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
            
            {/* Simulated typing indicator */}
            {isTyping && (
              <div className="chat-bubble-wrapper them">
                <span className="bubble-sender">{role === "donor" ? "City Hope Kitchen" : "Fresh Bites Catering"}</span>
                <div className="chat-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask a question or reply..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
            <button type="submit" className="chat-send-btn">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
