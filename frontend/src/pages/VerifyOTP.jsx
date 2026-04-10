import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/api/api';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSpamWarning, setShowSpamWarning] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpamWarning(true);
    }, 30000); // 30 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleOnChange = (e, index) => {
    const newOtp = [...otp];
    const val = e.target.value;
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    
    // Move to next input
    if (val) {
      setActiveOTPIndex(Math.min(5, index + 1));
    }
  };

  const handleOnKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index]) {
      setActiveOTPIndex(Math.max(0, index - 1));
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    
    setIsVerifying(true);
    try {
      const email = localStorage.getItem("pendingVerificationEmail");
      if (!email) throw new Error("Verification session expired. Please relogin.");
      
      const res = await API.post("/auth/verify", { email, otp: code });
      
      toast.success("Identity Verified successfully!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Save the device token so this browser is trusted for 30 days
      if (res.data.deviceToken) {
        localStorage.setItem("deviceToken", res.data.deviceToken);
      }
      localStorage.removeItem("pendingVerificationEmail");
      
      if (res.data.user.role === "provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Invalid Verification Code";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden">
       {/* Background ambient lighting */}
       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }} 
         animate={{ opacity: 1, scale: 1 }} 
         className="w-full max-w-md p-8 md:p-12 relative z-10"
       >
          <div className="absolute inset-0 bg-card border border-border shadow-2xl rounded-[3rem] backdrop-blur-xl -z-10" />
          
          <button onClick={() => navigate(-1)} className="w-10 h-10 mb-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all border border-border"><ArrowLeft className="w-5 h-5" /></button>

          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center relative shadow-[0_0_50px_rgba(232,78,27,0.2)]">
                <ShieldCheck className="w-10 h-10 text-primary" />
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-0 border-2 border-primary/30 rounded-[2rem] border-dashed" />
             </div>
          </div>

          <h2 className="text-3xl font-black font-display text-center text-foreground mb-4">Verify Your Email</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm leading-relaxed">We sent a 6-digit code to <strong className="text-foreground">{localStorage.getItem("pendingVerificationEmail") || "your email"}</strong>. Check your inbox and enter it below.</p>

          <div className="flex justify-center gap-2 sm:gap-3 mb-10">
            {otp.map((_, index) => (
               <input
                 key={index}
                 ref={index === activeOTPIndex ? inputRef : null}
                 type="number"
                 className="w-10 h-12 sm:w-14 sm:h-16 bg-background border border-border rounded-xl text-center text-2xl font-black font-mono text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-inner transition-all hide-arrows"
                 value={otp[index]}
                 onChange={(e) => handleOnChange(e, index)}
                 onKeyDown={(e) => handleOnKeyDown(e, index)}
               />
            ))}
          </div>

          <AnimatePresence>
            {showSpamWarning && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                   <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-[11px] font-bold text-amber-500 leading-tight">
                  Not seeing the code? <br />
                  <span className="text-slate-400">Please check your <strong className="text-amber-500 underline">Spam Folder</strong>.</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <style>{`
             .hide-arrows::-webkit-outer-spin-button,
             .hide-arrows::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
             }
             .hide-arrows {
                -moz-appearance: textfield;
             }
          `}</style>

          <button 
             onClick={handleVerify} 
             disabled={isVerifying}
             className="w-full h-14 bg-primary hover:bg-white hover:text-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(232,78,27,0.3)] group"
          >
             {isVerifying ? (
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
             ) : (
               <>Verify Identity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
             )}
          </button>

          <div className="mt-10 flex justify-center">
             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"><Mail className="w-3.5 h-3.5" /> Resend Email Code</button>
          </div>
       </motion.div>
    </div>
  )
}
