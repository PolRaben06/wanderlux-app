/* ============================
   WanderLux - ICT502 JavaScript
   File: js/script.js
   ============================ */

(function () {
  "use strict";

  // ----------------------------
  // Helpers
  // ----------------------------
  const $ = (selector, root = document) => root.querySelector(selector);

  const setText = (el, text) => {
    if (!el) return;
    el.textContent = text;
  };

  const isEmailValid = (email) => {
    // Simple, acceptable client-side check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };

  const isPhoneValid = (phone) => {
    // Loose validation: digits, spaces, +, (), -
    // Keeps it realistic for AU/international numbers
    return /^[0-9\s()+-]{8,}$/.test(String(phone).trim());
  };

  const formatCurrency = (amount) => {
    // Default to AUD-style formatting; adjust if your teacher expects USD
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // ----------------------------
  // Trip Cost Calculator
  // ----------------------------
  function initCalculator() {
    const form = $("#calcForm");
    if (!form) return; // Only run on calculator page

    // If you used the detailed calculator.html I provided earlier, these IDs exist.
    // If your current calculator.html is very minimal, this script still works,
    // but you should ensure these inputs exist for full marks.
    const destinationEl = $("#destination");
    const travellersEl = $("#travellers");
    const daysEl = $("#days");
    const resultEl = $("#calcResult");

    // Optional error fields (only used if present)
    const destinationError = $("#destinationError");
    const travellersError = $("#travellersError");
    const daysError = $("#daysError");
    const styleError = $("#styleError");

    // Preset base daily rates per traveller (example values; you can tweak)
    const dailyRateByDestination = {
      bali: 180,
      tokyo: 320,
      paris: 360,
      sydney: 220
    };

    // Fixed per-trip accommodation/fees (example)
    const baseTripFees = {
      bali: 350,
      tokyo: 600,
      paris: 650,
      sydney: 400
    };

    // Travel style multipliers
    const styleMultiplier = {
      budget: 0.9,
      standard: 1.15,
      luxury: 1.45
    };

    const styleLabel = {
      budget: "Budget",
      standard: "Standard",
      luxury: "Luxury"
    };

    const clearErrors = () => {
      setText(destinationError, "");
      setText(travellersError, "");
      setText(daysError, "");
      setText(styleError, "");
    };

    const getSelectedStyle = () => {
      const checked = form.querySelector('input[name="style"]:checked');
      return checked ? checked.value : "";
    };

    // If your calculator page does not have destination select + radios,
    // guide the user (and help you debug quickly).
    if (!destinationEl || !travellersEl || !daysEl) {
      setText(
        resultEl,
        "Calculator inputs are missing. Ensure calculator.html contains destination, travellers, days, and travel style inputs."
      );
      return;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const destination = String(destinationEl.value || "").toLowerCase();
      const travellers = Number(travellersEl.value);
      const days = Number(daysEl.value);
      const style = getSelectedStyle();

      let hasError = false;

      if (!destination || !dailyRateByDestination[destination]) {
        setText(destinationError, "Please select a destination.");
        hasError = true;
      }

      if (!Number.isFinite(travellers) || travellers < 1) {
        setText(travellersError, "Please enter a valid number of travellers (1 or more).");
        hasError = true;
      }

      if (!Number.isFinite(days) || days < 1) {
        setText(daysError, "Please enter a valid number of days (1 or more).");
        hasError = true;
      }

      if (!style || !styleMultiplier[style]) {
        setText(styleError, "Please select a travel style.");
        hasError = true;
      }

      if (hasError) {
        setText(resultEl, "Please correct the highlighted fields and try again.");
        return;
      }

      // Calculation model:
      // (daily rate per traveller × travellers × days) + base trip fees
      // then multiply by travel style
      const dailyRate = dailyRateByDestination[destination];
      const fees = baseTripFees[destination];

      const subtotal = (dailyRate * travellers * days) + fees;
      const total = Math.round(subtotal * styleMultiplier[style]);

      const destinationName =
        destination.charAt(0).toUpperCase() + destination.slice(1);

      const message =
        `Estimated cost for ${travellers} traveller${travellers > 1 ? "s" : ""} ` +
        `to ${destinationName} for ${days} day${days > 1 ? "s" : ""}: ` +
        `${formatCurrency(total)} – ${styleLabel[style]} Travel Package.`;

      setText(resultEl, message);
    });

    form.addEventListener("reset", () => {
      clearErrors();
      setText(resultEl, "Fill in the form and click Calculate to see your estimate.");
    });
  }

  // ----------------------------
  // Appointment Form Validation
  // ----------------------------
  function initAppointmentForm() {
    const form = $("#appointmentForm");
    if (!form) return;

    // If using the detailed appointment.html from earlier, these IDs exist:
    const nameEl = $("#apptName");
    const emailEl = $("#apptEmail");
    const phoneEl = $("#apptPhone");
    const dateEl = $("#apptDate");
    const msgEl = $("#apptMessage");

    // Optional error fields
    const nameErr = $("#apptNameError");
    const emailErr = $("#apptEmailError");
    const phoneErr = $("#apptPhoneError");
    const dateErr = $("#apptDateError");
    const msgErr = $("#apptMessageError");
    const successEl = $("#apptSuccess");

    const clearErrors = () => {
      setText(nameErr, "");
      setText(emailErr, "");
      setText(phoneErr, "");
      setText(dateErr, "");
      setText(msgErr, "");
      setText(successEl, "");
    };

    // If your appointment.html is minimal and doesn’t have these IDs yet,
    // you can still upgrade it later. For now, prevent runtime errors:
    if (!nameEl || !emailEl || !phoneEl || !dateEl || !msgEl) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const name = String(nameEl.value || "").trim();
      const email = String(emailEl.value || "").trim();
      const phone = String(phoneEl.value || "").trim();
      const date = String(dateEl.value || "").trim();
      const message = String(msgEl.value || "").trim();

      let hasError = false;

      if (name.length < 2) {
        setText(nameErr, "Please enter your full name.");
        hasError = true;
      }

      if (!isEmailValid(email)) {
        setText(emailErr, "Please enter a valid email address.");
        hasError = true;
      }

      if (!isPhoneValid(phone)) {
        setText(phoneErr, "Please enter a valid phone number.");
        hasError = true;
      }

      if (!date) {
        setText(dateErr, "Please select a preferred date.");
        hasError = true;
      }

      if (message.length < 10) {
        setText(msgErr, "Please enter a message (at least 10 characters).");
        hasError = true;
      }

      if (hasError) return;

      // For a static web app, we simulate submission success
      setText(
        successEl,
        "Thank you. Your appointment request has been received. A consultant will contact you shortly."
      );

      form.reset();
    });
  }

  // ----------------------------
  // Contact Form Validation
  // ----------------------------
  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const nameEl = $("#contactName");
    const emailEl = $("#contactEmail");
    const msgEl = $("#contactMessage");

    const nameErr = $("#contactNameError");
    const emailErr = $("#contactEmailError");
    const msgErr = $("#contactMessageError");
    const successEl = $("#contactSuccess");

    const clearErrors = () => {
      setText(nameErr, "");
      setText(emailErr, "");
      setText(msgErr, "");
      setText(successEl, "");
    };

    if (!nameEl || !emailEl || !msgEl) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const name = String(nameEl.value || "").trim();
      const email = String(emailEl.value || "").trim();
      const message = String(msgEl.value || "").trim();

      let hasError = false;

      if (name.length < 2) {
        setText(nameErr, "Please enter your name.");
        hasError = true;
      }

      if (!isEmailValid(email)) {
        setText(emailErr, "Please enter a valid email address.");
        hasError = true;
      }

      if (message.length < 10) {
        setText(msgErr, "Please enter a message (at least 10 characters).");
        hasError = true;
      }

      if (hasError) return;

      setText(successEl, "Thanks for your message. We will respond as soon as possible.");
      form.reset();
    });
  }

  // ----------------------------
  // Init
  // ----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    initCalculator();
    initAppointmentForm();
    initContactForm();
  });
})();
