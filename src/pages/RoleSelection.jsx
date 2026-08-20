import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./RoleSelection.css";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      // 1. Check Clerk metadata
      const clerkRole = user?.unsafeMetadata?.role || user?.publicMetadata?.role;
      if (clerkRole === "admin") {
        setIsAdmin(true);
        return;
      }

      // 2. Check Supabase profiles table
      if (user?.id && supabase) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (!error && data?.role === "admin") {
            setIsAdmin(true);
            return;
          }
        } catch (err) {
          console.warn("Supabase profiles role check notice:", err);
        }
      }

      // 3. Check session storage for admin session
      const storedRole = typeof window !== "undefined" ? sessionStorage.getItem("mealbridge-role") : null;
      if (storedRole === "admin") {
        setIsAdmin(true);
        return;
      }

      setIsAdmin(false);
    };

    verifyAdminStatus();
  }, [user]);

  const handleSelect = async (role, path) => {
    sessionStorage.setItem("mealbridge-role", role);
    if (user && user.unsafeMetadata?.role !== role) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            role,
          },
        });
      } catch (err) {
        console.error("Error updating role:", err);
      }
    }
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <main className="section">
        <p className="eyebrow">CHOOSE YOUR ROLE</p>
        <h1>How will you create impact?</h1>
        <div className="grid">
          <div
            className="role-card"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect("donor", "/donor-dashboard")}
          >
            <h2>🍱 Donor</h2>
            <p>List surplus food and monitor impact.</p>
          </div>
          <div
            className="role-card"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect("receiver", "/receiver-dashboard")}
          >
            <h2>🏘️ NGO / Receiver</h2>
            <p>Receive and distribute matched food donations.</p>
          </div>
          <div
            className="role-card"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect("admin", "/admin")}
          >
            <h2>🛡️ Platform Admin</h2>
            <p>Verify NGOs & donors, moderate listings, and resolve disputes.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}