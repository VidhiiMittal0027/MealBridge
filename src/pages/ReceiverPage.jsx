import React, { useState, useContext, useEffect } from "react";
import { useUser, useAuth } from "@clerk/react";
import { useNavigate, Link } from "react-router-dom";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";

export default function ReceiverPage() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  const { 
    donations, 
    orders, 
    messages,
    toast,
    isOrgRegistered,
    orgDetails,
    registerOrganization,
    showToast,
    requestFood,
    sendChatMessage
  } = useContext(MealBridgeContext);

  // States
  const [selectedItem, setSelectedItem] = useState(null);
  const currentItem = donations.find((d) => d.id === selectedItem?.id) || selectedItem;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Registration Form Fields State
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("NGO");
  const [regNum, setRegNum] = useState("");
  const [contactName, setContactName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [dailyServed, setDailyServed] = useState(50);
  const [description, setDescription] = useState("");
  
  // Request Expectations State
  const [expectedPeople, setExpectedPeople] = useState(10);
  const [donorMessage, setDonorMessage] = useState("");
  
  // Chat state specific to this listing
  const [questionText, setQuestionText] = useState("");

  // Tooltip helper
  const [showTooltipForId, setShowTooltipForId] = useState(null);

  const openDetails = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
    setQuestionText("");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const details = {
      orgName,
      orgType,
      regNum,
      contactName,
      email,
      phone,
      address,
      city,
      state: stateName,
      pinCode,
      dailyServed: Number(dailyServed),
      description,
    };
    registerOrganization(details);
    setIsRegisterModalOpen(false);
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    requestFood(
      selectedItem.id, 
      expectedPeople, 
      donorMessage
    );
    setIsRequestOpen(false);
    setIsDetailsOpen(false);
    setDonorMessage("");
  };

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim() || !selectedItem) return;

    const senderName = orgDetails?.orgName || user?.fullName || "City Hope Kitchen";
    sendChatMessage(selectedItem.id, "receiver", senderName, questionText.trim());
    setQuestionText("");
  };

  const handleAuthRedirect = () => {
    sessionStorage.setItem("mealbridge-role", "receiver");
    navigate("/login");
  };

  // Filter donations to only show matching-ready items
  const availableItems = donations.filter(
    (d) => d.status === "Available for NGO Matching" || d.status === "Matching Pending"
  );

  // My Orders list ( NGO requests matched by name )
  const myNGOOrders = orders.filter(
    (o) => o.ngoName === (orgDetails?.orgName || "City Hope Kitchen")
  );

  // Chat messages for the selected donation
  const activeMessages = selectedItem 
    ? messages.filter(m => m.donationId === selectedItem.id)
    : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Accepted": return "info";
      case "Preparing": return "info";
      case "Ready for Pickup": return "success";
      case "Picked Up": return "info";
      case "Completed": return "success";
      default: return "success";
    }
  };

  const content = (
    <div className="receiver-portal-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-card ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Unregistered Banner Alert */}
      {isSignedIn && !isOrgRegistered && (
        <div className="unregistered-banner-alert animate-fade-in" style={{
          background: "linear-gradient(135deg, #ff8a00, #ffb547)",
          color: "white",
          padding: "20px 32px",
          borderRadius: "20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 25px rgba(255, 138, 0, 0.15)",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: "800" }}>⚠️ Organization Not Registered</h3>
            <p style={{ margin: "0", fontSize: "0.9rem", opacity: "0.9" }}>Please register your organization details to enable food donation matching and submit portions expectations.</p>
          </div>
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              background: "white",
              color: "#ff8a00",
              border: "none",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Register Your Organization
          </button>
        </div>
      )}

      {/* Hero Welcome banner */}
      <div className="dashboard-hero-card">
        <div className="hero-text-container">
          <h1>Hi, {orgDetails?.orgName || user?.firstName || "NGO Partner"} 👋</h1>
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
                  {item.freshnessLabel && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: item.freshnessLabel === 'fresh' ? "rgba(5, 150, 105, 0.1)" : item.freshnessLabel === 'spoiled' ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)", color: item.freshnessLabel === 'fresh' ? "var(--primary-color)" : item.freshnessLabel === 'spoiled' ? "#ef4444" : "#d97706", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", marginBottom: "8px" }}>
                      <span>🤖 AI: {item.freshnessLabel.toUpperCase()} ({item.freshnessScore}%)</span>
                    </div>
                  )}
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

      {/* Dedicated My Orders Section */}
      {isSignedIn && (
        <section className="dashboard-section" style={{ marginTop: "48px" }}>
          <h2 className="section-title">My Orders</h2>
          {myNGOOrders.length === 0 ? (
            <div className="empty-listing-panel">
              <span className="empty-icon">📜</span>
              <h3>No requests submitted yet</h3>
              <p>Requested food items and their live pickup schedules will appear here.</p>
            </div>
          ) : (
            <div className="order-grid">
              {myNGOOrders.map((order) => (
                <article key={order.id} className="order-card-custom">
                  <div className="order-header">
                    <h4>🍱 {order.foodRequested}</h4>
                    <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="order-body" style={{ marginTop: "12px", gap: "6px" }}>
                    <p><strong>Donor Name:</strong> {order.ngoName === "City Hope Kitchen" ? "Fresh Bites Catering" : "Your Organization"}</p>
                    <p><strong>Meals Requested:</strong> {order.expectedPeople} servings</p>
                    <p><strong>Request Time:</strong> {new Date(order.orderTime).toLocaleDateString()} {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {order.prepTime && <p><strong>Estimated Pickup:</strong> {order.prepTime}</p>}
                    {order.receiverMessage && <p><strong>My Message:</strong> "{order.receiverMessage}"</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIEW DETAILS & CHAT SLIDE OVER / MODAL */}
      {isDetailsOpen && currentItem && (
        <div className="modal-backdrop-custom animate-fade-in" onClick={() => setIsDetailsOpen(false)}>
          <div className="modal-card-custom wide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Available Rescued Meals: {currentItem.name}</h2>
              <button className="close-btn" onClick={() => setIsDetailsOpen(false)}>×</button>
            </div>
            
            <div className="wide-modal-content-split">
              {/* Left Column: Details */}
              <div className="split-column-left">
                <img src={currentItem.imageUrl} alt={currentItem.name} className="details-img-split" />
                
                <div className="details-section-custom">
                  <h3>🍲 Recipe & Portion Info</h3>
                  <div className="details-grid-specs">
                    <p><strong>Name:</strong> {currentItem.name}</p>
                    <p><strong>Category:</strong> {currentItem.category}</p>
                    <p><strong>Veg / Non-Veg:</strong> {currentItem.vegNonVeg}</p>
                    <p><strong>Quantity:</strong> {currentItem.quantity} servings</p>
                    <p><strong>Transportation Available:</strong> {currentItem.needTransportation === "Yes" ? "No (Donor Requesting Volunteer Help)" : "Yes (Self-arranged/Pickup)"}</p>
                  </div>
                </div>

                <div className="details-section-custom">
                  <h3>🕒 Timings</h3>
                  <div className="details-grid-specs">
                    <p><strong>Cooking Time:</strong> {new Date(currentItem.cookingTime).toLocaleString()}</p>
                    <p><strong>Expiry Time:</strong> {new Date(currentItem.expiryTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="details-section-custom">
                  <h3>📍 Address details</h3>
                  <p>{currentItem.pickupAddress}</p>
                  <p className="gps-coordinate">Coordinates: {currentItem.gpsLocation}</p>
                </div>

                <div className="details-section-custom">
                  <h3>📝 Description</h3>
                  <p>{currentItem.description || "No description provided."}</p>
                  <p><strong>Special Instructions:</strong> {currentItem.specialInstructions || "None."}</p>
                </div>
              </div>

              {/* Right Column: Chat & Confirm Actions */}
              <div className="split-column-right">
                {isSignedIn ? (
                  <>
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
                    <div className="confirm-action-box" style={{ position: "relative" }}>
                      {currentItem.status === "Matching Pending" ? (
                        <div className="alert-box-info">
                          <p>⏳ Request Pending Donor Approval.</p>
                        </div>
                      ) : (
                        <>
                          <p>Satisfied with the details and chat answers?</p>
                          
                          {/* Tooltip trigger for disabled buttons */}
                          <div 
                            onMouseEnter={() => { if (!isOrgRegistered) setShowTooltipForId(currentItem.id); }}
                            onMouseLeave={() => setShowTooltipForId(null)}
                            style={{ display: "inline-block", width: "100%" }}
                          >
                            <button 
                              className="confirm-request-btn" 
                              onClick={() => { if (isOrgRegistered) setIsRequestOpen(true); }}
                              disabled={!isOrgRegistered}
                              style={{ 
                                opacity: isOrgRegistered ? 1 : 0.5,
                                cursor: isOrgRegistered ? "pointer" : "not-allowed"
                              }}
                            >
                              Confirm Request
                            </button>
                            
                            {!isOrgRegistered && showTooltipForId === currentItem.id && (
                              <div style={{
                                position: "absolute",
                                bottom: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "#ea5455",
                                color: "white",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                zIndex: 100,
                                width: "240px",
                                textAlign: "center",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                marginBottom: "8px"
                              }}>
                                Please register your organization before requesting food.
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="confirm-action-box" style={{ margin: "auto", background: "rgba(255, 138, 0, 0.05)", border: "1px dashed var(--primary)", padding: "32px 24px" }}>
                    <span style={{ fontSize: "2rem" }}>🔒</span>
                    <h3>Authentication Required</h3>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", margin: "10px 0 20px" }}>
                      Please sign in to contact the donor, ask questions, or request this food donation.
                    </p>
                    <button className="primary-button" onClick={handleAuthRedirect}>
                      Sign In to Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORGANIZATION REGISTRATION MODAL */}
      {isRegisterModalOpen && (
        <div className="modal-backdrop-custom" style={{ zIndex: 1500 }}>
          <div className="modal-card-custom">
            <div className="modal-header-custom">
              <h2>Register Your Organization</h2>
              <button className="close-btn" onClick={() => setIsRegisterModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="modal-form-scrollable">
              <label className="field-label">
                Organization Name
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="E.g., Green Hope Shelter" required />
              </label>

              <div className="form-row-custom">
                <label className="field-label half">
                  Organization Type
                  <select value={orgType} onChange={(e) => setOrgType(e.target.value)}>
                    <option value="NGO">NGO</option>
                    <option value="Shelter">Shelter</option>
                    <option value="Orphanage">Orphanage</option>
                    <option value="Community Kitchen">Community Kitchen</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="field-label half">
                  Registration Number (optional)
                  <input type="text" value={regNum} onChange={(e) => setRegNum(e.target.value)} placeholder="E.g., REG-8271" />
                </label>
              </div>

              <div className="form-row-custom">
                <label className="field-label half">
                  Contact Person Name
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                </label>
                <label className="field-label half">
                  Phone Number
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="E.g., 555-0199" required />
                </label>
              </div>

              <label className="field-label">
                Contact Email Address
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>

              <label className="field-label">
                Street Address
                <textarea rows="2" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </label>

              <div className="form-row-custom">
                <label className="field-label half">
                  City
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                </label>
                <label className="field-label half">
                  State
                  <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} required />
                </label>
              </div>

              <div className="form-row-custom">
                <label className="field-label half">
                  PIN Code
                  <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required />
                </label>
                <label className="field-label half">
                  People Served Daily
                  <input type="number" value={dailyServed} onChange={(e) => setDailyServed(e.target.value)} required />
                </label>
              </div>

              <label className="field-label">
                Brief Description of Activities
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your primary services and communities served..." required />
              </label>

              <label className="field-label">
                Upload Organization Verification Document (optional)
                <input type="file" style={{ border: "none", padding: "0" }} />
              </label>

              <div className="modal-actions-custom">
                <button type="button" className="btn-cancel" onClick={() => setIsRegisterModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-action">Register Organization</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM REQUEST POPUP */}
      {isRequestOpen && currentItem && (
        <div className="modal-backdrop-custom" style={{ zIndex: 1500 }}>
          <div className="modal-card-custom small-modal">
            <div className="modal-header-custom">
              <h2>Confirm Request</h2>
              <button className="close-btn" onClick={() => setIsRequestOpen(false)}>×</button>
            </div>
            <form onSubmit={handleConfirmRequest} className="modal-body-content" style={{ padding: "24px" }}>
              <p>Verify portion expectation before requesting this surplus food:</p>
              
              <label className="field-label" style={{ marginTop: "16px" }}>
                How many people are you expecting to serve with this food?
                <input 
                  type="number" 
                  min="1" 
                  max={currentItem.quantity}
                  value={expectedPeople} 
                  onChange={(e) => setExpectedPeople(e.target.value)} 
                  required 
                />
              </label>

              <label className="field-label" style={{ marginTop: "12px" }}>
                Optional Message to Donor
                <textarea 
                  rows="2" 
                  value={donorMessage} 
                  onChange={(e) => setDonorMessage(e.target.value)} 
                  placeholder="E.g., We have a transport ready for immediate pickup."
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
    </div>
  );

  return isSignedIn ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    <>
      <Navbar />
      <main className="public-receiver-page" style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 24px" }}>
        {content}
      </main>
    </>
  );
}
