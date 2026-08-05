import React, { useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/react";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";

export default function ReceiverDashboard() {
  const { user } = useUser();
  const { 
    donations, 
    orders, 
    messages,
    toast,
    requestFood,
    sendChatMessage
  } = useContext(MealBridgeContext);

  // States
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  
  // Confirmation state
  const [expectedPeople, setExpectedPeople] = useState(10);
  const [contactName, setContactName] = useState(user?.fullName || "Sarah Jenkins");
  
  // Chat state specific to this listing
  const [questionText, setQuestionText] = useState("");

  // Clean form states
  const openDetails = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
    setQuestionText("");
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    requestFood(
      selectedItem.id, 
      expectedPeople, 
      user?.fullName || "City Hope Kitchen", 
      contactName
    );
    setIsRequestOpen(false);
    setIsDetailsOpen(false);
  };

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim() || !selectedItem) return;

    const senderName = user?.fullName || "City Hope Kitchen";
    sendChatMessage(selectedItem.id, "receiver", senderName, questionText.trim());
    setQuestionText("");
  };

  // Filter donations to only show matching-ready items
  const availableItems = donations.filter(
    (d) => d.status === "Available for NGO Matching" || d.status === "Matching Pending"
  );

  // Get active order status for the selected item
  const activeOrder = orders.find(o => o.donationId === selectedItem?.id);

  // Chat messages for the selected donation
  const activeMessages = selectedItem 
    ? messages.filter(m => m.donationId === selectedItem.id)
    : [];

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-card ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Welcome banner */}
      <div className="dashboard-hero-card">
        <div className="hero-text-container">
          <h1>Hi, {user?.firstName || "NGO Partner"} 👋</h1>
          <p className="gradient-subtext">"Find fresh surplus food available near your organization."</p>
        </div>
      </div>

      {/* Available Food Donations section */}
      <section className="dashboard-section" style={{ marginTop: "40px" }}>
        <h2 className="section-title">Available Food Donations</h2>
        
        {availableItems.length === 0 ? (
          <div className="empty-listing-panel">
            <span className="empty-icon">🍽️</span>
            <h3>No food items available right now</h3>
            <p>Check back shortly. When local restaurants and vendors register fresh surplus meals, they will appear here instantly.</p>
          </div>
        ) : (
          <div className="donations-grid-custom">
            {availableItems.map((item) => (
              <article key={item.id} className="donation-card-custom">
                <img src={item.imageUrl} alt={item.name} className="donation-card-img" />
                <div className="donation-card-body">
                  <div className="card-title-row">
                    <h3>{item.name}</h3>
                    <span className={`veg-badge ${item.vegNonVeg === "Veg" ? "veg" : "non-veg"}`}>
                      {item.vegNonVeg === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                    </span>
                  </div>
                  <p className="cooking-time">🕒 Cooking: {new Date(item.cookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <div className="card-spec-row">
                    <span className="spec-pill">{item.quantity} Servings</span>
                    <span className={`status-badge-custom ${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      {item.status === "Matching Pending" ? "Requested" : "Available"}
                    </span>
                  </div>
                  <button className="btn-full-width" onClick={() => openDetails(item)}>View Details</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* VIEW DETAILS & CHAT SLIDE OVER / MODAL */}
      {isDetailsOpen && selectedItem && (
        <div className="modal-backdrop-custom animate-fade-in" onClick={() => setIsDetailsOpen(false)}>
          <div className="modal-card-custom wide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Available Rescued Meals: {selectedItem.name}</h2>
              <button className="close-btn" onClick={() => setIsDetailsOpen(false)}>×</button>
            </div>
            
            <div className="wide-modal-content-split">
              {/* Left Column: Details */}
              <div className="split-column-left">
                <img src={selectedItem.imageUrl} alt={selectedItem.name} className="details-img-split" />
                
                <div className="details-section-custom">
                  <h3>🍲 Recipe & Portion Info</h3>
                  <div className="details-grid-specs">
                    <p><strong>Name:</strong> {selectedItem.name}</p>
                    <p><strong>Category:</strong> {selectedItem.category}</p>
                    <p><strong>Veg / Non-Veg:</strong> {selectedItem.vegNonVeg}</p>
                    <p><strong>Quantity:</strong> {selectedItem.quantity} servings</p>
                    <p><strong>Transportation Available:</strong> {selectedItem.needTransportation === "Yes" ? "No (Donor Requesting Volunteer Help)" : "Yes (Self-arranged/Pickup)"}</p>
                  </div>
                </div>

                <div className="details-section-custom">
                  <h3>🕒 Timings</h3>
                  <div className="details-grid-specs">
                    <p><strong>Cooking Time:</strong> {new Date(selectedItem.cookingTime).toLocaleString()}</p>
                    <p><strong>Expiry Time:</strong> {new Date(selectedItem.expiryTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="details-section-custom">
                  <h3>📍 Address details</h3>
                  <p>{selectedItem.pickupAddress}</p>
                  <p className="gps-coordinate">Coordinates: {selectedItem.gpsLocation}</p>
                </div>

                <div className="details-section-custom">
                  <h3>📝 Description</h3>
                  <p>{selectedItem.description || "No description provided."}</p>
                  <p><strong>Special Instructions:</strong> {selectedItem.specialInstructions || "None."}</p>
                </div>
              </div>

              {/* Right Column: Chat & Confirm Actions */}
              <div className="split-column-right">
                {/* Questions for Donor */}
                <div className="card-inner-chat">
                  <h3>💬 Questions for Donor</h3>
                  <p className="chat-subtitle">Ask questions directly regarding logistics, packaging, or dietaries.</p>
                  
                  <div className="inner-chat-messages">
                    {activeMessages.length === 0 ? (
                      <p className="empty-messages-placeholder">No questions asked yet. Start the conversation below!</p>
                    ) : (
                      activeMessages.map(m => (
                        <div key={m.id} className={`chat-bubble-wrapper ${m.senderId === "receiver" ? "me" : "them"}`}>
                          <span className="bubble-sender">{m.senderName}</span>
                          <div className="chat-bubble">
                            <p>{m.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form className="inner-chat-form" onSubmit={handleSendQuestion}>
                    <input 
                      type="text" 
                      placeholder="Type a question (e.g. Is it freshly packed?)" 
                      value={questionText} 
                      onChange={(e) => setQuestionText(e.target.value)}
                      required 
                    />
                    <button type="submit" className="chat-send-btn">Send</button>
                  </form>
                </div>

                {/* Confirm Action Box */}
                <div className="confirm-action-box">
                  {selectedItem.status === "Matching Pending" ? (
                    <div className="alert-box-info">
                      <p>⏳ Request Pending Donor Approval.</p>
                      {activeOrder && <p>Expecting meals for {activeOrder.expectedPeople} people.</p>}
                    </div>
                  ) : (
                    <>
                      <p>Satisfied with the details and chat answers?</p>
                      <button className="confirm-request-btn" onClick={() => setIsRequestOpen(true)}>
                        Confirm Request
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM REQUEST POPUP */}
      {isRequestOpen && selectedItem && (
        <div className="modal-backdrop-custom">
          <div className="modal-card-custom small-modal">
            <div className="modal-header-custom">
              <h2>Confirm Request</h2>
              <button className="close-btn" onClick={() => setIsRequestOpen(false)}>×</button>
            </div>
            <form onSubmit={handleConfirmRequest} className="modal-body-content">
              <p>Verify portion expectation before requesting this surplus food:</p>
              
              <label className="field-label" style={{ marginTop: "16px" }}>
                For how many people are you expecting this food?
                <input 
                  type="number" 
                  min="1" 
                  max={selectedItem.quantity}
                  value={expectedPeople} 
                  onChange={(e) => setExpectedPeople(e.target.value)} 
                  required 
                />
              </label>

              <label className="field-label" style={{ marginTop: "12px" }}>
                Point of Contact Name
                <input 
                  type="text" 
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)} 
                  required 
                />
              </label>

              <div className="modal-actions-custom" style={{ marginTop: "24px" }}>
                <button type="button" className="btn-cancel" onClick={() => setIsRequestOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-action">Confirm Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
