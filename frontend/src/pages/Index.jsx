import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ArrowRight, Shield, Clock, Users, CalendarCheck, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import HeroScene from "@/components/HeroScene";
import ServiceCard from "@/components/ServiceCard";
import { categories, services, testimonials } from "@/data/services";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleSearch = () => {
    navigate(`/services?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative min-h-[90vh] bg-slate-950 flex items-center overflow-hidden"
      >
        <HeroScene />
        
        {/* Sexy Spotlight Mouse Glow */}
        <motion.div 
          animate={{
            x: mousePos.x - 400,
            y: mousePos.y - 400,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 50 }}
          className="pointer-events-none absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen z-0"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-primary text-xs font-black uppercase tracking-[0.3em] mb-8 shadow-2xl"
            >
              🏠 Your Neighbourhood, Your Services
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-black text-white leading-[0.95] tracking-tighter">
              Discover <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-pulse-glow">Local Excellence</span>
            </h1>
            <p className="mt-8 text-xl text-slate-300 max-w-lg font-medium leading-relaxed">
              The smartest way to find trusted professionals in your community. Reliable. Vetted. Instant.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-3xl max-w-2xl"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need?"
                  className="w-full pl-14 pr-4 py-5 rounded-2xl bg-transparent text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Location"
                    className="w-full pl-10 pr-3 py-5 rounded-2xl bg-white/5 text-white placeholder:text-slate-500 border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  size="lg" 
                  className="h-full px-8 rounded-2xl bg-primary text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/40 hover:shadow-primary/60"
                >
                  Search
                </Button>
              </div>
            </motion.div>

            <div className="mt-12 flex flex-wrap items-center gap-4 sm:gap-8">
              {[
                { label: "10K+ Providers", icon: Users },
                { label: "4.8 Avg Rating", icon: Star },
                { label: "Vetted Pros", icon: Shield },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-400 group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Redesigned Categories (Even Sexier) */}
      <section className="py-32 relative bg-slate-950 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter">
              Select <span className="text-primary italic">Expertise</span>
            </h2>
            <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Handpacked professionals waiting to serve your community.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -12, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
              >
                <Link
                  to={`/services?category=${cat.name}`}
                  className="flex flex-col items-center justify-center aspect-square rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-primary/50 hover:bg-white/10 transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500 z-10">{cat.icon}</span>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors z-10">{cat.name}</span>
                  
                  {/* Subtle Corner Accents */}
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary group-hover:animate-ping" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: The LocalLink Advantage (Sexy Dark Mode) */}
      <section className="py-24 overflow-hidden bg-slate-950 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h3 className="text-primary font-black tracking-widest uppercase text-xs mb-4">Why LocalLink?</h3>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white leading-[0.95] mb-10 tracking-tighter">
                The Standard of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Reliability</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Verified Professionals", desc: "Every provider undergoes a rigorous vetting process so you can hire with peace of mind.", icon: Shield },
                  { title: "Transparent Pricing", desc: "No hidden fees or surprises. See upfront costs and pay securely through our portal.", icon: CheckCircle },
                  { title: "Instant Booking", desc: "Schedule services in seconds. Real-time availability from experts in your exact zip code.", icon: Clock },
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    viewport={{ once: true }}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-white group-hover:text-primary transition-colors tracking-tight">{feature.title}</h4>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative min-h-[600px] flex items-center justify-center"
            >
              {/* Animated Background Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 90, 0],
                    x: [-40, 40, -40],
                    y: [-40, 40, -40]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-80 h-80 bg-primary/30 rounded-full blur-[100px]" 
                />
                <motion.div 
                   animate={{ 
                    scale: [1.3, 1, 1.3],
                    rotate: [0, -90, 0],
                    x: [40, -40, 40],
                    y: [40, -40, 40]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-[120px]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-8 relative w-full">
                <div className="space-y-8 pt-16">
                   <motion.div 
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      className="aspect-[4/5] rounded-[3rem] bg-slate-900 shadow-3xl overflow-hidden group border-4 border-white/10"
                   >
                      <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" alt="Home Service" />
                   </motion.div>
                   <motion.div 
                      whileHover={{ y: -15 }}
                      className="aspect-square rounded-[2.5rem] bg-primary flex flex-col items-center justify-center text-white text-center p-8 space-y-3 shadow-3xl shadow-primary/40 border border-white/20"
                   >
                      <span className="text-5xl font-black tracking-tighter">98%</span>
                      <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Success Rate</span>
                   </motion.div>
                </div>
                <div className="space-y-8">
                   <motion.div 
                      whileHover={{ y: 15 }}
                      className="aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center shadow-3xl backdrop-blur-2xl"
                   >
                      <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-4">
                         <Users className="w-10 h-10 text-primary" />
                      </div>
                      <span className="text-4xl font-black text-white tracking-tighter">10k+</span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Expert Pros</span>
                   </motion.div>
                   <motion.div 
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="aspect-[4/5] rounded-[3rem] bg-slate-900 shadow-3xl overflow-hidden group border-4 border-white/10"
                   >
                      <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" alt="Repairing" />
                   </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: LocalLink Pulse (Sexy Dark Trust Section) */}
      <section className="py-24 relative bg-slate-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/3 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Daily Appointments", value: "1,240+", sub: "Verified bookings today" },
              { label: "Professional Partners", value: "8,500+", sub: "Top-rated local experts" },
              { label: "Cities Covered", value: "45+", sub: "Expanding across India" },
              { label: "User Rating", value: "4.9/5", sub: "Based on 50k+ reviews" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4 group"
              >
                <h4 className="text-5xl lg:text-7xl font-black text-white tabular-nums tracking-tighter group-hover:text-primary transition-colors duration-500 drop-shadow-2xl">{stat.value}</h4>
                <p className="text-primary font-black text-sm tracking-[0.3em] uppercase">{stat.label}</p>
                <p className="text-slate-400 text-xs font-bold">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-20 p-[2px] rounded-[3rem] bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 shadow-3xl hover:shadow-primary/30 transition-all duration-500"
          >
            <div className="bg-slate-900 rounded-[2.9rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 backdrop-blur-3xl">
               <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0 animate-pulse border border-primary/20">
                  <Shield className="w-12 h-12 text-primary" />
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h4 className="text-3xl font-black text-white mb-4 tracking-tight leading-none">The LocalLink Safety Guarantee</h4>
                  <p className="text-slate-400 leading-relaxed max-w-2xl font-medium">
                    Every service booked through our platform is covered by our ₹10,000 protection plan. We stand by the quality of our professionals, ensuring your home is always in safe hands.
                  </p>
               </div>
                <button 
                   onClick={() => {
                     const el = document.getElementById('how-it-works');
                     el?.scrollIntoView({ behavior: 'smooth' });
                   }}
                   className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-primary text-white font-black hover:bg-white hover:text-primary transition-all transform hover:-translate-y-2 hover:shadow-3xl active:scale-95 text-base shrink-0"
                >
                   Learn More
                </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">It Works</span>
            </motion.h2>
          </motion.div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 -translate-y-1/2 rounded-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: "01", title: "Discover Services", desc: "Browse local pros. Filter by category, location, or price.", icon: Search, color: "from-blue-500 to-cyan-400" },
                { step: "02", title: "Book & Schedule", desc: "Select time and use our mock payment portal.", icon: CalendarCheck, color: "from-purple-500 to-pink-400" },
                { step: "03", title: "Service Delivered", desc: "Get high-quality service right to your doorstep.", icon: CheckCircle, color: "from-green-500 to-emerald-400" },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                  className="text-center relative group"
                >
                  <div className="w-24 h-24 rounded-full bg-background shadow-2xl border-4 border-background mx-auto mb-6 flex items-center justify-center relative cursor-pointer group-hover:-translate-y-4 group-hover:scale-110 transition-all duration-500 ease-out z-20">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${item.color} rounded-full opacity-20 blur-md group-hover:opacity-60 transition-opacity duration-500`} />
                    <item.icon className="w-10 h-10 text-foreground relative z-10 group-hover:text-primary transition-colors" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs shadow-lg">{item.step}</div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl group-hover:shadow-primary/5 transition-all duration-500 translate-y-0 group-hover:-translate-y-2 relative z-10">
                    <h3 className="text-xl font-display font-extrabold text-card-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
        <div className="absolute -right-64 -top-64 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -z-0" />
        <div className="absolute -left-64 -bottom-64 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-0" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-16 tracking-tight">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">thousands</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-primary/20 transition-all cursor-pointer group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700 ease-out" />
                <div className="flex gap-1 mb-5 relative z-10">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-md" />
                  ))}
                </div>
                <p className="text-base text-gray-300 leading-relaxed font-light italic relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-8 relative z-10">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent shadow-lg group-hover:rotate-12 transition-transform">
                     <img src={t.avatar} alt={t.name} className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                  </div>
                  <div>
                    <span className="block font-bold text-base text-white tracking-wide">{t.name}</span>
                    <span className="block text-xs font-semibold text-primary/80 uppercase tracking-widest mt-0.5">Verified Customer</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary to-accent p-12 md:p-24 text-center shadow-2xl shadow-primary/30">
            {/* Background geometric glass flares */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight drop-shadow-sm">
                Ready to connect with your neighbourhood?
              </h2>
              <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
                Join thousands of happy customers and service providers securely trading high-quality services right around the corner.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/login?mode=signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full rounded-2xl bg-white text-primary hover:bg-gray-50 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 text-lg font-bold px-10 h-16">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/services" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="group w-full rounded-2xl border-2 border-white/50 text-white hover:bg-white hover:text-primary hover:border-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 text-lg font-bold bg-white/10 backdrop-blur-md px-10 h-16">
                    Browse Services <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
