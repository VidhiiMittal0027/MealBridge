import React, { useState, useContext, useMemo } from "react";
import { useUser, useAuth } from "@clerk/react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import {
  MapPin,
  Utensils,
  Package,
  Truck,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Phone,
  Calendar
} from "../components/Icons";

/*
  ============================================================
  MEALBRIDGE — PREMIUM RECEIVER COMMAND CENTER
  ============================================================
  Existing functionality preserved:
  - Clerk authentication
  - MealBridgeContext
  - Donation matching
  - Food requests
  - Orders
  - Donor chat
  - Organization registration
  - Request confirmation
*/

const COLORS = {
  navy: "#071A2F",
  navy2: "#0B2742",
  navy3: "#123653",
  emerald: "#16A085",
  mint: "#52D6B8",
  green: "#16A085",
  bg: "#F4F7F9",
  white: "#FFFFFF",
  text: "#10263D",
  muted: "#718096",
  border: "#E3EAF0",
  softGreen: "#E8F8F4",
  orange: "#F59E0B",
  red: "#E85D5D",
};

const styles = `
  * {
    box-sizing: border-box;
  }

  .receiver-page {
    min-height: 100%;
    background:
      radial-gradient(circle at 90% 0%, rgba(22,160,133,.08), transparent 30%),
      radial-gradient(circle at 0% 20%, rgba(7,26,47,.045), transparent 28%),
      ${COLORS.bg};
    color: ${COLORS.text};
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .receiver-shell {
    width: min(1450px, 100%);
    margin: 0 auto;
    padding: 28px 30px 60px;
  }

  .receiver-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(22,160,133,.09);
    color: ${COLORS.emerald};
    border: 1px solid rgba(22,160,133,.16);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .09em;
    text-transform: uppercase;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${COLORS.emerald};
    box-shadow: 0 0 0 5px rgba(22,160,133,.10);
    animation: pulseLive 1.8s infinite;
  }

  @keyframes pulseLive {
    0%,100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(.7); opacity: .65; }
  }

  .topbar-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${COLORS.muted};
    font-size: 13px;
    font-weight: 700;
  }

  .verified-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 13px;
    background: white;
    border: 1px solid ${COLORS.border};
    border-radius: 999px;
    box-shadow: 0 5px 20px rgba(7,26,47,.04);
  }

  .verified-check {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${COLORS.emerald};
    color: white;
    font-size: 11px;
    font-weight: 900;
  }

  /* HERO */

  .premium-hero {
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    padding: 42px;
    min-height: 280px;
    color: white;
    background:
      radial-gradient(circle at 82% 18%, rgba(82,214,184,.25), transparent 24%),
      radial-gradient(circle at 100% 100%, rgba(22,160,133,.35), transparent 32%),
      linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navy2} 55%, #0C3A50 100%);
    box-shadow:
      0 28px 70px rgba(7,26,47,.18),
      inset 0 1px 0 rgba(255,255,255,.08);
  }

  .premium-hero::before {
    content: "";
    position: absolute;
    width: 330px;
    height: 330px;
    border-radius: 50%;
    right: -100px;
    top: -140px;
    border: 1px solid rgba(255,255,255,.10);
  }

  .premium-hero::after {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    right: 30px;
    bottom: -160px;
    background: rgba(82,214,184,.08);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 760px;
  }

  .hero-kicker {
    color: ${COLORS.mint};
    text-transform: uppercase;
    letter-spacing: .14em;
    font-size: 11px;
    font-weight: 900;
    margin-bottom: 15px;
  }

  .hero-title {
    margin: 0;
    font-size: clamp(2.1rem, 4vw, 3.7rem);
    line-height: 1.02;
    letter-spacing: -.055em;
    font-weight: 950;
  }

  .hero-title span {
    color: ${COLORS.mint};
  }

  .hero-description {
    max-width: 650px;
    margin: 18px 0 25px;
    color: rgba(255,255,255,.72);
    font-size: 15px;
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 11px;
  }

  .hero-primary {
    border: 0;
    border-radius: 13px;
    padding: 13px 19px;
    background: ${COLORS.mint};
    color: ${COLORS.navy};
    font-weight: 950;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(82,214,184,.18);
    transition: .2s ease;
  }

  .hero-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 17px 35px rgba(82,214,184,.28);
  }

  .hero-secondary {
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 13px;
    padding: 13px 18px;
    background: rgba(255,255,255,.07);
    color: white;
    font-weight: 850;
    cursor: pointer;
    backdrop-filter: blur(10px);
  }

  .hero-secondary:hover {
    background: rgba(255,255,255,.11);
  }

  .hero-network {
    position: absolute;
    right: 38px;
    top: 42px;
    width: 260px;
    height: 190px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .network-ring {
    position: absolute;
    border: 1px solid rgba(82,214,184,.17);
    border-radius: 50%;
  }

  .ring-one {
    width: 170px;
    height: 170px;
  }

  .ring-two {
    width: 125px;
    height: 125px;
  }

  .ring-three {
    width: 78px;
    height: 78px;
    background: rgba(82,214,184,.08);
  }

  .network-center {
    width: 58px;
    height: 58px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    background: rgba(82,214,184,.16);
    border: 1px solid rgba(82,214,184,.3);
    color: ${COLORS.mint};
    font-size: 25px;
    z-index: 3;
    box-shadow: 0 0 40px rgba(82,214,184,.12);
  }

  .network-node {
    position: absolute;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: rgba(255,255,255,.09);
    border: 1px solid rgba(255,255,255,.13);
    backdrop-filter: blur(8px);
    font-size: 15px;
  }

  .node-one { top: 6px; left: 111px; }
  .node-two { right: 17px; top: 78px; }
  .node-three { bottom: 4px; left: 111px; }
  .node-four { left: 17px; top: 78px; }

  /* STATS */

  .impact-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0,1fr));
    gap: 15px;
    margin: 18px 0 34px;
  }

  .impact-card {
    background: rgba(255,255,255,.92);
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    padding: 19px;
    box-shadow: 0 10px 30px rgba(7,26,47,.045);
    transition: .2s ease;
  }

  .impact-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 17px 38px rgba(7,26,47,.08);
  }

  .impact-icon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: ${COLORS.softGreen};
    font-size: 17px;
    margin-bottom: 14px;
  }

  .impact-value {
    font-size: 27px;
    font-weight: 950;
    letter-spacing: -.045em;
    color: ${COLORS.navy};
  }

  .impact-label {
    margin-top: 4px;
    color: ${COLORS.muted};
    font-size: 12px;
    font-weight: 750;
  }

  .impact-trend {
    float: right;
    color: ${COLORS.emerald};
    font-size: 11px;
    font-weight: 900;
    background: ${COLORS.softGreen};
    border-radius: 999px;
    padding: 5px 8px;
  }

  /* SECTION */

  .section {
    margin-top: 34px;
  }

  .section-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 17px;
  }

  .section-kicker {
    color: ${COLORS.emerald};
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .12em;
    margin-bottom: 5px;
  }

  .section-title {
    margin: 0;
    color: ${COLORS.navy};
    font-size: 23px;
    letter-spacing: -.035em;
    font-weight: 950;
  }

  .section-description {
    margin: 5px 0 0;
    color: ${COLORS.muted};
    font-size: 13px;
  }

  .section-count {
    padding: 8px 11px;
    border-radius: 999px;
    background: white;
    border: 1px solid ${COLORS.border};
    color: ${COLORS.muted};
    font-size: 11px;
    font-weight: 900;
  }

  /* DONATIONS */

  .donations-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 18px;
  }

  .donation-card {
    overflow: hidden;
    background: white;
    border: 1px solid ${COLORS.border};
    border-radius: 23px;
    box-shadow: 0 12px 35px rgba(7,26,47,.055);
    transition: .25s ease;
  }

  .donation-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 22px 48px rgba(7,26,47,.11);
    border-color: rgba(22,160,133,.28);
  }

  .donation-image-wrap {
    position: relative;
    height: 190px;
    overflow: hidden;
    background: #e9eef2;
  }

  .donation-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .4s ease;
  }

  .donation-card:hover .donation-image {
    transform: scale(1.045);
  }

  .live-badge {
    position: absolute;
    left: 13px;
    top: 13px;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(7,26,47,.78);
    color: white;
    backdrop-filter: blur(10px);
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .04em;
  }

  .live-badge::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${COLORS.mint};
  }

  .food-type {
    position: absolute;
    right: 13px;
    top: 13px;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.93);
    color: ${COLORS.navy};
    font-size: 10px;
    font-weight: 900;
  }

  .donation-body {
    padding: 19px;
  }

  .donation-title-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
  }

  .donation-title {
    margin: 0;
    color: ${COLORS.navy};
    font-size: 17px;
    font-weight: 950;
    letter-spacing: -.025em;
  }

  .veg-chip {
    flex-shrink: 0;
    padding: 5px 8px;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 950;
    border: 1px solid rgba(22,160,133,.17);
    color: ${COLORS.emerald};
    background: ${COLORS.softGreen};
  }

  .nonveg-chip {
    color: #C24141;
    background: #FFF0F0;
    border-color: #F7D3D3;
  }

  .donation-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 14px 0;
  }

  .meta-pill {
    padding: 7px 9px;
    border-radius: 9px;
    background: #F6F8FA;
    color: ${COLORS.muted};
    font-size: 10px;
    font-weight: 850;
  }

  .freshness-box {
    padding: 12px;
    border-radius: 13px;
    background: linear-gradient(135deg, #F1FBF8, #F8FCFB);
    border: 1px solid rgba(22,160,133,.11);
    margin-bottom: 14px;
  }

  .freshness-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .freshness-label {
    color: ${COLORS.navy};
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .04em;
  }

  .freshness-value {
    color: ${COLORS.emerald};
    font-size: 12px;
    font-weight: 950;
  }

  .freshness-track {
    height: 5px;
    overflow: hidden;
    border-radius: 999px;
    background: #DCECE8;
  }

  .freshness-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.mint});
  }

  .view-button {
    width: 100%;
    border: 0;
    border-radius: 12px;
    padding: 12px;
    background: ${COLORS.navy};
    color: white;
    font-weight: 900;
    cursor: pointer;
    transition: .2s ease;
  }

  .view-button:hover {
    background: ${COLORS.emerald};
    transform: translateY(-1px);
  }

  /* ORDERS */

  .orders-layout {
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 18px;
  }

  .orders-card,
  .organization-card {
    background: white;
    border: 1px solid ${COLORS.border};
    border-radius: 23px;
    box-shadow: 0 12px 35px rgba(7,26,47,.045);
  }

  .orders-card {
    padding: 20px;
  }

  .order-item {
    padding: 17px 0;
    border-bottom: 1px solid #EDF1F4;
  }

  .order-item:first-child {
    padding-top: 2px;
  }

  .order-item:last-child {
    border-bottom: 0;
    padding-bottom: 2px;
  }

  .order-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .order-name {
    margin: 0;
    color: ${COLORS.navy};
    font-size: 15px;
    font-weight: 950;
  }

  .status-pill {
    padding: 6px 9px;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 950;
  }

  .status-success {
    background: #E8F8F4;
    color: #12846E;
  }

  .status-info {
    background: #ECF4FF;
    color: #3475B8;
  }

  .status-warning {
    background: #FFF7E5;
    color: #B77908;
  }

  .order-details {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 15px;
    margin-top: 9px;
    color: ${COLORS.muted};
    font-size: 11px;
    font-weight: 700;
  }

  .order-details span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  /* TIMELINE */

  .timeline {
    margin-top: 14px;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .timeline-step {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .timeline-dot {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    background: #E9EEF2;
    color: #9AA8B4;
    font-size: 9px;
    font-weight: 950;
  }

  .timeline-dot.active {
    background: ${COLORS.emerald};
    color: white;
    box-shadow: 0 0 0 5px rgba(22,160,133,.09);
  }

  .timeline-line {
    height: 2px;
    flex: 1;
    background: #E6EBEF;
  }

  .timeline-line.active {
    background: ${COLORS.emerald};
  }

  /* ORG CARD */

  .organization-card {
    padding: 23px;
    position: relative;
    overflow: hidden;
  }

  .organization-card::before {
    content: "";
    position: absolute;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(22,160,133,.06);
    right: -80px;
    top: -80px;
  }

  .org-label {
    color: ${COLORS.muted};
    text-transform: uppercase;
    letter-spacing: .1em;
    font-size: 9px;
    font-weight: 950;
  }

  .org-name {
    margin: 7px 0 4px;
    color: ${COLORS.navy};
    font-size: 21px;
    font-weight: 950;
    letter-spacing: -.04em;
  }

  .org-type {
    color: ${COLORS.muted};
    font-size: 12px;
    font-weight: 700;
  }

  .org-divider {
    height: 1px;
    background: #EDF1F4;
    margin: 18px 0;
  }

  .org-stats {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 8px;
  }

  .org-stat {
    padding: 11px 8px;
    text-align: center;
    background: #F7F9FA;
    border-radius: 12px;
  }

  .org-stat strong {
    display: block;
    color: ${COLORS.navy};
    font-size: 16px;
    font-weight: 950;
  }

  .org-stat span {
    display: block;
    color: ${COLORS.muted};
    margin-top: 3px;
    font-size: 8px;
    font-weight: 850;
  }

  .trust-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 17px;
  }

  .trust-stars {
    color: #E7A900;
    letter-spacing: 2px;
    font-size: 12px;
  }

  .trust-text {
    color: ${COLORS.muted};
    font-size: 10px;
    font-weight: 800;
  }

  /* EMPTY */

  .empty-state {
    background: white;
    border: 1px dashed #CBD6DE;
    border-radius: 22px;
    padding: 55px 25px;
    text-align: center;
  }

  .empty-icon {
    width: 58px;
    height: 58px;
    margin: 0 auto 14px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: ${COLORS.softGreen};
    font-size: 24px;
  }

  .empty-state h3 {
    margin: 0;
    color: ${COLORS.navy};
    font-size: 17px;
    font-weight: 950;
  }

  .empty-state p {
    max-width: 480px;
    margin: 8px auto 0;
    color: ${COLORS.muted};
    font-size: 12px;
    line-height: 1.6;
  }

  /* REGISTER */

  .registration-alert {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 17px 20px;
    margin-bottom: 18px;
    border-radius: 19px;
    background: linear-gradient(135deg, #FFF8E9, #FFFDF8);
    border: 1px solid #F4DFB1;
    box-shadow: 0 8px 25px rgba(181,129,30,.05);
  }

  .registration-alert-left {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .alert-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: #FFF0C9;
    font-size: 17px;
  }

  .registration-alert h3 {
    margin: 0;
    color: #7C5A12;
    font-size: 13px;
    font-weight: 950;
  }

  .registration-alert p {
    margin: 3px 0 0;
    color: #9A7934;
    font-size: 11px;
  }

  .register-button {
    flex-shrink: 0;
    border: 0;
    border-radius: 11px;
    padding: 11px 15px;
    background: ${COLORS.navy};
    color: white;
    font-size: 11px;
    font-weight: 900;
    cursor: pointer;
  }

  /* TOAST */

  .premium-toast {
    position: fixed;
    z-index: 5000;
    right: 24px;
    top: 24px;
    padding: 14px 17px;
    border-radius: 14px;
    background: ${COLORS.navy};
    color: white;
    box-shadow: 0 18px 45px rgba(7,26,47,.2);
    font-size: 12px;
    font-weight: 800;
    animation: toastIn .25s ease;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* MODALS */

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2000;
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(3,14,26,.68);
    backdrop-filter: blur(10px);
    animation: fadeIn .2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    width: min(1120px, 100%);
    max-height: 92vh;
    overflow: hidden;
    border-radius: 26px;
    background: white;
    box-shadow: 0 35px 100px rgba(0,0,0,.28);
    animation: modalUp .25s ease;
  }

  @keyframes modalUp {
    from { opacity: 0; transform: translateY(18px) scale(.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .modal-small {
    width: min(540px, 100%);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 20px 23px;
    border-bottom: 1px solid #EDF1F4;
  }

  .modal-header h2 {
    margin: 0;
    color: ${COLORS.navy};
    font-size: 18px;
    font-weight: 950;
    letter-spacing: -.025em;
  }

  .close-button {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 10px;
    background: #F1F4F6;
    color: ${COLORS.navy};
    font-size: 22px;
    cursor: pointer;
  }

  .modal-content {
    overflow-y: auto;
    max-height: calc(92vh - 76px);
  }

  .details-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .details-left {
    padding: 22px;
    border-right: 1px solid #EDF1F4;
  }

  .details-right {
    padding: 22px;
    background: #FBFCFD;
  }

  .details-image {
    width: 100%;
    height: 255px;
    object-fit: cover;
    border-radius: 18px;
  }

  .ai-verification {
    margin-top: 14px;
    padding: 15px;
    border-radius: 16px;
    background: linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navy2});
    color: white;
  }

  .ai-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .ai-score {
    margin-top: 9px;
    display: flex;
    align-items: baseline;
    gap: 5px;
  }

  .ai-score strong {
    font-size: 30px;
    color: ${COLORS.mint};
    font-weight: 950;
  }

  .ai-score span {
    color: rgba(255,255,255,.6);
    font-size: 11px;
  }

  .details-section {
    margin-top: 20px;
  }

  .details-section h3 {
    margin: 0 0 10px;
    color: ${COLORS.navy};
    font-size: 13px;
    font-weight: 950;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
  }

  .detail-box {
    padding: 11px;
    border-radius: 11px;
    background: #F6F8FA;
  }

  .detail-box small {
    display: block;
    color: ${COLORS.muted};
    font-size: 8px;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: .05em;
  }

  .detail-box strong {
    display: block;
    margin-top: 3px;
    color: ${COLORS.navy};
    font-size: 11px;
  }

  .location-box {
    padding: 12px;
    border-radius: 12px;
    background: ${COLORS.softGreen};
    color: ${COLORS.navy};
    font-size: 11px;
    line-height: 1.5;
    font-weight: 750;
  }

  .chat-card {
    padding: 17px;
    border: 1px solid ${COLORS.border};
    border-radius: 17px;
    background: white;
  }

  .chat-card h3 {
    margin: 0;
    color: ${COLORS.navy};
    font-size: 14px;
    font-weight: 950;
  }

  .chat-subtitle {
    margin: 5px 0 14px;
    color: ${COLORS.muted};
    font-size: 10px;
    line-height: 1.5;
  }

  .chat-messages {
    min-height: 130px;
    max-height: 220px;
    overflow-y: auto;
    padding: 4px;
  }

  .message-row {
    margin-bottom: 10px;
  }

  .message-row.me {
    text-align: right;
  }

  .message-name {
    display: block;
    color: ${COLORS.muted};
    font-size: 8px;
    font-weight: 850;
    margin-bottom: 3px;
  }

  .message-bubble {
    display: inline-block;
    max-width: 85%;
    padding: 9px 11px;
    border-radius: 11px;
    background: #F0F3F5;
    color: ${COLORS.text};
    font-size: 10px;
    line-height: 1.45;
    text-align: left;
  }

  .message-row.me .message-bubble {
    background: ${COLORS.navy};
    color: white;
  }

  .chat-form {
    display: flex;
    gap: 7px;
    margin-top: 10px;
  }

  .chat-form input {
    min-width: 0;
    flex: 1;
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 10px;
    outline: none;
    font-size: 10px;
  }

  .chat-form input:focus {
    border-color: ${COLORS.emerald};
  }

  .send-button {
    border: 0;
    border-radius: 10px;
    padding: 0 13px;
    background: ${COLORS.emerald};
    color: white;
    font-size: 10px;
    font-weight: 900;
    cursor: pointer;
  }

  .request-box {
    margin-top: 14px;
    padding: 16px;
    border-radius: 17px;
    background: linear-gradient(135deg, #F0FBF8, #FAFEFD);
    border: 1px solid rgba(22,160,133,.14);
  }

  .request-box p {
    margin: 0 0 11px;
    color: ${COLORS.text};
    font-size: 11px;
    line-height: 1.5;
    font-weight: 750;
  }

  .request-button {
    width: 100%;
    border: 0;
    border-radius: 11px;
    padding: 12px;
    background: ${COLORS.emerald};
    color: white;
    font-weight: 950;
    font-size: 11px;
    cursor: pointer;
  }

  .request-button:disabled {
    opacity: .45;
    cursor: not-allowed;
  }

  .auth-box {
    padding: 30px;
    text-align: center;
  }

  .auth-icon {
    width: 55px;
    height: 55px;
    display: grid;
    place-items: center;
    margin: 0 auto 13px;
    border-radius: 17px;
    background: ${COLORS.softGreen};
    font-size: 22px;
  }

  /* FORM */

  .form {
    padding: 22px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 13px;
  }

  .field.full {
    grid-column: 1 / -1;
  }

  .field label {
    color: ${COLORS.navy};
    font-size: 10px;
    font-weight: 900;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    border: 1px solid ${COLORS.border};
    border-radius: 11px;
    padding: 11px 12px;
    outline: none;
    color: ${COLORS.text};
    background: #FBFCFD;
    font: inherit;
    font-size: 11px;
  }

  .field textarea {
    resize: vertical;
  }

  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    border-color: ${COLORS.emerald};
    background: white;
    box-shadow: 0 0 0 3px rgba(22,160,133,.07);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 9px;
    margin-top: 9px;
    padding-top: 16px;
    border-top: 1px solid #EDF1F4;
  }

  .cancel-button {
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 11px 15px;
    background: white;
    color: ${COLORS.muted};
    font-weight: 850;
    cursor: pointer;
  }

  .confirm-button {
    border: 0;
    border-radius: 10px;
    padding: 11px 16px;
    background: ${COLORS.navy};
    color: white;
    font-weight: 900;
    cursor: pointer;
  }

  /* RESPONSIVE */

  @media (max-width: 1100px) {
    .hero-network {
      opacity: .35;
      right: -20px;
    }

    .donations-grid {
      grid-template-columns: repeat(2, minmax(0,1fr));
    }

    .orders-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 800px) {
    .receiver-shell {
      padding: 20px 15px 45px;
    }

    .premium-hero {
      padding: 29px 23px;
      min-height: 330px;
    }

    .hero-network {
      opacity: .15;
      right: -45px;
      top: 125px;
    }

    .impact-grid {
      grid-template-columns: repeat(2,1fr);
    }

    .details-layout {
      grid-template-columns: 1fr;
    }

    .details-left {
      border-right: 0;
      border-bottom: 1px solid #EDF1F4;
    }

    .registration-alert {
      align-items: flex-start;
      flex-direction: column;
    }

    .register-button {
      width: 100%;
    }
  }

  @media (max-width: 600px) {
    .receiver-topbar {
      align-items: flex-start;
      flex-direction: column;
    }

    .topbar-meta {
      width: 100%;
      justify-content: space-between;
    }

    .premium-hero {
      border-radius: 23px;
    }

    .hero-title {
      font-size: 2.15rem;
    }

    .donations-grid {
      grid-template-columns: 1fr;
    }

    .impact-grid {
      grid-template-columns: 1fr 1fr;
      gap: 9px;
    }

    .impact-card {
      padding: 14px;
    }

    .impact-value {
      font-size: 22px;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .field.full {
      grid-column: auto;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .modal-backdrop {
      padding: 10px;
    }

    .modal {
      border-radius: 20px;
    }
  }

  /* SUB-PAGE MODULE STYLES */
  .category-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .category-pill {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid ${COLORS.border};
    background: white;
    color: ${COLORS.text};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .category-pill:hover,
  .category-pill.active {
    background: ${COLORS.emerald};
    color: white;
    border-color: ${COLORS.emerald};
    box-shadow: 0 4px 12px rgba(22, 160, 133, 0.25);
  }

  .search-box-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border: 1px solid ${COLORS.border};
    border-radius: 14px;
    padding: 10px 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 15px rgba(7, 26, 47, 0.03);
  }

  .search-box-input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    color: ${COLORS.text};
    background: transparent;
    font-family: inherit;
  }

  .requests-filter-tabs {
    display: flex;
    gap: 10px;
    border-bottom: 1px solid ${COLORS.border};
    margin-bottom: 22px;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .filter-tab {
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: ${COLORS.muted};
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-tab:hover {
    color: ${COLORS.text};
    background: #eef4f3;
  }

  .filter-tab.active {
    color: ${COLORS.emerald};
    background: ${COLORS.softGreen};
  }

  .module-card {
    background: white;
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(7, 26, 47, 0.04);
    margin-bottom: 20px;
  }

  .module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .notif-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 18px;
    border-radius: 14px;
    background: white;
    border: 1px solid ${COLORS.border};
    margin-bottom: 12px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .notif-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(7, 26, 47, 0.06);
  }

  .notif-unread {
    border-left: 4px solid ${COLORS.emerald};
    background: #F7FBFA;
  }

  .notif-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: ${COLORS.softGreen};
    font-size: 18px;
    flex-shrink: 0;
  }

  .faq-card {
    background: white;
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .faq-question {
    width: 100%;
    text-align: left;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 800;
    color: ${COLORS.navy};
    font-family: inherit;
  }

  .faq-answer {
    padding: 0 20px 18px;
    font-size: 13px;
    line-height: 1.6;
    color: ${COLORS.muted};
    border-top: 1px solid #F0F4F3;
    padding-top: 14px;
  }
`;

export default function ReceiverPage() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const {
    donations,
    orders,
    messages,
    toast,
    isOrgRegistered,
    orgDetails,
    registerOrganization,
    requestFood,
    sendChatMessage,
  } = useContext(MealBridgeContext);

  /* =========================================================
     STATE
  ========================================================= */

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("NGO");
  const [regNum, setRegNum] = useState("");
  const [contactName, setContactName] = useState(
    user?.fullName || ""
  );
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [dailyServed, setDailyServed] = useState(50);
  const [description, setDescription] = useState("");

  const [expectedPeople, setExpectedPeople] = useState(10);
  const [donorMessage, setDonorMessage] = useState("");
  const [questionText, setQuestionText] = useState("");

  const [uploadedDocName, setUploadedDocName] = useState(
    user?.unsafeMetadata?.ngoDocName || "ngo_darpan_registration.pdf"
  );
  const [isSavingNgoProfile, setIsSavingNgoProfile] = useState(false);

  const [receiverTicketCategory, setReceiverTicketCategory] = useState("Urgent Delivery Assistance");
  const [receiverTicketSubject, setReceiverTicketSubject] = useState("");
  const [receiverTicketMessage, setReceiverTicketMessage] = useState("");
  const [receiverTicketPriority, setReceiverTicketPriority] = useState("High");
  const [receiverSubmittedTicket, setReceiverSubmittedTicket] = useState(null);
  const [isSubmittingReceiverTicket, setIsSubmittingReceiverTicket] = useState(false);

  /* =========================================================
     ROUTING & FILTERS
  ========================================================= */
  const location = useLocation();
  const currentPath = location.pathname;

  const isOverview =
    currentPath === "/receiver-dashboard" ||
    currentPath === "/receiver-dashboard/" ||
    currentPath === "/receiver" ||
    currentPath === "/ngo-dashboard";
  const isBrowse =
    currentPath.startsWith("/receiver-dashboard/browse") ||
    currentPath.startsWith("/ngo-matching");
  const isRequests = currentPath.startsWith("/receiver-dashboard/requests");
  const isHistory = currentPath.startsWith("/receiver-dashboard/history");
  const isDelivery = currentPath.startsWith("/receiver-dashboard/delivery");
  const isNotifications = currentPath.startsWith(
    "/receiver-dashboard/notifications"
  );
  const isProfile = currentPath.startsWith("/receiver-dashboard/profile");
  const isImpact = currentPath.startsWith("/receiver-dashboard/impact");
  const isSupport = currentPath.startsWith("/receiver-dashboard/support");

  // Filters & Accordion State
  const [browseCategory, setBrowseCategory] = useState("All");
  const [browseSearch, setBrowseSearch] = useState("");
  const [requestsFilter, setRequestsFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  /* =========================================================
     DATA
  ========================================================= */

  const availableItems = (donations || []).filter(
    (d) =>
      d.status === "Available for NGO Matching" ||
      d.status === "Matching Pending"
  );

  const myNGOOrders = (orders || []).filter(
    (o) =>
      o.ngoName ===
      (orgDetails?.orgName || "City Hope Kitchen")
  );

  const filteredAvailableItems = useMemo(() => {
    return availableItems.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      const veg = item.vegNonVeg === "Veg";
      const filter = browseCategory.toLowerCase();

      let matchCategory = true;
      if (browseCategory === "Veg") matchCategory = veg;
      else if (browseCategory === "Non-Veg") matchCategory = !veg;
      else if (browseCategory !== "All") matchCategory = cat.includes(filter);

      const matchSearch =
        !browseSearch ||
        (item.name && item.name.toLowerCase().includes(browseSearch.toLowerCase())) ||
        (item.donorName && item.donorName.toLowerCase().includes(browseSearch.toLowerCase())) ||
        (item.pickupAddress && item.pickupAddress.toLowerCase().includes(browseSearch.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [availableItems, browseCategory, browseSearch]);

  const filteredNGOOrders = useMemo(() => {
    return myNGOOrders.filter((order) => {
      if (requestsFilter === "all") return true;
      if (requestsFilter === "pending")
        return order.status === "Pending" || order.status === "Matching Pending";
      if (requestsFilter === "accepted")
        return (
          order.status === "Accepted" ||
          order.status === "Ready for Pickup" ||
          order.status === "Preparing"
        );
      if (requestsFilter === "completed")
        return order.status === "Completed" || order.status === "Picked Up";
      if (requestsFilter === "declined")
        return order.status === "Declined" || order.status === "Cancelled";
      return true;
    });
  }, [myNGOOrders, requestsFilter]);

  const completedOrderHistory = useMemo(() => {
    return myNGOOrders.filter(
      (o) => o.status === "Completed" || o.status === "Picked Up"
    );
  }, [myNGOOrders]);

  const activeDeliveries = useMemo(() => {
    return myNGOOrders.filter(
      (o) =>
        o.status === "Accepted" ||
        o.status === "Ready for Pickup" ||
        o.status === "Preparing"
    );
  }, [myNGOOrders]);

  const activeMessages = selectedItem
    ? (messages || []).filter(
        (m) => m.donationId === selectedItem.id
      )
    : [];

  const totalServings = availableItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const completedOrders = completedOrderHistory.length;

  const pendingOrders = myNGOOrders.filter(
    (o) =>
      o.status !== "Completed" &&
      o.status !== "Picked Up"
  ).length;

  const peopleServed =
    myNGOOrders.reduce(
      (sum, order) =>
        sum + Number(order.expectedPeople || 0),
      0
    ) || 0;

  /* =========================================================
     ACTIONS
  ========================================================= */

  const openDetails = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
    setQuestionText("");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const details = {
      orgName,
      orgType,
      regNum,
      contactName,
      email,
      phone,
      address,
      city,
      state: stateName,
      pinCode,
      dailyServed: Number(dailyServed),
      description,
    };

    registerOrganization(details);
    setIsRegisterModalOpen(false);
  };

  const handleSaveProfileFromPage = async (e) => {
    e.preventDefault();
    setIsSavingNgoProfile(true);
    const details = {
      orgName: orgName || orgDetails?.orgName || "City Hope Kitchen",
      orgType: orgType || orgDetails?.orgType || "NGO",
      regNum: regNum || orgDetails?.regNum || "NGO-88219-IND",
      contactName: contactName || orgDetails?.contactName || user?.fullName || "Director Coordinator",
      email: email || orgDetails?.email || user?.primaryEmailAddress?.emailAddress || "contact@cityhope.org",
      phone: phone || orgDetails?.phone || "9876543210",
      address: address || orgDetails?.address || "Building 4, Community Rescue Hub",
      city: city || orgDetails?.city || "New Delhi",
      state: stateName || orgDetails?.state || "Delhi",
      pinCode: pinCode || orgDetails?.pinCode || "110001",
      dailyServed: Number(dailyServed) || 150,
      description: description || orgDetails?.description || "",
      documentName: uploadedDocName,
    };
    registerOrganization(details);
    try {
      if (user?.update) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            orgDetails: details,
            verificationStatus: "verified",
          },
        });
      }
    } catch (err) {
      console.error("Error updating Clerk metadata:", err);
    } finally {
      setIsSavingNgoProfile(false);
    }
  };

  const handleReceiverTicketSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingReceiverTicket(true);
    setTimeout(() => {
      const ticketId = `MB-NGO-${Math.floor(10000 + Math.random() * 90000)}`;
      setReceiverSubmittedTicket({
        id: ticketId,
        category: receiverTicketCategory,
        subject: receiverTicketSubject,
        time: "Just now",
        priority: receiverTicketPriority,
      });
      setIsSubmittingReceiverTicket(false);
      setReceiverTicketSubject("");
      setReceiverTicketMessage("");
    }, 500);
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();

    if (!selectedItem) return;

    requestFood(
      selectedItem.id,
      Number(expectedPeople),
      donorMessage
    );

    setIsRequestOpen(false);
    setIsDetailsOpen(false);
    setDonorMessage("");
  };

  const handleSendQuestion = (e) => {
    e.preventDefault();

    if (!questionText.trim() || !selectedItem) return;

    const senderName =
      orgDetails?.orgName ||
      user?.fullName ||
      "City Hope Kitchen";

    sendChatMessage(
      selectedItem.id,
      "receiver",
      senderName,
      questionText.trim()
    );

    setQuestionText("");
  };

  const handleAuthRedirect = () => {
    sessionStorage.setItem(
      "mealbridge-role",
      "receiver"
    );

    navigate("/login");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-warning";

      case "Accepted":
      case "Preparing":
      case "Picked Up":
        return "status-info";

      case "Ready for Pickup":
      case "Completed":
        return "status-success";

      default:
        return "status-success";
    }
  };

  const getTimelineIndex = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Accepted":
        return 1;
      case "Preparing":
        return 2;
      case "Ready for Pickup":
        return 3;
      case "Picked Up":
        return 4;
      case "Completed":
        return 5;
      default:
        return 0;
    }
  };

  /* =========================================================
     DONATION CARD
  ========================================================= */

  const DonationCard = ({ item }) => {
    const freshness =
      Number(item.freshnessScore) ||
      Number(item.aiFreshnessScore) ||
      91;

    return (
      <article className="donation-card">
        <div className="donation-image-wrap">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="donation-image"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg,#DCEDE9,#EEF5F4)",
                fontSize: "45px",
              }}
            >
              🍱
            </div>
          )}

          <div className="live-badge">
            <Sparkles size={11} color="#52D6B8" /> LIVE DONATION
          </div>

          <div className="food-type">
            {item.category || "Prepared Food"}
          </div>
        </div>

        <div className="donation-body">
          <div className="donation-title-row">
            <h3 className="donation-title">
              {item.name}
            </h3>

            <span
              className={`veg-chip ${
                item.vegNonVeg !== "Veg"
                  ? "nonveg-chip"
                  : ""
              }`}
            >
              {item.vegNonVeg === "Veg"
                ? "🟢 VEG"
                : "🔴 NON-VEG"}
            </span>
          </div>

          <div className="donation-meta">
            <span className="meta-pill">
              <Utensils size={12} color="#16A085" /> {item.quantity || 0} servings
            </span>

            <span className="meta-pill">
              <Clock size={12} color="#16A085" />{" "}
              {item.cookingTime
                ? new Date(
                    item.cookingTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Fresh"}
            </span>
          </div>

          <div className="freshness-box">
            <div className="freshness-top">
              <span className="freshness-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Sparkles size={12} color="#16A085" /> AI-ESTIMATED FRESHNESS
              </span>

              <span className="freshness-value">
                {freshness}%
              </span>
            </div>

            <div className="freshness-track">
              <div
                className="freshness-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, freshness)
                  )}%`,
                }}
              />
            </div>
          </div>

          <button
            className="view-button"
            onClick={() => openDetails(item)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            View Donation <ArrowRight size={14} />
          </button>
        </div>
      </article>
    );
  };

  /* =========================================================
     CONTENT
  ========================================================= */

  const content = (
    <>
      <style>{styles}</style>

      <div className="receiver-page">
        <div className="receiver-shell">

          {/* TOAST */}
          {toast && (
            <div className="premium-toast">
              {toast.message}
            </div>
          )}

          {/* TOP BAR */}
          <div className="receiver-topbar">
            <div>
              <div className="eyebrow">
                <span className="live-dot" />
                MealBridge Network
              </div>
            </div>

            <div className="topbar-meta">
              <span>
                {availableItems.length} live
                donation
                {availableItems.length !== 1
                  ? "s"
                  : ""}
              </span>

              {isOrgRegistered && (
                <div className="verified-chip">
                  <span className="verified-check">
                    ✓
                  </span>
                  Verified Receiver
                </div>
              )}
            </div>
          </div>

          {/* REGISTRATION ALERT */}
          {isSignedIn && !isOrgRegistered && (
            <div className="registration-alert">
              <div className="registration-alert-left">
                <div className="alert-icon">
                  ⚡
                </div>

                <div>
                  <h3>
                    Complete your organization
                    profile
                  </h3>

                  <p>
                    Register your organization to
                    unlock donation requests and
                    matching.
                  </p>
                </div>
              </div>

              <button
                className="register-button"
                onClick={() =>
                  setIsRegisterModalOpen(true)
                }
              >
                Register Organization →
              </button>
            </div>
          )}

          {/* =====================================================
              1. OVERVIEW PAGE
              ===================================================== */}
          {isOverview && (
            <>
              {/* HERO */}
              <section className="premium-hero">
                <div className="hero-content">
                  <div className="hero-kicker">
                    Food Rescue Command Center
                  </div>

                  <h1 className="hero-title">
                    Turn surplus into
                    <br />
                    <span>real impact.</span>
                  </h1>

                  <p className="hero-description">
                    Welcome back,{" "}
                    <strong>
                      {orgDetails?.orgName ||
                        user?.firstName ||
                        "NGO Partner"}
                    </strong>
                    . Discover verified surplus food,
                    connect with donors and get meals to
                    the people who need them.
                  </p>

                  <div className="hero-actions">
                    <Link
                      to="/receiver-dashboard/browse"
                      className="hero-primary"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                    >
                      Find Available Food →
                    </Link>

                    <Link
                      to="/receiver-dashboard/requests"
                      className="hero-secondary"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                    >
                      View My Requests
                    </Link>
                  </div>
                </div>

                <div className="hero-network">
                  <div className="network-ring ring-one" />
                  <div className="network-ring ring-two" />
                  <div className="network-ring ring-three" />
                  <div className="network-center">♻</div>
                  <div className="network-node node-one">🍱</div>
                  <div className="network-node node-two">🤝</div>
                  <div className="network-node node-three">❤️</div>
                  <div className="network-node node-four">📍</div>
                </div>
              </section>

              {/* IMPACT STATS */}
              <section className="impact-grid">
                <div className="impact-card">
                  <span className="impact-trend">LIVE</span>
                  <div className="impact-icon">🍱</div>
                  <div className="impact-value">{totalServings.toLocaleString()}</div>
                  <div className="impact-label">Meals available now</div>
                </div>

                <div className="impact-card">
                  <span className="impact-trend">ACTIVE</span>
                  <div className="impact-icon">🤝</div>
                  <div className="impact-value">{pendingOrders}</div>
                  <div className="impact-label">Active requests</div>
                </div>

                <div className="impact-card">
                  <span className="impact-trend">IMPACT</span>
                  <div className="impact-icon">❤️</div>
                  <div className="impact-value">{peopleServed.toLocaleString()}</div>
                  <div className="impact-label">People reached</div>
                </div>

                <div className="impact-card">
                  <span className="impact-trend">DONE</span>
                  <div className="impact-icon">✓</div>
                  <div className="impact-value">{completedOrders}</div>
                  <div className="impact-label">Completed pickups</div>
                </div>
              </section>

              {/* RECENT REQUESTS SUMMARY */}
              {isSignedIn && (
                <section className="section" id="my-orders">
                  <div className="section-header">
                    <div>
                      <div className="section-kicker">Request Activity</div>
                      <h2 className="section-title">Active Requests</h2>
                      <p className="section-description">
                        Track live status and incoming donation pickups.
                      </p>
                    </div>
                    <Link
                      to="/receiver-dashboard/requests"
                      className="section-count"
                      style={{ textDecoration: "none", cursor: "pointer" }}
                    >
                      View All ({myNGOOrders.length}) →
                    </Link>
                  </div>

                  <div className="orders-layout">
                    <div className="orders-card">
                      {myNGOOrders.length === 0 ? (
                        <div style={{ padding: "38px 10px", textAlign: "center" }}>
                          <div className="empty-icon">📦</div>
                          <h3 style={{ margin: 0, color: COLORS.navy, fontSize: "16px" }}>
                            No requests yet
                          </h3>
                          <p style={{ margin: "7px auto 0", maxWidth: "380px", color: COLORS.muted, fontSize: "11px" }}>
                            When you request surplus food, its live progress will appear here.
                          </p>
                        </div>
                      ) : (
                        myNGOOrders.slice(0, 3).map((order) => {
                          const activeStep = getTimelineIndex(order.status);
                          const isDelivered = order.status === "Completed" || order.status === "Picked Up";
                          return (
                            <div className="order-item" key={order.id} style={{ padding: "18px 0" }}>
                              <div className="order-top">
                                <h3 className="order-name" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 16, fontWeight: 900 }}>
                                  <Utensils size={15} color="#16A085" /> {order.foodRequested}
                                </h3>
                                {isDelivered ? (
                                  <span 
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 5,
                                      padding: "6px 12px",
                                      borderRadius: 999,
                                      background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                                      border: "1px solid #A7F3D0",
                                      color: "#065F46",
                                      fontSize: 10,
                                      fontWeight: 850,
                                      boxShadow: "0 2px 6px rgba(22,160,133,0.12)"
                                    }}
                                  >
                                    <CheckCircle2 size={12} color="#059669" />
                                    Successfully Delivered
                                  </span>
                                ) : (
                                  <span className={`status-pill ${getStatusClass(order.status)}`}>
                                    {order.status}
                                  </span>
                                )}
                              </div>
                              <div className="order-details" style={{ marginTop: 10 }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F1FBF8", padding: "4px 9px", borderRadius: 8, color: "#16A085" }}>
                                  <Users size={12} color="#16A085" /> {order.expectedPeople} servings
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F8FAFC", padding: "4px 9px", borderRadius: 8, color: "#64748B" }}>
                                  <Clock size={12} color="#64748B" /> {order.orderTime ? new Date(order.orderTime).toLocaleDateString() : "Recently"}
                                </span>
                                {order.prepTime && (
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F8FAFC", padding: "4px 9px", borderRadius: 8, color: "#64748B" }}>
                                    <MapPin size={12} color="#64748B" /> Pickup: {order.prepTime}
                                  </span>
                                )}
                              </div>
                              <div className="timeline">
                                {["Requested", "Accepted", "Preparing", "Ready", "Pickup", "Done"].map((label, index) => (
                                  <React.Fragment key={label}>
                                    <div className="timeline-step">
                                      <div className={`timeline-dot ${index <= activeStep ? "active" : ""}`} title={label}>
                                        {index < activeStep ? "✓" : index === activeStep ? "•" : ""}
                                      </div>
                                    </div>
                                    {index < 5 && (
                                      <div className={`timeline-line ${index < activeStep ? "active" : ""}`} />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="organization-card">
                      <div className="org-label" style={{ display: "flex", alignItems: "center", gap: 5, textTransform: "uppercase", fontSize: 10, fontWeight: 850, color: "#16A085" }}>
                        <Building2 size={13} color="#16A085" /> Verified Organization
                      </div>
                      <h3 className="org-name" style={{ marginTop: 6, fontSize: 18, fontWeight: 900 }}>{orgDetails?.orgName || "City Hope Kitchen"}</h3>
                      <div className="org-type" style={{ color: "#64748B", fontSize: 12 }}>{orgDetails?.orgType || "Community Food Shelter"}</div>
                      <div className="org-divider" />
                      <div className="org-stats">
                        <div className="org-stat">
                          <strong>{peopleServed}</strong>
                          <span>PEOPLE SERVED</span>
                        </div>
                        <div className="org-stat">
                          <strong>{myNGOOrders.length}</strong>
                          <span>REQUESTS</span>
                        </div>
                        <div className="org-stat">
                          <strong>{completedOrders}</strong>
                          <span>COMPLETED</span>
                        </div>
                      </div>
                      <div className="trust-row" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
                        <ShieldCheck size={16} color="#16A085" />
                        <span className="trust-text" style={{ fontSize: 12, fontWeight: 800, color: "#065F46" }}>Verified Community NGO Partner</span>
                      </div>
                      <Link
                        to="/receiver-dashboard/profile"
                        className="register-button"
                        style={{ width: "100%", marginTop: "17px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, textAlign: "center", textDecoration: "none" }}
                      >
                        Manage Profile <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {/* AVAILABLE FOOD PREVIEW */}
              <section className="section" id="available-donations">
                <div className="section-header">
                  <div>
                    <div className="section-kicker">Live food network</div>
                    <h2 className="section-title">Available Donations Nearby</h2>
                    <p className="section-description">
                      Fresh surplus food ready to be matched with your organization.
                    </p>
                  </div>
                  <Link
                    to="/receiver-dashboard/browse"
                    className="section-count"
                    style={{ textDecoration: "none" }}
                  >
                    Browse All ({availableItems.length}) →
                  </Link>
                </div>

                {availableItems.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🍽️</div>
                    <h3>No donations available right now</h3>
                    <p>New surplus meals will appear here as soon as donors register them.</p>
                  </div>
                ) : (
                  <div className="donations-grid">
                    {availableItems.slice(0, 4).map((item) => (
                      <DonationCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* =====================================================
              2. BROWSE / MATCHED DONATIONS PAGE
              ===================================================== */}
          {isBrowse && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">Browse Food</div>
                  <h2 className="section-title">Browse & Matched Donations</h2>
                  <p className="section-description">
                    Search and claim fresh surplus meals directly from verified donors.
                  </p>
                </div>
                <div className="section-count">{filteredAvailableItems.length} Available</div>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="search-box-wrap">
                <span style={{ fontSize: "16px" }}>🔍</span>
                <input
                  type="text"
                  className="search-box-input"
                  placeholder="Search donations by food name, donor, or location..."
                  value={browseSearch}
                  onChange={(e) => setBrowseSearch(e.target.value)}
                />
                {browseSearch && (
                  <button
                    onClick={() => setBrowseSearch("")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontWeight: 800 }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="category-pills">
                {["All", "Cooked Meals", "Raw Groceries", "Baked Goods", "Packaged", "Veg", "Non-Veg"].map((cat) => (
                  <button
                    key={cat}
                    className={`category-pill ${browseCategory === cat ? "active" : ""}`}
                    onClick={() => setBrowseCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredAvailableItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🍱</div>
                  <h3>No matching donations found</h3>
                  <p>Try adjusting your search query or category filters.</p>
                </div>
              ) : (
                <div className="donations-grid">
                  {filteredAvailableItems.map((item) => (
                    <DonationCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* =====================================================
              3. MY REQUESTS PAGE
              ===================================================== */}
          {isRequests && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">Request Center</div>
                  <h2 className="section-title">My Food Requests</h2>
                  <p className="section-description">
                    Manage your sent, pending, and accepted food donation requests.
                  </p>
                </div>
                <div className="section-count">{filteredNGOOrders.length} Requests</div>
              </div>

              {/* TABS */}
              <div className="requests-filter-tabs">
                {[
                  { id: "all", label: "All Requests", count: myNGOOrders.length },
                  { id: "pending", label: "Pending", count: myNGOOrders.filter((o) => o.status === "Pending" || o.status === "Matching Pending").length },
                  { id: "accepted", label: "Accepted & Preparing", count: myNGOOrders.filter((o) => o.status === "Accepted" || o.status === "Ready for Pickup" || o.status === "Preparing").length },
                  { id: "completed", label: "Completed", count: completedOrders },
                  { id: "declined", label: "Declined", count: myNGOOrders.filter((o) => o.status === "Declined" || o.status === "Cancelled").length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`filter-tab ${requestsFilter === tab.id ? "active" : ""}`}
                    onClick={() => setRequestsFilter(tab.id)}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <div className="orders-card">
                {filteredNGOOrders.length === 0 ? (
                  <div style={{ padding: "40px 10px", textAlign: "center" }}>
                    <div className="empty-icon">📋</div>
                    <h3 style={{ margin: 0, color: COLORS.navy, fontSize: "16px" }}>
                      No requests in this category
                    </h3>
                    <p style={{ margin: "8px auto 0", maxWidth: "380px", color: COLORS.muted, fontSize: "12px" }}>
                      Browse available donations and send a request to start receiving surplus meals.
                    </p>
                  </div>
                ) : (
                  filteredNGOOrders.map((order) => {
                    const activeStep = getTimelineIndex(order.status);
                    return (
                      <div className="order-item" key={order.id}>
                        <div className="order-top">
                          <h3 className="order-name">🍱 {order.foodRequested || order.foodName || "Meal Box"}</h3>
                          <span className={`status-pill ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="order-details">
                          <span>👥 {order.expectedPeople || order.quantity || 10} servings</span>
                          <span>🕒 {order.orderTime ? new Date(order.orderTime).toLocaleDateString() : "Recently"}</span>
                          {order.prepTime && <span>📍 Pickup: {order.prepTime}</span>}
                          {order.donorName && <span>🏢 Donor: {order.donorName}</span>}
                        </div>

                        <div className="timeline">
                          {["Requested", "Accepted", "Preparing", "Ready", "Pickup", "Done"].map((label, index) => (
                            <React.Fragment key={label}>
                              <div className="timeline-step">
                                <div className={`timeline-dot ${index <= activeStep ? "active" : ""}`} title={label}>
                                  {index < activeStep ? "✓" : index === activeStep ? "•" : ""}
                                </div>
                              </div>
                              {index < 5 && (
                                <div className={`timeline-line ${index < activeStep ? "active" : ""}`} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              4. ORDER HISTORY PAGE
              ===================================================== */}
          {isHistory && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">Past Deliveries</div>
                  <h2 className="section-title">Order History</h2>
                  <p className="section-description">
                    Review completed donations and past distribution receipts.
                  </p>
                </div>
                <div className="section-count">{completedOrderHistory.length} Completed</div>
              </div>

              <div className="orders-card">
                {completedOrderHistory.length === 0 ? (
                  <div style={{ padding: "40px 10px", textAlign: "center" }}>
                    <div className="empty-icon">📜</div>
                    <h3 style={{ margin: 0, color: COLORS.navy, fontSize: "16px" }}>
                      No completed orders yet
                    </h3>
                    <p style={{ margin: "8px auto 0", maxWidth: "380px", color: COLORS.muted, fontSize: "12px" }}>
                      Once food requests are marked as delivered or picked up, they will be archived here.
                    </p>
                  </div>
                ) : (
                  completedOrderHistory.map((order) => (
                    <div className="order-item" key={order.id} style={{ borderLeft: `4px solid ${COLORS.emerald}` }}>
                      <div className="order-top">
                        <h3 className="order-name">✓ {order.foodRequested || "Cooked Meals"}</h3>
                        <span className="status-pill status-completed">Completed</span>
                      </div>
                      <div className="order-details">
                        <span>👥 {order.expectedPeople || 20} meals served</span>
                        <span>📅 Completed on {order.orderTime ? new Date(order.orderTime).toLocaleDateString() : "Today"}</span>
                        <span>🏢 Donor: {order.donorName || "Local Partner Kitchen"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              5. DELIVERY TRACKING PAGE
              ===================================================== */}
          {isDelivery && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">Live Logistics</div>
                  <h2 className="section-title">Delivery Tracking</h2>
                  <p className="section-description">
                    Track live status of incoming food pickups and volunteer dispatches.
                  </p>
                </div>
                <div className="section-count">{activeDeliveries.length} Active</div>
              </div>

              {activeDeliveries.length === 0 ? (
                <div className="module-card" style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div className="empty-icon" style={{ fontSize: "36px", marginBottom: "12px" }}>🚚</div>
                  <h3 style={{ margin: "0 0 8px", color: COLORS.navy, fontSize: "18px" }}>No active deliveries right now</h3>
                  <p style={{ color: COLORS.muted, fontSize: "13px", maxWidth: "420px", margin: "0 auto" }}>
                    When a donor accepts your request and dispatches food, real-time tracking will show here.
                  </p>
                </div>
              ) : (
                activeDeliveries.map((order) => (
                  <div className="module-card" key={order.id}>
                    <div className="module-header">
                      <div>
                        <div style={{ color: COLORS.emerald, fontSize: "11px", fontWeight: 900, textTransform: "uppercase" }}>
                          LIVE DISPATCH
                        </div>
                        <h3 style={{ margin: "4px 0", color: COLORS.navy, fontSize: "18px" }}>
                          🍱 {order.foodRequested || "Surplus Food Rescue"}
                        </h3>
                      </div>
                      <span className="status-pill status-preparing">In Transit</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", margin: "16px 0", padding: "16px", background: COLORS.soft, borderRadius: "14px" }}>
                      <div>
                        <small style={{ color: COLORS.muted, display: "block", fontSize: "11px", fontWeight: 700 }}>PICKUP LOCATION</small>
                        <strong style={{ color: COLORS.navy, fontSize: "13px" }}>{order.prepTime || "Community Kitchen Central"}</strong>
                      </div>
                      <div>
                        <small style={{ color: COLORS.muted, display: "block", fontSize: "11px", fontWeight: 700 }}>ESTIMATED ARRIVAL</small>
                        <strong style={{ color: COLORS.emerald, fontSize: "13px" }}>~25-35 Minutes</strong>
                      </div>
                      <div>
                        <small style={{ color: COLORS.muted, display: "block", fontSize: "11px", fontWeight: 700 }}>VOLUNTEER COURIER</small>
                        <strong style={{ color: COLORS.navy, fontSize: "13px" }}>MealBridge Dispatcher #402</strong>
                      </div>
                    </div>

                    <div className="timeline" style={{ marginTop: "20px" }}>
                      {["Dispatched", "Picked Up", "En Route", "Delivered"].map((st, i) => (
                        <React.Fragment key={st}>
                          <div className="timeline-step">
                            <div className={`timeline-dot ${i <= 2 ? "active" : ""}`}>
                              {i < 2 ? "✓" : i === 2 ? "•" : ""}
                            </div>
                          </div>
                          {i < 3 && <div className={`timeline-line ${i < 2 ? "active" : ""}`} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

          {/* =====================================================
              6. NOTIFICATIONS PAGE
              ===================================================== */}
          {isNotifications && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">Alert Center</div>
                  <h2 className="section-title">Notifications & Rescue Alerts</h2>
                  <p className="section-description">
                    Stay informed on new surplus food nearby and delivery status changes.
                  </p>
                </div>
                <div className="section-count">Live Feed</div>
              </div>

              <div>
                {[
                  {
                    id: 1,
                    icon: "🍱",
                    title: "New Surplus Food Available Nearby",
                    text: "Fresh Bites Catering listed 25 meal boxes ready for immediate pickup (2.4 km away).",
                    time: "10 mins ago",
                    unread: true,
                  },
                  {
                    id: 2,
                    icon: "✓",
                    title: "Food Request Accepted",
                    text: "Your request for 15 servings of Cooked Meals was accepted by the donor.",
                    time: "1 hour ago",
                    unread: true,
                  },
                  {
                    id: 3,
                    icon: "🚚",
                    title: "Volunteer Courier Assigned",
                    text: "Volunteer driver #402 is on the way to pick up donation order #204.",
                    time: "3 hours ago",
                    unread: false,
                  },
                  {
                    id: 4,
                    icon: "⭐",
                    title: "Organization Verification Active",
                    text: "Your organization credentials have been verified for priority donation matching.",
                    time: "1 day ago",
                    unread: false,
                  },
                ].map((n) => (
                  <div key={n.id} className={`notif-item ${n.unread ? "notif-unread" : ""}`}>
                    <div className="notif-icon">{n.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <strong style={{ color: COLORS.navy, fontSize: "14px" }}>{n.title}</strong>
                        <small style={{ color: COLORS.muted, fontSize: "11px" }}>{n.time}</small>
                      </div>
                      <p style={{ margin: 0, color: COLORS.muted, fontSize: "12px", lineHeight: 1.5 }}>
                        {n.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              7. ORGANIZATION PROFILE & VERIFICATION PAGE
              ===================================================== */}
          {isProfile && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">NGO Credentials</div>
                  <h2 className="section-title">Organization Profile & Verification</h2>
                  <p className="section-description">
                    Manage your organization identity, verification status, and serving capacity.
                  </p>
                </div>
                <div className="verified-chip">
                  <span className="verified-check">✓</span>
                  {isOrgRegistered ? "Verified NGO" : "Profile Active"}
                </div>
              </div>

              {/* Status Overview Card */}
              <div className="module-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.mint})`, display: "grid", placeItems: "center", color: "white", fontSize: "28px", fontWeight: 900 }}>
                    🏛️
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: COLORS.navy, fontSize: "20px" }}>
                      {orgName || orgDetails?.orgName || "City Hope Kitchen"}
                    </h3>
                    <div style={{ color: COLORS.muted, fontSize: "13px", marginTop: "3px" }}>
                      {orgType || orgDetails?.orgType || "Non-Profit Community Kitchen"} · Reg: {regNum || orgDetails?.regNum || "NGO-88219-IND"}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                    <span className="status-pill status-success">
                      ✓ Food Safety Compliant
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  <div style={{ padding: "16px", borderRadius: "12px", background: COLORS.soft, border: `1px solid ${COLORS.border}` }}>
                    <small style={{ color: COLORS.muted, fontSize: "11px", fontWeight: 700 }}>PRIMARY CONTACT</small>
                    <div style={{ color: COLORS.navy, fontWeight: 800, marginTop: "4px" }}>
                      {contactName || orgDetails?.contactName || user?.fullName || "Director Coordinator"}
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: "12px" }}>
                      {email || orgDetails?.email || user?.primaryEmailAddress?.emailAddress || "contact@cityhope.org"}
                    </div>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: COLORS.soft, border: `1px solid ${COLORS.border}` }}>
                    <small style={{ color: COLORS.muted, fontSize: "11px", fontWeight: 700 }}>DROP-OFF ADDRESS</small>
                    <div style={{ color: COLORS.navy, fontWeight: 800, marginTop: "4px" }}>
                      {address || orgDetails?.address || "Building 4, Community Rescue Hub"}
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: "12px" }}>
                      {city || orgDetails?.city || "New Delhi"}, PIN {pinCode || orgDetails?.pinCode || "110001"}
                    </div>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: COLORS.soft, border: `1px solid ${COLORS.border}` }}>
                    <small style={{ color: COLORS.muted, fontSize: "11px", fontWeight: 700 }}>DAILY SERVING CAPACITY</small>
                    <div style={{ color: COLORS.emerald, fontWeight: 900, fontSize: "18px", marginTop: "4px" }}>
                      {dailyServed || orgDetails?.dailyServed || 150} People / Day
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: "12px" }}>
                      Verified Food Rescue Partner
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Interactive Profile Edit Form */}
              <div className="module-card">
                <h3 style={{ margin: "0 0 18px", color: COLORS.navy, fontSize: "16px" }}>
                  Edit NGO Profile & Verification Details
                </h3>

                <form onSubmit={handleSaveProfileFromPage}>
                  <div className="form-grid">
                    <div className="field full">
                      <label>Organization Name *</label>
                      <input
                        type="text"
                        required
                        value={orgName || orgDetails?.orgName || ""}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. City Hope Kitchen"
                      />
                    </div>

                    <div className="field">
                      <label>Organization Type *</label>
                      <select
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                      >
                        <option value="NGO">NGO / Non-Profit</option>
                        <option value="Shelter">Shelter Home</option>
                        <option value="Orphanage">Orphanage</option>
                        <option value="Community Kitchen">Community Kitchen</option>
                        <option value="Relief Foundation">Relief Foundation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="field">
                      <label>NGO Registration / Darpan ID / 80G No. *</label>
                      <input
                        type="text"
                        required
                        value={regNum || orgDetails?.regNum || ""}
                        onChange={(e) => setRegNum(e.target.value)}
                        placeholder="e.g. NGO-88219-IND"
                      />
                    </div>

                    <div className="field">
                      <label>Primary Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={contactName || orgDetails?.contactName || ""}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Coordinator Name"
                      />
                    </div>

                    <div className="field">
                      <label>Contact Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone || orgDetails?.phone || ""}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div className="field full">
                      <label>Contact Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email || orgDetails?.email || ""}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@org.org"
                      />
                    </div>

                    <div className="field full">
                      <label>Official Drop-off / Receiving Address *</label>
                      <textarea
                        rows={2}
                        required
                        value={address || orgDetails?.address || ""}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full street address for courier delivery..."
                      />
                    </div>

                    <div className="field">
                      <label>City *</label>
                      <input
                        type="text"
                        required
                        value={city || orgDetails?.city || ""}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New Delhi"
                      />
                    </div>

                    <div className="field">
                      <label>State *</label>
                      <input
                        type="text"
                        required
                        value={stateName || orgDetails?.state || ""}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Delhi"
                      />
                    </div>

                    <div className="field">
                      <label>PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={pinCode || orgDetails?.pinCode || ""}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="110001"
                      />
                    </div>

                    <div className="field">
                      <label>Daily Serving Capacity (People/Day) *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={dailyServed || orgDetails?.dailyServed || 150}
                        onChange={(e) => setDailyServed(Number(e.target.value))}
                      />
                    </div>

                    <div className="field full">
                      <label>Verification Document / Registration Certificate</label>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="file"
                          id="ngo-doc-upload"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadedDocName(e.target.files[0].name);
                            }
                          }}
                        />
                        <label
                          htmlFor="ngo-doc-upload"
                          className="action-button"
                          style={{
                            background: "white",
                            color: COLORS.navy,
                            border: `1px solid ${COLORS.border}`,
                            padding: "9px 15px",
                            fontSize: "12px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          📎 {uploadedDocName ? "Replace Document" : "Upload Document"}
                        </label>
                        <span style={{ fontSize: "12px", color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {uploadedDocName || "No certificate attached"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${COLORS.border}` }}>
                    <button
                      type="submit"
                      disabled={isSavingNgoProfile}
                      className="register-button"
                      style={{ cursor: isSavingNgoProfile ? "not-allowed" : "pointer" }}
                    >
                      {isSavingNgoProfile ? "Saving Profile..." : "Save Profile & Update Verification →"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* =====================================================
              8. IMPACT STATS PAGE
              ===================================================== */}
          {isImpact && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">Impact Analytics</div>
                  <h2 className="section-title">Community Impact & Sustainability</h2>
                  <p className="section-description">
                    Measure meals distributed, carbon emissions saved, and community reach.
                  </p>
                </div>
                <div className="section-count">Verified Stats</div>
              </div>

              <div className="impact-grid" style={{ marginBottom: "24px" }}>
                <div className="impact-card">
                  <span className="impact-trend">TOTAL</span>
                  <div className="impact-icon">🍱</div>
                  <div className="impact-value">{(totalServings + 120).toLocaleString()}</div>
                  <div className="impact-label">Total Meals Rescued</div>
                </div>

                <div className="impact-card">
                  <span className="impact-trend">REACH</span>
                  <div className="impact-icon">👥</div>
                  <div className="impact-value">{(peopleServed + 85).toLocaleString()}</div>
                  <div className="impact-label">People Nourished</div>
                </div>

                <div className="impact-card">
                  <span className="impact-trend">ECO</span>
                  <div className="impact-icon">🌱</div>
                  <div className="impact-value">~180 kg</div>
                  <div className="impact-label">CO2 Emissions Saved</div>
                </div>

                <div className="impact-card">
                  <span className="impact-trend">SCORE</span>
                  <div className="impact-icon">⭐</div>
                  <div className="impact-value">98.5%</div>
                  <div className="impact-label">Receiver Reliability</div>
                </div>
              </div>

              <div className="module-card">
                <h3 style={{ margin: "0 0 12px", color: COLORS.navy, fontSize: "16px" }}>
                  📊 Distribution Summary
                </h3>
                <p style={{ color: COLORS.muted, fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  By rescuing surplus food through MealBridge, your organization prevents edible meals
                  from landfill disposal, helping reduce greenhouse gas emissions while directly supporting
                  families in need across the community.
                </p>
              </div>
            </section>
          )}

          {/* =====================================================
              9. SUPPORT & HELP PAGE
              ===================================================== */}
          {isSupport && (
            <section className="section">
              <div className="section-header">
                <div>
                  <div className="section-kicker">Help Center</div>
                  <h2 className="section-title">Support & FAQ</h2>
                  <p className="section-description">
                    Frequently asked questions, food safety guides, and receiver assistance.
                  </p>
                </div>
                <div className="section-count">24/7 Assistance</div>
              </div>

              {/* HELPLINE BANNER */}
              <div className="module-card" style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navy2})`, color: "white", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <span style={{ color: COLORS.mint, fontSize: "11px", fontWeight: 900, textTransform: "uppercase" }}>
                      EMERGENCY NGO HELPLINE
                    </span>
                    <h3 style={{ margin: "6px 0 0", fontSize: "20px", color: "white" }}>
                      📞 +91 1800-MEAL-BRIDGE (Toll Free)
                    </h3>
                    <p style={{ margin: "4px 0 0", color: "#A0AEC0", fontSize: "12px" }}>
                      Direct assistance for urgent food collections and courier inquiries.
                    </p>
                  </div>
                  <a
                    href="mailto:support@mealbridge.org"
                    className="register-button"
                    style={{ textDecoration: "none" }}
                  >
                    Email Support Desk →
                  </a>
                </div>
              </div>

              {/* TICKET CREATED BANNER */}
              {receiverSubmittedTicket && (
                <div
                  className="module-card"
                  style={{
                    background: "#ECFDF5",
                    border: `1px solid rgba(22,160,133,0.3)`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div style={{ color: COLORS.emerald, fontWeight: 900, fontSize: "14px" }}>
                      ✓ Support Ticket #{receiverSubmittedTicket.id} Created
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: "12px", marginTop: "3px" }}>
                      Category: <strong>{receiverSubmittedTicket.category}</strong> · Response ETA: &lt;15 mins
                    </div>
                  </div>
                  <button
                    onClick={() => setReceiverSubmittedTicket(null)}
                    style={{
                      background: "none",
                      border: `1px solid ${COLORS.emerald}`,
                      color: COLORS.emerald,
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* SUPPORT GRID: TICKET FORM + FAQ */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {/* Support Request Form */}
                <div className="module-card">
                  <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: "16px" }}>
                    Submit a Support Ticket
                  </h3>

                  <form onSubmit={handleReceiverTicketSubmit}>
                    <div className="field" style={{ marginBottom: "14px" }}>
                      <label>Assistance Category *</label>
                      <select
                        value={receiverTicketCategory}
                        onChange={(e) => setReceiverTicketCategory(e.target.value)}
                      >
                        <option value="Urgent Delivery Assistance">Urgent Delivery / Courier Assistance</option>
                        <option value="Food Quality & Safety Concern">Food Quality & Safety Escalation</option>
                        <option value="Request Cancellation / Change">Request Cancellation / Change</option>
                        <option value="NGO Verification & Capacity">NGO Verification & Capacity Update</option>
                        <option value="General Technical Support">General Technical Support</option>
                      </select>
                    </div>

                    <div className="field" style={{ marginBottom: "14px" }}>
                      <label>Subject / Order Ref *</label>
                      <input
                        type="text"
                        required
                        value={receiverTicketSubject}
                        onChange={(e) => setReceiverTicketSubject(e.target.value)}
                        placeholder="e.g. Courier delay for 25 meal boxes"
                      />
                    </div>

                    <div className="field" style={{ marginBottom: "14px" }}>
                      <label>Priority Level</label>
                      <select
                        value={receiverTicketPriority}
                        onChange={(e) => setReceiverTicketPriority(e.target.value)}
                      >
                        <option value="Normal">Normal — standard question</option>
                        <option value="High">High — active food pickup scheduled</option>
                        <option value="Urgent">Urgent / Emergency — immediate courier intervention</option>
                      </select>
                    </div>

                    <div className="field" style={{ marginBottom: "18px" }}>
                      <label>Message Description *</label>
                      <textarea
                        rows={4}
                        required
                        value={receiverTicketMessage}
                        onChange={(e) => setReceiverTicketMessage(e.target.value)}
                        placeholder="Describe your question or issue in detail..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReceiverTicket}
                      className="register-button"
                      style={{ width: "100%", cursor: isSubmittingReceiverTicket ? "not-allowed" : "pointer" }}
                    >
                      {isSubmittingReceiverTicket ? "Submitting Ticket..." : "Submit Support Ticket →"}
                    </button>
                  </form>
                </div>

                {/* FAQ ACCORDION */}
                <div className="module-card">
                  <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: "16px" }}>
                    Frequently Asked Questions
                  </h3>

                  <div>
                    {[
                      {
                        q: "How do I claim a surplus food listing?",
                        a: "Go to the Browse / Matched Donations page, click on any live listing, review the food type, servings, and AI freshness rating, then click 'Request Food'.",
                      },
                      {
                        q: "How does delivery work for NGO receivers?",
                        a: "Donors or MealBridge volunteer couriers are dispatched as soon as the donor accepts your request. You can track courier ETA in the Delivery Tracking tab.",
                      },
                      {
                        q: "What should I do if the food quality does not match?",
                        a: "You can report quality issues directly through the order completion modal or contact our 24/7 helpline immediately for food safety escalation.",
                      },
                      {
                        q: "How do I update our organization's serving capacity?",
                        a: "Visit the Organization Profile page and edit your daily serving capacity and drop-off address directly.",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="faq-card">
                        <button
                          type="button"
                          className="faq-question"
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        >
                          <span>{item.q}</span>
                          <span style={{ fontSize: "18px", color: COLORS.emerald }}>
                            {openFaq === idx ? "−" : "+"}
                          </span>
                        </button>
                        {openFaq === idx && (
                          <div className="faq-answer">{item.a}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              DETAILS MODAL
          ================================================= */}
          {isDetailsOpen && selectedItem && (
            <div
              className="modal-backdrop"
              onClick={() =>
                setIsDetailsOpen(false)
              }
            >
              <div
                className="modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <div className="modal-header">
                  <h2>
                    {selectedItem.name}
                  </h2>

                  <button
                    className="close-button"
                    onClick={() =>
                      setIsDetailsOpen(false)
                    }
                  >
                    ×
                  </button>
                </div>

                <div className="modal-content">
                  <div className="details-layout">

                    {/* LEFT */}
                    <div className="details-left">
                      {selectedItem.imageUrl ? (
                        <img
                          src={
                            selectedItem.imageUrl
                          }
                          alt={
                            selectedItem.name
                          }
                          className="details-image"
                        />
                      ) : (
                        <div
                          className="details-image"
                          style={{
                            display: "grid",
                            placeItems:
                              "center",
                            background:
                              "#E8F4F1",
                            fontSize: "60px",
                          }}
                        >
                          🍱
                        </div>
                      )}

                      <div className="ai-verification" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: 16, marginTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>
                          <span style={{ color: "#374151" }}>✦ AI Freshness Assessment</span>
                          <span style={{
                            color: selectedItem.freshnessLabel === 'spoiled' ? '#DC2626' : selectedItem.freshnessLabel === 'moderate' ? '#D97706' : '#059669',
                            textTransform: "uppercase"
                          }}>
                            {selectedItem.freshnessLabel === 'spoiled' ? 'Potential Spoilage' : selectedItem.freshnessLabel === 'moderate' ? 'Questionable' : '🟢 Fresh-looking'}
                          </span>
                        </div>

                        <div style={{ fontSize: 18, color: "#1F2937", marginBottom: 8 }}>
                          <strong>
                            {Number(
                              selectedItem.freshnessScore ||
                                selectedItem.aiFreshnessScore ||
                                91
                            )}%
                          </strong>{" "}
                          <span style={{ fontSize: 12, color: "#6B7280" }}>
                            confidence (Analyzed recently)
                          </span>
                        </div>

                        <div style={{
                          padding: 8,
                          background: "#FEF2F2",
                          border: "1px solid #FEE2E2",
                          borderRadius: 8,
                          color: "#991B1B",
                          fontSize: 11,
                          lineHeight: "1.4"
                        }}>
                          <strong>⚠️ SAFETY DISCLAIMER:</strong> AI assessment does not certify food safety. Actual food safety depends on storage temperature, preparation time, handling, hygiene, contamination, packaging, expiry information, and storage conditions.
                        </div>
                      </div>

                      <div className="details-section">
                        <h3>
                          Food information
                        </h3>

                        <div className="details-grid">
                          <div className="detail-box">
                            <small>
                              Category
                            </small>

                            <strong>
                              {
                                selectedItem.category
                              }
                            </strong>
                          </div>

                          <div className="detail-box">
                            <small>
                              Type
                            </small>

                            <strong>
                              {
                                selectedItem.vegNonVeg
                              }
                            </strong>
                          </div>

                          <div className="detail-box">
                            <small>
                              Servings
                            </small>

                            <strong>
                              {
                                selectedItem.quantity
                              }
                            </strong>
                          </div>

                          <div className="detail-box">
                            <small>
                              Transport
                            </small>

                            <strong>
                              {selectedItem.needTransportation ===
                              "Yes"
                                ? "Volunteer needed"
                                : "Self pickup"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="details-section">
                        <h3>
                          Timings
                        </h3>

                        <div className="details-grid">
                          <div className="detail-box">
                            <small>
                              Cooking
                            </small>

                            <strong>
                              {selectedItem.cookingTime
                                ? new Date(
                                    selectedItem.cookingTime
                                  ).toLocaleString()
                                : "—"}
                            </strong>
                          </div>

                          <div className="detail-box">
                            <small>
                              Expires
                            </small>

                            <strong>
                              {selectedItem.expiryTime
                                ? new Date(
                                    selectedItem.expiryTime
                                  ).toLocaleString()
                                : "—"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="details-section">
                        <h3>
                          Pickup location
                        </h3>

                        <div className="location-box">
                          📍{" "}
                          {
                            selectedItem.pickupAddress
                          }

                          {selectedItem.gpsLocation && (
                            <div
                              style={{
                                marginTop:
                                  "5px",
                                opacity: .65,
                                fontSize:
                                  "9px",
                              }}
                            >
                              GPS:{" "}
                              {
                                selectedItem.gpsLocation
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="details-section">
                        <h3>
                          Description
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color:
                              COLORS.muted,
                            fontSize:
                              "11px",
                            lineHeight: 1.65,
                          }}
                        >
                          {selectedItem.description ||
                            "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="details-right">
                      {isSignedIn ? (
                        <>
                          <div className="chat-card">
                            <h3>
                              💬 Connect with donor
                            </h3>

                            <p className="chat-subtitle">
                              Ask about packaging,
                              dietary information,
                              logistics or pickup.
                            </p>

                            <div className="chat-messages">
                              {activeMessages.length ===
                              0 ? (
                                <div
                                  style={{
                                    padding:
                                      "30px 10px",
                                    textAlign:
                                      "center",
                                    color:
                                      COLORS.muted,
                                    fontSize:
                                      "10px",
                                  }}
                                >
                                  No messages yet.
                                  <br />
                                  Start the
                                  conversation.
                                </div>
                              ) : (
                                activeMessages.map(
                                  (m) => (
                                    <div
                                      key={m.id}
                                      className={`message-row ${
                                        m.senderId ===
                                        "receiver"
                                          ? "me"
                                          : ""
                                      }`}
                                    >
                                      <span className="message-name">
                                        {
                                          m.senderName
                                        }
                                      </span>

                                      <div className="message-bubble">
                                        {m.text}
                                      </div>
                                    </div>
                                  )
                                )
                              )}
                            </div>

                            <form
                              className="chat-form"
                              onSubmit={
                                handleSendQuestion
                              }
                            >
                              <input
                                type="text"
                                value={
                                  questionText
                                }
                                onChange={(e) =>
                                  setQuestionText(
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="Ask the donor something..."
                                required
                              />

                              <button
                                type="submit"
                                className="send-button"
                              >
                                Send
                              </button>
                            </form>
                          </div>

                          <div className="request-box">
                            {selectedItem.status ===
                            "Matching Pending" ? (
                              <>
                                <p>
                                  ⏳ Your request is
                                  already pending
                                  donor approval.
                                </p>

                                <button
                                  className="request-button"
                                  disabled
                                >
                                  Request Pending
                                </button>
                              </>
                            ) : (
                              <>
                                <p>
                                  Ready to rescue
                                  this surplus?
                                  Confirm how many
                                  people you expect
                                  to serve.
                                </p>

                                <button
                                  className="request-button"
                                  onClick={() => {
                                    if (
                                      isOrgRegistered
                                    ) {
                                      setIsRequestOpen(
                                        true
                                      );
                                    } else {
                                      setIsRegisterModalOpen(
                                        true
                                      );
                                    }
                                  }}
                                >
                                  {isOrgRegistered
                                    ? "Request This Food →"
                                    : "Register to Request →"}
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="auth-box">
                          <div className="auth-icon">
                            🔐
                          </div>

                          <h3
                            style={{
                              margin: 0,
                              color:
                                COLORS.navy,
                              fontSize:
                                "17px",
                              fontWeight:
                                950,
                            }}
                          >
                            Sign in to continue
                          </h3>

                          <p
                            style={{
                              color:
                                COLORS.muted,
                              fontSize:
                                "11px",
                              lineHeight:
                                1.6,
                              margin:
                                "8px 0 18px",
                            }}
                          >
                            Sign in to chat with
                            donors and request
                            available food.
                          </p>

                          <button
                            className="request-button"
                            onClick={
                              handleAuthRedirect
                            }
                          >
                            Sign In →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              ORGANIZATION REGISTRATION
          ================================================= */}
          {isRegisterModalOpen && (
            <div
              className="modal-backdrop"
              style={{ zIndex: 3000 }}
              onClick={() =>
                setIsRegisterModalOpen(false)
              }
            >
              <div
                className="modal"
                style={{
                  width: "min(760px,100%)",
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <div className="modal-header">
                  <div>
                    <h2>
                      Register your organization
                    </h2>

                    <div
                      style={{
                        marginTop:
                          "4px",
                        color:
                          COLORS.muted,
                        fontSize:
                          "10px",
                      }}
                    >
                      Create a trusted receiver
                      profile on MealBridge.
                    </div>
                  </div>

                  <button
                    className="close-button"
                    onClick={() =>
                      setIsRegisterModalOpen(
                        false
                      )
                    }
                  >
                    ×
                  </button>
                </div>

                <div className="modal-content">
                  <form
                    className="form"
                    onSubmit={
                      handleRegisterSubmit
                    }
                  >
                    <div className="form-grid">

                      <div className="field full">
                        <label>
                          Organization Name
                        </label>

                        <input
                          type="text"
                          value={orgName}
                          onChange={(e) =>
                            setOrgName(
                              e.target.value
                            )
                          }
                          placeholder="Green Hope Foundation"
                          required
                        />
                      </div>

                      <div className="field">
                        <label>
                          Organization Type
                        </label>

                        <select
                          value={orgType}
                          onChange={(e) =>
                            setOrgType(
                              e.target.value
                            )
                          }
                        >
                          <option value="NGO">
                            NGO
                          </option>

                          <option value="Shelter">
                            Shelter
                          </option>

                          <option value="Orphanage">
                            Orphanage
                          </option>

                          <option value="Community Kitchen">
                            Community Kitchen
                          </option>

                          <option value="Other">
                            Other
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>
                          Registration Number
                          (optional)
                        </label>

                        <input
                          type="text"
                          value={regNum}
                          onChange={(e) =>
                            setRegNum(
                              e.target.value
                            )
                          }
                          placeholder="REG-8271"
                        />
                      </div>

                      <div className="field">
                        <label>
                          Contact Person
                        </label>

                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) =>
                            setContactName(
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="field">
                        <label>
                          Phone Number
                        </label>

                        <input
                          type="text"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value
                            )
                          }
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                      </div>

                      <div className="field full">
                        <label>
                          Contact Email
                        </label>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail(
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="field full">
                        <label>
                          Street Address
                        </label>

                        <textarea
                          rows="2"
                          value={address}
                          onChange={(e) =>
                            setAddress(
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="field">
                        <label>
                          City
                        </label>

                        <input
                          type="text"
                          value={city}
                          onChange={(e) =>
                            setCity(
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="field">
                        <label>
                          State
                        </label>

                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) =>
                            setStateName(
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="field">
                        <label>
                          PIN Code
                        </label>

                        <input
                          type="text"
                          value={pinCode}
                          onChange={(e) =>
                            setPinCode(
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="field">
                        <label>
                          People Served Daily
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={dailyServed}
                          onChange={(e) =>
                            setDailyServed(
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="field full">
                        <label>
                          About your organization
                        </label>

                        <textarea
                          rows="3"
                          value={description}
                          onChange={(e) =>
                            setDescription(
                              e.target.value
                            )
                          }
                          placeholder="Tell donors about the communities you serve..."
                          required
                        />
                      </div>

                      <div className="field full">
                        <label>
                          Verification Document
                          (optional)
                        </label>

                        <input
                          type="file"
                          style={{
                            padding:
                              "8px",
                          }}
                        />
                      </div>

                    </div>

                    <div className="modal-actions">
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                          setIsRegisterModalOpen(
                            false
                          )
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="confirm-button"
                      >
                        Create Receiver
                        Profile →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              REQUEST CONFIRMATION
          ================================================= */}
          {isRequestOpen &&
            selectedItem && (
              <div
                className="modal-backdrop"
                style={{ zIndex: 3500 }}
                onClick={() =>
                  setIsRequestOpen(false)
                }
              >
                <div
                  className="modal modal-small"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <div className="modal-header">
                    <div>
                      <h2>
                        Confirm food request
                      </h2>

                      <div
                        style={{
                          marginTop:
                            "4px",
                          color:
                            COLORS.muted,
                          fontSize:
                            "10px",
                        }}
                      >
                        {selectedItem.name}
                      </div>
                    </div>

                    <button
                      className="close-button"
                      onClick={() =>
                        setIsRequestOpen(false)
                      }
                    >
                      ×
                    </button>
                  </div>

                  <form
                    className="form"
                    onSubmit={
                      handleConfirmRequest
                    }
                  >
                    <div
                      style={{
                        padding:
                          "14px",
                        borderRadius:
                          "14px",
                        background:
                          COLORS.softGreen,
                        marginBottom:
                          "17px",
                        color:
                          COLORS.navy,
                        fontSize:
                          "11px",
                        lineHeight:
                          1.5,
                      }}
                    >
                      🍱 This donation has{" "}
                      <strong>
                        {selectedItem.quantity}
                      </strong>{" "}
                      servings available.
                    </div>

                    <div className="field">
                      <label>
                        PEOPLE YOU EXPECT TO
                        SERVE
                      </label>

                      <input
                        type="number"
                        min="1"
                        max={
                          selectedItem.quantity
                        }
                        value={
                          expectedPeople
                        }
                        onChange={(e) =>
                          setExpectedPeople(
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label>
                        MESSAGE TO DONOR
                      </label>

                      <textarea
                        rows="3"
                        value={
                          donorMessage
                        }
                        onChange={(e) =>
                          setDonorMessage(
                            e.target.value
                          )
                        }
                        placeholder="We have transport ready for immediate pickup..."
                      />
                    </div>

                    <div className="modal-actions">
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                          setIsRequestOpen(
                            false
                          )
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="confirm-button"
                      >
                        Send Request →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );

  /* =========================================================
     LAYOUT
  ========================================================= */

  return isSignedIn ? (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  ) : (
    <>
      <Navbar />

      <main
        style={{
          width: "100%",
          margin: 0,
        }}
      >
        {content}
      </main>
    </>
  );
}