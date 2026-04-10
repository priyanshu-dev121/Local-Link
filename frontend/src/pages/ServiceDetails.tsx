import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, ShieldCheck, ArrowLeft, Calendar, Check, Briefcase, User, Info } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import API, { BACKEND_URL } from "@/api/api";
import { toast } from "sonner";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        setService(res.data);
      } catch (error) {
        toast.error("Service not found");
        navigate("/services");
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id, navigate]);

  const getImageUrl = (path: string) => {
    if (!path) return "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800";
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading LocalLink Details...</div>;
  if (!service) return null;

  return (
    <Layout>
      <section className="py-24 bg-slate-950 relative overflow-hidden min-h-screen">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-0" />

        <div className="container mx-auto px-4 relative z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 font-bold uppercase tracking-widest text-xs group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: Image & Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7"
            >
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl aspect-video mb-8">
                <img src={getImageUrl(service.image)} className="w-full h-full object-cover" alt={service.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-10 left-10">
                   <span className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">{service.category}</span>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter mb-6">{service.title}</h1>
                  <div className="flex flex-wrap gap-8 items-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    <span className="flex items-center gap-2">
                       <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9 (120+ Reviews)
                    </span>
                    <span className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-primary" /> Verified Pro
                    </span>
                    <span className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-accent" /> Available Locally
                    </span>
                  </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl">
                   <h3 className="text-xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
                     <Info className="w-5 h-5 text-primary" /> Service Overview
                   </h3>
                   <p className="text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-wrap">{service.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 rounded-3xl bg-white/5 border border-white/10 group hover:border-emerald-500/30 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="font-black text-white mb-2">Safety Guaranteed</h4>
                      <p className="text-slate-500 text-sm font-medium">All our professionals are background checked and verified for your peace of mind.</p>
                   </div>
                   <div className="p-8 rounded-3xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                         <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-black text-white mb-2">Fixed Pricing</h4>
                      <p className="text-slate-500 text-sm font-medium">No hidden costs. The price you see is exactly what you pay for the basic service.</p>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Booking Card & Provider Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-8"
            >
              {/* Sticky Price Card */}
              <div className="sticky top-24 space-y-8">
                <div className="p-10 rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
                  
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Total Price</p>
                      <span className="text-5xl font-black text-white tracking-tighter tabular-nums">₹{service.price}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Available Now</span>
                    </div>
                  </div>

                  <Link to={`/booking/${service._id}`}>
                    <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                       Proceed to Booking
                    </Button>
                  </Link>

                  <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest mt-6">
                     Secure checkout via HDFC Gateway
                  </p>
                </div>

                {/* Provider Profile Card */}
                <div className="p-10 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl">
                   <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Service Specialist</h3>
                   <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white text-3xl font-black overflow-hidden relative">
                         {service.provider?.image ? (
                            <img src={getImageUrl(service.provider.image)} className="w-full h-full object-cover" alt="Provider" />
                         ) : (
                            <span>{service.provider?.name?.charAt(0) || <User className="w-10 h-10" />}</span>
                         )}
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-white tracking-tight">{service.provider?.name || "Verified Provider"}</h4>
                         <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
                           <Briefcase className="w-3.5 h-3.5" /> {service.provider?.businessName || "Independent Expert"}
                         </p>
                      </div>
                   </div>
                   
                   <div className="space-y-6 pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Experience</span>
                         <span className="text-white font-black tracking-widest">{service.provider?.experience || 5}+ Years</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Member Since</span>
                         <span className="text-white font-black tracking-widest">2024</span>
                      </div>
                      <div className="pt-4">
                         <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-3">
                           {service.provider?.bio || "A dedicated professional serving the local community with excellence and integrity."}
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetails;
