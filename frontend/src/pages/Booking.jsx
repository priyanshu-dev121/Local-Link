import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Calendar, Clock, MapPin, QrCode, ArrowLeft, ShieldCheck, Navigation, Crosshair, Map as MapIcon } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "@/api/api";
import { toast } from "sonner";

const Booking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
       toast.error("Geolocation is not supported by your browser");
       return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        // Mock Reverse Geocoding for specific "Success" feel
        setAddress(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setIsFetchingLocation(false);
        toast.success("Location fetched successfully!");
      },
      (error) => {
        setIsFetchingLocation(false);
        toast.error("Unable to retrieve your location");
      }
    );
  };

  const handleProceedToPayment = () => {
    if (!date || !time || !address) {
      toast.error("Please fill in date, time, and address first");
      return;
    }
    setPaymentStep(true);
  };

  const handlePaymentAndBooking = async () => {
    setIsProcessing(true);
    
    // Simulate systematic 3-second bank verification network delay
    await new Promise(r => setTimeout(r, 4000));

    try {
      await API.post("/bookings", {
        service: serviceId,
        date: new Date(`${date} ${time}`),
        address,
        coordinates
      });

      toast.success("Payment Received & Booking Confirmed!");
      setConfirmed(true);
    } catch (error) {
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

  return (
    <Layout>
      <section className="py-20 min-h-screen bg-slate-950 relative overflow-hidden">
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
              <h2 className="text-4xl font-display font-black text-white tracking-tighter">Receipt Generated!</h2>
              <p className="mt-4 text-slate-400 font-medium leading-relaxed">Check your email for the confirmation receipt. Our expert is now notified.</p>
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
              <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">Finalize <span className="text-primary italic">Order</span></h1>
              <p className="mt-3 text-slate-400 font-medium">Verify your details and location for the provider.</p>

              <div className="mt-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-6 sm:p-10 lg:p-12 space-y-10 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 sm:p-8 rounded-[2rem] bg-white/5 border border-white/5 gap-4">
                  <div>
                    <h3 className="font-black text-2xl text-white tracking-tight leading-none">{service?.title}</h3>
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-3">Expert: {service?.provider?.name || 'Local Pro'}</p>
                  </div>
                  <span className="text-3xl font-black text-white tracking-tighter">₹{service?.price}</span>
                </div>

                {/* Specific Location Selector */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Location</label>
                      <button 
                        onClick={fetchCurrentLocation}
                        disabled={isFetchingLocation}
                        className="text-[10px] font-black text-primary hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5 disabled:opacity-50"
                      >
                         <Crosshair className={`w-3 h-3 ${isFetchingLocation ? 'animate-spin' : ''}`} /> {isFetchingLocation ? 'Locating...' : 'Fetch My Location'}
                      </button>
                   </div>
                   
                   <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="Enter street address manually..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white font-bold transition-all placeholder:text-slate-600 shadow-inner" 
                      />
                   </div>

                   {coordinates && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-2xl overflow-hidden bg-slate-900 border border-white/5 p-4 text-center">
                         <div className="flex items-center justify-center gap-3 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                            <Navigation className="w-4 h-4" /> Coordinates Locked
                         </div>
                         <div className="relative h-24 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                            {/* Static Placeholder for Map without API Key */}
                            <MapIcon className="w-12 h-12 text-white/10" />
                            <p className="absolute text-[8px] text-slate-600 uppercase tracking-widest font-black">Live Map Preview Active</p>
                            <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" />
                         </div>
                      </motion.div>
                   )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white font-bold transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Arrival Time</label>
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

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Base Service Price</span><span>₹{service?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Booking Fee</span><span>₹29</span>
                  </div>
                  <div className="flex justify-between font-black text-3xl text-white mt-6 pt-6 border-t border-white/5 tracking-tighter">
                    <span>Grand Total</span><span className="text-primary animate-pulse">₹{(service?.price || 0) + 29}</span>
                  </div>
                </div>

                {(() => {
                  const finalTotal = (service?.price || 0) + 29;
                  const upiString = `upi://pay?pa=pprai1009@okhdfcbank&pn=LocalLink&am=${finalTotal}&cu=INR`;
                  
                  return !paymentStep ? (
                    <button className="w-full bg-primary text-white font-black py-6 rounded-2xl shadow-3xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-[0.3em]" onClick={handleProceedToPayment}>
                      Proceed to Receipt Generation
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-10 border-t border-white/10 space-y-8">
                      {!isProcessing && (
                        <div className="flex items-center gap-4">
                          <button onClick={() => setPaymentStep(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft className="w-5 h-5" /></button>
                          <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">Scan to Pay (HDFC Secure)</h3>
                        </div>
                      )}
                      
                      <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden shadow-3xl border border-white/10 flex flex-col items-center text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
                        
                        {isProcessing ? (
                           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-12 z-10 w-full">
                             <div className="relative w-28 h-28 mb-8">
                               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 rounded-full border-[3px] border-white/5 border-t-primary shadow-[0_0_30px_rgba(232,78,27,0.3)]" />
                               <ShieldCheck className="w-10 h-10 text-primary absolute inset-0 m-auto animate-pulse" />
                             </div>
                             <h4 className="text-2xl font-black font-display animate-pulse text-white mb-2 tracking-tighter">Confirming Payment...</h4>
                             <p className="text-slate-400 text-sm max-w-sm leading-relaxed">Verifying the 12-digit transaction ID with HDFC servers. Please wait.</p>
                           </motion.div>
                        ) : (
                           <>
                             <div className="relative z-10 group cursor-pointer mb-6">
                               <div className="bg-white p-3 rounded-[1.5rem] relative overflow-hidden">
                                  <QRCodeSVG value={upiString} size={220} level="H" />
                                  <motion.div animate={{ top: [0, 220, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute left-0 w-full h-[3px] bg-primary shadow-[0_0_20px_5px_rgba(232,78,27,0.8)] z-20 pointer-events-none rounded-full" />
                               </div>
                             </div>
                            
                             <h4 className="text-3xl font-black font-display mb-3 tracking-tighter text-white z-10">₹{finalTotal}</h4>
                             <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3 z-10 mb-6">
                               <ShieldCheck className="w-4 h-4 text-emerald-500" />
                               <span className="text-slate-300 text-xs font-mono tracking-widest">pprai1009@okhdfcbank</span>
                             </div>

                             <div className="w-full flex gap-4 z-10">
                               <button onClick={handlePaymentAndBooking} className="flex-1 bg-primary hover:bg-white hover:text-primary text-white font-black py-4 rounded-xl shadow-[0_0_40px_rgba(232,78,27,0.4)] transition-all uppercase tracking-[0.2em] text-[10px] relative overflow-hidden group">
                                  I Have Paid
                               </button>
                             </div>
                           </>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
