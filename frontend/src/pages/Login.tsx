import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import API from "@/api/api";

const Login = () => {

  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<"customer" | "provider">("customer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {

    if (!email || !password || (isSignup && !name)) {
      toast.error("Please fill all fields");
      return;
    }

    const endpoint = isSignup ? "/auth/signup" : "/auth/login";

    try {
      const deviceToken = localStorage.getItem("deviceToken") || undefined;
    const res = await API.post(endpoint, {
        name: isSignup ? name : undefined,
        email,
        password,
        role: isSignup ? role : undefined,
        deviceToken: !isSignup ? deviceToken : undefined
      });

      console.log("Auth response:", res.data);

      if (isSignup) {
        // Signup always requires OTP
        toast.success("Account created! Please verify your email/phone.");
        localStorage.setItem("pendingVerificationEmail", email);
        navigate("/verify");
      } else if (res.data.skipOtp) {
        // Trusted browser — skip OTP entirely
        toast.success("Welcome back! Trusted device recognized.");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user.role === "provider") {
          navigate("/provider-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Unrecognized browser — require OTP
        toast.success("Welcome back! Please verify your identity.");
        localStorage.setItem("pendingVerificationEmail", email);
        navigate("/verify");
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Server error";
      toast.error(errorMessage);
    }
  };

  return (
    <Layout>
      <section className="py-20 min-h-screen flex items-center bg-slate-950 relative overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-blob -z-0 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000 -z-0 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-10 lg:p-12 border border-white/10"
          >

            <div className="text-center mb-10">

              <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40">
                <MapPin className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-4xl font-display font-black text-white tracking-tighter">
                {isSignup ? "Join Us" : "Welcome Back"}
              </h1>

              <p className="text-slate-400 font-medium mt-2">
                {isSignup ? "Step into the local excellence." : "Resume your local link journey."}
              </p>

            </div>

            {isSignup && (
              <div className="flex rounded-2xl bg-white/5 p-1.5 mb-8 border border-white/5">
                {(["customer", "provider"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                      role === r
                        ? "bg-primary text-white shadow-xl"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {r === "customer" ? "Customer" : "Expert"}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-6">

              {isSignup && (
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <input
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="Secret Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-bold focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-3xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                {isSignup ? "Create Free Account" : "Access Account"}
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>

            <p className="text-center text-xs font-bold text-slate-500 mt-10 uppercase tracking-widest">
              {isSignup ? "Already one of us?" : "New to locallink?"}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-primary hover:text-white transition-colors ml-2 underline decoration-primary/30"
              >
                {isSignup ? "Sign In" : "Register Now"}
              </button>
            </p>

          </motion.div>

        </div>
      </section>
    </Layout>
  );
};

export default Login;