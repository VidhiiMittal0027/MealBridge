import React, { createContext, useState, useEffect } from "react";

export const MealBridgeContext = createContext();

export function MealBridgeProvider({ children }) {
  // Mock initial donations list
  const initialDonations = [
    {
      id: "don-1",
      name: "Fresh Veggie Salad Trays",
      category: "Salads",
      vegNonVeg: "Veg",
      quantity: 25,
      cookingTime: "2026-08-04T12:00",
      expiryTime: "2026-08-04T18:00",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60",
      pickupAddress: "128 Gourmet Way, Food District",
      gpsLocation: "40.7128° N, 74.0060° W",
      needTransportation: "Yes",
      description: "Organic mixed salad trays with balsamic dressing on the side. Prepared for a corporate event that got cancelled.",
      specialInstructions: "Keep refrigerated until distribution. Trays are packed with ice packs.",
      status: "Available for NGO Matching",
      donorName: "Fresh Bites Catering",
    },
    {
      id: "don-2",
      name: "Artisan Sourdough Bread",
      category: "Bakery",
      vegNonVeg: "Veg",
      quantity: 45,
      cookingTime: "2026-08-04T08:00",
      expiryTime: "2026-08-05T12:00",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60",
      pickupAddress: "45 Baker Street, Downtown",
      gpsLocation: "40.7282° N, 73.9942° W",
      needTransportation: "No",
      description: "Freshly baked sourdough bread loaves. Completely vegan and nutritious.",
      specialInstructions: "Store in a dry, cool place. No refrigeration needed.",
      status: "Available for NGO Matching",
      donorName: "Rise & Shine Bakery",
    },
    {
      id: "don-3",
      name: "Roasted Vegetable Curry",
      category: "Cooked Meals",
      vegNonVeg: "Veg",
      quantity: 35,
      cookingTime: "2026-08-04T14:30",
      expiryTime: "2026-08-04T20:30",
      imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop&q=60",
      pickupAddress: "89 Spice Garden, Midtown",
      gpsLocation: "40.7484° N, 73.9857° W",
      needTransportation: "Yes",
      description: "Assorted roasted vegetables in a mild coconut curry base. Served with steamed basmati rice.",
      specialInstructions: "Warm before serving. Ideal for shelters.",
      status: "Accepted by NGO",
      donorName: "The Green Bistro",
    }
  ];

  // Mock initial orders list
  const initialOrders = [
    {
      id: "ord-1",
      donationId: "don-3",
      ngoName: "City Hope Kitchen",
      contactPerson: "Sarah Jenkins",
      phone: "555-0199",
      foodRequested: "Roasted Vegetable Curry",
      quantity: 35,
      expectedPeople: 30,
      receiverMessage: "Thank you for the delicious healthy meal suggestion!",
      orderTime: "2026-08-04T15:15",
      status: "Accepted",
      prepTime: "30 Minutes",
    }
  ];

  // Mock initial messages list
  const initialMessages = [
    {
      id: "msg-1",
      donationId: "don-1",
      senderId: "receiver",
      senderName: "City Hope Kitchen",
      text: "Hi, is the salad dressing packed separately?",
      timestamp: "2026-08-04T16:10",
    },
    {
      id: "msg-2",
      donationId: "don-1",
      senderId: "donor",
      senderName: "Fresh Bites Catering",
      text: "Yes, it is packed in individual 2oz cups so the salad stays fresh!",
      timestamp: "2026-08-04T16:12",
    }
  ];

  // Persist and load from localStorage
  const [donations, setDonations] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealbridge-donations");
      return stored ? JSON.parse(stored) : initialDonations;
    }
    return initialDonations;
  });

  const [orders, setOrders] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealbridge-orders");
      return stored ? JSON.parse(stored) : initialOrders;
    }
    return initialOrders;
  });

  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealbridge-messages");
      return stored ? JSON.parse(stored) : initialMessages;
    }
    return initialMessages;
  });

  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealbridge-notifications");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [isOrgRegistered, setIsOrgRegistered] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mealbridge-org-registered") === "true";
    }
    return false;
  });

  const [orgDetails, setOrgDetails] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealbridge-org-details");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mealbridge-donations", JSON.stringify(donations));
    }
  }, [donations]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mealbridge-orders", JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mealbridge-messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mealbridge-notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const registerOrganization = (details) => {
    setIsOrgRegistered(true);
    setOrgDetails(details);
    if (typeof window !== "undefined") {
      localStorage.setItem("mealbridge-org-registered", "true");
      localStorage.setItem("mealbridge-org-details", JSON.stringify(details));
    }
    showToast("Organization registered successfully!");
  };

  const registerFood = (foodData) => {
    const newFood = {
      id: "don-" + (donations.length + 1),
      ...foodData,
      status: "Available for NGO Matching",
      donorName: foodData.donorName || "My Restaurant",
    };
    setDonations((prev) => [newFood, ...prev]);
    
    // Add Notification
    addNotification("donor", "Food Registered", `Successfully listed '${foodData.name}' for matching.`, "success");
    showToast("Food donation registered successfully!");
  };

  const updateFood = (id, updatedData) => {
    setDonations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
    showToast("Food information updated successfully!");
  };

  const deleteFood = (id) => {
    setDonations((prev) => prev.filter((item) => item.id !== id));
    showToast("Food donation listing removed.", "warning");
  };

  const requestFood = (donationId, expectedPeople, receiverMessage) => {
    const donation = donations.find((item) => item.id === donationId);
    if (!donation) return;

    const ngoName = orgDetails?.orgName || "City Hope Kitchen";
    const contactPerson = orgDetails?.contactPerson || "Sarah Jenkins";
    const phone = orgDetails?.phone || "555-0199";

    const newOrder = {
      id: "ord-" + (orders.length + 1),
      donationId,
      ngoName,
      contactPerson,
      phone,
      foodRequested: donation.name,
      quantity: donation.quantity,
      expectedPeople: Number(expectedPeople),
      receiverMessage: receiverMessage || "",
      orderTime: new Date().toISOString(),
      status: "Pending",
      prepTime: "",
    };

    setOrders((prev) => [newOrder, ...prev]);
    
    // Mark donation status
    setDonations((prev) =>
      prev.map((item) => (item.id === donationId ? { ...item, status: "Matching Pending" } : item))
    );

    // Notifications
    addNotification(
      "donor", 
      "New Food Request", 
      `${ngoName} has requested ${donation.name} for ${expectedPeople} people.`, 
      "info", 
      newOrder.id
    );
    showToast("Your request was submitted to the donor!");
  };

  const acceptOrder = (orderId, prepTime) => {
    const order = orders.find((ord) => ord.id === orderId);
    if (!order) return;

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: "Accepted", prepTime } : ord))
    );

    setDonations((prev) =>
      prev.map((item) => (item.id === order.donationId ? { ...item, status: "Accepted by NGO" } : item))
    );

    // Notify Receiver
    addNotification(
      "receiver",
      "Request Accepted",
      `Your request for ${order.foodRequested} has been accepted by ${order.donorName || "the donor"}. Estimated pickup time: ${prepTime}.`,
      "success",
      orderId
    );
    showToast(`Order accepted. Expected pickup in ${prepTime}.`);
  };

  const declineOrder = (orderId) => {
    const order = orders.find((ord) => ord.id === orderId);
    if (!order) return;

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: "Declined" } : ord))
    );
    
    // Revert donation status
    setDonations((prev) =>
      prev.map((item) =>
        item.id === order.donationId ? { ...item, status: "Available for NGO Matching" } : item
      )
    );

    // Notify Receiver
    addNotification(
      "receiver",
      "Request Declined",
      `Your request for ${order.foodRequested} was declined by the donor.`,
      "warning",
      orderId
    );
    showToast("Order declined.", "warning");
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    const order = orders.find((ord) => ord.id === orderId);
    if (!order) return;

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );

    // Map nextStatus to donation status
    let donationStatus = "Accepted by NGO";
    if (nextStatus === "Preparing") donationStatus = "Preparing";
    else if (nextStatus === "Ready for Pickup") donationStatus = "Ready for Pickup";
    else if (nextStatus === "Picked Up") donationStatus = "In Transit";
    else if (nextStatus === "Completed") donationStatus = "Delivered";

    setDonations((prev) =>
      prev.map((item) => (item.id === order.donationId ? { ...item, status: donationStatus } : item))
    );

    // Notify Receiver
    addNotification(
      "receiver",
      "Order Status Update",
      `Your order for '${order.foodRequested}' is now ${nextStatus}.`,
      "info",
      orderId
    );
    showToast(`Order status updated to ${nextStatus}.`);
  };

  const sendChatMessage = (donationId, senderId, senderName, text) => {
    const newMsg = {
      id: "msg-" + (messages.length + 1),
      donationId,
      senderId,
      senderName,
      text,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newMsg]);

    const otherRole = senderId === "donor" ? "receiver" : "donor";
    addNotification(
      otherRole,
      "New Chat Message",
      `${senderName}: "${text.length > 30 ? text.substring(0, 30) + "..." : text}"`,
      "info"
    );
  };

  const addNotification = (role, title, message, type = "info", targetId = null) => {
    const newNotif = {
      id: "not-" + (notifications.length + 1),
      role,
      title,
      message,
      timestamp: new Date().toISOString(),
      type,
      unread: true,
      targetId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = (role) => {
    setNotifications((prev) =>
      prev.map((not) => (not.role === role ? { ...not, unread: false } : not))
    );
  };

  return (
    <MealBridgeContext.Provider
      value={{
        donations,
        orders,
        messages,
        notifications,
        toast,
        isOrgRegistered,
        orgDetails,
        showToast,
        registerOrganization,
        registerFood,
        updateFood,
        deleteFood,
        requestFood,
        acceptOrder,
        declineOrder,
        updateOrderStatus,
        sendChatMessage,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </MealBridgeContext.Provider>
  );
}
