import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";

import API from "@/api/api";
import { ServiceData } from "@/components/ServiceCard";

const Services = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [locationSearch, setLocationSearch] = useState(searchParams.get("location") || "");
  const [activeCategory, setActiveCategory] = useState("All");
  const [services, setServices] = useState<ServiceData[]>([]);

  /* THIS is the useEffect */
  useEffect(() => {

    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data);
        console.log("Backend services:", res.data);
      } catch (error) {
        console.log("Error fetching services:", error);
      }
    };

    fetchServices();

  }, []);

  const categories = [
  "All",
  "plumber",
  "electrician",
  "cleaning",
  "painter"
 ];

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat =
           activeCategory === "All" ||
           s.category.toLowerCase() === activeCategory.toLowerCase();

      const matchSearch =
        search === "" ||
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase());

      const matchLoc =
        locationSearch === "" ||
        s.title?.toLowerCase().includes(locationSearch.toLowerCase()) ||
        s.description?.toLowerCase().includes(locationSearch.toLowerCase());

      return matchCat && matchSearch && matchLoc;
    });
  }, [search, locationSearch, activeCategory, services]);

  return (
    <Layout>
      <section className="py-20 relative min-h-screen bg-slate-950 overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000 -z-0 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-pulse-glow">Services</span>
            </h1>
            <p className="mt-6 text-slate-400 text-lg font-medium max-w-xl mx-auto">
              The most reliable local professionals, now at your fingertips.
            </p>
          </motion.div>

          {/* Sexy Search Bar */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-3xl">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What service are you looking for?"
                  className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-transparent text-white placeholder:text-slate-500 font-bold focus:outline-none transition-all"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Location"
                  className="w-full md:w-56 pl-14 pr-6 py-6 rounded-[2rem] bg-white/5 text-white placeholder:text-slate-500 font-bold border border-white/5 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Sexy Category filters */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                    activeCategory === cat
                      ? "bg-primary text-white border-primary shadow-2xl shadow-primary/40 scale-105"
                      : "bg-white/5 text-slate-400 border-white/10 hover:border-primary/50 hover:text-white"
                  }`}
                >
                  {cat === "All"
                    ? "All Services"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((s, i) => (
              <motion.div
                key={s._id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
              >
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </div>

          {/* No services message */}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 rounded-[3rem] bg-white/5 border border-white/5 mt-10">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/5">
                 <Search className="w-12 h-12 text-slate-600 opacity-20" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">No services matched.</h3>
              <p className="text-slate-400 font-medium">Try broader keywords or a different category.</p>
            </motion.div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default Services;