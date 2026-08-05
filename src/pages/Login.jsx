import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, useUser } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Login.css";

export default function Login() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const syncRoleAndRedirect = async () => {
      if (isSignedIn && user) {
        const storedRole = sessionStorage.getItem("mealbridge-role") || "donor";
        
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
      }
    };
    syncRoleAndRedirect();
  }, [isSignedIn, user, navigate]);

  return (
    <>
      <Navbar />
      <main className="auth">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/register"
          appearance={{
            elements: {
              card: {
                boxShadow: "var(--shadow)",
                border: "1px solid rgba(255, 138, 0, 0.15)",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(16px)",
                width: "100%",
                maxWidth: "400px",
              },
              headerTitle: {
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: "800",
                color: "#1b1b1b",
              },
              headerSubtitle: {
                fontFamily: "'Inter', sans-serif",
                color: "#5c5c5c",
              },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #ff8a00, #ffb547)",
                color: "#ffffff",
                fontWeight: "700",
                borderRadius: "999px",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #ff8a00, #ffb547)",
                  opacity: 0.95,
                },
              },
              formFieldInput: {
                borderRadius: "12px",
                border: "1px solid rgba(255, 138, 0, 0.2)",
                "&:focus": {
                  borderColor: "#ff8a00",
                  boxShadow: "0 0 0 3px rgba(255, 138, 0, 0.15)",
                }
              },
              footerActionLink: {
                color: "#ff8a00",
                "&:hover": {
                  color: "#ffb547",
                }
              }
            }
          }}
        />
      </main>
      <Footer />
    </>
  );
}
