import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email, 
  message: "You can only request 3 OTPs per hour for this email.",
});

export const verifyAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Allow 5 attempts per hour
  keyGenerator: (req) => req.body.email || req.ip,
  message: "Too many account verification attempts. Please try again after an hour.",

});

// ✅ Limit for Forgot Password Reset OTP
export const resetPasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3, // Allow 3 reset attempts per 30 mins
  keyGenerator: (req) => req.body.email || req.ip,
  message: "Too many password reset attempts. Please try again later.",

});


