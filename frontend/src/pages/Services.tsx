import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";

/* Type for service coming from backend */
interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  price: number;
}

const Services = () => {

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [services, setServices] = useState<Service[]>([]);

  /* THIS is the useEffect */
  useEffect(() => {

    const fetchServices = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`)
        const data = await res.json();
        setServices(data);
        console.log("Backend services:", data);
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
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase());

      return matchCat && matchSearch;

    });

  }, [search, activeCategory, services]);

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">
              All Services
            </h1>
            <p className="mt-2 text-muted-foreground">
              Find the perfect service provider near you
            </p>
          </motion.div>

          {/* Search bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

              <input
                placeholder="Location"
                className="w-full md:w-44 pl-9 pr-3 py-3 rounded-xl border"
              />
            </div>

          </div>

          {/* Category buttons */}
          <div className="mt-6 flex flex-wrap gap-2">

            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "All"
                   ? "All"
                   : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}

          </div>

          {/* Services grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filtered.map((s, i) => (
              <motion.div
                key={s._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ServiceCard service={s} />
              </motion.div>
            ))}

          </div>

          {/* No services message */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p>No services found.</p>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default Services;