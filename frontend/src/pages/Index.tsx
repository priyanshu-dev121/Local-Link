import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ArrowRight, Shield, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import HeroScene from "@/components/HeroScene";
import ServiceCard from "@/components/ServiceCard";
import { categories, services, testimonials } from "@/data/services";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] bg-hero flex items-center overflow-hidden">
        <HeroScene />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
              🏠 Your Neighbourhood, Your Services
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-secondary-foreground leading-tight">
              Find Trusted Local
              <span className="text-gradient block">Service Providers</span>
            </h1>
            <p className="mt-5 text-lg text-secondary-foreground/70 max-w-lg">
              Book plumbers, electricians, tutors, and more — right from your neighbourhood. Fast, reliable, affordable.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a service..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-card text-card-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    placeholder="Location"
                    className="w-40 pl-9 pr-3 py-3.5 rounded-xl bg-card text-card-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Link to="/services">
                  <Button size="lg" className="h-full px-6 rounded-xl">Search</Button>
                </Link>
              </div>
            </motion.div>

            <div className="mt-8 flex items-center gap-6 text-sm text-secondary-foreground/60">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 10K+ Providers</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4" /> 4.8 Avg Rating</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Verified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Browse by Category
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-muted-foreground max-w-md mx-auto">
              Find the right professional for any job around your home
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {categories.map((cat, i) => (
              <motion.div key={cat.name} variants={fadeUp} custom={i}>
                <Link
                  to="/services"
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all group"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Featured Services</h2>
              <p className="mt-3 text-muted-foreground">Top-rated services in your area</p>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-display font-bold text-foreground">
              How It Works
            </motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Search", desc: "Find the service you need in your neighbourhood", icon: Search },
              { step: "02", title: "Book", desc: "Choose a provider, pick a time, and confirm", icon: Clock },
              { step: "03", title: "Done", desc: "Get the job done by a verified professional", icon: Shield },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8 rounded-2xl bg-card shadow-card"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary">STEP {item.step}</span>
                <h3 className="mt-2 text-xl font-display font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-4">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <span className="font-semibold text-sm text-card-foreground">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-hero p-12 md:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary-foreground">
                Ready to get started?
              </h2>
              <p className="mt-4 text-secondary-foreground/70 max-w-md mx-auto">
                Join thousands of happy customers and service providers on NeighbourHub.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link to="/login">
                  <Button size="lg" className="rounded-xl animate-pulse-glow">Get Started Free</Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="rounded-xl border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                    Browse Services
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
