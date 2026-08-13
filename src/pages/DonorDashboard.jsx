import React, { useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setDisplayValue(value);
      return;
    }
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function DonorDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { 
    donations, 
    orders, 
    toast,
    showToast,
    registerFood, 
    updateFood, 
    deleteFood,
    acceptOrder, 
    declineOrder,
    updateOrderStatus
  } = useContext(MealBridgeContext);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  
  // Custom modals for incoming requests
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isDeclineConfirmOpen, setIsDeclineConfirmOpen] = useState(false);

  // Selected item states
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderIdToDecline, setOrderIdToDecline] = useState(null);

  // Form Fields State
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("Cooked Meals");
  const [vegNonVeg, setVegNonVeg] = useState("Veg");
  const [quantity, setQuantity] = useState(10);
  const [cookingTime, setCookingTime] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [gpsLocation, setGpsLocation] = useState("40.7128° N, 74.0060° W");
  const [needTransportation, setNeedTransportation] = useState("No");
  const [description, setDescription] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  // Accept Prep Time State
  const [prepTime, setPrepTime] = useState("30 Minutes");
  const [customPrepTime, setCustomPrepTime] = useState("");

  // Check for session storage command to open a specific request (from notification click)
  useEffect(() => {
    const openOrderId = sessionStorage.getItem("mealbridge-open-order");
    if (openOrderId) {
      const ord = orders.find(o => o.id === openOrderId);
      if (ord) {
        setSelectedOrder(ord);
        setIsOrderDetailsOpen(true);
      }
      sessionStorage.removeItem("mealbridge-open-order");
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = sessionStorage.getItem("mealbridge-role");
      if (role === "receiver") {
        showToast("You are signed in as a Receiver. Please switch accounts to access the Donor Portal.", "warning");
        navigate("/receiver-dashboard");
      } else if (role === "delivery") {
        navigate("/delivery-dashboard");
      }
    }
  }, [navigate, showToast]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const foodData = {
      name: foodName,
      category,
      vegNonVeg,
      quantity: Number(quantity),
      cookingTime,
      expiryTime,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60", // default food mock image
      pickupAddress,
      gpsLocation,
      needTransportation,
      description,
      specialInstructions,
      donorName: user?.fullName || "Fresh Bites Catering",
    };
    registerFood(foodData);
    resetForm();
    setIsRegisterOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    const updatedData = {
      name: foodName,
      category,
      vegNonVeg,
      quantity: Number(quantity),
      cookingTime,
      expiryTime,
      pickupAddress,
      gpsLocation,
      needTransportation,
      description,
      specialInstructions,
    };
    updateFood(selectedItem.id, updatedData);
    setIsEditOpen(false);
    setSelectedItem(null);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFoodName(item.name);
    setCategory(item.category);
    setVegNonVeg(item.vegNonVeg);
    setQuantity(item.quantity);
    setCookingTime(item.cookingTime);
    setExpiryTime(item.expiryTime);
    setPickupAddress(item.pickupAddress);
    setGpsLocation(item.gpsLocation);
    setNeedTransportation(item.needTransportation);
    setDescription(item.description);
    setSpecialInstructions(item.specialInstructions);
    setIsEditOpen(true);
  };

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const openAcceptModal = (orderId) => {
    setSelectedOrderId(orderId);
    setPrepTime("30 Minutes");
    setCustomPrepTime("");
    setIsAcceptOpen(true);
  };

  const handleConfirmAccept = () => {
    const timeToSubmit = prepTime === "Custom" ? customPrepTime : prepTime;
    acceptOrder(selectedOrderId, timeToSubmit);
    setIsAcceptOpen(false);
    setSelectedOrderId(null);
  };

  const triggerDecline = (orderId) => {
    setOrderIdToDecline(orderId);
    setIsDeclineConfirmOpen(true);
  };

  const handleConfirmDecline = () => {
    declineOrder(orderIdToDecline);
    setIsDeclineConfirmOpen(false);
    setOrderIdToDecline(null);
  };

  const resetForm = () => {
    setFoodName("");
    setCategory("Cooked Meals");
    setVegNonVeg("Veg");
    setQuantity(10);
    setCookingTime("");
    setExpiryTime("");
    setPickupAddress("");
    setGpsLocation("40.7128° N, 74.0060° W");
    setNeedTransportation("No");
    setDescription("");
    setSpecialInstructions("");
  };

  // Filter donations and orders
  const myDonations = donations; 
  const incomingRequests = orders.filter((o) => o.status === "Pending");
  const activeOrders = orders.filter((o) => o.status !== "Pending" && o.status !== "Declined");

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted": return "info";
      case "Preparing": return "warning";
      case "Ready for Pickup": return "success";
      case "Picked Up": return "info";
      case "Completed": return "success";
      default: return "success";
    }
  };

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
          <h1>Hi, {user?.firstName || "Fresh Bites"} 👋</h1>
          <p className="gradient-subtext">"Every surplus meal you share creates hope for someone in need."</p>
        </div>
      </div>

      {/* Dashboard Overview Section */}
      <h2 className="section-title" style={{ marginTop: "32px", fontSize: "1.25rem" }}>Dashboard Overview</h2>
      
      <div className="overview-container-custom">
        {/* Left Section – Quick Summary */}
        <div className="overview-column">
          <h3 className="overview-column-title">Quick Summary</h3>
          <div className="summary-rows-list">
            {/* Active Listings */}
            <div className="summary-row-item">
              <div className="summary-row-left">
                <div className="summary-row-icon-box">📦</div>
                <div className="summary-row-info">
                  <span className="summary-row-title">Active Listings</span>
                  <span className="summary-row-value">
                    <AnimatedNumber value={myDonations.length} /> Food Donations
                  </span>
                </div>
              </div>
              <span className="summary-row-badge success">Active</span>
            </div>

            {/* Incoming Requests */}
            <div className="summary-row-item">
              <div className="summary-row-left">
                <div className="summary-row-icon-box">📩</div>
                <div className="summary-row-info">
                  <span className="summary-row-title">Incoming Requests</span>
                  <span className="summary-row-value">
                    <AnimatedNumber value={incomingRequests.length} /> Pending Requests
                  </span>
                </div>
              </div>
              <span className="summary-row-badge warning">Awaiting</span>
            </div>

            {/* Weekly Growth */}
            <div className="summary-row-item">
              <div className="summary-row-left">
                <div className="summary-row-icon-box">📈</div>
                <div className="summary-row-info">
                  <span className="summary-row-title">Weekly Growth</span>
                  <span className="summary-row-value">+12% This Week</span>
                </div>
              </div>
              <span className="summary-row-badge info">Excellent</span>
            </div>
          </div>
        </div>

        {/* Center Section – Today's Activity Timeline */}
        <div className="overview-column">
          <h3 className="overview-column-title">Today's Activity</h3>
          <div className="timeline-vertical-list">
            <div className="timeline-node-item" style={{ animationDelay: "0s" }}>
              <span className="timeline-node-dot green"></span>
              <div className="timeline-node-info">
                <h4>Food registered</h4>
                <p>Surplus meals are live on the matching marketplace.</p>
              </div>
            </div>
            <div className="timeline-node-item" style={{ animationDelay: "0.15s" }}>
              <span className="timeline-node-dot orange"></span>
              <div className="timeline-node-info">
                <h4>Waiting for NGO requests</h4>
                <p>Nearby verified partners are reviewing current listings.</p>
              </div>
            </div>
            <div className="timeline-node-item" style={{ animationDelay: "0.3s" }}>
              <span className="timeline-node-dot blue"></span>
              <div className="timeline-node-info">
                <h4>Pickup not scheduled</h4>
                <p>Delivery volunteer assignments will activate once accepted.</p>
              </div>
            </div>
            <div className="timeline-node-item" style={{ animationDelay: "0.45s" }}>
              <span className="timeline-node-dot white"></span>
              <div className="timeline-node-info">
                <h4>No active deliveries</h4>
                <p>Rescued items currently waiting to be picked up.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section – Quick Actions */}
        <div className="overview-column">
          <h3 className="overview-column-title">Quick Actions</h3>
          <div className="quick-actions-list">
            <button className="quick-action-btn-item" onClick={() => { resetForm(); setIsRegisterOpen(true); }}>
              <span className="action-icon">🍱</span>
              <span>Register Food</span>
            </button>
            <button className="quick-action-btn-item" onClick={() => document.getElementById("active-listings").scrollIntoView({ behavior: "smooth" })}>
              <span className="action-icon">📍</span>
              <span>Track Donations</span>
            </button>
            <button className="quick-action-btn-item" onClick={() => document.getElementById("incoming-requests").scrollIntoView({ behavior: "smooth" })}>
              <span className="action-icon">📜</span>
              <span>Donation History</span>
            </button>
            <button className="quick-action-btn-item" onClick={() => showToast("Analytics data refreshed.", "success")}>
              <span className="action-icon">📊</span>
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Overview Strip */}
      <div className="overview-bottom-strip">
        <div className="strip-metric-item">
          <span className="strip-metric-label">Meals Donated</span>
          <span className="strip-metric-value"><AnimatedNumber value={12} /></span>
        </div>
        <div className="strip-metric-item">
          <span className="strip-metric-label">Available Foods</span>
          <span className="strip-metric-value"><AnimatedNumber value={myDonations.length} /></span>
        </div>
        <div className="strip-metric-item">
          <span className="strip-metric-label">Pending Orders</span>
          <span className="strip-metric-value"><AnimatedNumber value={incomingRequests.length} /></span>
        </div>
        <div className="strip-metric-item">
          <span className="strip-metric-label">Partner NGOs</span>
          <span className="strip-metric-value"><AnimatedNumber value={18} /></span>
        </div>
        <div className="strip-metric-item">
          <span className="strip-metric-label">Impact Score</span>
          <span className="strip-metric-value"><AnimatedNumber value="Excellent" /></span>
        </div>
      </div>

      {/* Incoming Requests Portal */}
      <section id="incoming-requests" className="dashboard-section" style={{ marginTop: "40px" }}>
        <h2 className="section-title">Incoming Orders & Requests</h2>
        {incomingRequests.length === 0 ? (
          <div className="empty-listing-panel">
            <span className="empty-icon">📭</span>
            <h3>No pending requests</h3>
            <p>Once recipient NGOs express interest in your food, requests will populate here.</p>
          </div>
        ) : (
          <div className="order-grid">
            {incomingRequests.map((order) => (
              <article key={order.id} className="order-card-custom">
                <div className="order-header">
                  <h4>🏘️ {order.ngoName}</h4>
                  <span className="badge info">Pending</span>
                </div>
                <div className="order-body" style={{ gap: "6px" }}>
                  <p><strong>Food requested:</strong> {order.foodRequested}</p>
                  <p><strong>Quantity:</strong> {order.quantity} servings</p>
                  <p><strong>Expecting:</strong> {order.expectedPeople} guests</p>
                  <p><strong>Contact:</strong> {order.contactPerson} ({order.phone})</p>
                  {order.receiverMessage && <p><strong>Message:</strong> "{order.receiverMessage}"</p>}
                  <p className="order-time">Received: {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="order-actions">
                  <button className="view-btn" style={{ borderRadius: "999px", padding: "10px" }} onClick={() => { setSelectedOrder(order); setIsOrderDetailsOpen(true); }}>View Details</button>
                  <button className="accept-btn-custom" onClick={() => openAcceptModal(order.id)}>Request Accepted</button>
                  <button className="decline-btn-custom" onClick={() => triggerDecline(order.id)}>Decline</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Active Workflows tracking */}
      <section className="dashboard-section" style={{ marginTop: "40px" }}>
        <h2 className="section-title">Order Handover Workflow</h2>
        {activeOrders.length === 0 ? (
          <div className="empty-listing-panel">
            <span className="empty-icon">🚚</span>
            <h3>No active match handovers</h3>
            <p>Once you accept requests, you can track their preparing and pickup progress here.</p>
          </div>
        ) : (
          <div className="order-grid">
            {activeOrders.map((order) => (
              <article key={order.id} className="order-card-custom" style={{ borderLeft: "5px solid var(--primary)" }}>
                <div className="order-header">
                  <h4>🏘️ {order.ngoName}</h4>
                  <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="order-body" style={{ gap: "6px", margin: "12px 0" }}>
                  <p><strong>Food type:</strong> {order.foodRequested}</p>
                  <p><strong>Quantity:</strong> {order.expectedPeople} portions</p>
                  <p><strong>ETA:</strong> {order.prepTime || "Not set"}</p>
                </div>
                <div className="workflow-action-bar" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
                  {order.status === "Accepted" && (
                    <button className="btn-confirm-action" style={{ padding: "8px 16px", fontSize: "0.8rem" }} onClick={() => updateOrderStatus(order.id, "Preparing")}>
                      Start Preparing
                    </button>
                  )}
                  {order.status === "Preparing" && (
                    <button className="btn-confirm-action" style={{ padding: "8px 16px", fontSize: "0.8rem", background: "var(--success)" }} onClick={() => updateOrderStatus(order.id, "Ready for Pickup")}>
                      Mark Ready for Pickup
                    </button>
                  )}
                  {order.status === "Ready for Pickup" && (
                    <button className="btn-confirm-action" style={{ padding: "8px 16px", fontSize: "0.8rem", background: "var(--teal)" }} onClick={() => updateOrderStatus(order.id, "Picked Up")}>
                      Mark Picked Up
                    </button>
                  )}
                  {order.status === "Picked Up" && (
                    <button className="btn-confirm-action" style={{ padding: "8px 16px", fontSize: "0.8rem", background: "#888" }} onClick={() => updateOrderStatus(order.id, "Completed")}>
                      Complete Order
                    </button>
                  )}
                  <span style={{ fontSize: "0.8rem", color: "#888", display: "flex", alignItems: "center" }}>
                    {order.status === "Completed" ? "🎉 Order Completed" : "⚡ Click to update receiver"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Active Listings Grid */}
      <section id="active-listings" className="dashboard-section" style={{ marginTop: "40px" }}>
        <div className="section-header-row">
          <h2 className="section-title">My Registered Donations</h2>
          <button className="btn-add-food" onClick={() => { resetForm(); setIsRegisterOpen(true); }}>+ Register Food</button>
        </div>
        {myDonations.length === 0 ? (
          <div className="empty-listing-panel">
            <span className="empty-icon">🍲</span>
            <h3>No food items listed</h3>
            <p>Register surplus meals to make them available for matching shelters.</p>
          </div>
        ) : (
          <div className="donations-grid-custom">
            {myDonations.map((item) => (
              <article key={item.id} className="donation-card-custom">
                <img src={item.imageUrl} alt={item.name} className="donation-card-img" />
                <div className="donation-card-body">
                  <div className="card-title-row">
                    <h3>{item.name}</h3>
                    <span className={`veg-badge ${item.vegNonVeg === "Veg" ? "veg" : "non-veg"}`}>
                      {item.vegNonVeg === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                    </span>
                  </div>
                  <p className="cooking-time">🕒 Cooking: {item.cookingTime ? new Date(item.cookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</p>
                  <span className={`status-badge-custom ${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {item.status}
                  </span>
                  <div className="card-btn-actions" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>
                    <button className="view-btn" onClick={() => openDetailsModal(item)}>View Details</button>
                    <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                    <button className="delete-btn-custom" onClick={() => {
                      if (window.confirm(`Are you sure you want to delete '${item.name}'?`)) {
                        deleteFood(item.id);
                      }
                    }}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* MODALS */}

      {/* DETAILED ORDER SPECIFICATION MODAL */}
      {isOrderDetailsOpen && selectedOrder && (
        <div className="modal-backdrop-custom animate-fade-in" onClick={() => setIsOrderDetailsOpen(false)}>
          <div className="modal-card-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Food Request Details</h2>
              <button className="close-btn" onClick={() => setIsOrderDetailsOpen(false)}>×</button>
            </div>
            <div className="modal-form-scrollable" style={{ padding: "24px" }}>
              <div className="details-section-custom">
                <h3>🏘️ NGO Information</h3>
                <p><strong>Organization Name:</strong> {selectedOrder.ngoName}</p>
                <p><strong>Contact Person:</strong> {selectedOrder.contactPerson}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              </div>
              <div className="details-section-custom">
                <h3>🍲 Meal Details</h3>
                <p><strong>Food Requested:</strong> {selectedOrder.foodRequested}</p>
                <p><strong>Expecting Portions:</strong> {selectedOrder.expectedPeople} servings</p>
                <p><strong>Request Submitted:</strong> {new Date(selectedOrder.orderTime).toLocaleString()}</p>
              </div>
              <div className="details-section-custom">
                <h3>✉️ Message from NGO</h3>
                <p>"{selectedOrder.receiverMessage || "No message included."}"</p>
              </div>
              <div className="modal-actions-custom" style={{ marginTop: "24px" }}>
                <button className="btn-cancel" onClick={() => setIsOrderDetailsOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DECLINE MODAL */}
      {isDeclineConfirmOpen && (
        <div className="modal-backdrop-custom" style={{ zIndex: 2000 }}>
          <div className="modal-card-custom small-modal" style={{ padding: "24px", textAlign: "center" }}>
            <span style={{ fontSize: "2.5rem" }}>⚠️</span>
            <h3 style={{ margin: "16px 0 8px", fontSize: "1.15rem", fontWeight: "800" }}>Decline Request?</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 20px" }}>
              Are you sure you want to decline this food request? This action will notify the NGO.
            </p>
            <div className="modal-actions-custom" style={{ justifyContent: "center" }}>
              <button className="btn-cancel" onClick={() => setIsDeclineConfirmOpen(false)}>Cancel</button>
              <button className="decline-btn-custom" style={{ borderRadius: "999px", padding: "12px 24px" }} onClick={handleConfirmDecline}>Decline</button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER FOOD MODAL */}
      {isRegisterOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal-card-custom">
            <div className="modal-header-custom">
              <h2>Register New Surplus Food</h2>
              <button className="close-btn" onClick={() => setIsRegisterOpen(false)}>×</button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="modal-form-scrollable">
              <label className="field-label">
                Food Name
                <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
              </label>

              <div className="form-row-custom">
                <label className="field-label half">
                  Category
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Salads">Salads</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </label>
                <label className="field-label half">
                  Veg / Non-Veg
                  <select value={vegNonVeg} onChange={(e) => setVegNonVeg(e.target.value)}>
                    <option value="Veg">Veg</option>
                    <option value="Non Veg">Non Veg</option>
                  </select>
                </label>
              </div>

              <div className="form-row-custom">
                <label className="field-label half">
                  Quantity (servings/meals)
                  <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </label>
                <label className="field-label half">
                  Need Transportation?
                  <select value={needTransportation} onChange={(e) => setNeedTransportation(e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
              </div>

              <div className="form-row-custom">
                <label className="field-label half">
                  Cooking Time
                  <input type="datetime-local" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} required />
                </label>
                <label className="field-label half">
                  Expiry Time
                  <input type="datetime-local" value={expiryTime} onChange={(e) => setExpiryTime(e.target.value)} required />
                </label>
              </div>

              <label className="field-label">
                Pickup Address
                <textarea rows="2" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} required />
              </label>

              <label className="field-label">
                GPS Location coordinates
                <input type="text" value={gpsLocation} onChange={(e) => setGpsLocation(e.target.value)} required />
              </label>

              <label className="field-label">
                Description
                <textarea rows="2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="E.g., Pasta, side vegetables..." />
              </label>

              <label className="field-label">
                Special Instructions
                <textarea rows="2" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} placeholder="Allergens, packaging details..." />
              </label>

              <div className="modal-actions-custom">
                <button type="button" className="btn-cancel" onClick={() => setIsRegisterOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-action">Register Food</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FOOD MODAL */}
      {isEditOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal-card-custom">
            <div className="modal-header-custom">
              <h2>Edit Food Details</h2>
              <button className="close-btn" onClick={() => setIsEditOpen(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-form-scrollable">
              <label className="field-label">
                Food Name
                <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
              </label>

              <div className="form-row-custom">
                <label className="field-label half">
                  Category
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Salads">Salads</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </label>
                <label className="field-label half">
                  Veg / Non-Veg
                  <select value={vegNonVeg} onChange={(e) => setVegNonVeg(e.target.value)}>
                    <option value="Veg">Veg</option>
                    <option value="Non Veg">Non Veg</option>
                  </select>
                </label>
              </div>

              <div className="form-row-custom">
                <label className="field-label half">
                  Quantity (servings/meals)
                  <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </label>
                <label className="field-label half">
                  Need Transportation?
                  <select value={needTransportation} onChange={(e) => setNeedTransportation(e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
              </div>

              <div className="form-row-custom">
                <label className="field-label half">
                  Cooking Time
                  <input type="datetime-local" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} required />
                </label>
                <label className="field-label half">
                  Expiry Time
                  <input type="datetime-local" value={expiryTime} onChange={(e) => setExpiryTime(e.target.value)} required />
                </label>
              </div>

              <label className="field-label">
                Pickup Address
                <textarea rows="2" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} required />
              </label>

              <label className="field-label">
                GPS Location coordinates
                <input type="text" value={gpsLocation} onChange={(e) => setGpsLocation(e.target.value)} required />
              </label>

              <label className="field-label">
                Description
                <textarea rows="2" value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>

              <label className="field-label">
                Special Instructions
                <textarea rows="2" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
              </label>

              <div className="modal-actions-custom">
                <button type="button" className="btn-cancel" onClick={() => setIsEditOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-action">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {isDetailsOpen && selectedItem && (
        <div className="modal-backdrop-custom animate-fade-in" onClick={() => setIsDetailsOpen(false)}>
          <div className="modal-card-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Food Rescue Details</h2>
              <button className="close-btn" onClick={() => setIsDetailsOpen(false)}>×</button>
            </div>
            <div className="modal-form-scrollable">
              <img src={selectedItem.imageUrl} alt={selectedItem.name} className="details-img" />
              
              <div className="details-section-custom">
                <h3>🍲 Food Information</h3>
                <div className="details-grid-specs">
                  <p><strong>Name:</strong> {selectedItem.name}</p>
                  <p><strong>Category:</strong> {selectedItem.category}</p>
                  <p><strong>Veg / Non-Veg:</strong> {selectedItem.vegNonVeg}</p>
                  <p><strong>Quantity:</strong> {selectedItem.quantity} meals</p>
                </div>
              </div>

              <div className="details-section-custom">
                <h3>🕒 Timing</h3>
                <div className="details-grid-specs">
                  <p><strong>Cooking Time:</strong> {selectedItem.cookingTime ? new Date(selectedItem.cookingTime).toLocaleString() : "N/A"}</p>
                  <p><strong>Expiry Time:</strong> {selectedItem.expiryTime ? new Date(selectedItem.expiryTime).toLocaleString() : "N/A"}</p>
                </div>
              </div>

              <div className="details-section-custom">
                <h3>📍 Pickup Details</h3>
                <p><strong>Address:</strong> {selectedItem.pickupAddress}</p>
                <p><strong>GPS Coordinates:</strong> {selectedItem.gpsLocation}</p>
                <p><strong>Transportation Required:</strong> {selectedItem.needTransportation}</p>
              </div>

              <div className="details-section-custom">
                <h3>📝 Extra Notes</h3>
                <p><strong>Description:</strong> {selectedItem.description || "None provided."}</p>
                <p><strong>Special Instructions:</strong> {selectedItem.specialInstructions || "None provided."}</p>
              </div>

              <div className="status-display-bottom">
                <span>Current Status:</span>
                <span className={`status-badge-custom ${selectedItem.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCEPT PREP TIME MODAL */}
      {isAcceptOpen && (
        <div className="modal-backdrop-custom" style={{ zIndex: 1500 }}>
          <div className="modal-card-custom small-modal">
            <div className="modal-header-custom">
              <h2>Accept Order Request</h2>
              <button className="close-btn" onClick={() => setIsAcceptOpen(false)}>×</button>
            </div>
            <div className="modal-body-content" style={{ padding: "24px" }}>
              <p>Set the estimated preparation time for NGO pickup:</p>
              <div className="prep-time-options" style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
                {["15 Minutes", "30 Minutes", "45 Minutes", "1 Hour"].map((time) => (
                  <button 
                    key={time} 
                    className={`prep-option-btn ${prepTime === time ? "active" : ""}`}
                    onClick={() => setPrepTime(time)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 138, 0, 0.18)",
                      background: prepTime === time ? "var(--primary)" : "white",
                      color: prepTime === time ? "white" : "var(--text-primary)",
                      cursor: "pointer",
                      fontWeight: "700"
                    }}
                  >
                    {time}
                  </button>
                ))}
                <button 
                  className={`prep-option-btn ${prepTime === "Custom" ? "active" : ""}`}
                  onClick={() => setPrepTime("Custom")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 138, 0, 0.18)",
                    background: prepTime === "Custom" ? "var(--primary)" : "white",
                    color: prepTime === "Custom" ? "white" : "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: "700"
                  }}
                >
                  Custom
                </button>
              </div>

              {prepTime === "Custom" && (
                <label className="field-label" style={{ marginTop: "16px" }}>
                  Enter preparation time:
                  <input 
                    type="text" 
                    placeholder="E.g., 2 Hours"
                    value={customPrepTime} 
                    onChange={(e) => setCustomPrepTime(e.target.value)} 
                    required 
                  />
                </label>
              )}

              <div className="modal-actions-custom" style={{ marginTop: "24px" }}>
                <button className="btn-cancel" onClick={() => setIsAcceptOpen(false)}>Cancel</button>
                <button className="btn-confirm-action" onClick={handleConfirmAccept}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}