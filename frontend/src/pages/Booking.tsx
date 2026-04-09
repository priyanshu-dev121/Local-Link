import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, MapPin, CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "@/api/api";
import { toast } from "sonner";
import { ServiceData } from "@/components/ServiceCard";

const Booking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceData | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (error) {
        toast.error("Error fetching service details");
        navigate("/services");
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) fetchService();
  }, [serviceId, navigate]);

  const handleProceedToPayment = () => {
    if (!date || !time || !address) {
      toast.error("Please fill in date, time, and address first");
      return;
    }
    setPaymentStep(true);
  };

  const handlePaymentAndBooking = async () => {
    setIsProcessing(true);
    
    // Simulate real payment delay
    await new Promise(r => setTimeout(r, 1500));

    try {
      await API.post("/bookings", {
        service: serviceId,
        date: new Date(`${date} ${time}`),
        address
      });

      toast.success("Payment Received & Booking Confirmed!");
      setConfirmed(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error confirming booking");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-20 flex justify-center"><p>Loading...</p></section>
      </Layout>
    );
  }

  if (!service && !confirmed) return null;

    <Layout>
      <section className="py-20 min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob -z-0 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000 -z-0 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          {confirmed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-12 md:p-16 border border-white/10"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10">
                 <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-4xl font-display font-black text-white tracking-tighter">Booking Confirmed!</h2>
              <p className="mt-4 text-slate-400 font-medium leading-relaxed">Your service has been secured. Our expert will arrive as scheduled. Get ready for excellence.</p>
              <div className="mt-10 p-8 rounded-[2rem] bg-white/5 text-left space-y-4 border border-white/5">
                <p className="flex items-center gap-4 text-slate-300 font-bold"><Calendar className="w-5 h-5 text-primary" /> {date}</p>
                <p className="flex items-center gap-4 text-slate-300 font-bold"><Clock className="w-5 h-5 text-primary" /> {time}</p>
                <p className="flex items-center gap-4 text-slate-300 font-bold"><MapPin className="w-5 h-5 text-primary" /> {address}</p>
              </div>
              <Link to="/dashboard">
                <button className="mt-10 w-full bg-primary text-white font-black py-5 rounded-2xl shadow-3xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-[0.2em]">
                   Return to Dashboard
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">Confirm <span className="text-primary italic">Booking</span></h1>
              <p className="mt-3 text-slate-400 font-medium">Review your details before we finalize your local excellence.</p>

              <div className="mt-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-10 lg:p-12 space-y-10 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="flex justify-between items-center p-8 rounded-[2rem] bg-white/5 border border-white/5">
                  <div>
                    <h3 className="font-black text-2xl text-white tracking-tight leading-none">{service?.title}</h3>
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-3">Category: {service?.category}</p>
                  </div>
                  <span className="text-3xl font-black text-white tracking-tighter">₹{service?.price}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Service Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white font-bold transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Arrival Time</label>
                    <div className="relative">
                      <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white font-bold transition-all appearance-none">
                        <option className="bg-slate-900">10:00 AM</option>
                        <option className="bg-slate-900">11:00 AM</option>
                        <option className="bg-slate-900">02:00 PM</option>
                        <option className="bg-slate-900">03:00 PM</option>
                      </select>
                      <Clock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Service Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Where should we arrive?" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white font-bold transition-all placeholder:text-slate-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Special Instructions</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any details for the pro..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white font-bold transition-all placeholder:text-slate-600 resize-none" />
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-400 tracking-tight">
                    <span>Base Service Price</span><span>₹{service?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-400 tracking-tight">
                    <span>Vetting & Platform Fee</span><span>₹29</span>
                  </div>
                  <div className="flex justify-between font-black text-3xl text-white mt-6 pt-6 border-t border-white/5 tracking-tighter">
                    <span>Grand Total</span><span className="text-primary prose-amber animate-pulse-glow">₹{(service?.price || 0) + 29}</span>
                  </div>
                </div>

                {!paymentStep ? (
                  <button className="w-full bg-primary text-white font-black py-6 rounded-2xl shadow-3xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-[0.3em]" onClick={handleProceedToPayment}>
                    Secure Checkout
                  </button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="pt-10 border-t border-white/10 space-y-8"
                  >
                    <div className="flex items-center gap-4">
                      <button onClick={() => setPaymentStep(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft className="w-5 h-5" /></button>
                      <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">Enter Payment Card</h3>
                    </div>
                    
                    <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden shadow-3xl border border-white/10 group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full -ml-24 -mb-24 blur-[80px] pointer-events-none" />
                      <ShieldCheck className="w-10 h-10 text-emerald-500/50 absolute top-8 right-8" />
                      
                      <div className="space-y-8 relative z-10">
                        <div>
                          <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] block mb-3">Card Number</label>
                          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:border-primary/50 font-mono tracking-widest text-center" />
                        </div>
                        <div className="flex gap-6">
                           <div className="flex-1">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] block mb-3">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-primary/50 font-mono text-center" />
                           </div>
                           <div className="flex-1">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] block mb-3">CVV</label>
                            <input type="password" placeholder="XXX" className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-primary/50 font-mono text-center tracking-[0.5em]" />
                           </div>
                        </div>
                        <button onClick={handlePaymentAndBooking} disabled={isProcessing} className="w-full bg-primary hover:bg-white hover:text-primary text-white font-black py-6 rounded-2xl shadow-3xl shadow-primary/30 transition-all uppercase tracking-[0.3em] text-sm relative overflow-hidden group">
                          {isProcessing ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full mx-auto" />
                          ) : (
                            "Pay & Confirm"
                          )}
                        </button>
                        <p className="text-[10px] text-center text-slate-500 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"><ShieldCheck className="w-4 h-4" /> 256-Bit Secure Checkout</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
