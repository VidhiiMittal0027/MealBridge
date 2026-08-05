import DashboardLayout from "../components/DashboardLayout";
import "./NGODashboard.css";

export default function NGODashboard() {
  return (
    <DashboardLayout>
      <div className="portal-content">
        <p className="eyebrow">NGO PORTAL</p>
        <h1>Food Opportunities</h1>
        <article className="panel">
          <h2>Prepared Salad Trays</h2>
          <p>20 meals · 3.4 km · Safe for 4 hours</p>
          <button className="btn">Accept Donation</button>
        </article>
      </div>
    </DashboardLayout>
  );
}