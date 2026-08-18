import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignUp } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const syncRoleAndRedirect = async () => {
      if (!isSignedIn || !user) return;

      const storedRole =
        sessionStorage.getItem("mealbridge-role") ||
        user.unsafeMetadata?.role ||
        "donor";

      try {
        if (user.unsafeMetadata?.role !== storedRole) {
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              role: storedRole,
            },
          });
        }
      } catch (error) {
        console.error("Role update failed:", error);
      }

      if (storedRole === "donor") {
        navigate("/donor-dashboard");
      } else if (storedRole === "receiver") {
        navigate("/receiver-dashboard");
      } else if (storedRole === "delivery") {
        navigate("/delivery-dashboard");
      }
    };

    syncRoleAndRedirect();
  }, [isSignedIn, user, navigate]);

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        {/* Decorative background glow */}
        <div className="auth-glow auth-glow-left" />
        <div className="auth-glow auth-glow-right" />

        <div className="auth-container">
          {/* Brand introduction */}
          <div className="auth-intro">
            <div className="auth-badge">
              <span className="auth-badge-dot" />
              AI-POWERED FOOD RESCUE
            </div>

            <h1>
              Turn surplus food
              <span> into meaningful impact.</span>
            </h1>

            <p>
              Join MealBridge and help connect surplus food with
              people and communities who need it most.
            </p>
          </div>

          {/* Clerk Authentication */}
          <div className="auth-card-wrapper">
            <SignUp
              path="/register"
              routing="path"
              signInUrl="/login"
              appearance={{
                layout: {
                  socialButtonsPlacement: "top",
                  socialButtonsVariant: "blockButton",
                },

                variables: {
                  colorPrimary: "#08b486",
                  colorText: "#071426",
                  colorTextSecondary: "#65758b",
                  colorBackground: "#ffffff",
                  colorInputBackground: "#ffffff",
                  colorInputText: "#071426",
                  borderRadius: "16px",
                  fontFamily: "Inter, sans-serif",
                },

                elements: {
                  rootBox: {
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  },

                  card: {
                    width: "100%",
                    maxWidth: "420px",
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(8,180,134,0.12)",
                    borderRadius: "26px",
                    boxShadow:
                      "0 30px 80px rgba(7,20,38,0.12)",
                    backdropFilter: "blur(20px)",
                  },

                  headerTitle: {
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "25px",
                    fontWeight: "800",
                    color: "#071426",
                  },

                  headerSubtitle: {
                    fontFamily: "Inter, sans-serif",
                    color: "#65758b",
                    fontSize: "14px",
                  },

                  socialButtonsBlockButton: {
                    height: "46px",
                    borderRadius: "13px",
                    border: "1px solid rgba(7,20,38,0.10)",
                    background: "#ffffff",
                    color: "#071426",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  },

                  socialButtonsBlockButtonHover: {
                    background: "#f0fbf7",
                    borderColor: "#08b486",
                  },

                  formFieldLabel: {
                    color: "#071426",
                    fontWeight: "600",
                    fontSize: "13px",
                  },

                  formFieldInput: {
                    height: "46px",
                    borderRadius: "13px",
                    border: "1px solid rgba(7,20,38,0.12)",
                    background: "#ffffff",
                    transition: "all 0.2s ease",
                  },

                  formFieldInputFocus: {
                    borderColor: "#08b486",
                    boxShadow:
                      "0 0 0 3px rgba(8,180,134,0.12)",
                  },

                  formButtonPrimary: {
                    height: "47px",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(135deg, #06a878 0%, #13c79a 100%)",
                    color: "#ffffff",
                    fontWeight: "700",
                    boxShadow:
                      "0 12px 28px rgba(8,180,134,0.22)",
                    transition: "all 0.2s ease",
                  },

                  formButtonPrimaryHover: {
                    background:
                      "linear-gradient(135deg, #05966d 0%, #0fbd91 100%)",
                    transform: "translateY(-1px)",
                    boxShadow:
                      "0 15px 32px rgba(8,180,134,0.28)",
                  },

                  footerActionLink: {
                    color: "#08a979",
                    fontWeight: "700",
                  },

                  footerActionLinkHover: {
                    color: "#057d5e",
                  },

                  dividerLine: {
                    background: "rgba(7,20,38,0.08)",
                  },

                  dividerText: {
                    color: "#8a98a9",
                  },

                  footer: {
                    background: "transparent",
                  },
                },
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}