import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignUp } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Register.css";

export default function Register() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      const storedRole = sessionStorage.getItem("mealbridge-role") || user.unsafeMetadata?.role || "donor";
      
      const syncRoleAndRedirect = async () => {
        // Save the selected role in the user's unsafeMetadata if not already set or mismatching
        if (user.unsafeMetadata?.role !== storedRole) {
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              role: storedRole
            }
          });
        }

        if (storedRole === "donor") navigate("/donor-dashboard");
        else if (storedRole === "receiver") navigate("/receiver-dashboard");
        else if (storedRole === "delivery") navigate("/delivery-dashboard");
      };

      syncRoleAndRedirect();
    }
  }, [isSignedIn, user, navigate]);

  return (
    <>
      <Navbar />
      <main className="auth" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 0" }}>
        <SignUp
          path="/register"
          routing="path"
          signInUrl="/login"
          appearance={{
            elements: {
              card: {
                boxShadow: "var(--shadow)",
                border: "1px solid rgba(255, 138, 0, 0.15)",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(16px)",
              },
              headerTitle: {
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: "800",
                color: "#1b1b1b",
              },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #ff8a00, #ffb547)",
                color: "#ffffff",
                fontWeight: "700",
                borderRadius: "999px",
                border: "none",
                textTransform: "none",
                fontSize: "0.95rem",
              },
              formFieldInput: {
                borderRadius: "12px",
                border: "1px solid rgba(255, 138, 0, 0.2)",
              }
            }
          }}
        />
      </main>
      <Footer />
    </>
  );
}
