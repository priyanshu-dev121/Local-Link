import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Shield, Calendar, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";

const reviews = [
  { name: "Arjun M.", rating: 5, text: "Excellent work! Very professional and punctual.", date: "2 days ago" },
  { name: "Sneha K.", rating: 4, text: "Good service, reasonable pricing. Would recommend.", date: "1 week ago" },
  { name: "Rohan D.", rating: 5, text: "Best in the neighbourhood. Will definitely hire again!", date: "2 weeks ago" },
];

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const ProviderProfile = () => {
  const { id } = useParams();
  const service = services.find((s) => s.id === id) || services[0];

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link to="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Provider Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden bg-card shadow-card">
                <img src={service.image} alt={service.name} className="w-full h-64 object-cover" />
                <div className="p-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{service.category}</span>
                  <h1 className="mt-3 text-2xl md:text-3xl font-display font-bold text-card-foreground">{service.name}</h1>
                  <p className="mt-2 text-lg text-muted-foreground">by {service.provider}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-warning text-warning" /> {service.rating} ({service.reviews} reviews)</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {service.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.duration}</span>
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-success" /> Verified</span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-display font-semibold text-card-foreground">About this Service</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Professional {service.category.toLowerCase()} service provided by experienced and verified professionals. 
                      We ensure quality work with a satisfaction guarantee. All materials and tools are included in the service price.
                      Available for both residential and commercial properties in {service.location} and nearby areas.
                    </p>
                  </div>

                  {/* Reviews */}
                  <div className="mt-8">
                    <h3 className="font-display font-semibold text-card-foreground mb-4">Reviews</h3>
                    <div className="space-y-4">
                      {reviews.map((r, i) => (
                        <div key={i} className="p-4 rounded-xl bg-muted/50">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-card-foreground">{r.name}</span>
                            <span className="text-xs text-muted-foreground">{r.date}</span>
                          </div>
                          <div className="flex gap-0.5 my-1">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-warning text-warning" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Booking Sidebar */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="sticky top-24 rounded-2xl bg-card shadow-card p-6">
                <div className="text-center mb-6">
                  <span className="text-3xl font-display font-bold text-primary">₹{service.price}</span>
                  <span className="text-sm text-muted-foreground"> / session</span>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-card-foreground block mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" /> Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-card-foreground block mb-2">Available Slots</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        className="px-2 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors focus:bg-primary focus:text-primary-foreground"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <Link to="/booking">
                  <Button className="w-full" size="lg">Book Now</Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-3">Free cancellation up to 24 hours before</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProviderProfile;
