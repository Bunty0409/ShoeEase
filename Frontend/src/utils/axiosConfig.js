export const base_url = process.env.REACT_APP_API_URL || "http://localhost:5000/api/";

// BUG-08 FIX: The original code evaluated the token once at module import time
// and stored it in a constant. Any user who logged in AFTER the app loaded
// would always send an empty Bearer token because the module-level value was
// already frozen to "" at startup.
//
// Solution: export getConfig() as a function so each API call reads the token
// from localStorage at call time, always returning a fresh, valid token.
export const getConfig = () => {
  const customer = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;
  return {
    headers: {
      Authorization: `Bearer ${customer?.token ?? ""}`,
      Accept: "application/json",
    },
  };
};

// Keep config as a backwards-compatible alias for components that build
// one-off request objects (e.g. Checkout.js inline Razorpay axios calls).
// Services should use getConfig() directly.
export const config = getConfig();
