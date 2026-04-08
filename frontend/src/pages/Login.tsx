import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<"customer" | "provider">("customer");

  return (
    <Layout>
      <section className="py-16 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-card rounded-2xl shadow-card p-8"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-display font-bold text-card-foreground">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignup ? "Join NeighbourHub today" : "Sign in to your account"}
              </p>
            </div>

            {isSignup && (
              <div className="flex rounded-xl bg-muted p-1 mb-6">
                {(["customer", "provider"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      role === r ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    {r === "customer" ? "Customer" : "Service Provider"}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {isSignup && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>

              <Link to="/dashboard">
                <Button className="w-full" size="lg">
                  {isSignup ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">Google</Button>
              <Button variant="outline" className="w-full">GitHub</Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium hover:underline">
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
