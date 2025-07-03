// src/utils/auth.js

export function getUserIdFromToken(token) {
  try {
    const base64Url = token.split('.')[1]; // Get payload part of JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64 compatibility
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    return decoded.user_id || null;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}
