import React, { useState, useEffect, useRef, useContext } from "react";
import { useUser } from "@clerk/react";
import { useLocation } from "react-router-dom";
import { MealBridgeContext } from "../context/MealBridgeContext";

export default function FloatingChat() {
  const { user } = useUser();
  const location = useLocation();
  const { donations, messages, sendChatMessage } = useContext(MealBridgeContext);
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState("");
  const [inputText, setInputText] = useState("");
  
  const messagesEndRef = useRef(null);

  // Automatically determine active role based on current dashboard route or session
  const role = location.pathname.includes("receiver")
    ? "receiver"
    : location.pathname.includes("donor")
    ? "donor"
    : (sessionStorage.getItem("mealbridge-role") || "donor");

  const activeDonations = Array.isArray(donations) && donations.length > 0 ? donations : [
    { id: "1", name: "Vegetable Biryani", donorName: "Fresh Bites Catering" },
    { id: "2", name: "Paneer Butter Masala & Rotis", donorName: "Spice Garden" }
  ];

  // Auto-select first donation thread if not selected
  useEffect(() => {
    if (activeDonations.length > 0 && !selectedDonationId) {
      setSelectedDonationId(String(activeDonations[0].id));
    }
  }, [activeDonations, selectedDonationId]);

  const activeDonation = activeDonations.find(d => String(d.id) === String(selectedDonationId)) || activeDonations[0];

  // Get messages for the selected donation or order thread
  const chatMessages = (messages || []).filter(
    (m) => String(m.donationId) === String(selectedDonationId) || String(m.orderId) === String(selectedDonationId)
  );

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

    const senderName = user?.fullName || (role === "donor" ? "Food Donor" : "Community NGO");
    sendChatMessage(selectedDonationId, role, senderName, inputText.trim());
    setInputText("");
  };

  return (
    <div className="floating-chat-container">
      {/* Floating Action Button */}
      <button 
        id="floating-chat-trigger" 
        className={`chat-fab ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Live Support & MealBridge Chat"
      >
        💬
        {chatMessages.length > 0 && !isOpen && (
          <span style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#10B981",
            border: "2px solid #FFFFFF"
          }} />
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chat-window" style={{ zIndex: 9999 }}>
          <div className="chat-window-header">
            <div className="header-status">
              <span className="online-indicator"></span>
              <div>
                <h4>MealBridge Direct Chat</h4>
                <p className="online-label">
                  Role: <strong>{role === "donor" ? "🍱 Donor" : "🏘️ Receiver / NGO"}</strong>
                </p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Thread Selector */}
          <div className="chat-thread-selector">
            <label style={{ fontSize: 11, fontWeight: 700 }}>Food Listing: </label>
            <select 
              value={selectedDonationId} 
              onChange={(e) => setSelectedDonationId(e.target.value)}
              style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6 }}
            >
              {activeDonations.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.donorName || "Donor"})</option>
              ))}
            </select>
          </div>

          {/* Messages list */}
          <div className="chat-messages-body">
            {chatMessages.length === 0 ? (
              <div className="chat-empty-state">
                <p style={{ margin: 0, fontSize: 12, color: "#8194A6" }}>
                  Start a conversation between the Donor and Receiver for <strong>{activeDonation?.name}</strong>.
                </p>
              </div>
            ) : (
              chatMessages.map(msg => {
                const isMe = msg.senderRole === role || msg.senderId === role;
                return (
                  <div key={msg.id} className={`chat-bubble-wrapper ${isMe ? "me" : "them"}`}>
                    <span className="bubble-sender" style={{ fontSize: 10, fontWeight: 800 }}>
                      {msg.senderName} ({msg.senderRole === "donor" ? "Donor" : "NGO"})
                    </span>
                    <div className="chat-bubble">
                      <p style={{ margin: 0 }}>{msg.text || msg.message}</p>
                      <span className="bubble-time" style={{ fontSize: 9 }}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder={role === "donor" ? "Reply to NGO questions..." : "Ask donor about pickup, packaging..."}
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
