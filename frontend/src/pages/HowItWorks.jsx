import { motion } from "framer-motion";
import { Search, CalendarCheck, CheckCircle, Star } from "lucide-react";
import Layout from "@/components/Layout";

const steps = [
  {
    icon: Search,
    title: "1. Discover Services",
    description: "Browse through our extensive list of local neighbourhood services. Filter by category, location, or price to find exactly what you need.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: CalendarCheck,
    title: "2. Book & Schedule",
    description: "Select your preferred date and time, provide your location, and securely confirm your booking with a mock payment portal.",
    color: "from-purple-500 to-pink-400"
  },
  {
    icon: CheckCircle,
    title: "3. Service Delivered",
    description: "Your verified neighbourhood professional will arrive at the scheduled time to deliver high-quality service right to your doorstep.",
    color: "from-green-500 to-emerald-400"
  },
  {
    icon: Star,
    title: "4. Rate & Review",
    description: "After the job is done, share your experience to help the community make informed decisions.",
    color: "from-amber-400 to-orange-500"
  }
];

const HowItWorks = () => {
  return (
    <Layout>
      <section className="py-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-extrabold mb-6"
          >
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">LocalLink</span> Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-16"
          >
            Connecting with your local neighborhood experts has never been easier.
          </motion.p>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-accent/20 to-transparent -translate-x-1/2 rounded-full" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 text-center md:text-left">
                    <h3 className={`text-2xl font-bold mb-3 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      {step.title}
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="w-20 h-20 rounded-full shrink-0 bg-background shadow-xl border-4 border-background z-10 flex items-center justify-center relative group cursor-pointer hover:scale-110 transition-transform">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${step.color} rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity`} />
                    <step.icon className={`w-8 h-8 text-foreground z-10`} />
                  </div>
                  
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
