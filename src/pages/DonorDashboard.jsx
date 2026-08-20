import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";

/* =========================================================
   MEALBRIDGE — PROFESSIONAL DONOR COMMAND CENTER
   ---------------------------------------------------------
   Includes:
   ✓ DashboardLayout / Sidebar
   ✓ Clerk user
   ✓ MealBridgeContext
   ✓ Donation images
   ✓ Register food
   ✓ Edit food
   ✓ Delete food
   ✓ Food details
   ✓ Incoming requests
   ✓ Accept / decline request
   ✓ Preparation workflow
   ✓ Order details
   ✓ Impact Summary
   ✓ Community performance metrics
   ✓ Session role protection
   ✓ Session open-order support
   ========================================================= */

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1400&auto=format&fit=crop&q=90"; 
 
const COLORS = { 
  green: "#08A979", 
  greenDark: "#067A62", 
  teal: "#10B9A4", 
  navy: "#102A43", 
  text: "#17324A", 
  muted: "#71869A", 
  soft: "#F5F8F8", 
  border: "#E3ECEA", 
  white: "#FFFFFF", 
  danger: "#D9534F", 
  warning: "#C17A00", 
  blue: "#1683BD", 
}; 
 
/* ========================================================= 
   ANIMATED NUMBER 
   ========================================================= */ 
 
function AnimatedNumber({ value }) { 
  const [displayValue, setDisplayValue] = useState( 
    typeof value === "number" ? 0 : value 
  ); 
 
  useEffect(() => { 
    const numeric = Number(value); 
 
    if (!Number.isFinite(numeric)) { 
      setDisplayValue(value); 
      return; 
    } 
 
    if (numeric === 0) { 
      setDisplayValue(0); 
      return; 
    } 
 
    let start = 0; 
    const duration = 650; 
    const steps = duration / 16; 
    const increment = numeric / steps; 
 
    const timer = setInterval(() => { 
      start += increment; 
 
      if (start >= numeric) { 
        clearInterval(timer); 
        setDisplayValue(numeric); 
      } else { 
        setDisplayValue(Math.floor(start)); 
      } 
    }, 16); 
 
    return () => clearInterval(timer); 
  }, [value]); 
 
  return <span>{displayValue}</span>; 
} 
 
/* ========================================================= 
   STATUS BADGE 
   ========================================================= */ 
 
function StatusBadge({ status }) { 
  const styles = { 
    Pending: { 
      background: "#FFF7E8", 
      color: "#B77900", 
      dot: "#F59E0B", 
    }, 
    Accepted: { 
      background: "#EEF8FF", 
      color: "#1683BD", 
      dot: "#38A3DB", 
    }, 
    Preparing: { 
      background: "#FFF6E5", 
      color: "#B77900", 
      dot: "#F59E0B", 
    }, 
    "Ready for Pickup": { 
      background: "#EAF9F4", 
      color: "#058E72", 
      dot: "#10B981", 
    }, 
    "Picked Up": { 
      background: "#EEF8FF", 
      color: "#1683BD", 
      dot: "#1683BD", 
    }, 
    Completed: { 
      background: "#EAF9F4", 
      color: "#058E72", 
      dot: "#10B981", 
    }, 
    Declined: { 
      background: "#FFF0F0", 
      color: "#C95353", 
      dot: "#EF6B6B", 
    }, 
    Available: { 
      background: "#EAF9F4", 
      color: "#058E72", 
      dot: "#10B981", 
    }, 
  }; 
 
  const current = styles[status] || styles.Available; 
 
  return ( 
    <span 
      style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: 6, 
        padding: "6px 10px", 
        borderRadius: 999, 
        background: current.background, 
        color: current.color, 
        fontSize: 10, 
        fontWeight: 850, 
        whiteSpace: "nowrap", 
      }} 
    > 
      <span 
        style={{ 
          width: 6, 
          height: 6, 
          borderRadius: "50%", 
          background: current.dot, 
        }} 
      /> 
      {status} 
    </span> 
  ); 
} 
 
/* ========================================================= 
   SECTION HEADER 
   ========================================================= */ 
 
function SectionHeader({ 
  eyebrow, 
  title, 
  description, 
  action, 
}) { 
  return ( 
    <div 
      style={{ 
        display: "flex", 
        alignItems: "flex-end", 
        justifyContent: "space-between", 
        gap: 18, 
        marginBottom: 16, 
      }} 
    > 
      <div> 
        <div 
          style={{ 
            color: COLORS.green, 
            fontSize: 9, 
            fontWeight: 900, 
            letterSpacing: ".15em", 
            textTransform: "uppercase", 
            marginBottom: 5, 
          }} 
        > 
          {eyebrow} 
        </div> 
 
        <h2 
          style={{ 
            margin: 0, 
            color: COLORS.navy, 
            fontSize: "clamp(1.35rem, 2vw, 1.7rem)", 
            lineHeight: 1.15, 
            letterSpacing: "-.04em", 
            fontWeight: 900, 
          }} 
        > 
          {title} 
        </h2> 
 
        {description && ( 
          <p 
            style={{ 
              margin: "6px 0 0", 
              color: COLORS.muted, 
              fontSize: 12, 
              lineHeight: 1.6, 
            }} 
          > 
            {description} 
          </p> 
        )} 
      </div> 
 
      {action} 
    </div> 
  ); 
} 
 
/* ========================================================= 
   MODAL 
   ========================================================= */ 
 
function ModalShell({ 
  children, 
  onClose, 
  maxWidth = 600, 
  zIndex = 3000, 
}) { 
  return ( 
    <div 
      onClick={onClose} 
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex, 
        display: "grid", 
        placeItems: "center", 
        padding: 18, 
        background: "rgba(5,30,29,.55)", 
        backdropFilter: "blur(10px)", 
      }} 
    > 
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: "100%", 
          maxWidth, 
          maxHeight: "92vh", 
          overflowY: "auto", 
          background: COLORS.white, 
          borderRadius: 22, 
          boxShadow: "0 30px 90px rgba(0,0,0,.25)", 
          border: "1px solid rgba(255,255,255,.5)", 
        }} 
      > 
        {children} 
      </div> 
    </div> 
  ); 
} 
 
function ModalHeader({ eyebrow, title, onClose }) { 
  return ( 
    <div 
      style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 5, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        gap: 15, 
        padding: "18px 22px", 
        background: "rgba(255,255,255,.97)", 
        backdropFilter: "blur(12px)", 
        borderBottom: "1px solid #EDF2F4", 
      }} 
    > 
      <div> 
        {eyebrow && ( 
          <div 
            style={{ 
              color: COLORS.green, 
              fontSize: 9, 
              fontWeight: 900, 
              letterSpacing: ".15em", 
              textTransform: "uppercase", 
              marginBottom: 3, 
            }} 
          > 
            {eyebrow} 
          </div> 
        )} 
 
        <h2 
          style={{ 
            margin: 0, 
            color: COLORS.navy, 
            fontSize: "1.15rem", 
            fontWeight: 900, 
            letterSpacing: "-.03em", 
          }} 
        > 
          {title} 
        </h2> 
      </div> 
 
      <button 
        onClick={onClose} 
        style={closeButtonStyle} 
        aria-label="Close" 
      > 
        × 
      </button> 
    </div> 
  ); 
} 
 
/* ========================================================= 
   MAIN DASHBOARD 
   ========================================================= */ 
 
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
    updateOrderStatus, 
  } = useContext(MealBridgeContext); 
 
  /* ========================================================= 
     MODALS 
     ========================================================= */ 
 
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); 
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); 
  const [isAcceptOpen, setIsAcceptOpen] = useState(false); 
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = 
    useState(false); 
  const [isDeclineConfirmOpen, setIsDeclineConfirmOpen] = 
    useState(false); 
 
  /* ========================================================= 
     SELECTED DATA 
     ========================================================= */ 
 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [selectedOrderId, setSelectedOrderId] = useState(null); 
  const [orderIdToDecline, setOrderIdToDecline] = useState(null); 
 
  /* ========================================================= 
     FORM STATE 
     ========================================================= */ 
 
  const [foodName, setFoodName] = useState(""); 
  const [category, setCategory] = useState("Cooked Meals"); 
  const [vegNonVeg, setVegNonVeg] = useState("Veg"); 
  const [quantity, setQuantity] = useState(10); 
  const [cookingTime, setCookingTime] = useState(""); 
  const [expiryTime, setExpiryTime] = useState(""); 
  const [pickupAddress, setPickupAddress] = useState(""); 
  const [gpsLocation, setGpsLocation] = useState( 
    "28.6139° N, 77.2090° E" 
  ); 
  const [needTransportation, setNeedTransportation] = 
    useState("No"); 
  const [description, setDescription] = useState(""); 
  const [specialInstructions, setSpecialInstructions] = 
    useState(""); 
  const [imageFile, setImageFile] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

 
  const [prepTime, setPrepTime] = useState("30 Minutes"); 
  const [customPrepTime, setCustomPrepTime] = useState("");

  /* =========================================================
     CHAT / PARTNER MESSAGING
     ========================================================= */

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState({});

 
  /* ========================================================= 
     DATA 
     ========================================================= */ 
 
  // Use real context data whenever available. If the context is empty
  // during the initial load/refresh, keep the donor dashboard populated
  // with demo data instead of showing empty 0-state metrics.
  const demoDonations = [
    {
      id: "demo-donation-1",
      name: "Fresh Veg Meal Boxes",
      category: "Cooked Meals",
      vegNonVeg: "Veg",
      quantity: 25,
      cookingTime: "12:30 PM",
      expiryTime: "6:00 PM",
      imageUrl: HERO_IMAGE,
      pickupAddress: "Community Kitchen, New Delhi",
      gpsLocation: "28.6139° N, 77.2090° E",
      needTransportation: "No",
      description: "Fresh surplus meal boxes ready for community rescue.",
      specialInstructions: "Please collect before expiry.",
      donorName: user?.fullName || "Vidhi Mittal",
      status: "Available",
    },
  ];

  const demoOrders = [
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

  const myDonations =
    Array.isArray(donations) && donations.length > 0
      ? donations
      : demoDonations;

  const allOrders =
    Array.isArray(orders) && orders.length > 0
      ? orders
      : demoOrders;

  const chatPartners = useMemo(() => {
    const seen = new Set();

    return allOrders.reduce((list, order) => {
      const name =
        order.ngoName ||
        order.receiverName ||
        "City Hope Kitchen";
      const key = String(order.id || name);

      if (seen.has(key)) return list;
      seen.add(key);

      list.push({
        id: key,
        name,
        food:
          order.foodRequested ||
          order.foodName ||
          "Food donation",
        order,
      });

      return list;
    }, []);
  }, [allOrders]);

  const activeChatPartner = useMemo(() => {
    if (chatPartners.length === 0) {
      return {
        id: "city-hope-kitchen",
        name: "City Hope Kitchen",
        food: "chapati",
        order: null,
      };
    }

    return (
      chatPartners.find(
        (partner) => partner.id === selectedChatId
      ) || chatPartners[0]
    );
  }, [chatPartners, selectedChatId]);

  useEffect(() => {
    if (chatPartners.length && !selectedChatId) {
      setSelectedChatId(chatPartners[0].id);
    }
  }, [chatPartners, selectedChatId]);

  useEffect(() => {
    if (
      !activeChatPartner ||
      chatMessages[activeChatPartner.id]
    ) {
      return;
    }

    const order = activeChatPartner.order;
    const initial = [
      {
        id: `${activeChatPartner.id}-received-1`,
        sender: "partner",
        text:
          order?.receiverMessage ||
          "Received! Let me check the details and get back to you shortly.",
        time: order?.orderTime
          ? new Date(order.orderTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "19:33",
      },
    ];

    setChatMessages((prev) => ({
      ...prev,
      [activeChatPartner.id]: initial,
    }));
  }, [activeChatPartner, chatMessages]);

  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text || !activeChatPartner) return;

    const message = {
      id: `${Date.now()}-user`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChatPartner.id]: [
        ...(prev[activeChatPartner.id] || []),
        message,
      ],
    }));

    setChatInput("");
  };
 
 
  const incomingRequests = useMemo( 
    () => 
      allOrders.filter( 
        (order) => order.status === "Pending" 
      ), 
    [allOrders] 
  ); 
 
  const activeOrders = useMemo( 
    () => 
      allOrders.filter( 
        (order) => 
          order.status !== "Pending" && 
          order.status !== "Declined" 
      ), 
    [allOrders] 
  ); 
 
  const completedOrders = useMemo( 
    () => 
      allOrders.filter( 
        (order) => order.status === "Completed" 
      ), 
    [allOrders] 
  ); 
 
  const rescuedMeals = useMemo( 
    () => 
      completedOrders.reduce( 
        (sum, order) => 
          sum + 
          Number( 
            order.quantity || 
              order.expectedPeople || 
              0 
          ), 
        0 
      ), 
    [completedOrders] 
  ); 
 
  /* ========================================================= 
     IMPACT / SUMMARY METRICS 
     ========================================================= */ 
 
  const totalRequests = allOrders.length; 
 
  const acceptedRequests = useMemo( 
    () => 
      allOrders.filter( 
        (order) => 
          order.status !== "Pending" && 
          order.status !== "Declined" 
      ).length, 
    [allOrders] 
  ); 
 
  const declinedRequests = useMemo( 
    () => 
      allOrders.filter( 
        (order) => order.status === "Declined" 
      ).length, 
    [allOrders] 
  ); 
 
  const activeMeals = useMemo( 
    () => 
      myDonations.reduce( 
        (sum, item) => 
          sum + Number(item.quantity || 0), 
        0 
      ), 
    [myDonations] 
  ); 
 
  const completionRate = 
    acceptedRequests > 0 
      ? Math.round( 
          (completedOrders.length / acceptedRequests) * 100 
        ) 
      : 0; 
 
  const acceptanceRate = 
    totalRequests > 0 
      ? Math.round( 
          (acceptedRequests / totalRequests) * 100 
        ) 
      : 0; 
 
  const impactLevel = 
    completionRate >= 80 
      ? "Excellent" 
      : completionRate >= 50 
      ? "Growing" 
      : totalRequests > 0 
      ? "Building" 
      : "Getting Started"; 
 
  const impactScore = Math.min( 
    100, 
    Math.round( 
      completionRate * 0.55 + 
        acceptanceRate * 0.25 + 
        Math.min(activeMeals, 100) * 0.2 
    ) 
  ); 
 
  /* ========================================================= 
     SESSION / ROLE PROTECTION 
     ========================================================= */ 
 
  useEffect(() => { 
    const openOrderId = sessionStorage.getItem( 
      "mealbridge-open-order" 
    ); 
 
    if (openOrderId) { 
      const ord = allOrders.find( 
        (order) => order.id === openOrderId 
      ); 
 
      if (ord) { 
        setSelectedOrder(ord); 
        setIsOrderDetailsOpen(true); 
      } 
 
      sessionStorage.removeItem( 
        "mealbridge-open-order" 
      ); 
    } 
  }, [allOrders]); 
 
  useEffect(() => { 
    const role = sessionStorage.getItem( 
      "mealbridge-role" 
    ); 
 
    if (role === "receiver") { 
      showToast( 
        "You are signed in as a Receiver. Please switch accounts to access the Donor Portal.", 
        "warning" 
      ); 
 
      navigate("/receiver-dashboard"); 
    } 
 
    if (role === "delivery") { 
      navigate("/delivery-dashboard"); 
    } 
  }, [navigate, showToast]); 
 
  /* ========================================================= 
     FORM HELPERS 
     ========================================================= */ 
 
  const resetForm = () => { 
    setFoodName(""); 
    setCategory("Cooked Meals"); 
    setVegNonVeg("Veg"); 
    setQuantity(10); 
    setCookingTime(""); 
    setExpiryTime(""); 
    setPickupAddress(""); 
    setGpsLocation("28.6139° N, 77.2090° E"); 
    setNeedTransportation("No"); 
    setDescription(""); 
    setSpecialInstructions(""); 
    setImageFile(null);
    setAiResult(null);
    setIsAiLoading(false);
  }; 
 
  const handleRegisterSubmit = async (e) => { 
    e.preventDefault(); 

    if (aiResult) {
      // If AI result is already present, this is the second click: Confirm & Register
      await handleConfirmRegister();
      return;
    }

    if (!imageFile) {
      showToast("Please upload an image for AI assessment.", "error");
      return;
    }

    setIsAiLoading(true);

    try {
      // 1. Run AI Assessment
      const formData = new FormData();
      formData.append("file", imageFile);

      const aiResponse = await fetch("http://127.0.0.1:8000/predict-freshness", {
        method: "POST",
        body: formData,
      });

      if (!aiResponse.ok) {
        throw new Error("AI assessment failed.");
      }

      const aiData = await aiResponse.json();
      
      if (aiData.error) {
        throw new Error(aiData.error);
      }
      
      setAiResult(aiData);
      setIsAiLoading(false);
      showToast("AI Assessment complete! Please review and confirm.", "success");
    } catch (err) {
      setIsAiLoading(false);
      showToast(err.message, "error");
    }
  }; 

  const handleConfirmRegister = async () => {
    setIsAiLoading(true);
    let finalImageUrl = HERO_IMAGE;

    try {
      // 2. Upload Image to Supabase
      const { supabase } = await import('../supabase.js');
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("food-images")
        .upload(filePath, imageFile);

      if (!uploadError) {
        const { data: publicData } = supabase.storage
          .from("food-images")
          .getPublicUrl(filePath);
        if (publicData) {
          finalImageUrl = publicData.publicUrl;
        }
      }

      // 3. Register Food
      await registerFood({ 
        name: foodName, 
        category, 
        vegNonVeg, 
        quantity: Number(quantity), 
        cookingTime, 
        expiryTime, 
        imageUrl: finalImageUrl, 
        pickupAddress, 
        gpsLocation, 
        needTransportation, 
        description, 
        specialInstructions, 
        donorName: 
          user?.fullName || "Fresh Bites Catering",
        freshnessLabel: aiResult.freshness_label,
        freshnessScore: aiResult.freshness_score,
        aiModelVersion: aiResult.model_version
      }); 
 
      setIsAiLoading(false);
      resetForm(); 
      setIsRegisterOpen(false); 
      
      showToast( 
        "Food donation registered successfully.", 
        "success" 
      ); 
    } catch (err) {
      setIsAiLoading(false);
      showToast("Registration failed: " + err.message, "error");
    }
  };
 
  const handleEditSubmit = (e) => { 
    e.preventDefault(); 
 
    if (!selectedItem) return; 
 
    updateFood(selectedItem.id, { 
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
    }); 
 
    setIsEditOpen(false); 
    setSelectedItem(null); 
 
    showToast( 
      "Donation updated successfully.", 
      "success" 
    ); 
  }; 
 
  const openEditModal = (item) => { 
    setSelectedItem(item); 
 
    setFoodName(item.name || ""); 
    setCategory(item.category || "Cooked Meals"); 
    setVegNonVeg(item.vegNonVeg || "Veg"); 
    setQuantity(item.quantity || 1); 
    setCookingTime(item.cookingTime || ""); 
    setExpiryTime(item.expiryTime || ""); 
    setPickupAddress(item.pickupAddress || ""); 
    setGpsLocation( 
      item.gpsLocation || "28.6139° N, 77.2090° E" 
    ); 
    setNeedTransportation( 
      item.needTransportation || "No" 
    ); 
    setDescription(item.description || ""); 
    setSpecialInstructions( 
      item.specialInstructions || "" 
    ); 
 
    setIsEditOpen(true); 
  }; 
 
  const openDetailsModal = (item) => { 
    setSelectedItem(item); 
    setIsDetailsOpen(true); 
  }; 
 
  /* ========================================================= 
     ORDER ACTIONS 
     ========================================================= */ 
 
  const openAcceptModal = (orderId) => { 
    setSelectedOrderId(orderId); 
    setPrepTime("30 Minutes"); 
    setCustomPrepTime(""); 
    setIsAcceptOpen(true); 
  }; 
 
  const handleConfirmAccept = () => { 
    const timeToSubmit = 
      prepTime === "Custom" 
        ? customPrepTime 
        : prepTime; 
 
    if (!timeToSubmit) { 
      showToast( 
        "Please enter a preparation time.", 
        "warning" 
      ); 
      return; 
    } 
 
    acceptOrder( 
      selectedOrderId, 
      timeToSubmit 
    ); 
 
    setIsAcceptOpen(false); 
    setSelectedOrderId(null); 
 
    showToast( 
      "Request accepted successfully.", 
      "success" 
    ); 
  }; 
 
  const triggerDecline = (orderId) => { 
    setOrderIdToDecline(orderId); 
    setIsDeclineConfirmOpen(true); 
  }; 
 
  const handleConfirmDecline = () => { 
    declineOrder(orderIdToDecline); 
 
    setIsDeclineConfirmOpen(false); 
    setOrderIdToDecline(null); 
 
    showToast( 
      "Request declined.", 
      "warning" 
    ); 
  }; 
 
  const scrollTo = (id) => { 
    document 
      .getElementById(id) 
      ?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start", 
      }); 
  }; 
 
  /* ========================================================= 
     STYLES 
     ========================================================= */ 
 
  const cardStyle = { 
    background: "#FFFFFF", 
    border: `1px solid ${COLORS.border}`, 
    borderRadius: 18, 
    boxShadow: 
      "0 8px 28px rgba(16,72,64,.045)", 
  }; 
 
  const primaryButton = { 
    ...buttonBase, 
    padding: "11px 16px", 
    borderRadius: 11, 
    color: "#FFFFFF", 
    background: 
      "linear-gradient(135deg,#08A979,#10B9A4)", 
    boxShadow: 
      "0 8px 20px rgba(8,169,121,.15)", 
  }; 
 
  return ( 
    <DashboardLayout> 
      <div 
        className="professional-donor-dashboard" 
        style={{ 
          width: "100%", 
          maxWidth: 1500, 
          margin: "0 auto", 
          padding: "72px 0 60px", 
          color: COLORS.text, 
          fontFamily: 
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
        }} 
      > 
        {/* ===================================================== 
            TOAST 
            ===================================================== */} 
 
        {toast && ( 
          <div 
            style={{ 
              position: "fixed", 
              top: 88, 
              right: 24, 
              zIndex: 6000, 
              display: "flex", 
              alignItems: "center", 
              gap: 10, 
              maxWidth: 380, 
              padding: "12px 16px", 
              borderRadius: 13, 
              background: "#FFFFFF", 
              border: "1px solid #DCEBE7", 
              boxShadow: 
                "0 18px 50px rgba(0,0,0,.14)", 
              color: COLORS.text, 
              fontSize: 12, 
              fontWeight: 750, 
            }} 
          > 
            <span 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: "50%", 
                background: COLORS.green, 
                boxShadow: 
                  "0 0 0 5px rgba(8,169,121,.10)", 
              }} 
            /> 
 
            {toast.message} 
          </div> 
        )} 
 
        {/* ===================================================== 
            DASHBOARD HEADER 
            ===================================================== */} 
 
        <div 
          className="dashboard-top-header" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: 20, 
            marginBottom: 16, 
          }} 
        > 
          <div> 
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 7, 
                marginBottom: 5, 
              }} 
            > 
              <span 
                style={{ 
                  width: 7, 
                  height: 7, 
                  borderRadius: "50%", 
                  background: "#10B981", 
                  boxShadow: 
                    "0 0 0 5px rgba(16,185,129,.09)", 
                }} 
              /> 
 
              <span 
                style={{ 
                  color: COLORS.greenDark, 
                  fontSize: 9, 
                  fontWeight: 900, 
                  letterSpacing: ".13em", 
                  textTransform: "uppercase", 
                }} 
              > 
                Donor Command Center 
              </span> 
            </div> 
 
            <h1 
              style={{ 
                margin: 0, 
                fontSize: 
                  "clamp(1.45rem, 2.7vw, 2rem)", 
                letterSpacing: "-.055em", 
                lineHeight: 1.08, 
                color: COLORS.navy, 
                fontWeight: 900, 
              }} 
            > 
              Good to see you,{" "} 
              <span 
                style={{ 
                  color: COLORS.green, 
                }} 
              > 
                {user?.firstName || "Donor"} 
              </span> 
            </h1> 
 
            <p 
              style={{ 
                margin: "5px 0 0", 
                color: COLORS.muted, 
                fontSize: 11, 
              }} 
            > 
              Manage donations, requests and 
              community handovers from one place. 
            </p> 
          </div> 
 
          <button 
            onClick={() => { 
              resetForm(); 
              setIsRegisterOpen(true); 
            }} 
            style={{ 
              ...primaryButton, 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              whiteSpace: "nowrap", 
            }} 
          > 
            <span style={{ fontSize: 16 }}>+</span> 
            Register Donation 
          </button> 
        </div> 
 
        {/* ===================================================== 
            HERO / OVERVIEW BANNER 
            ===================================================== */} 
 
        <section 
          className="donor-hero-section" 
          style={{ 
            ...cardStyle, 
            minHeight: 205, 
            overflow: "hidden", 
            display: "grid", 
            gridTemplateColumns: 
              "minmax(0,1.35fr) minmax(280px,.65fr)", 
            marginBottom: 18, 
          }} 
        > 
          <div 
            style={{ 
              padding: "27px 30px", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center", 
              background: 
                "linear-gradient(135deg,#F4FBF9,#FFFFFF)", 
            }} 
          > 
            <div 
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 7, 
                width: "fit-content", 
                padding: "6px 10px", 
                borderRadius: 999, 
                background: "#EAF9F4", 
                color: COLORS.greenDark, 
                fontSize: 8, 
                fontWeight: 900, 
                letterSpacing: ".12em", 
                textTransform: "uppercase", 
              }} 
            > 
              <span>●</span> 
              Live Donation Network 
            </div> 
 
            <h2 
              style={{ 
                margin: "12px 0 7px", 
                maxWidth: 580, 
                color: COLORS.navy, 
                fontSize: 
                  "clamp(1.65rem, 3vw, 2.45rem)", 
                lineHeight: 1.04, 
                letterSpacing: "-.06em", 
                fontWeight: 900, 
              }} 
            > 
              Your surplus is ready 
              to make a difference. 
            </h2> 
 
            <p 
              style={{ 
                maxWidth: 570, 
                margin: 0, 
                color: COLORS.muted, 
                fontSize: 12, 
                lineHeight: 1.65, 
              }} 
            > 
              Keep your listings accurate, 
              respond quickly to NGO requests, 
              and move every accepted donation 
              through the handover workflow. 
            </p> 
 
            <div 
              style={{ 
                display: "flex", 
                gap: 8, 
                flexWrap: "wrap", 
                marginTop: 15, 
              }} 
            > 
              <button 
                onClick={() => { 
                  resetForm(); 
                  setIsRegisterOpen(true); 
                }} 
                style={{ 
                  ...primaryButton, 
                  borderRadius: 10, 
                  fontSize: 11, 
                }} 
              > 
                + Add Food 
              </button> 
 
              <button 
                onClick={() => 
                  scrollTo("incoming-requests") 
                } 
                style={{ 
                  ...secondaryButton, 
                  fontSize: 11, 
                }} 
              > 
                Review Requests → 
              </button> 
            </div> 
          </div> 
 
          <div 
            style={{ 
              position: "relative", 
              minHeight: 205, 
            }} 
          > 
            <img 
              src={HERO_IMAGE} 
              alt="Fresh food ready for donation" 
              style={{ 
                width: "100%", 
                height: "100%", 
                minHeight: 205, 
                display: "block", 
                objectFit: "cover", 
              }} 
            /> 
 
            <div 
              style={{ 
                position: "absolute", 
                inset: 0, 
                background: 
                  "linear-gradient(90deg,rgba(255,255,255,.08),transparent 45%),linear-gradient(0deg,rgba(4,34,30,.35),transparent 65%)", 
              }} 
            /> 
 
            <div 
              style={{ 
                position: "absolute", 
                left: 17, 
                bottom: 16, 
                padding: "10px 12px", 
                borderRadius: 12, 
                background: 
                  "rgba(255,255,255,.94)", 
                backdropFilter: "blur(10px)", 
                boxShadow: 
                  "0 10px 25px rgba(0,0,0,.12)", 
              }} 
            > 
              <div 
                style={{ 
                  color: COLORS.green, 
                  fontSize: 8, 
                  fontWeight: 900, 
                  letterSpacing: ".1em", 
                  textTransform: "uppercase", 
                }} 
              > 
                Donor mission 
              </div> 
 
              <strong 
                style={{ 
                  display: "block", 
                  marginTop: 3, 
                  color: COLORS.navy, 
                  fontSize: 11, 
                }} 
              > 
                Rescue food. Reduce waste. 
              </strong> 
            </div> 
          </div> 
        </section> 
 
        {/* ===================================================== 
            KPI CARDS 
            ===================================================== */} 
 
        <div 
          className="donor-kpi-grid" 
          style={{ 
            display: "grid", 
            gridTemplateColumns: 
              "repeat(4,minmax(0,1fr))", 
            gap: 11, 
            marginBottom: 20, 
          }} 
        > 
          {[ 
            { 
              icon: "📦", 
              label: "Active Listings", 
              value: myDonations.length, 
              detail: "Currently available", 
              tone: "green", 
            }, 
            { 
              icon: "📩", 
              label: "Pending Requests", 
              value: incomingRequests.length, 
              detail: "Need your attention", 
              tone: "amber", 
            }, 
            { 
              icon: "🍽️", 
              label: "Meals Rescued", 
              value: rescuedMeals, 
              detail: "Completed handovers", 
              tone: "blue", 
            }, 
            { 
              icon: "🌱", 
              label: "Impact Status", 
              value: impactLevel, 
              detail: "Community contribution", 
              tone: "teal", 
            }, 
          ].map((stat) => { 
            const tone = 
              stat.tone === "amber" 
                ? { 
                    bg: "#FFF7E8", 
                    icon: "#FFF1D4", 
                    color: "#B77900", 
                  } 
                : stat.tone === "blue" 
                ? { 
                    bg: "#EEF8FF", 
                    icon: "#E3F3FC", 
                    color: "#1683BD", 
                  } 
                : stat.tone === "teal" 
                ? { 
                    bg: "#EAF9F7", 
                    icon: "#E0F5F2", 
                    color: "#0F9F93", 
                  } 
                : { 
                    bg: "#EAF9F4", 
                    icon: "#DFF7EF", 
                    color: "#058E72", 
                  }; 
 
            return ( 
              <div 
                key={stat.label} 
                style={{ 
                  ...cardStyle, 
                  padding: 16, 
                  position: "relative", 
                  overflow: "hidden", 
                }} 
              > 
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: 
                      "space-between", 
                  }} 
                > 
                  <div 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      display: "grid", 
                      placeItems: "center", 
                      borderRadius: 12, 
                      background: tone.icon, 
                      fontSize: 18, 
                    }} 
                  > 
                    {stat.icon} 
                  </div> 
 
                  <span 
                    style={{ 
                      padding: "4px 7px", 
                      borderRadius: 999, 
                      background: tone.bg, 
                      color: tone.color, 
                      fontSize: 8, 
                      fontWeight: 900, 
                    }} 
                  > 
                    LIVE 
                  </span> 
                </div> 
 
                <div 
                  style={{ 
                    marginTop: 14, 
                    color: "#8194A6", 
                    fontSize: 10, 
                    fontWeight: 750, 
                  }} 
                > 
                  {stat.label} 
                </div> 
 
                <div 
                  style={{ 
                    marginTop: 3, 
                    color: COLORS.navy, 
                    fontSize: 
                      typeof stat.value === "string" 
                        ? "1.2rem" 
                        : "1.75rem", 
                    lineHeight: 1, 
                    letterSpacing: "-.055em", 
                    fontWeight: 900, 
                  }} 
                > 
                  <AnimatedNumber value={stat.value} /> 
                </div> 
 
                <div 
                  style={{ 
                    marginTop: 5, 
                    color: "#91A0AE", 
                    fontSize: 9, 
                  }} 
                > 
                  {stat.detail} 
                </div> 
              </div> 
            ); 
          })} 
        </div> 
 
        {/* ===================================================== 
            NEW — IMPACT SUMMARY 
            ===================================================== */} 
 
        <section 
          id="impact-summary" 
          className="impact-summary-section" 
          style={{ 
            ...cardStyle, 
            marginBottom: 30, 
            padding: 0, 
            overflow: "hidden", 
            background: 
              "linear-gradient(135deg,#FFFFFF 0%,#F7FCFA 100%)", 
          }} 
        > 
          {/* SUMMARY HEADER */} 
 
          <div 
            style={{ 
              padding: "20px 22px 16px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              gap: 15, 
              borderBottom: "1px solid #EAF1EF", 
            }} 
          > 
            <div> 
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 7, 
                  marginBottom: 5, 
                }} 
              > 
                <span 
                  style={{ 
                    width: 7, 
                    height: 7, 
                    borderRadius: "50%", 
                    background: COLORS.green, 
                    boxShadow: 
                      "0 0 0 5px rgba(8,169,121,.09)", 
                  }} 
                /> 
 
                <span 
                  style={{ 
                    color: COLORS.greenDark, 
                    fontSize: 9, 
                    fontWeight: 900, 
                    letterSpacing: ".14em", 
                    textTransform: "uppercase", 
                  }} 
                > 
                  Donor Performance 
                </span> 
              </div> 
 
              <h2 
                style={{ 
                  margin: 0, 
                  color: COLORS.navy, 
                  fontSize: "1.35rem", 
                  fontWeight: 900, 
                  letterSpacing: "-.045em", 
                }} 
              > 
                Your Impact Summary 
              </h2> 
 
              <p 
                style={{ 
                  margin: "5px 0 0", 
                  color: COLORS.muted, 
                  fontSize: 11, 
                }} 
              > 
                A quick look at your food rescue activity 
                and community contribution. 
              </p> 
            </div> 
 
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 9, 
                padding: "8px 11px", 
                borderRadius: 999, 
                background: "#EAF9F4", 
                color: COLORS.greenDark, 
                fontSize: 9, 
                fontWeight: 900, 
                whiteSpace: "nowrap", 
              }} 
            > 
              <span style={{ fontSize: 12 }}>🌱</span> 
              {impactLevel} 
            </div> 
          </div> 
 
          {/* SUMMARY BODY */} 
 
          <div 
            className="impact-summary-body" 
            style={{ 
              display: "grid", 
              gridTemplateColumns: 
                "minmax(0,1.35fr) minmax(280px,.65fr)", 
            }} 
          > 
            {/* LEFT SIDE */} 
 
            <div 
              style={{ 
                padding: 22, 
              }} 
            > 
              <div 
                className="summary-stat-grid" 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: 
                    "repeat(3,minmax(0,1fr))", 
                  gap: 10, 
                }} 
              > 
                {/* ACCEPTANCE RATE */} 
 
                <div 
                  className="summary-stat-card" 
                  style={{ 
                    padding: 14, 
                    borderRadius: 14, 
                    background: "#F7FAFA", 
                    border: "1px solid #EAF1EF", 
                  }} 
                > 
                  <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      gap: 8, 
                    }} 
                  > 
                    <span 
                      style={{ 
                        width: 34, 
                        height: 34, 
                        display: "grid", 
                        placeItems: "center", 
                        borderRadius: 10, 
                        background: "#EAF9F4", 
                        fontSize: 15, 
                      }} 
                    > 
                      🤝 
                    </span> 
 
                    <span 
                      style={{ 
                        color: COLORS.green, 
                        fontSize: 16, 
                        fontWeight: 900, 
                      }} 
                    > 
                      {acceptanceRate}% 
                    </span> 
                  </div> 
 
                  <div 
                    style={{ 
                      marginTop: 11, 
                      color: COLORS.text, 
                      fontSize: 10, 
                      fontWeight: 900, 
                    }} 
                  > 
                    Request Acceptance 
                  </div> 
 
                  <div 
                    style={{ 
                      marginTop: 3, 
                      color: COLORS.muted, 
                      fontSize: 8, 
                    }} 
                  > 
                    Requests successfully accepted 
                  </div> 
 
                  <div 
                    style={{ 
                      height: 5, 
                      marginTop: 10, 
                      borderRadius: 999, 
                      background: "#E5EFED", 
                      overflow: "hidden", 
                    }} 
                  > 
                    <div 
                      style={{ 
                        width: `${Math.min( 
                          acceptanceRate, 
                          100 
                        )}%`, 
                        height: "100%", 
                        borderRadius: 999, 
                        background: 
                          "linear-gradient(90deg,#08A979,#10B9A4)", 
                        transition: 
                          "width .7s ease", 
                      }} 
                    /> 
                  </div> 
                </div> 
 
                {/* COMPLETION RATE */} 
 
                <div 
                  className="summary-stat-card" 
                  style={{ 
                    padding: 14, 
                    borderRadius: 14, 
                    background: "#F7FAFA", 
                    border: "1px solid #EAF1EF", 
                  }} 
                > 
                  <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      gap: 8, 
                    }} 
                  > 
                    <span 
                      style={{ 
                        width: 34, 
                        height: 34, 
                        display: "grid", 
                        placeItems: "center", 
                        borderRadius: 10, 
                        background: "#EEF8FF", 
                        fontSize: 15, 
                      }} 
                    > 
                      ✓ 
                    </span> 
 
                    <span 
                      style={{ 
                        color: "#1683BD", 
                        fontSize: 16, 
                        fontWeight: 900, 
                      }} 
                    > 
                      {completionRate}% 
                    </span> 
                  </div> 
 
                  <div 
                    style={{ 
                      marginTop: 11, 
                      color: COLORS.text, 
                      fontSize: 10, 
                      fontWeight: 900, 
                    }} 
                  > 
                    Completion Rate 
                  </div> 
 
                  <div 
                    style={{ 
                      marginTop: 3, 
                      color: COLORS.muted, 
                      fontSize: 8, 
                    }} 
                  > 
                    Accepted orders completed 
                  </div> 
 
                  <div 
                    style={{ 
                      height: 5, 
                      marginTop: 10, 
                      borderRadius: 999, 
                      background: "#E5EFED", 
                      overflow: "hidden", 
                    }} 
                  > 
                    <div 
                      style={{ 
                        width: `${Math.min( 
                          completionRate, 
                          100 
                        )}%`, 
                        height: "100%", 
                        borderRadius: 999, 
                        background: 
                          "linear-gradient(90deg,#1683BD,#43B3E5)", 
                        transition: 
                          "width .7s ease", 
                      }} 
                    /> 
                  </div> 
                </div> 
 
                {/* AVAILABLE MEALS */} 
 
                <div 
                  className="summary-stat-card" 
                  style={{ 
                    padding: 14, 
                    borderRadius: 14, 
                    background: "#F7FAFA", 
                    border: "1px solid #EAF1EF", 
                  }} 
                > 
                  <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      gap: 8, 
                    }} 
                  > 
                    <span 
                      style={{ 
                        width: 34, 
                        height: 34, 
                        display: "grid", 
                        placeItems: "center", 
                        borderRadius: 10, 
                        background: "#FFF7E8", 
                        fontSize: 15, 
                      }} 
                    > 
                      🍱 
                    </span> 
 
                    <span 
                      style={{ 
                        color: "#B77900", 
                        fontSize: 16, 
                        fontWeight: 900, 
                      }} 
                    > 
                      <AnimatedNumber value={activeMeals} /> 
                    </span> 
                  </div> 
 
                  <div 
                    style={{ 
                      marginTop: 11, 
                      color: COLORS.text, 
                      fontSize: 10, 
                      fontWeight: 900, 
                    }} 
                  > 
                    Meals Available 
                  </div> 
 
                  <div 
                    style={{ 
                      marginTop: 3, 
                      color: COLORS.muted, 
                      fontSize: 8, 
                    }} 
                  > 
                    Portions currently listed 
                  </div> 
 
                  <div 
                    style={{ 
                      height: 5, 
                      marginTop: 10, 
                      borderRadius: 999, 
                      background: "#F0E8D5", 
                      overflow: "hidden", 
                    }} 
                  > 
                    <div 
                      style={{ 
                        width: 
                          activeMeals > 0 
                            ? "100%" 
                            : "8%", 
                        height: "100%", 
                        borderRadius: 999, 
                        background: 
                          "linear-gradient(90deg,#F59E0B,#F7C65A)", 
                      }} 
                    /> 
                  </div> 
                </div> 
              </div> 
 
              {/* IMPACT MESSAGE */} 
 
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  marginTop: 12, 
                  padding: "12px 14px", 
                  borderRadius: 13, 
                  background: 
                    "linear-gradient(135deg,#EAF9F4,#F5FCFA)", 
                  border: 
                    "1px solid #DCEFEA", 
                }} 
              > 
                <div 
                  style={{ 
                    width: 38, 
                    height: 38, 
                    flexShrink: 0, 
                    display: "grid", 
                    placeItems: "center", 
                    borderRadius: 12, 
                    background: "#FFFFFF", 
                    boxShadow: 
                      "0 5px 15px rgba(8,169,121,.08)", 
                    fontSize: 18, 
                  }} 
                > 
                  🌍 
                </div> 
 
                <div> 
                  <strong 
                    style={{ 
                      display: "block", 
                      color: COLORS.navy, 
                      fontSize: 10, 
                      fontWeight: 900, 
                    }} 
                  > 
                    Every completed handover creates 
                    measurable impact. 
                  </strong> 
 
                  <p 
                    style={{ 
                      margin: "3px 0 0", 
                      color: COLORS.muted, 
                      fontSize: 9, 
                      lineHeight: 1.5, 
                    }} 
                  > 
                    You've helped redirect surplus food 
                    toward people who need it instead of 
                    letting it go to waste. 
                  </p> 
                </div> 
              </div> 
            </div> 
 
            {/* RIGHT SIDE */} 
 
            <div 
              className="impact-score-panel" 
              style={{ 
                padding: 22, 
                borderLeft: "1px solid #EAF1EF", 
                background: 
                  "linear-gradient(180deg,#F5FCFA,#FFFFFF)", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
              }} 
            > 
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  marginBottom: 10, 
                }} 
              > 
                <div> 
                  <div 
                    style={{ 
                      color: COLORS.greenDark, 
                      fontSize: 8, 
                      fontWeight: 900, 
                      letterSpacing: ".12em", 
                      textTransform: "uppercase", 
                    }} 
                  > 
                    Community Score 
                  </div> 
 
                  <h3 
                    style={{ 
                      margin: "4px 0 0", 
                      color: COLORS.navy, 
                      fontSize: 16, 
                      fontWeight: 900, 
                      letterSpacing: "-.035em", 
                    }} 
                  > 
                    {impactLevel} 
                  </h3> 
                </div> 
 
                <div 
                  className="impact-score-circle" 
                  style={{ 
                    width: 62, 
                    height: 62, 
                    borderRadius: "50%", 
                    display: "grid", 
                    placeItems: "center", 
                    background: `conic-gradient( 
                      #08A979 0deg, 
                      #10B9A4 ${ 
                        impactScore * 3.6 
                      }deg, 
                      #E4EFEC ${ 
                        impactScore * 3.6 
                      }deg 
                    )`, 
                    position: "relative", 
                  }} 
                > 
                  <div 
                    style={{ 
                      width: 49, 
                      height: 49, 
                      borderRadius: "50%", 
                      display: "grid", 
                      placeItems: "center", 
                      background: "#FFFFFF", 
                      color: COLORS.greenDark, 
                      fontSize: 13, 
                      fontWeight: 900, 
                    }} 
                  > 
                    {impactScore} 
                  </div> 
                </div> 
              </div> 
 
              <div 
                style={{ 
                  display: "grid", 
                  gap: 7, 
                  marginTop: 8, 
                }} 
              > 
                <SummaryRow 
                  icon="🍽️" 
                  label="Meals rescued" 
                  value={rescuedMeals} 
                /> 
 
                <SummaryRow 
                  icon="🤝" 
                  label="Completed matches" 
                  value={completedOrders.length} 
                /> 
 
                <SummaryRow 
                  icon="📦" 
                  label="Active listings" 
                  value={myDonations.length} 
                /> 
 
                <SummaryRow 
                  icon="⚡" 
                  label="Pending actions" 
                  value={incomingRequests.length} 
                /> 
              </div> 
            </div> 
          </div> 
        </section> 
 
        {/* ===================================================== 
            REQUESTS + QUICK ACTIONS 
            ===================================================== */} 
 
        <div 
          className="requests-actions-grid" 
          style={{ 
            display: "grid", 
            gridTemplateColumns: 
              "minmax(0,1.35fr) minmax(280px,.65fr)", 
            gap: 18, 
            marginBottom: 30, 
          }} 
        > 
          {/* REQUESTS */} 
 
          <section id="incoming-requests"> 
            <SectionHeader 
              eyebrow="Requires Attention" 
              title="Incoming Requests" 
              description="Verified community partners requesting your surplus food." 
              action={ 
                <span 
                  style={{ 
                    padding: "6px 10px", 
                    borderRadius: 999, 
                    background: 
                      incomingRequests.length > 0 
                        ? "#FFF7E8" 
                        : "#EAF9F4", 
                    color: 
                      incomingRequests.length > 0 
                        ? COLORS.warning 
                        : COLORS.greenDark, 
                    fontSize: 9, 
                    fontWeight: 900, 
                  }} 
                > 
                  {incomingRequests.length} Pending 
                </span> 
              } 
            /> 
 
            {incomingRequests.length === 0 ? ( 
              <div 
                style={{ 
                  ...cardStyle, 
                  minHeight: 245, 
                  display: "grid", 
                  placeItems: "center", 
                  padding: 30, 
                  textAlign: "center", 
                }} 
              > 
                <div> 
                  <div 
                    style={{ 
                      width: 54, 
                      height: 54, 
                      margin: "0 auto 12px", 
                      display: "grid", 
                      placeItems: "center", 
                      borderRadius: 16, 
                      background: "#EAF9F4", 
                      color: COLORS.greenDark, 
                      fontSize: 23, 
                      fontWeight: 900, 
                    }} 
                  > 
                    ✓ 
                  </div> 
 
                  <h3 
                    style={{ 
                      margin: 0, 
                      color: COLORS.navy, 
                      fontSize: 15, 
                      fontWeight: 900, 
                    }} 
                  > 
                    All caught up 
                  </h3> 
 
                  <p 
                    style={{ 
                      maxWidth: 390, 
                      margin: "6px auto 0", 
                      color: COLORS.muted, 
                      fontSize: 11, 
                      lineHeight: 1.6, 
                    }} 
                  > 
                    No NGO requests are waiting 
                    for your response right now. 
                  </p> 
                </div> 
              </div> 
            ) : ( 
              <div 
                style={{ 
                  display: "grid", 
                  gap: 11, 
                }} 
              > 
                {incomingRequests.map((order) => ( 
                  <article 
                    key={order.id} 
                    style={{ 
                      ...cardStyle, 
                      padding: 17, 
                      borderLeft: 
                        "3px solid #10B981", 
                    }} 
                  > 
                    <div 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        gap: 12, 
                      }} 
                    > 
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 10, 
                          minWidth: 0, 
                        }} 
                      > 
                        <div 
                          style={{ 
                            width: 40, 
                            height: 40, 
                            flexShrink: 0, 
                            display: "grid", 
                            placeItems: "center", 
                            borderRadius: 12, 
                            background: "#EAF9F4", 
                            fontSize: 17, 
                          }} 
                        > 
                          🏘️ 
                        </div> 
 
                        <div style={{ minWidth: 0 }}> 
                          <h3 
                            style={{ 
                              margin: 0, 
                              color: COLORS.navy, 
                              fontSize: 13, 
                              fontWeight: 900, 
                            }} 
                          > 
                            {order.ngoName || 
                              "Community NGO"} 
                          </h3> 
 
                          <p 
                            style={{ 
                              margin: "3px 0 0", 
                              color: "#91A0AE", 
                              fontSize: 9, 
                            }} 
                          > 
                            Verified community partner 
                          </p> 
                        </div> 
                      </div> 
 
                      <StatusBadge status="Pending" /> 
                    </div> 
 
                    <div 
                      style={{ 
                        display: "grid", 
                        gridTemplateColumns: 
                          "repeat(4,minmax(0,1fr))", 
                        gap: 7, 
                        marginTop: 14, 
                      }} 
                    > 
                      {[ 
                        [ 
                          "Food", 
                          order.foodRequested, 
                        ], 
                        [ 
                          "Quantity", 
                          `${ 
                            order.quantity || 
                            order.expectedPeople || 
                            0 
                          } servings`, 
                        ], 
                        [ 
                          "People", 
                          `${ 
                            order.expectedPeople || 
                            0 
                          }`, 
                        ], 
                        [ 
                          "Contact", 
                          order.contactPerson || 
                            "—", 
                        ], 
                      ].map(([label, value]) => ( 
                        <div 
                          key={label} 
                          style={{ 
                            minWidth: 0, 
                            padding: "9px 10px", 
                            borderRadius: 10, 
                            background: "#F7FAFA", 
                            border: 
                              "1px solid #EEF3F2", 
                          }} 
                        > 
                          <span 
                            style={{ 
                              display: "block", 
                              color: "#91A0AE", 
                              fontSize: 8, 
                              fontWeight: 800, 
                              textTransform: 
                                "uppercase", 
                            }} 
                          > 
                            {label} 
                          </span> 
 
                          <strong 
                            style={{ 
                              display: "block", 
                              marginTop: 4, 
                              color: COLORS.text, 
                              fontSize: 10, 
                              whiteSpace: "nowrap", 
                              overflow: "hidden", 
                              textOverflow: "ellipsis", 
                            }} 
                          > 
                            {value} 
                          </strong> 
                        </div> 
                      ))} 
                    </div> 
 
                    {order.receiverMessage && ( 
                      <div 
                        style={{ 
                          marginTop: 10, 
                          padding: "9px 11px", 
                          borderRadius: 10, 
                          background: "#F1FAF8", 
                          color: "#617A8A", 
                          fontSize: 10, 
                          lineHeight: 1.5, 
                        }} 
                      > 
                        💬 {order.receiverMessage} 
                      </div> 
                    )} 
 
                    <div 
                      style={{ 
                        display: "flex", 
                        gap: 7, 
                        marginTop: 12, 
                        flexWrap: "wrap", 
                      }} 
                    > 
                      <button 
                        onClick={() => { 
                          setSelectedOrder(order); 
                          setIsOrderDetailsOpen(true); 
                        }} 
                        style={{ 
                          ...secondaryButton, 
                          flex: 1, 
                          minWidth: 110, 
                        }} 
                      > 
                        View Details 
                      </button> 
 
                      <button 
                        onClick={() => 
                          openAcceptModal(order.id) 
                        } 
                        style={{ 
                          ...primaryButton, 
                          flex: 1, 
                          minWidth: 110, 
                        }} 
                      > 
                        Accept Request 
                      </button> 
 
                      <button 
                        onClick={() => 
                          triggerDecline(order.id) 
                        } 
                        style={{ 
                          ...dangerButton, 
                          minWidth: 85, 
                        }} 
                      > 
                        Decline 
                      </button> 
                    </div> 
                  </article> 
                ))} 
              </div> 
            )} 
          </section> 
 
          {/* QUICK ACTIONS */} 
 
          <section> 
            <SectionHeader 
              eyebrow="Workspace" 
              title="Quick Actions" 
              description="Shortcuts for your donor workflow." 
            /> 
 
            <div 
              style={{ 
                ...cardStyle, 
                padding: 13, 
              }} 
            > 
              {[ 
                { 
                  icon: "🍱", 
                  title: "Register Food", 
                  text: "List new surplus meals", 
                  action: () => { 
                    resetForm(); 
                    setIsRegisterOpen(true); 
                  }, 
                }, 
                { 
                  icon: "📊", 
                  title: "Impact Summary", 
                  text: "View your donor performance", 
                  action: () => 
                    scrollTo("impact-summary"), 
                }, 
                { 
                  icon: "📦", 
                  title: "My Donations", 
                  text: "Manage active listings", 
                  action: () => 
                    scrollTo("active-listings"), 
                }, 
                { 
                  icon: "📩", 
                  title: "Requests", 
                  text: `${incomingRequests.length} awaiting response`, 
                  action: () => 
                    scrollTo("incoming-requests"), 
                }, 
                { 
                  icon: "🚚", 
                  title: "Live Workflow", 
                  text: "Track accepted orders", 
                  action: () => 
                    scrollTo("live-workflow"), 
                }, 
              ].map((item) => ( 
                <button 
                  key={item.title} 
                  onClick={item.action} 
                  style={{ 
                    width: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 11, 
                    padding: "11px 9px", 
                    marginBottom: 5, 
                    border: "none", 
                    borderRadius: 12, 
                    background: "#F7FAFA", 
                    color: COLORS.text, 
                    cursor: "pointer", 
                    textAlign: "left", 
                    fontFamily: "inherit", 
                  }} 
                > 
                  <span 
                    style={{ 
                      width: 37, 
                      height: 37, 
                      flexShrink: 0, 
                      display: "grid", 
                      placeItems: "center", 
                      borderRadius: 11, 
                      background: "#EAF9F4", 
                      fontSize: 16, 
                    }} 
                  > 
                    {item.icon} 
                  </span> 
 
                  <span style={{ minWidth: 0 }}> 
                    <strong 
                      style={{ 
                        display: "block", 
                        fontSize: 11, 
                        fontWeight: 850, 
                      }} 
                    > 
                      {item.title} 
                    </strong> 
 
                    <small 
                      style={{ 
                        display: "block", 
                        marginTop: 2, 
                        color: "#91A0AE", 
                        fontSize: 9, 
                      }} 
                    > 
                      {item.text} 
                    </small> 
                  </span> 
 
                  <span 
                    style={{ 
                      marginLeft: "auto", 
                      color: "#9AAAB6", 
                      fontSize: 15, 
                    }} 
                  > 
                    → 
                  </span> 
                </button> 
              ))} 
            </div> 
          </section> 
        </div> 
 
        {/* ===================================================== 
            LIVE ORDER WORKFLOW 
            ===================================================== */} 
 
        <section 
          id="live-workflow" 
          style={{ 
            marginBottom: 30, 
          }} 
        > 
          <SectionHeader 
            eyebrow="Live Handover" 
            title="Order Workflow" 
            description="Track accepted donations from preparation to successful pickup." 
          /> 
 
          {activeOrders.length === 0 ? ( 
            <div 
              style={{ 
                ...cardStyle, 
                padding: "36px 25px", 
                textAlign: "center", 
              }} 
            > 
              <div 
                style={{ 
                  fontSize: 28, 
                  marginBottom: 7, 
                }} 
              > 
                🚚 
              </div> 
 
              <h3 
                style={{ 
                  margin: 0, 
                  fontSize: 14, 
                  fontWeight: 900, 
                  color: COLORS.navy, 
                }} 
              > 
                No active handovers 
              </h3> 
 
              <p 
                style={{ 
                  margin: "5px 0 0", 
                  color: COLORS.muted, 
                  fontSize: 11, 
                }} 
              > 
                Accepted requests will appear here 
                for real-time tracking. 
              </p> 
            </div> 
          ) : ( 
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: 
                  "repeat(2,minmax(0,1fr))", 
                gap: 12, 
              }} 
            > 
              {activeOrders.map((order) => { 
                const orderSteps = [ 
                  "Accepted", 
                  "Preparing", 
                  "Ready for Pickup", 
                  "Picked Up", 
                  "Completed", 
                ]; 
 
                const currentIndex = 
                  orderSteps.indexOf(order.status); 
 
                return ( 
                  <article 
                    key={order.id} 
                    style={{ 
                      ...cardStyle, 
                      padding: 18, 
                    }} 
                  > 
                    <div 
                      style={{ 
                        display: "flex", 
                        justifyContent: 
                          "space-between", 
                        alignItems: "center", 
                        gap: 12, 
                      }} 
                    > 
                      <div> 
                        <h3 
                          style={{ 
                            margin: 0, 
                            color: COLORS.navy, 
                            fontSize: 13, 
                            fontWeight: 900, 
                          }} 
                        > 
                          {order.ngoName || 
                            "Community Partner"} 
                        </h3> 
 
                        <p 
                          style={{ 
                            margin: "3px 0 0", 
                            color: COLORS.muted, 
                            fontSize: 10, 
                          }} 
                        > 
                          {order.foodRequested} 
                        </p> 
                      </div> 
 
                      <StatusBadge 
                        status={order.status} 
                      /> 
                    </div> 
 
                    {/* PROGRESS */} 
 
                    <div 
                      style={{ 
                        display: "grid", 
                        gridTemplateColumns: 
                          "repeat(5,1fr)", 
                        gap: 4, 
                        marginTop: 18, 
                      }} 
                    > 
                      {orderSteps.map( 
                        (step, index) => { 
                          const active = 
                            index <= currentIndex; 
 
                          return ( 
                            <div key={step}> 
                              <div 
                                style={{ 
                                  height: 5, 
                                  borderRadius: 999, 
                                  background: 
                                    active 
                                      ? COLORS.green 
                                      : "#E8EFEE", 
                                }} 
                              /> 
 
                              <span 
                                style={{ 
                                  display: "block", 
                                  marginTop: 5, 
                                  color: 
                                    active 
                                      ? COLORS.greenDark 
                                      : "#9AAAB6", 
                                  fontSize: 7, 
                                  lineHeight: 1.25, 
                                  fontWeight: 800, 
                                }} 
                              > 
                                {step === 
                                "Ready for Pickup" 
                                  ? "READY" 
                                  : step === 
                                    "Picked Up" 
                                  ? "PICKED" 
                                  : step.toUpperCase()} 
                              </span> 
                            </div> 
                          ); 
                        } 
                      )} 
                    </div> 
 
                    <div 
                      style={{ 
                        display: "grid", 
                        gridTemplateColumns: 
                          "repeat(3,1fr)", 
                        gap: 7, 
                        marginTop: 15, 
                      }} 
                    > 
                      <InfoMini 
                        label="Quantity" 
                        value={`${ 
                          order.quantity || 
                          order.expectedPeople || 
                          0 
                        } portions`} 
                      /> 
 
                      <InfoMini 
                        label="Prep Time" 
                        value={ 
                          order.prepTime || 
                          "Not set" 
                        } 
                      /> 
 
                      <InfoMini 
                        label="Contact" 
                        value={ 
                          order.contactPerson || 
                          "—" 
                        } 
                      /> 
                    </div> 
 
                    <div 
                      style={{ 
                        display: "flex", 
                        gap: 7, 
                        marginTop: 13, 
                        flexWrap: "wrap", 
                      }} 
                    > 
                      {order.status === 
                        "Accepted" && ( 
                        <WorkflowButton 
                          onClick={() => 
                            updateOrderStatus( 
                              order.id, 
                              "Preparing" 
                            ) 
                          } 
                        > 
                          Start Preparing 
                        </WorkflowButton> 
                      )} 
 
                      {order.status === 
                        "Preparing" && ( 
                        <WorkflowButton 
                          onClick={() => 
                            updateOrderStatus( 
                              order.id, 
                              "Ready for Pickup" 
                            ) 
                          } 
                        > 
                          Mark Ready 
                        </WorkflowButton> 
                      )} 
 
                      {order.status === 
                        "Ready for Pickup" && ( 
                        <WorkflowButton 
                          onClick={() => 
                            updateOrderStatus( 
                              order.id, 
                              "Picked Up" 
                            ) 
                          } 
                        > 
                          Mark Picked Up 
                        </WorkflowButton> 
                      )} 
 
                      {order.status === 
                        "Picked Up" && ( 
                        <WorkflowButton 
                          onClick={() => 
                            updateOrderStatus( 
                              order.id, 
                              "Completed" 
                            ) 
                          } 
                        > 
                          Complete Order 
                        </WorkflowButton> 
                      )} 
 
                      {order.status === 
                        "Completed" && ( 
                        <span 
                          style={{ 
                            padding: "9px 12px", 
                            borderRadius: 999, 
                            background: "#EAF9F4", 
                            color: 
                              COLORS.greenDark, 
                            fontSize: 10, 
                            fontWeight: 850, 
                          }} 
                        > 
                          ✓ Successfully Rescued 
                        </span> 
                      )} 
 
                      <button 
                        onClick={() => { 
                          setSelectedOrder(order); 
                          setIsOrderDetailsOpen(true); 
                        }} 
                        style={{ 
                          ...secondaryButton, 
                          marginLeft: "auto", 
                          padding: "9px 12px", 
                        }} 
                      > 
                        Details 
                      </button> 
                    </div> 
                  </article> 
                ); 
              })} 
            </div> 
          )} 
        </section> 
 
        {/* ===================================================== 
            IMPACT STRIP 
            ===================================================== */} 
 
        <section 
          style={{ 
            ...cardStyle, 
            padding: 14, 
            marginBottom: 30, 
            background: 
              "linear-gradient(135deg,#EAF9F4 0%,#F7FCFB 55%,#FFFFFF 100%)", 
          }} 
        > 
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: 
                "repeat(4,minmax(0,1fr))", 
            }} 
          > 
            {[ 
              { 
                icon: "🍽️", 
                label: "Meals Rescued", 
                value: rescuedMeals, 
              }, 
              { 
                icon: "📦", 
                label: "Food Listings", 
                value: myDonations.length, 
              }, 
              { 
                icon: "🤝", 
                label: "Completed Matches", 
                value: completedOrders.length, 
              }, 
              { 
                icon: "🌱", 
                label: "Waste Diverted", 
                value: 
                  rescuedMeals > 0 
                    ? "Active" 
                    : "Building", 
              }, 
            ].map((metric) => ( 
              <div 
                key={metric.label} 
                style={{ 
                  padding: "12px 15px", 
                  textAlign: "center", 
                  borderRight: 
                    "1px solid rgba(15,118,110,.08)", 
                }} 
              > 
                <div style={{ fontSize: 17 }}> 
                  {metric.icon} 
                </div> 
 
                <div 
                  style={{ 
                    marginTop: 4, 
                    color: COLORS.navy, 
                    fontSize: 
                      typeof metric.value === 
                      "string" 
                        ? 13 
                        : 20, 
                    fontWeight: 900, 
                    letterSpacing: "-.04em", 
                  }} 
                > 
                  <AnimatedNumber 
                    value={metric.value} 
                  /> 
                </div> 
 
                <div 
                  style={{ 
                    marginTop: 2, 
                    color: "#8194A6", 
                    fontSize: 8, 
                    fontWeight: 750, 
                  }} 
                > 
                  {metric.label} 
                </div> 
              </div> 
            ))} 
          </div> 
        </section> 
 
        {/* ===================================================== 
            DONATIONS 
            ===================================================== */} 
 
        <section 
          id="active-listings" 
          style={{ 
            marginBottom: 30, 
          }} 
        > 
          <SectionHeader 
            eyebrow="Food Inventory" 
            title="My Registered Donations" 
            description="Manage the surplus meals currently available for community rescue." 
            action={ 
              <button 
                onClick={() => { 
                  resetForm(); 
                  setIsRegisterOpen(true); 
                }} 
                style={primaryButton} 
              > 
                + Register Food 
              </button> 
            } 
          /> 
 
          {myDonations.length === 0 ? ( 
            <div 
              style={{ 
                ...cardStyle, 
                padding: "48px 25px", 
                textAlign: "center", 
              }} 
            > 
              <div 
                style={{ 
                  width: 60, 
                  height: 60, 
                  margin: "0 auto 13px", 
                  display: "grid", 
                  placeItems: "center", 
                  borderRadius: 18, 
                  background: "#EAF9F4", 
                  fontSize: 27, 
                }} 
              > 
                🍲 
              </div> 
 
              <h3 
                style={{ 
                  margin: 0, 
                  color: COLORS.navy, 
                  fontSize: 15, 
                  fontWeight: 900, 
                }} 
              > 
                Your food inventory is empty 
              </h3> 
 
              <p 
                style={{ 
                  maxWidth: 420, 
                  margin: "6px auto 15px", 
                  color: COLORS.muted, 
                  fontSize: 11, 
                  lineHeight: 1.6, 
                }} 
              > 
                Register your first surplus meal 
                and make it available to verified 
                community partners. 
              </p> 
 
              <button 
                onClick={() => { 
                  resetForm(); 
                  setIsRegisterOpen(true); 
                }} 
                style={{ 
                  ...primaryButton, 
                  borderRadius: 999, 
                }} 
              > 
                Register First Donation 
              </button> 
            </div> 
          ) : ( 
            <div 
              className="donation-grid" 
              style={{ 
                display: "grid", 
                gridTemplateColumns: 
                  "repeat(3,minmax(0,1fr))", 
                gap: 14, 
              }} 
            > 
              {myDonations.map((item) => ( 
                <DonationCard 
                  key={item.id} 
                  item={item} 
                  onDetails={() => 
                    openDetailsModal(item) 
                  } 
                  onEdit={() => 
                    openEditModal(item) 
                  } 
                  onDelete={() => { 
                    if ( 
                      window.confirm( 
                        `Are you sure you want to delete "${item.name}"?` 
                      ) 
                    ) { 
                      deleteFood(item.id); 
                    } 
                  }} 
                /> 
              ))} 
            </div> 
          )} 
        </section> 
 
                {/* =====================================================
            PROFESSIONAL PARTNER CHAT
            ===================================================== */}

        <ChatPanel
          partners={chatPartners}
          activePartner={activeChatPartner}
          selectedChatId={selectedChatId}
          onSelectPartner={setSelectedChatId}
          messages={
            chatMessages[activeChatPartner?.id] || []
          }
          input={chatInput}
          setInput={setChatInput}
          onSend={handleSendChat}
          currentUserName={user?.fullName || "Vidhi Mittal"}
        />

        {/* =====================================================
            ORDER DETAILS MODAL
            ===================================================== */} 
 
        {isOrderDetailsOpen && 
          selectedOrder && ( 
            <ModalShell 
              onClose={() => 
                setIsOrderDetailsOpen(false) 
              } 
              maxWidth={620} 
            > 
              <ModalHeader 
                eyebrow="Community Request" 
                title="Food Request Details" 
                onClose={() => 
                  setIsOrderDetailsOpen(false) 
                } 
              /> 
 
              <div style={{ padding: 22 }}> 
                <DetailPanel 
                  icon="🏘️" 
                  title="NGO Information" 
                > 
                  <DetailRow 
                    label="Organization" 
                    value={selectedOrder.ngoName} 
                  /> 
                  <DetailRow 
                    label="Contact" 
                    value={ 
                      selectedOrder.contactPerson 
                    } 
                  /> 
                  <DetailRow 
                    label="Phone" 
                    value={selectedOrder.phone} 
                  /> 
                </DetailPanel> 
 
                <DetailPanel 
                  icon="🍲" 
                  title="Meal Details" 
                > 
                  <DetailRow 
                    label="Food Requested" 
                    value={ 
                      selectedOrder.foodRequested 
                    } 
                  /> 
                  <DetailRow 
                    label="Portions" 
                    value={ 
                      selectedOrder.expectedPeople 
                    } 
                  /> 
                  <DetailRow 
                    label="Submitted" 
                    value={ 
                      selectedOrder.orderTime 
                        ? new Date( 
                            selectedOrder.orderTime 
                          ).toLocaleString() 
                        : "—" 
                    } 
                  /> 
                </DetailPanel> 
 
                <DetailPanel 
                  icon="💬" 
                  title="Message" 
                > 
                  <p 
                    style={{ 
                      margin: 0, 
                      color: COLORS.muted, 
                      fontSize: 12, 
                      lineHeight: 1.7, 
                    }} 
                  > 
                    {selectedOrder.receiverMessage || 
                      "No message included."} 
                  </p> 
                </DetailPanel> 
 
                <button 
                  onClick={() => 
                    setIsOrderDetailsOpen(false) 
                  } 
                  style={{ 
                    ...primaryButton, 
                    width: "100%", 
                    marginTop: 12, 
                  }} 
                > 
                  Close 
                </button> 
              </div> 
            </ModalShell> 
          )} 
 
        {/* ===================================================== 
            DECLINE MODAL 
            ===================================================== */} 
 
        {isDeclineConfirmOpen && ( 
          <ModalShell 
            onClose={() => 
              setIsDeclineConfirmOpen(false) 
            } 
            maxWidth={410} 
            zIndex={4000} 
          > 
            <div 
              style={{ 
                padding: 28, 
                textAlign: "center", 
              }} 
            > 
              <div 
                style={{ 
                  width: 58, 
                  height: 58, 
                  margin: "0 auto 14px", 
                  display: "grid", 
                  placeItems: "center", 
                  borderRadius: 18, 
                  background: "#FFF3E8", 
                  fontSize: 25, 
                }} 
              > 
                ⚠️ 
              </div> 
 
              <h2 
                style={{ 
                  margin: 0, 
                  color: COLORS.navy, 
                  fontSize: 18, 
                  fontWeight: 900, 
                }} 
              > 
                Decline Request? 
              </h2> 
 
              <p 
                style={{ 
                  margin: "8px 0 19px", 
                  color: COLORS.muted, 
                  fontSize: 11, 
                  lineHeight: 1.7, 
                }} 
              > 
                This request will be declined and 
                the NGO will be notified. 
              </p> 
 
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: 8, 
                }} 
              > 
                <button 
                  onClick={() => 
                    setIsDeclineConfirmOpen(false) 
                  } 
                  style={secondaryButton} 
                > 
                  Cancel 
                </button> 
 
                <button 
                  onClick={handleConfirmDecline} 
                  style={dangerButton} 
                > 
                  Decline Request 
                </button> 
              </div> 
            </div> 
          </ModalShell> 
        )} 
 
        {/* ===================================================== 
            REGISTER / EDIT MODAL 
            ===================================================== */} 
 
        {(isRegisterOpen || isEditOpen) && ( 
          <ModalShell 
            onClose={() => { 
              setIsRegisterOpen(false); 
              setIsEditOpen(false); 
            }} 
            maxWidth={720} 
            zIndex={3500} 
          > 
            <ModalHeader 
              eyebrow="MealBridge" 
              title={ 
                isEditOpen 
                  ? "Edit Food Details" 
                  : "Register New Surplus Food" 
              } 
              onClose={() => { 
                setIsRegisterOpen(false); 
                setIsEditOpen(false); 
              }} 
            /> 
 
            <form 
              onSubmit={ 
                isEditOpen 
                  ? handleEditSubmit 
                  : handleRegisterSubmit 
              } 
              style={{ 
                padding: 22, 
              }} 
            > 
              {!aiResult ? (
                <>
                  <div 
                    style={{ 
                      padding: 14, 
                      marginBottom: 16, 
                      borderRadius: 14, 
                      background: 
                        "linear-gradient(135deg,#F0FBF8,#F8FCFB)", 
                      border: "1px solid #DCEFEA", 
                    }} 
                  > 
                    <div 
                      style={{ 
                        color: COLORS.greenDark, 
                        fontSize: 9, 
                        fontWeight: 900, 
                        textTransform: "uppercase", 
                        letterSpacing: ".1em", 
                      }} 
                    > 
                      Donation information 
                    </div> 
     
                    <p 
                      style={{ 
                        margin: "5px 0 0", 
                        color: COLORS.muted, 
                        fontSize: 10, 
                        lineHeight: 1.5, 
                      }} 
                    > 
                      Add accurate food and pickup 
                      details so community partners 
                      can respond quickly. 
                    </p> 
                  </div> 
     
                  <label style={fieldStyle}> 
                    Food Name 
                    <input 
                      type="text" 
                      value={foodName} 
                      onChange={(e) => 
                        setFoodName(e.target.value) 
                      } 
                      placeholder="e.g. Fresh Vegetable Biryani" 
                      required 
                      style={inputStyle} 
                    /> 
                  </label> 
     
                  <div style={twoColumnGrid}> 
                    <label style={fieldStyle}> 
                      Category 
                      <select 
                        value={category} 
                        onChange={(e) => 
                          setCategory(e.target.value) 
                        } 
                        style={inputStyle} 
                      > 
                        <option>Cooked Meals</option> 
                        <option>Salads</option> 
                        <option>Bakery</option> 
                        <option>Dairy</option> 
                        <option>Beverages</option> 
                      </select> 
                    </label> 
     
                    <label style={fieldStyle}> 
                      Veg / Non-Veg 
                      <select 
                        value={vegNonVeg} 
                        onChange={(e) => 
                          setVegNonVeg(e.target.value) 
                        } 
                        style={inputStyle} 
                      > 
                        <option>Veg</option> 
                        <option>Non Veg</option> 
                      </select> 
                    </label> 
                  </div> 
     
                  <div style={twoColumnGrid}> 
                    <label style={fieldStyle}> 
                      Quantity 
                      <input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => 
                          setQuantity(e.target.value) 
                        } 
                        required 
                        style={inputStyle} 
                      /> 
                    </label> 
     
                    <label style={fieldStyle}> 
                      Food Image (Required for AI Safety Check)
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => 
                          setImageFile(e.target.files[0]) 
                        } 
                        style={inputStyle} 
                        required={!isEditOpen}
                        disabled={isEditOpen}
                      /> 
                    </label> 
                  </div> 
     
                  <div style={twoColumnGrid}> 
                    <label style={fieldStyle}> 
                      Cooking Time 
                      <input 
                        type="datetime-local" 
                        value={cookingTime} 
                        onChange={(e) => 
                          setCookingTime(e.target.value) 
                        } 
                        required 
                        style={inputStyle} 
                      /> 
                    </label> 
     
                    <label style={fieldStyle}> 
                      Expiry Time 
                      <input 
                        type="datetime-local" 
                        value={expiryTime} 
                        onChange={(e) => 
                          setExpiryTime(e.target.value) 
                        } 
                        required 
                        style={inputStyle} 
                      /> 
                    </label> 
                  </div> 
     
                  <label style={fieldStyle}> 
                    Pickup Address 
                    <textarea 
                      rows="3" 
                      value={pickupAddress} 
                      onChange={(e) => 
                        setPickupAddress(e.target.value) 
                      } 
                      placeholder="Enter complete pickup address" 
                      required 
                      style={{ 
                        ...inputStyle, 
                        resize: "vertical", 
                      }} 
                    /> 
                  </label> 
     
                  <label style={fieldStyle}> 
                    GPS Location 
                    <input 
                      type="text" 
                      value={gpsLocation} 
                      onChange={(e) => 
                        setGpsLocation(e.target.value) 
                      } 
                      required 
                      style={inputStyle} 
                    /> 
                  </label> 
     
                  <label style={fieldStyle}> 
                    Description 
                    <textarea 
                      rows="3" 
                      value={description} 
                      onChange={(e) => 
                        setDescription(e.target.value) 
                      } 
                      placeholder="Describe the food, ingredients or serving details..." 
                      style={{ 
                        ...inputStyle, 
                        resize: "vertical", 
                      }} 
                    /> 
                  </label> 
     
                  <label style={fieldStyle}> 
                    Special Instructions 
                    <textarea 
                      rows="3" 
                      value={specialInstructions} 
                      onChange={(e) => 
                        setSpecialInstructions( 
                          e.target.value 
                        ) 
                      } 
                      placeholder="Allergens, packaging, storage or pickup notes..." 
                      style={{ 
                        ...inputStyle, 
                        resize: "vertical", 
                      }} 
                    /> 
                  </label> 

                  <div 
                    style={{ 
                      display: "flex", 
                      justifyContent: "flex-end", 
                      gap: 8, 
                      marginTop: 20, 
                    }} 
                  > 
                    <button 
                      type="button" 
                      onClick={() => { 
                        setIsRegisterOpen(false); 
                        setIsEditOpen(false); 
                      }} 
                      style={secondaryButton} 
                    > 
                      Cancel 
                    </button> 
       
                    <button 
                      type="submit" 
                      style={primaryButton} 
                      disabled={isAiLoading}
                    > 
                      {isAiLoading ? "Processing..." : isEditOpen ? "Save Changes" : "Run AI Assessment"} 
                    </button> 
                  </div>
                </>
              ) : (() => {
                const FOOD_INDICATORS = {
                  "biryani": { fresh: "Normal color, moist grains, normal aroma/appearance, no discoloration", spoilage: "Drying, unusual discoloration, mold, slimy appearance", storage: "Keep hot or refrigerate promptly" },
                  "rice": { fresh: "Separate/normal grains, normal color and texture", spoilage: "Dry/hard or unusually sticky texture, discoloration, mold", storage: "Hot holding or prompt refrigeration" },
                  "dal": { fresh: "Normal color, smooth/expected consistency", spoilage: "Unusual separation, discoloration, surface growth, abnormal texture", storage: "Hot holding or refrigeration" },
                  "curry": { fresh: "Normal color, expected consistency, no surface growth", spoilage: "Film, mold, unusual discoloration, abnormal separation/texture", storage: "Hot holding or refrigeration" },
                  "roti": { fresh: "Normal color, soft/expected texture, no visible mold", spoilage: "Excessive dryness, discoloration, mold", storage: "Covered/appropriate storage; refrigeration if holding longer" },
                  "naan": { fresh: "Normal color, soft/expected texture, no visible mold", spoilage: "Excessive dryness, discoloration, mold", storage: "Covered/appropriate storage; refrigeration if holding longer" },
                  "chapati": { fresh: "Normal color, soft/expected texture, no visible mold", spoilage: "Excessive dryness, discoloration, mold", storage: "Covered/appropriate storage; refrigeration if holding longer" },
                  "pizza": { fresh: "Normal toppings, intact appearance, no mold/slime", spoilage: "Mold, abnormal discoloration, degraded toppings", storage: "Refrigeration for longer holding" },
                  "pasta": { fresh: "Normal color/texture, no visible spoilage", spoilage: "Excessive drying, discoloration, mold, abnormal texture", storage: "Hot holding or refrigeration" },
                  "noodles": { fresh: "Normal color/texture, no visible spoilage", spoilage: "Excessive drying, discoloration, mold, abnormal texture", storage: "Hot holding or refrigeration" },
                  "sandwich": { fresh: "Fresh bread, normal fillings, no mold", spoilage: "Mold on bread, soggy, off-smell", storage: "Refrigeration" },
                  "fried foods": { fresh: "Normal color, intact coating, no visible spoilage", spoilage: "Excessive sogginess/degradation, discoloration, mold", storage: "Appropriate hot holding or prompt refrigeration" }
                };
                const details = FOOD_INDICATORS[aiResult.food_type?.toLowerCase()] || null;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{
                      padding: 16,
                      background: "#F9FAFB",
                      border: "1px solid #D1D5DB",
                      borderRadius: 12,
                      fontSize: 13,
                      color: "#1F2937",
                      width: "100%",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                      textAlign: "left"
                    }}>
                      <h3 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: "bold", borderBottom: "1px solid #E5E7EB", paddingBottom: 6 }}>🤖 AI-Estimated Freshness Check</h3>
                      
                      {imageFile && (
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                          <img 
                            src={URL.createObjectURL(imageFile)} 
                            alt="Uploaded Food" 
                            style={{ maxWidth: "100%", maxHeight: "180px", borderRadius: 8, objectFit: "cover" }} 
                          />
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div><strong>Detected Food:</strong> <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{aiResult.food_type}</span></div>
                        <div><strong>Confidence:</strong> <span style={{ fontWeight: "bold" }}>{aiResult.freshness_score}%</span></div>
                      </div>
                      
                      <div style={{ marginBottom: 12 }}>
                        <strong>Visual Freshness:</strong> <span style={{
                          fontWeight: "bold",
                          color: aiResult.freshness_label === 'fresh' ? '#059669' : aiResult.freshness_label === 'moderate' ? '#D97706' : '#DC2626',
                          textTransform: "uppercase"
                        }}>
                          {aiResult.freshness_label === 'fresh' ? 'FRESH' : aiResult.freshness_label === 'moderate' ? 'MODERATE / QUESTIONABLE' : 'SPOILED'}
                        </span>
                      </div>
                      
                      <div style={{ padding: 10, background: "white", borderRadius: 8, border: "1px solid #E5E7EB", marginBottom: 12 }}>
                        <strong>AI Assessment:</strong> {aiResult.recommendation}
                      </div>

                      {details && (
                        <div style={{ marginTop: 12, borderTop: "1px solid #E5E7EB", paddingTop: 10 }}>
                          <strong style={{ color: "#374151", display: "block", marginBottom: 6 }}>🍽️ Quality Guidelines for {aiResult.food_type}:</strong>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                            <div><b>🟢 Fresh-looking indicators:</b> {details.fresh}</div>
                            <div><b>🔴 Main deterioration indicators:</b> {details.spoilage}</div>
                            <div><b>❄️ Suggested storage:</b> {details.storage}</div>
                          </div>
                        </div>
                      )}

                      <div style={{
                        marginTop: 12,
                        padding: 10,
                        background: "#FEF2F2",
                        border: "1px solid #FEE2E2",
                        borderRadius: 8,
                        color: "#991B1B",
                        fontSize: 11,
                        lineHeight: "1.4"
                      }}>
                        <strong>⚠️ SAFETY DISCLAIMER:</strong> AI assessment is based on visual characteristics and does <strong>not</strong> certify food safety. Actual food safety depends on storage temperature, preparation time, handling, hygiene, contamination, packaging, expiry information, and storage conditions.
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setAiResult(null);
                          setImageFile(null);
                        }}
                        style={{
                          ...secondaryButton,
                          padding: "10px 20px"
                        }}
                      >
                        Analyze Again
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmRegister}
                        style={{
                          ...primaryButton,
                          padding: "10px 20px"
                        }}
                        disabled={isAiLoading}
                      >
                        {isAiLoading ? "Processing..." : "Confirm & Continue"}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </form>
          </ModalShell>
        )} 
 
        {/* ===================================================== 
            FOOD DETAILS 
            ===================================================== */} 
 
        {isDetailsOpen && selectedItem && ( 
          <ModalShell 
            onClose={() => 
              setIsDetailsOpen(false) 
            } 
            maxWidth={680} 
            zIndex={3200} 
          > 
            <div 
              style={{ 
                position: "relative", 
                height: 235, 
              }} 
            > 
              <img 
                src={ 
                  selectedItem.imageUrl || 
                  HERO_IMAGE 
                } 
                alt={selectedItem.name} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover", 
                }} 
              /> 
 
              <div 
                style={{ 
                  position: "absolute", 
                  inset: 0, 
                  background: 
                    "linear-gradient(0deg,rgba(0,0,0,.68),transparent 65%)", 
                }} 
              /> 
 
              <button 
                onClick={() => 
                  setIsDetailsOpen(false) 
                } 
                style={{ 
                  ...closeButtonStyle, 
                  position: "absolute", 
                  top: 14, 
                  right: 14, 
                  background: 
                    "rgba(255,255,255,.92)", 
                }} 
              > 
                × 
              </button> 
 
              <div 
                style={{ 
                  position: "absolute", 
                  left: 22, 
                  bottom: 18, 
                  color: "#FFFFFF", 
                }} 
              > 
                <div 
                  style={{ 
                    fontSize: 8, 
                    fontWeight: 800, 
                    letterSpacing: ".13em", 
                    textTransform: "uppercase", 
                    opacity: 0.8, 
                  }} 
                > 
                  Food Rescue 
                </div> 
 
                <h2 
                  style={{ 
                    margin: "4px 0 0", 
                    fontSize: 21, 
                    letterSpacing: "-.035em", 
                    fontWeight: 900, 
                  }} 
                > 
                  {selectedItem.name} 
                </h2> 
              </div> 
            </div> 
 
            <div style={{ padding: 22 }}> 
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: 
                    "repeat(2,minmax(0,1fr))", 
                  gap: 8, 
                }} 
              > 
                {[ 
                  [ 
                    "Category", 
                    selectedItem.category, 
                  ], 
                  [ 
                    "Food Type", 
                    selectedItem.vegNonVeg, 
                  ], 
                  [ 
                    "Quantity", 
                    `${selectedItem.quantity} meals`, 
                  ], 
                  [ 
                    "Status", 
                    selectedItem.status || 
                      "Available", 
                  ], 
                ].map(([label, value]) => ( 
                  <div 
                    key={label} 
                    style={{ 
                      padding: 13, 
                      borderRadius: 13, 
                      background: "#F7FAFA", 
                    }} 
                  > 
                    <span 
                      style={{ 
                        display: "block", 
                        color: "#91A0AE", 
                        fontSize: 8, 
                        fontWeight: 800, 
                        textTransform: 
                          "uppercase", 
                      }} 
                    > 
                      {label} 
                    </span> 
 
                    <strong 
                      style={{ 
                        display: "block", 
                        marginTop: 4, 
                        color: COLORS.text, 
                        fontSize: 11, 
                      }} 
                    > 
                      {value || "—"} 
                    </strong> 
                  </div> 
                ))} 
              </div> 
 
              <DetailPanel 
                icon="🕒" 
                title="Timing" 
              > 
                <DetailRow 
                  label="Cooking" 
                  value={ 
                    selectedItem.cookingTime 
                      ? new Date( 
                          selectedItem.cookingTime 
                        ).toLocaleString() 
                      : "N/A" 
                  } 
                /> 
 
                <DetailRow 
                  label="Expiry" 
                  value={ 
                    selectedItem.expiryTime 
                      ? new Date( 
                          selectedItem.expiryTime 
                        ).toLocaleString() 
                      : "N/A" 
                  } 
                /> 
              </DetailPanel> 
 
              <DetailPanel 
                icon="📍" 
                title="Pickup Details" 
              > 
                <DetailRow 
                  label="Address" 
                  value={ 
                    selectedItem.pickupAddress 
                  } 
                /> 
 
                <DetailRow 
                  label="GPS" 
                  value={ 
                    selectedItem.gpsLocation 
                  } 
                /> 
 
                <DetailRow 
                  label="Transportation" 
                  value={ 
                    selectedItem.needTransportation 
                  } 
                /> 
              </DetailPanel> 
 
              <DetailPanel 
                icon="📝" 
                title="Notes" 
              > 
                <DetailRow 
                  label="Description" 
                  value={ 
                    selectedItem.description || 
                    "None provided." 
                  } 
                /> 
 
                <DetailRow 
                  label="Instructions" 
                  value={ 
                    selectedItem.specialInstructions || 
                    "None provided." 
                  } 
                /> 
              </DetailPanel> 
 
              <button 
                onClick={() => 
                  setIsDetailsOpen(false) 
                } 
                style={{ 
                  ...primaryButton, 
                  width: "100%", 
                  marginTop: 12, 
                }} 
              > 
                Close 
              </button> 
            </div> 
          </ModalShell> 
        )} 
 
        {/* ===================================================== 
            ACCEPT ORDER MODAL 
            ===================================================== */} 
 
        {isAcceptOpen && ( 
          <ModalShell 
            onClose={() => 
              setIsAcceptOpen(false) 
            } 
            maxWidth={470} 
            zIndex={3600} 
          > 
            <ModalHeader 
              eyebrow="Confirm Match" 
              title="Accept Order Request" 
              onClose={() => 
                setIsAcceptOpen(false) 
              } 
            /> 
 
            <div style={{ padding: 22 }}> 
              <div 
                style={{ 
                  padding: 14, 
                  borderRadius: 14, 
                  background: "#F0FBF8", 
                  border: "1px solid #DCEFEA", 
                }} 
              > 
                <strong 
                  style={{ 
                    color: COLORS.greenDark, 
                    fontSize: 12, 
                  }} 
                > 
                  You're helping make this meal 
                  available to the community. 
                </strong> 
 
                <p 
                  style={{ 
                    margin: "5px 0 0", 
                    color: COLORS.muted, 
                    fontSize: 10, 
                    lineHeight: 1.6, 
                  }} 
                > 
                  Select an estimated preparation 
                  time so the NGO can coordinate 
                  pickup. 
                </p> 
              </div> 
 
              <div 
                style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: 7, 
                  margin: "17px 0", 
                }} 
              > 
                {[ 
                  "15 Minutes", 
                  "30 Minutes", 
                  "45 Minutes", 
                  "1 Hour", 
                  "Custom", 
                ].map((time) => ( 
                  <button 
                    key={time} 
                    type="button" 
                    onClick={() => 
                      setPrepTime(time) 
                    } 
                    style={{ 
                      ...buttonBase, 
                      padding: "8px 11px", 
                      borderRadius: 999, 
                      background: 
                        prepTime === time 
                          ? "linear-gradient(135deg,#08A979,#10B9A4)" 
                          : "#F2F7F6", 
                      color: 
                        prepTime === time 
                          ? "#FFFFFF" 
                          : COLORS.text, 
                      border: 
                        prepTime === time 
                          ? "none" 
                          : "1px solid #E2ECEA", 
                      fontSize: 10, 
                    }} 
                  > 
                    {time} 
                  </button> 
                ))} 
              </div> 
 
              {prepTime === "Custom" && ( 
                <label style={fieldStyle}> 
                  Preparation Time 
                  <input 
                    type="text" 
                    placeholder="e.g. 2 Hours" 
                    value={customPrepTime} 
                    onChange={(e) => 
                      setCustomPrepTime( 
                        e.target.value 
                      ) 
                    } 
                    style={inputStyle} 
                  /> 
                </label> 
              )} 
 
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "flex-end", 
                  gap: 8, 
                  marginTop: 19, 
                }} 
              > 
                <button 
                  onClick={() => 
                    setIsAcceptOpen(false) 
                  } 
                  style={secondaryButton} 
                > 
                  Cancel 
                </button> 
 
                <button 
                  onClick={handleConfirmAccept} 
                  style={primaryButton} 
                > 
                  Confirm Acceptance 
                </button> 
              </div> 
            </div> 
          </ModalShell> 
        )} 
      </div> 
    </DashboardLayout> 
  ); 
} 
 
/* =========================================================
   PROFESSIONAL CHAT PANEL
   ========================================================= */

function ChatPanel({
  partners,
  activePartner,
  selectedChatId,
  onSelectPartner,
  messages,
  input,
  setInput,
  onSend,
  currentUserName,
}) {
  return (
    <section
      id="partner-chat"
      className="donor-chat-panel"
      style={{
        marginBottom: 30,
        border: "1px solid #DDEBE8",
        borderRadius: 22,
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 14px 45px rgba(16,72,64,.07)",
      }}
    >
      <div
        className="donor-chat-header"
        style={{
          minHeight: 74,
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 15,
          background: "linear-gradient(135deg,#F3FBF9,#FFFFFF)",
          borderBottom: "1px solid #E8F0EE",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 14,
              background:
                "linear-gradient(135deg,#08A979,#10B9A4)",
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: 900,
              boxShadow: "0 8px 18px rgba(8,169,121,.18)",
            }}
          >
            ✦
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: COLORS.greenDark,
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Partner Communication
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <strong
                style={{
                  color: COLORS.navy,
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: "-.025em",
                }}
              >
                Chat about your donation
              </strong>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "#EAF9F4",
                  color: COLORS.greenDark,
                  fontSize: 8,
                  fontWeight: 850,
                }}
              >
                <span style={{ fontSize: 7 }}>●</span> Connected
              </span>
            </div>
          </div>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 10px",
            borderRadius: 10,
            background: "#FFFFFF",
            border: "1px solid #DDEBE8",
            color: COLORS.muted,
            fontSize: 9,
            fontWeight: 800,
          }}
        >
          🔒 Secure
        </span>
      </div>

      <div
        className="donor-chat-toolbar"
        style={{
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          background: "#FBFDFC",
          borderBottom: "1px solid #EDF3F1",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            color: COLORS.muted,
            fontSize: 9,
            fontWeight: 800,
          }}
        >
          <span>Chatting about</span>
          <select
            value={activePartner?.id || selectedChatId || ""}
            onChange={(e) => onSelectPartner(e.target.value)}
            style={{
              minWidth: 220,
              padding: "9px 34px 9px 11px",
              borderRadius: 10,
              border: "1px solid #D9E7E4",
              outline: "none",
              background: "#FFFFFF",
              color: COLORS.navy,
              fontFamily: "inherit",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            {partners.length === 0 ? (
              <option value="city-hope-kitchen">
                chapati (City Hope Kitchen)
              </option>
            ) : (
              partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.food} ({partner.name})
                </option>
              ))
            )}
          </select>
        </label>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            color: COLORS.muted,
            fontSize: 9,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow:
                "0 0 0 4px rgba(16,185,129,.08)",
            }}
          />
          Partner is available
        </div>
      </div>

      <div
        className="donor-chat-body"
        style={{
          minHeight: 360,
          maxHeight: 480,
          overflowY: "auto",
          padding: "22px 24px",
          background:
            "radial-gradient(circle at 10% 10%,rgba(16,185,164,.055),transparent 30%),linear-gradient(180deg,#F9FCFC,#F4F9F8)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              height: 1,
              flex: 1,
              background: "#DDE9E6",
            }}
          />
          <span
            style={{
              padding: "5px 10px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "1px solid #E1EBE9",
              color: "#8A9AA0",
              fontSize: 8,
              fontWeight: 850,
              letterSpacing: ".08em",
            }}
          >
            TODAY
          </span>
          <div
            style={{
              height: 1,
              flex: 1,
              background: "#DDE9E6",
            }}
          />
        </div>

        {messages.length === 0 ? (
          <div
            style={{
              minHeight: 260,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              color: COLORS.muted,
              fontSize: 11,
            }}
          >
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                💬
              </div>
              <strong style={{ color: COLORS.navy }}>
                Start the conversation
              </strong>
              <div style={{ marginTop: 4 }}>
                Send a message to your community partner.
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const mine = message.sender === "user";
            const initials = String(
              currentUserName || "You"
            )
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: mine
                    ? "flex-end"
                    : "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 9,
                    flexDirection: mine
                      ? "row-reverse"
                      : "row",
                    maxWidth: "78%",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 11,
                      background: mine
                        ? "#0E9F86"
                        : "#E0F4EF",
                      color: mine
                        ? "#FFFFFF"
                        : COLORS.greenDark,
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    {mine ? initials : "CH"}
                  </div>

                  <div>
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: mine
                          ? "17px 6px 17px 17px"
                          : "6px 17px 17px 17px",
                        background: mine
                          ? "linear-gradient(135deg,#0E9F86,#0B8E78)"
                          : "#FFFFFF",
                        border: mine
                          ? "none"
                          : "1px solid #DDE9E6",
                        color: mine
                          ? "#FFFFFF"
                          : COLORS.text,
                        boxShadow:
                          "0 6px 18px rgba(16,72,64,.055)",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 4,
                          fontSize: 9,
                          fontWeight: 900,
                          color: mine
                            ? "rgba(255,255,255,.82)"
                            : COLORS.greenDark,
                        }}
                      >
                        {mine
                          ? currentUserName
                          : activePartner?.name ||
                            "City Hope Kitchen"}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: 1.55,
                          wordBreak: "break-word",
                        }}
                      >
                        {message.text}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 5,
                        textAlign: mine
                          ? "right"
                          : "left",
                        color: "#91A0A6",
                        fontSize: 8,
                      }}
                    >
                      {message.time}
                      {mine ? " · ✓" : ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        style={{
          padding: "14px 18px 12px",
          background: "#FFFFFF",
          borderTop: "1px solid #E7EFED",
        }}
      >
        <div
          className="donor-chat-input-wrap"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "6px 7px 6px 8px",
            borderRadius: 16,
            background: "#F8FBFA",
            border: "1px solid #DCE8E5",
          }}
        >
          <button
            type="button"
            title="Attachment"
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              border: "1px solid #E0EAE8",
              borderRadius: 11,
              background: "#FFFFFF",
              color: COLORS.muted,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            📎
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask a question or reply..."
            aria-label="Message"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: COLORS.text,
              fontFamily: "inherit",
              fontSize: 12,
              padding: "10px 2px",
            }}
          />

          <button
            type="button"
            title="Emoji"
            style={{
              width: 36,
              height: 36,
              flexShrink: 0,
              border: "none",
              background: "transparent",
              color: COLORS.muted,
              cursor: "pointer",
              fontSize: 17,
            }}
          >
            ☺
          </button>

          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              height: 40,
              padding: "0 15px",
              border: "none",
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#08A979,#10B9A4)",
              color: "#FFFFFF",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 900,
              boxShadow:
                "0 7px 16px rgba(8,169,121,.18)",
            }}
          >
            Send <span style={{ fontSize: 14 }}>➤</span>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            padding: "8px 3px 0",
            color: "#91A0A6",
            fontSize: 8,
          }}
        >
          <span>
            💡 Tip: Be specific for faster and more accurate
            responses.
          </span>
          <span>
            Press <strong style={{ color: COLORS.greenDark }}>Enter</strong> to send
          </span>
        </div>
      </form>
    </section>
  );
}

/* =========================================================
   DONATION CARD
   ========================================================= */ 
 
function DonationCard({ 
  item, 
  onDetails, 
  onEdit, 
  onDelete, 
}) { 
  return ( 
    <article 
      style={{ 
        background: "#FFFFFF", 
        border: "1px solid #E4EEEC", 
        borderRadius: 18, 
        overflow: "hidden", 
        boxShadow: 
          "0 8px 28px rgba(16,72,64,.045)", 
      }} 
    > 
      <div 
        style={{ 
          position: "relative", 
          height: 195, 
          overflow: "hidden", 
        }} 
      > 
        <img 
          src={item.imageUrl || HERO_IMAGE} 
          alt={item.name} 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", 
            display: "block", 
          }} 
        /> 
 
        <div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            background: 
              "linear-gradient(0deg,rgba(0,0,0,.5),transparent 62%)", 
          }} 
        /> 
 
        <span 
          style={{ 
            position: "absolute", 
            top: 12, 
            left: 12, 
            padding: "5px 8px", 
            borderRadius: 999, 
            background: 
              item.vegNonVeg === "Veg" 
                ? "rgba(232,250,242,.96)" 
                : "rgba(255,238,238,.96)", 
            color: 
              item.vegNonVeg === "Veg" 
                ? "#078C63" 
                : "#CF4B4B", 
            fontSize: 8, 
            fontWeight: 900, 
          }} 
        > 
          {item.vegNonVeg === "Veg" 
            ? "● VEG" 
            : "● NON-VEG"} 
        </span> 
 
        <span 
          style={{ 
            position: "absolute", 
            top: 12, 
            right: 12, 
            padding: "5px 8px", 
            borderRadius: 999, 
            background: 
              "rgba(255,255,255,.94)", 
            color: "#28445A", 
            fontSize: 8, 
            fontWeight: 850, 
          }} 
        > 
          {item.category} 
        </span> 
 
        <div 
          style={{ 
            position: "absolute", 
            left: 13, 
            right: 13, 
            bottom: 12, 
            display: "flex", 
            alignItems: "flex-end", 
            justifyContent: "space-between", 
            gap: 8, 
          }} 
        > 
          <div style={{ minWidth: 0 }}> 
            <div 
              style={{ 
                color: "#FFFFFF", 
                fontSize: 8, 
                fontWeight: 800, 
                opacity: 0.8, 
                textTransform: "uppercase", 
                letterSpacing: ".1em", 
              }} 
            > 
              Donation 
            </div> 
 
            <h3 
              style={{ 
                margin: "3px 0 0", 
                color: "#FFFFFF", 
                fontSize: 15, 
                fontWeight: 900, 
                letterSpacing: "-.02em", 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis", 
              }} 
            > 
              {item.name} 
            </h3> 
          </div> 
 
          <StatusBadge 
            status={item.status || "Available"} 
          /> 
        </div> 
      </div> 
 
      <div style={{ padding: 15 }}> 
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 7, 
          }} 
        > 
          <InfoMini 
            label="Quantity" 
            value={`${item.quantity || 0} meals`} 
          /> 
 
          <InfoMini 
            label="Cooking" 
            value={ 
              item.cookingTime 
                ? new Date( 
                    item.cookingTime 
                  ).toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit", 
                  }) 
                : "N/A" 
            } 
          /> 
        </div> 
 
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: 
              "1.3fr 1fr 1fr", 
            gap: 6, 
            marginTop: 10, 
          }} 
        > 
          <button 
            onClick={onDetails} 
            style={{ 
              ...buttonBase, 
              padding: "9px 6px", 
              borderRadius: 10, 
              background: "#EAF9F4", 
              color: "#058E72", 
              fontSize: 9, 
            }} 
          > 
            View Details 
          </button> 
 
          <button 
            onClick={onEdit} 
            style={{ 
              ...buttonBase, 
              padding: "9px 6px", 
              borderRadius: 10, 
              background: "#F1F6F7", 
              color: "#456175", 
              fontSize: 9, 
            }} 
          > 
            Edit 
          </button> 
 
          <button 
            onClick={onDelete} 
            style={{ 
              ...buttonBase, 
              padding: "9px 6px", 
              borderRadius: 10, 
              background: "#FFF1F1", 
              color: "#CF5555", 
              fontSize: 9, 
            }} 
          > 
            Delete 
          </button> 
        </div> 
      </div> 
    </article> 
  ); 
} 
 
/* ========================================================= 
   SUMMARY ROW 
   ========================================================= */ 
 
function SummaryRow({ 
  icon, 
  label, 
  value, 
}) { 
  return ( 
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 9, 
        padding: "8px 9px", 
        borderRadius: 10, 
        background: "#FFFFFF", 
        border: "1px solid #EDF3F1", 
      }} 
    > 
      <span 
        style={{ 
          width: 27, 
          height: 27, 
          display: "grid", 
          placeItems: "center", 
          borderRadius: 8, 
          background: "#EAF9F4", 
          fontSize: 12, 
        }} 
      > 
        {icon} 
      </span> 
 
      <span 
        style={{ 
          color: "#71869A", 
          fontSize: 9, 
          fontWeight: 750, 
        }} 
      > 
        {label} 
      </span> 
 
      <strong 
        style={{ 
          marginLeft: "auto", 
          color: COLORS.navy, 
          fontSize: 11, 
          fontWeight: 900, 
        }} 
      > 
        <AnimatedNumber value={value} /> 
      </strong> 
    </div> 
  ); 
} 
 
/* ========================================================= 
   SMALL COMPONENTS 
   ========================================================= */ 
 
function InfoMini({ 
  label, 
  value, 
}) { 
  return ( 
    <div 
      style={{ 
        minWidth: 0, 
        padding: "9px 10px", 
        borderRadius: 10, 
        background: "#F7FAFA", 
        border: "1px solid #EEF3F2", 
      }} 
    > 
      <span 
        style={{ 
          display: "block", 
          color: "#91A0AE", 
          fontSize: 8, 
          fontWeight: 850, 
          textTransform: "uppercase", 
          letterSpacing: ".03em", 
        }} 
      > 
        {label} 
      </span> 
 
      <strong 
        style={{ 
          display: "block", 
          marginTop: 3, 
          color: "#29445A", 
          fontSize: 9, 
          whiteSpace: "nowrap", 
          overflow: "hidden", 
          textOverflow: "ellipsis", 
        }} 
      > 
        {value || "—"} 
      </strong> 
    </div> 
  ); 
} 
 
function WorkflowButton({ 
  children, 
  onClick, 
}) { 
  return ( 
    <button 
      onClick={onClick} 
      style={{ 
        ...buttonBase, 
        padding: "9px 13px", 
        borderRadius: 10, 
        background: 
          "linear-gradient(135deg,#08A979,#10B9A4)", 
        color: "#FFFFFF", 
        fontSize: 10, 
        boxShadow: 
          "0 7px 16px rgba(8,169,121,.14)", 
      }} 
    > 
      {children} 
    </button> 
  ); 
} 
 
function DetailPanel({ 
  icon, 
  title, 
  children, 
}) { 
  return ( 
    <div 
      style={{ 
        marginTop: 12, 
        padding: 14, 
        borderRadius: 14, 
        background: "#F7FAFA", 
        border: "1px solid #ECF2F1", 
      }} 
    > 
      <h3 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 7, 
          margin: "0 0 10px", 
          color: "#24445A", 
          fontSize: 11, 
          fontWeight: 900, 
        }} 
      > 
        <span>{icon}</span> 
        {title} 
      </h3> 
 
      {children} 
    </div> 
  ); 
} 
 
function DetailRow({ 
  label, 
  value, 
}) { 
  return ( 
    <div 
      style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        gap: 18, 
        padding: "6px 0", 
        borderBottom: 
          "1px solid rgba(15,118,110,.06)", 
      }} 
    > 
      <span 
        style={{ 
          color: "#8A9BAA", 
          fontSize: 9, 
          fontWeight: 750, 
          flexShrink: 0, 
        }} 
      > 
        {label} 
      </span> 
 
      <strong 
        style={{ 
          color: "#29445A", 
          fontSize: 10, 
          textAlign: "right", 
          lineHeight: 1.5, 
        }} 
      > 
        {value || "—"} 
      </strong> 
    </div> 
  ); 
} 
 
/* ========================================================= 
   SHARED STYLES 
   ========================================================= */ 
 
const buttonBase = { 
  border: "none", 
  cursor: "pointer", 
  fontFamily: "inherit", 
  fontWeight: 800, 
  transition: 
    "transform .18s ease, box-shadow .18s ease, background .18s ease", 
}; 
 
const secondaryButton = { 
  ...buttonBase, 
  display: "inline-flex", 
  alignItems: "center", 
  justifyContent: "center", 
  gap: 7, 
  padding: "10px 13px", 
  borderRadius: 10, 
  background: "#F2F7F6", 
  border: "1px solid #E0EBE9", 
  color: "#38566B", 
  fontSize: 10, 
}; 
 
const dangerButton = { 
  ...buttonBase, 
  padding: "10px 13px", 
  borderRadius: 10, 
  background: "#FFF1F1", 
  border: "1px solid #F5DADA", 
  color: "#C95353", 
  fontSize: 10, 
}; 
 
const closeButtonStyle = { 
  width: 34, 
  height: 34, 
  flexShrink: 0, 
  display: "grid", 
  placeItems: "center", 
  border: "none", 
  borderRadius: "50%", 
  background: "#F1F6F7", 
  color: "#456175", 
  cursor: "pointer", 
  fontSize: 19, 
  lineHeight: 1, 
}; 
 
const fieldStyle = { 
  display: "grid", 
  gap: 6, 
  marginBottom: 13, 
  color: "#40586C", 
  fontSize: 10, 
  fontWeight: 850, 
}; 
 
const inputStyle = { 
  width: "100%", 
  boxSizing: "border-box", 
  padding: "11px 12px", 
  borderRadius: 11, 
  border: "1px solid #DDE9E7", 
  outline: "none", 
  background: "#FBFDFD", 
  color: "#183047", 
  fontFamily: "inherit", 
  fontSize: 11, 
}; 
 
const twoColumnGrid = { 
  display: "grid", 
  gridTemplateColumns: 
    "repeat(2,minmax(0,1fr))", 
  gap: 12, 
}; 
 
/* ========================================================= 
   RESPONSIVE CSS 
   ========================================================= */ 
 
if ( 
  typeof document !== "undefined" && 
  !document.getElementById( 
    "mealbridge-donor-dashboard-styles" 
  ) 
) { 
  const style = document.createElement("style"); 
 
  style.id = 
    "mealbridge-donor-dashboard-styles"; 
 
  style.textContent = ` 
    .professional-donor-dashboard button:hover { 
      transform: translateY(-1px); 
    } 
 
    .professional-donor-dashboard article { 
      transition: 
        transform .2s ease, 
        box-shadow .2s ease, 
        border-color .2s ease; 
    } 
 
    .professional-donor-dashboard article:hover { 
      transform: translateY(-2px); 
      box-shadow: 
        0 14px 38px rgba(16,72,64,.075); 
    } 
 
    .professional-donor-dashboard input:focus, 
    .professional-donor-dashboard textarea:focus, 
    .professional-donor-dashboard select:focus { 
      border-color: #10B9A4 !important; 
      box-shadow: 
        0 0 0 3px rgba(16,185,164,.09); 
    } 
 
    .impact-summary-section { 
      transition: 
        transform .2s ease, 
        box-shadow .2s ease; 
    } 
 
    .impact-summary-section:hover { 
      box-shadow: 
        0 14px 40px rgba(16,72,64,.07); 
    } 
 
    .summary-stat-card { 
      transition: 
        transform .2s ease, 
        box-shadow .2s ease, 
        border-color .2s ease; 
    } 
 
    .summary-stat-card:hover { 
      transform: translateY(-2px); 
      box-shadow: 
        0 10px 25px rgba(16,72,64,.06); 
      border-color: #D5EAE5 !important; 
    } 
 
    .impact-score-circle { 
      transition: 
        transform .35s ease, 
        box-shadow .35s ease; 
    } 
 
    .impact-score-circle:hover { 
      transform: scale(1.05); 
      box-shadow: 
        0 10px 25px rgba(8,169,121,.12); 
    } 
 
    @media (max-width: 1100px) { 
      .professional-donor-dashboard { 
        max-width: 100%; 
      } 
 
      .impact-summary-body { 
        grid-template-columns: 1fr !important; 
      } 
 
      .impact-score-panel { 
        border-left: none !important; 
        border-top: 1px solid #EAF1EF; 
      } 
    } 
 
    @media (max-width: 900px) { 
      .requests-actions-grid { 
        grid-template-columns: 1fr !important; 
      } 
 
      .donation-grid { 
        grid-template-columns: 
          repeat(2,minmax(0,1fr)) !important; 
      } 
 
      .donor-kpi-grid { 
        grid-template-columns: 
          repeat(2,minmax(0,1fr)) !important; 
      } 
 
      .donor-hero-section { 
        grid-template-columns: 1fr !important; 
      } 
 
      .donor-hero-section > div:last-child { 
        min-height: 230px !important; 
      } 
 
      .professional-donor-dashboard 
        [style*="repeat(5,1fr)"] { 
        gap: 3px !important; 
      } 
    } 
 
    .donor-chat-panel select:focus,
    .donor-chat-panel input:focus {
      border-color: #10B9A4 !important;
      box-shadow: 0 0 0 3px rgba(16,185,164,.09);
    }

    @media (max-width: 800px) {
      .donor-chat-toolbar {
        align-items: flex-start !important;
        flex-direction: column !important;
      }

      .donor-chat-toolbar label {
        width: 100%;
        align-items: flex-start !important;
        flex-direction: column !important;
      }

      .donor-chat-toolbar select {
        width: 100%;
        min-width: 0 !important;
      }

      .donor-chat-body {
        min-height: 330px !important;
        padding: 18px 14px !important;
      }
    }

    @media (max-width: 560px) {
      .donor-chat-header {
        padding: 13px !important;
      }

      .donor-chat-header > span {
        display: none !important;
      }

      .donor-chat-input-wrap {
        flex-wrap: wrap !important;
      }

      .donor-chat-input-wrap input {
        order: 2;
        flex-basis: calc(100% - 48px) !important;
      }

      .donor-chat-input-wrap button[type="submit"] {
        flex: 1;
        justify-content: center;
      }

      .donor-chat-input-wrap button[title="Emoji"] {
        display: none;
      }
    }

    @media (max-width: 800px) { 
      .professional-donor-dashboard { 
        padding-top: 72px !important;
        padding-left: 8px !important; 
        padding-right: 8px !important; 
      } 
 
      .dashboard-top-header { 
        flex-direction: column !important; 
        align-items: flex-start !important; 
      } 
 
      .dashboard-top-header > button { 
        width: 100%; 
        justify-content: center; 
      } 
 
      .donor-kpi-grid { 
        grid-template-columns: 
          repeat(2,minmax(0,1fr)) !important; 
      } 
 
      .summary-stat-grid { 
        grid-template-columns: 1fr !important; 
      } 
 
      .impact-summary-body { 
        display: block !important; 
      } 
 
      .impact-score-panel { 
        border-left: none !important; 
        border-top: 1px solid #EAF1EF; 
      } 
 
      .donation-grid { 
        grid-template-columns: 1fr !important; 
      } 
 
      .requests-actions-grid { 
        display: block !important; 
      } 
 
      .requests-actions-grid > section + section { 
        margin-top: 25px; 
      } 
 
      .professional-donor-dashboard 
        [style*="repeat(4,minmax(0,1fr))"] { 
        grid-template-columns: 
          repeat(2,minmax(0,1fr)) !important; 
      } 
 
      .professional-donor-dashboard 
        [style*="repeat(3,minmax(0,1fr))"] { 
        grid-template-columns: 
          1fr !important; 
      } 
 
      .professional-donor-dashboard 
        [style*="repeat(2,minmax(0,1fr))"] { 
        grid-template-columns: 
          1fr !important; 
      } 
 
      .impact-summary-section > div:first-child { 
        align-items: flex-start !important; 
      } 
 
      .impact-summary-section > div:first-child > div:last-child { 
        margin-top: 2px; 
      } 
    } 
 
    @media (max-width: 500px) { 
      .donor-kpi-grid { 
        grid-template-columns: 
          1fr 1fr !important; 
        gap: 8px !important; 
      } 
 
      .impact-summary-section { 
        border-radius: 15px !important; 
      } 
 
      .impact-summary-section > div:first-child { 
        padding: 17px !important; 
      } 
 
      .impact-summary-section 
        .impact-summary-body 
        > div { 
        padding: 17px !important; 
      } 
 
      .impact-summary-section > div:first-child > div:last-child { 
        padding: 6px 9px !important; 
        font-size: 8px !important; 
      } 
 
      .impact-score-circle { 
        width: 55px !important; 
        height: 55px !important; 
      } 
 
      .impact-score-circle > div { 
        width: 43px !important; 
        height: 43px !important; 
        font-size: 11px !important; 
      } 
 
      .professional-donor-dashboard 
        [style*="repeat(5,1fr)"] { 
        gap: 2px !important; 
      } 
 
      .professional-donor-dashboard 
        [style*="repeat(4,minmax(0,1fr))"] { 
        grid-template-columns: 
          1fr 1fr !important; 
      } 
    } 
  `; 
 
  document.head.appendChild(style); 
}