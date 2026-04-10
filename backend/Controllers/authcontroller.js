const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const transporter = require('../Config/mailer');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (toEmail, otp) => {
  try {
    await transporter.sendMail({
      from: `"LocalLink Security 🔐" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your LocalLink Verification Code",
      html: `
        <div style="font-family:Arial,sans-serif;background:#0f172a;padding:40px;border-radius:20px;max-width:480px;margin:auto;">
          <h2 style="color:#ff6b35;margin-bottom:8px;font-size:24px;">LocalLink</h2>
          <p style="color:#94a3b8;font-size:14px;margin-bottom:32px;">Your secure verification code</p>
          <div style="background:#1e293b;border-radius:16px;padding:32px;text-align:center;border:1px solid #334155;">
            <p style="color:#94a3b8;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">One-Time Password</p>
            <h1 style="color:#ffffff;font-size:48px;letter-spacing:16px;font-family:monospace;margin:0;">${otp}</h1>
          </div>
          <p style="color:#64748b;font-size:12px;margin-top:24px;text-align:center;">This code expires in <strong style="color:#ff6b35;">10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `
    });
  } catch(e) {
    console.log('Mail error:', e.message);
  }
};


// 👉 SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 mins

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      otp,
      otpExpiresAt
    });

    await sendOTPEmail(user.email, otp);
    res.status(201).json({ message: "Verification code sent to your email", email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👉 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, deviceToken } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // --- TRUSTED DEVICE CHECK ---
    // If browser sends a deviceToken, check if it's valid and not expired
    if (deviceToken) {
      const hashedIncoming = crypto.createHash('sha256').update(deviceToken).digest('hex');
      const trustedDevice = user.trustedDevices?.find(
        d => d.token === hashedIncoming && new Date(d.expiresAt) > new Date()
      );

      if (trustedDevice) {
        // Trusted browser! Skip OTP — issue JWT directly
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        return res.json({
          message: "Trusted device login successful",
          skipOtp: true,
          token,
          user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
      }
    }

    // Not a trusted device — send OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 mins
    await user.save();

    await sendOTPEmail(user.email, otp);
    res.json({ message: "Verification code sent to your email", email: user.email });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👉 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== String(otp)) return res.status(400).json({ message: "Invalid OTP Code" });
    if (new Date() > new Date(user.otpExpiresAt)) return res.status(400).json({ message: "OTP has expired" });
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    // --- GENERATE DEVICE TOKEN (trust this browser for 30 days) ---
    const rawDeviceToken = crypto.randomBytes(32).toString('hex');
    const hashedDeviceToken = crypto.createHash('sha256').update(rawDeviceToken).digest('hex');
    const deviceExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Clean expired tokens then add new one
    user.trustedDevices = (user.trustedDevices || []).filter(d => new Date(d.expiresAt) > new Date());
    user.trustedDevices.push({ token: hashedDeviceToken, expiresAt: deviceExpiry });

    await user.save();
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      message: "Identity verified successfully",
      token,
      deviceToken: rawDeviceToken, // send raw token to browser for storage
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};