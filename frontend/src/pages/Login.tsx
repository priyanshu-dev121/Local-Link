import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Login = () => {

  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<"customer" | "provider">("customer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {

    if (!email || !password || (isSignup && !name)) {
      alert("Please fill all fields");
      return;
    }

    const url = isSignup
      ? "http://localhost:5000/api/auth/signup"
      : "http://localhost:5000/api/auth/login";

    try {

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await res.json();

      console.log("Auth response:", data);

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (isSignup) {

        alert("Signup successful. Please login.");

        setIsSignup(false);
        setName("");
        setEmail("");
        setPassword("");

      } else {

        alert("Login successful");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");

      }

    } catch (error) {

      console.log(error);
      alert("Server error");

    }
  };

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
                      role === r
                        ? "bg-card text-card-foreground shadow-sm"
                        : "text-muted-foreground"
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

                  <input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />

                </div>

              )}

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />

              </div>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />

              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
              >
                {isSignup ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}

              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-primary font-medium hover:underline ml-1"
              >
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