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
  const [messages, setMessages] = useState([]);
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
          donorName: d.donor?.full_name || "Food Donor"
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
          servings: foodData.quantity,
          prepared_at: foodData.cookingTime || new Date().toISOString(),
          expiry_time: foodData.expiryTime || new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
          pickup_address: foodData.pickupAddress,
          gps_location: foodData.gpsLocation,
          need_transportation: foodData.needTransportation,
          special_instructions: foodData.specialInstructions,
          image_url: foodData.imageUrl,
          status: 'available'
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
          prepared_at: updatedData.cookingTime,
          expiry_time: updatedData.expiryTime,
          pickup_address: updatedData.pickupAddress,
          gps_location: updatedData.gpsLocation,
          need_transportation: updatedData.needTransportation,
          special_instructions: updatedData.specialInstructions
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
    if (!user) return;
    try {
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (orgError || !orgData) {
        showToast("Please register your organization before requesting food.", "warning");
        return;
      }

      const requestedAmount = Number(expectedPeople);

      const { error } = await supabase
        .from("orders")
        .insert({
          donation_id: donationId,
          receiver_id: user.id,
          organization_id: orgData.id,
          requested_quantity: requestedAmount,
          receiver_message: receiverMessage || "",
          status: 'pending'
        });

      if (error) {
        showToast("Error creating request: " + error.message, "error");
      } else {
        showToast("Your request was submitted to the donor!");
        fetchDonations();
        fetchOrders();
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const acceptOrder = async (orderId, prepTime) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: 'accepted',
          prep_time: prepTime,
          accepted_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) {
        showToast("Error accepting order: " + error.message, "error");
      } else {
        showToast(`Order accepted. Expected pickup in ${prepTime}.`);
        fetchOrders();
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const declineOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: 'rejected'
        })
        .eq("id", orderId);

      if (error) {
        showToast("Error declining order: " + error.message, "error");
      } else {
        showToast("Order declined.", "warning");
        fetchOrders();
        fetchDonations();
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      let dbStatus = 'accepted';
      if (nextStatus === "Preparing") dbStatus = 'accepted';
      else if (nextStatus === "Ready for Pickup") dbStatus = 'ready_for_pickup';
      else if (nextStatus === "Picked Up") dbStatus = 'picked_up';
      else if (nextStatus === "Completed") dbStatus = 'delivered';

      const updates = { status: dbStatus };
      if (dbStatus === 'delivered') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (error) {
        showToast("Error updating order status: " + error.message, "error");
      } else {
        showToast(`Order status updated to ${nextStatus}.`);
        fetchOrders();
        fetchDonations();
      }
    } catch (err) {
      showToast("Error connecting to server.", "error");
    }
  };

  const sendChatMessage = async (orderId, senderId, senderName, text) => {
    if (!user) return;
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("id, receiver_id, food_donations(donor_id)")
        .eq("id", orderId)
        .single();
        
      let targetOrderId = orderId;
      let targetReceiverId = null;

      if (orderError || !orderData) {
        // Fallback search by donation_id if orderId was passed as donationId
        const { data: ordByDonation } = await supabase
          .from("orders")
          .select("id, receiver_id, food_donations(donor_id)")
          .eq("donation_id", orderId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (ordByDonation && ordByDonation.length > 0) {
          targetOrderId = ordByDonation[0].id;
          targetReceiverId = user.id === ordByDonation[0].receiver_id ? ordByDonation[0].food_donations.donor_id : ordByDonation[0].receiver_id;
        } else {
          console.error("Could not find matching order for chat");
          return;
        }
      } else {
        targetReceiverId = user.id === orderData.receiver_id ? orderData.food_donations.donor_id : orderData.receiver_id;
      }

      await supabase
        .from("messages")
        .insert({
          order_id: targetOrderId,
          sender_id: user.id,
          receiver_id: targetReceiverId,
          sender_name: senderName,
          message: text
        });

    } catch (err) {
      console.error("Error sending message:", err);
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
      }}
    >
      {children}
    </MealBridgeContext.Provider>
  );
}
