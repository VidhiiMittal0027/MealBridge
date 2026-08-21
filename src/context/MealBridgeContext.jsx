import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useUser } from "@clerk/react";

export const MealBridgeContext = createContext();

const dbToMockStatus = (status) => {
  switch(status) {
    case 'available': return "Available for NGO Matching";
    case 'requested': return "Matching Pending";
    case 'accepted': return "Accepted";
    case 'picked_up': return "Picked Up";
    case 'delivered': return "Completed";
    default: return "Available for NGO Matching";
  }
};

const orderDbToMockStatus = (status) => {
  switch(status) {
    case 'pending': return "Pending";
    case 'accepted': return "Accepted";
    case 'rejected': return "Declined";
    case 'ready_for_pickup': return "Ready for Pickup";
    case 'picked_up': return "Picked Up";
    case 'delivered': return "Completed";
    case 'cancelled': return "Declined";
    default: return "Pending";
  }
};

export function MealBridgeProvider({ children }) {
  const { user, isSignedIn } = useUser();

  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState(() => {
    try {
      const cached = localStorage.getItem("mealbridge_chat_messages");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: "msg-demo-1",
        donationId: "1",
        orderId: "1",
        senderId: "receiver",
        senderRole: "receiver",
        senderName: "City Hope Kitchen",
        text: "Hello! We would like to request this meal for our shelter dinner. Is it still available for pickup?",
        message: "Hello! We would like to request this meal for our shelter dinner. Is it still available for pickup?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "msg-demo-2",
        donationId: "1",
        orderId: "1",
        senderId: "donor",
        senderRole: "donor",
        senderName: "Fresh Bites Catering",
        text: "Yes, absolutely! It has been packed in sealed food-grade containers and is ready for pickup.",
        message: "Yes, absolutely! It has been packed in sealed food-grade containers and is ready for pickup.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ];
  });
  const [notifications, setNotifications] = useState([]);
  const [isOrgRegistered, setIsOrgRegistered] = useState(false);
  const [orgDetails, setOrgDetails] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("food_donations")
        .select("*, donor:profiles(full_name)");
      
      if (!error && data) {
        const mapped = data.map(d => ({
          id: d.id,
          name: d.food_name,
          description: d.description,
          category: d.category,
          vegNonVeg: d.veg_non_veg,
          quantity: d.quantity,
          servings: d.servings,
          cookingTime: d.prepared_at,
          expiryTime: d.expiry_time,
          imageUrl: d.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60",
          pickupAddress: d.pickup_address,
          gpsLocation: d.gps_location,
          needTransportation: d.need_transportation,
          specialInstructions: d.special_instructions,
          status: dbToMockStatus(d.status),
          donorId: d.donor_id,
          donorName: d.donor?.full_name || "Food Donor",
          freshnessLabel: d.freshness_label,
          freshnessScore: d.freshness_score,
          aiModelVersion: d.ai_model_version
        }));
        setDonations(mapped);
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, donation:food_donations(*), receiver_profile:profiles!orders_receiver_id_fkey(full_name, phone), org:organizations(*)");
      
      if (!error && data) {
        const mapped = data.map(o => ({
          id: o.id,
          donationId: o.donation_id,
          ngoName: o.org?.organization_name || "City Hope Kitchen",
          contactPerson: o.receiver_profile?.full_name || "Sarah Jenkins",
          phone: o.receiver_profile?.phone || o.phone || "555-0199",
          foodRequested: o.donation?.food_name || o.foodRequested || "Surplus Food",
          quantity: o.donation?.quantity || o.quantity,
          expectedPeople: o.requested_quantity,
          receiverMessage: o.receiver_message,
          orderTime: o.requested_at,
          status: orderDbToMockStatus(o.status),
          prepTime: o.prep_time,
          donorId: o.donation?.donor_id,
          donorName: o.donation ? "Fresh Bites Catering" : "Donor"
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        const mapped = data.map(n => ({
          id: n.id,
          role: user.unsafeMetadata?.role || "donor",
          title: n.title,
          message: n.message,
          timestamp: n.created_at,
          type: n.type === 'new_order' ? 'info' : n.type === 'order_accepted' ? 'success' : 'warning',
          unread: !n.is_read,
          targetId: n.order_id
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (!error && data) {
        const mapped = data.map(m => ({
          id: m.id,
          donationId: m.order_id, // map order_id to donationId to match context chat payload mapping
          senderId: m.sender_id === user.id ? (user.unsafeMetadata?.role || "donor") : (user.unsafeMetadata?.role === "donor" ? "receiver" : "donor"),
          senderName: m.sender_name,
          text: m.message,
          timestamp: m.created_at
        }));
        setMessages(mapped);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchOrganization = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (!error && data) {
        setIsOrgRegistered(true);
        setOrgDetails({
          orgName: data.organization_name,
          orgType: data.organization_type,
          regNum: data.registration_no,
          contactName: user.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          dailyServed: 50,
          description: data.description
        });
      } else {
        setIsOrgRegistered(false);
        setOrgDetails(null);
      }
    } catch (err) {
      console.error("Error fetching organization:", err);
    }
  };

  useEffect(() => {
    if (!isSignedIn || !user) {
      setDonations([]);
      setOrders([]);
      setNotifications([]);
      setMessages([]);
      setIsOrgRegistered(false);
      setOrgDetails(null);
      return;
    }

    const syncUserAndFetchData = async () => {
      try {
        const storedRole = sessionStorage.getItem("mealbridge-role") || user.unsafeMetadata?.role || "donor";
        
        // 1. Sync Clerk user profile to Supabase public.profiles table
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileErr && profileErr.code === "PGRST116") {
          // Profile does not exist, insert it!
          await supabase.from("profiles").insert({
            id: user.id,
            full_name: user.fullName || "Anonymous User",
            email: user.primaryEmailAddress?.emailAddress || "",
            avatar_url: user.imageUrl || "",
            role: storedRole
          });
        } else if (!profileErr && profile) {
          // Sync role or details if changed
          if (profile.role !== storedRole || profile.full_name !== user.fullName) {
            await supabase
              .from("profiles")
              .update({
                role: storedRole,
                full_name: user.fullName || profile.full_name,
                avatar_url: user.imageUrl || profile.avatar_url
              })
              .eq("id", user.id);
          }
        }

        // Fetch database tables
        fetchDonations();
        fetchOrders();
        fetchNotifications();
        fetchMessages();
        fetchOrganization();
      } catch (err) {
        console.error("Error syncing profile/fetching data:", err);
      }
    };

    syncUserAndFetchData();

    // Set up Realtime subscriptions
    const donationsChannel = supabase
      .channel("public:food_donations")
      .on("postgres_changes", { event: "*", schema: "public", table: "food_donations" }, () => {
        fetchDonations();
      })
      .subscribe();

    const ordersChannel = supabase
      .channel("public:orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
        fetchDonations();
      })
      .subscribe();

    const notificationsChannel = supabase
      .channel("public:notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => {
        fetchNotifications();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel("public:messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(donationsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user, isSignedIn]);

  // Real-time inter-tab & local storage chat sync
  useEffect(() => {
    let bc = null;
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        bc = new BroadcastChannel("mealbridge_realtime_chat");
        bc.onmessage = (event) => {
          if (event.data?.type === "NEW_MESSAGE" && event.data.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === event.data.message.id)) return prev;
              const updated = [...prev, event.data.message];
              try {
                localStorage.setItem("mealbridge_chat_messages", JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });
          }
        };
      }
    } catch (e) {}

    const handleStorage = (e) => {
      if (e.key === "mealbridge_chat_messages" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setMessages(parsed);
        } catch (err) {}
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const registerOrganization = async (details) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("organizations")
        .insert({
          user_id: user.id,
          organization_name: details.orgName,
          organization_type: details.orgType,
          registration_no: details.regNum,
          phone: details.phone,
          address: details.address,
          city: details.city,
          description: details.description
        });
      
      if (error) {
        showToast("Error registering organization: " + error.message, "error");
      } else {
        setIsOrgRegistered(true);
        setOrgDetails(details);
        showToast("Organization registered successfully!");
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const registerFood = async (foodData) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("food_donations")
        .insert({
          donor_id: user.id,
          food_name: foodData.name,
          description: foodData.description,
          category: foodData.category,
          veg_non_veg: foodData.vegNonVeg,
          quantity: foodData.quantity,
          servings: foodData.servings,
          prepared_at: foodData.cookingTime || new Date().toISOString(),
          expiry_time: foodData.expiryTime || new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
          pickup_address: foodData.pickupAddress,
          need_transportation: foodData.needTransportation,
          special_instructions: foodData.specialInstructions,
          image_url: foodData.imageUrl,
          status: 'available',
          freshness_label: foodData.freshnessLabel,
          freshness_score: foodData.freshnessScore,
          ai_model_version: foodData.aiModelVersion
        });
      
      if (error) {
        showToast("Error registering food: " + error.message, "error");
      } else {
        showToast("Food donation registered successfully!");
        fetchDonations();
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const updateFood = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from("food_donations")
        .update({
          food_name: updatedData.name,
          description: updatedData.description,
          category: updatedData.category,
          veg_non_veg: updatedData.vegNonVeg,
          quantity: updatedData.quantity,
          servings: updatedData.servings,
          prepared_at: updatedData.cookingTime,
          expiry_time: updatedData.expiryTime,
          pickup_address: updatedData.pickupAddress,
          need_transportation: updatedData.needTransportation,
          special_instructions: updatedData.specialInstructions,
          ...(updatedData.imageUrl && { image_url: updatedData.imageUrl })
        })
        .eq("id", id);

      if (error) {
        showToast("Error updating food: " + error.message, "error");
      } else {
        showToast("Food information updated successfully!");
        fetchDonations();
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const deleteFood = async (id) => {
    try {
      const { error } = await supabase
        .from("food_donations")
        .delete()
        .eq("id", id);
      
      if (error) {
        showToast("Error removing listing: " + error.message, "error");
      } else {
        showToast("Food donation listing removed.", "warning");
        fetchDonations();
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const requestFood = async (donationId, expectedPeople, receiverMessage) => {
    const requestedAmount = Number(expectedPeople) || 1;

    // 1. Instantly update donations in React state by deducting requested quantity
    setDonations((prevDonations) => {
      return prevDonations.map((d) => {
        if (d.id === donationId) {
          const currentQty = Number(d.quantity) || Number(d.servings) || 0;
          const remaining = Math.max(0, currentQty - requestedAmount);
          return {
            ...d,
            quantity: remaining,
            servings: remaining,
            status: remaining <= 0 ? "Matching Pending" : d.status,
          };
        }
        return d;
      });
    });

    // 2. Add local order immediately
    const targetDonation = donations.find((d) => d.id === donationId);
    const newMockOrder = {
      id: `order-${Date.now()}`,
      donationId: donationId,
      ngoName: orgDetails?.organization_name || user?.fullName || "City Hope Kitchen",
      receiverName: orgDetails?.organization_name || user?.fullName || "City Hope Kitchen",
      contactPerson: user?.fullName || "Sarah Jenkins",
      foodRequested: targetDonation?.name || "Surplus Food",
      foodName: targetDonation?.name || "Surplus Food",
      quantity: requestedAmount,
      expectedPeople: requestedAmount,
      receiverMessage: receiverMessage || "",
      orderTime: new Date().toISOString(),
      status: "Pending",
      donorId: targetDonation?.donorId,
      donorName: targetDonation?.donorName || "Food Donor",
    };
    setOrders((prev) => [newMockOrder, ...(prev || [])]);

    // 3. If signed in, sync with Supabase
    if (user) {
      try {
        let orgId = null;
        try {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();
          if (orgData) orgId = orgData.id;
        } catch (e) {}

        if (isUuid(donationId)) {
          const { error: orderError } = await supabase
            .from("orders")
            .insert({
              donation_id: donationId,
              receiver_id: user.id,
              organization_id: orgId,
              requested_quantity: requestedAmount,
              receiver_message: receiverMessage || "",
              status: "pending",
            });

          if (!orderError) {
            const currentQty = Number(targetDonation?.quantity) || Number(targetDonation?.servings) || 0;
            const remaining = Math.max(0, currentQty - requestedAmount);

            await supabase
              .from("food_donations")
              .update({
                quantity: remaining,
                servings: remaining,
                status: remaining <= 0 ? "requested" : "available",
              })
              .eq("id", donationId);

            fetchDonations();
            fetchOrders();
          }
        }
      } catch (err) {
        console.warn("Supabase request food notice:", err);
      }
    }

    showToast("Your request was submitted to the donor!", "success");
  };

  const isUuid = (id) =>
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const defaultDemoOrders = [
    {
      id: "demo-order-1",
      status: "Pending",
      ngoName: "City Hope Kitchen",
      receiverName: "City Hope Kitchen",
      foodRequested: "Fresh Veg Meal Boxes",
      foodName: "Fresh Veg Meal Boxes",
      quantity: 10,
      expectedPeople: 10,
      orderTime: new Date().toISOString(),
      receiverMessage:
        "We would like to request these meals for today's distribution.",
      contactPerson: "Community Coordinator",
    },
    {
      id: "demo-order-2",
      status: "Completed",
      ngoName: "Helping Hands NGO",
      receiverName: "Helping Hands NGO",
      foodRequested: "Cooked Meals",
      foodName: "Cooked Meals",
      quantity: 15,
      expectedPeople: 15,
      orderTime: new Date(Date.now() - 86400000).toISOString(),
      receiverMessage: "Thank you for the donation.",
      contactPerson: "NGO Coordinator",
    },
  ];

  const acceptOrder = async (orderId, prepTime) => {
    // 1. Instantly update React context state
    setOrders((prevOrders) => {
      const baseList = prevOrders && prevOrders.length > 0 ? prevOrders : defaultDemoOrders;
      return baseList.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: "Accepted",
              prepTime: prepTime,
              prep_time: prepTime,
              accepted_at: new Date().toISOString(),
            }
          : ord
      );
    });

    // 2. If it's a valid Supabase UUID, sync with backend database
    if (isUuid(orderId)) {
      try {
        const { error } = await supabase
          .from("orders")
          .update({
            status: "accepted",
            prep_time: prepTime,
            accepted_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (!error) {
          fetchOrders();
        } else {
          console.warn("Supabase accept order notice:", error.message);
        }
      } catch (err) {
        console.warn("Supabase sync notice:", err);
      }
    }

    showToast(`Order accepted. Expected pickup in ${prepTime}.`, "success");
  };

  const declineOrder = async (orderId) => {
    // 1. Instantly update React context state
    setOrders((prevOrders) => {
      const baseList = prevOrders && prevOrders.length > 0 ? prevOrders : defaultDemoOrders;
      return baseList.map((ord) =>
        ord.id === orderId ? { ...ord, status: "Declined" } : ord
      );
    });

    // 2. If it's a valid Supabase UUID, sync with backend database
    if (isUuid(orderId)) {
      try {
        const { error } = await supabase
          .from("orders")
          .update({
            status: "rejected",
          })
          .eq("id", orderId);

        if (!error) {
          fetchOrders();
          fetchDonations();
        } else {
          console.warn("Supabase decline order notice:", error.message);
        }
      } catch (err) {
        console.warn("Supabase sync notice:", err);
      }
    }

    showToast("Order declined.", "warning");
  };

  const updateOrderStatus = async (orderId, nextStatus) => {
    let dbStatus = "accepted";
    if (nextStatus === "Preparing") dbStatus = "accepted";
    else if (nextStatus === "Ready for Pickup") dbStatus = "ready_for_pickup";
    else if (nextStatus === "Picked Up") dbStatus = "picked_up";
    else if (nextStatus === "Completed") dbStatus = "delivered";

    // 1. Instantly update React context state
    setOrders((prevOrders) => {
      const baseList = prevOrders && prevOrders.length > 0 ? prevOrders : defaultDemoOrders;
      return baseList.map((ord) =>
        ord.id === orderId ? { ...ord, status: nextStatus } : ord
      );
    });

    // 2. If it's a valid Supabase UUID, sync with backend database
    if (isUuid(orderId)) {
      try {
        const updates = { status: dbStatus };
        if (dbStatus === "delivered") {
          updates.completed_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from("orders")
          .update(updates)
          .eq("id", orderId);

        if (!error) {
          fetchOrders();
          fetchDonations();
        } else {
          console.warn("Supabase update status notice:", error.message);
        }
      } catch (err) {
        console.warn("Supabase sync notice:", err);
      }
    }

    showToast(`Order status updated to ${nextStatus}.`);
  };

  const sendChatMessage = async (orderOrDonationId, senderRoleOrId, senderName, text) => {
    if (!text || !text.trim()) return;

    const trimmedText = text.trim();
    const isReceiver = String(senderRoleOrId).toLowerCase().includes("receiver");
    const role = isReceiver ? "receiver" : "donor";
    const resolvedName = senderName || (role === "receiver" ? "City Hope Kitchen" : "Fresh Bites Catering");

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      donationId: String(orderOrDonationId),
      orderId: String(orderOrDonationId),
      senderId: role,
      senderRole: role,
      senderName: resolvedName,
      text: trimmedText,
      message: trimmedText,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // 1. Immediately update React state for zero-latency local experience
    setMessages((prev) => {
      const updated = [...(prev || []), newMsg];
      try {
        localStorage.setItem("mealbridge_chat_messages", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 2. Broadcast to all open tabs immediately (real-time cross-tab sync)
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        const bc = new BroadcastChannel("mealbridge_realtime_chat");
        bc.postMessage({ type: "NEW_MESSAGE", message: newMsg });
        setTimeout(() => bc.close(), 100);
      }
    } catch (e) {}

    // 3. Database sync if signed in and valid UUID
    if (user) {
      try {
        if (isUuid(orderOrDonationId)) {
          const { data: orderData } = await supabase
            .from("orders")
            .select("id, receiver_id, food_donations(donor_id)")
            .eq("id", orderOrDonationId)
            .maybeSingle();

          let targetOrderId = orderOrDonationId;
          let targetReceiverId = null;

          if (orderData) {
            targetReceiverId = user.id === orderData.receiver_id ? orderData.food_donations?.donor_id : orderData.receiver_id;
          }

          await supabase.from("messages").insert({
            order_id: targetOrderId,
            sender_id: user.id,
            receiver_id: targetReceiverId,
            sender_name: resolvedName,
            message: trimmedText,
          });
        }
      } catch (err) {
        console.warn("Supabase message sync notice:", err);
      }
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n))
    );
    if (!user) return;
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (!user) return;
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id);
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const clearNotifications = async (role) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id);
      
      if (!error) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
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
        clearNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </MealBridgeContext.Provider>
  );
}
