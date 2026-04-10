import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import API from "@/api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Reset code sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword });
      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 min-h-screen flex items-center bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-10 lg:p-12 border border-white/10"
          >
            <button onClick={() => step === 1 ? navigate("/login") : setStep(1)} className="mb-8 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                {step === 1 ? <Mail className="w-8 h-8 text-primary" /> : <ShieldCheck className="w-8 h-8 text-primary" />}
              </div>
              <h1 className="text-3xl font-display font-black text-white tracking-tighter">
                {step === 1 ? "Forgot Password?" : "Reset Password"}
              </h1>
              <p className="text-slate-400 font-medium mt-2">
                {step === 1 ? "Enter your email to receive a reset code." : "Check your inbox for the code."}
              </p>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="relative group mb-6">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                    <Button onClick={handleSendOTP} disabled={loading} className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-[0.2em] text-xs">
                      {loading ? "Sending..." : "Send Reset Code"} <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="space-y-5">
                      <div className="relative group">
                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input
                          placeholder="6-Digit Reset Code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
                        />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input
                          type="password"
                          placeholder="New Secret Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                    <Button onClick={handleResetPassword} disabled={loading} className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-[0.2em] text-xs mt-8">
                      {loading ? "Resetting..." : "Update Password"} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
