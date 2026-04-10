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
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [refCode] = useState(() => `LL-${Math.floor(Math.random() * 90000 + 10000)}`);

  // Timer logic for payment
  useEffect(() => {
    let timer;
    if (paymentStep && timeLeft > 0 && !isProcessing && !confirmed) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStep, timeLeft, isProcessing, confirmed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        
        try {
          // Real Reverse Geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          // Extract a cleaner address (Street, Area, City)
          const cleanAddress = data.display_name.split(',').slice(0, 5).join(',');
          setAddress(cleanAddress || `Location locked at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast.success("Location identified!");
        } catch (err) {
          setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          toast.error("Address fetch failed, using coordinates");
        } finally {
          setIsFetchingLocation(false);
        }
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("UPI ID Copied!");
  };

  const handlePaymentAndBooking = async () => {
    setIsProcessing(true);
    
    // Simulate systematic 3-second bank verification network delay with realistic steps
    const steps = ["Securing Transaction...", "Verifying with UPI Network...", "Syncing Escrow Ledger...", "Authenticating Transaction ID..."];
    for (const step of steps) {
        toast.info(step, { duration: 1000 });
        await new Promise(r => setTimeout(r, 1200));
    }

    try {
      await API.post("/bookings", {
        service: serviceId,
        date: new Date(`${date} ${time}`),
        address,
        coordinates,
        paymentRef: refCode
      });

      toast.success("Payment Verified & Held in Escrow!");
      setConfirmed(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed. Try again.");
      if (error.response?.status === 401) navigate("/login");
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
              <h2 className="text-4xl font-display font-black text-white tracking-tighter">Booking Confirmed!</h2>
              <p className="mt-4 text-slate-400 font-medium leading-relaxed">Your payment of ₹{(service?.price || 0) + 29} is **secured in LocalLink Escrow**. Expert is on their way!</p>
              
              <div className="mt-10 p-8 rounded-[2rem] bg-black/40 text-left space-y-4 border border-white/5">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                    <span className="text-[10px] font-black uppercase text-slate-500">Transaction ID</span>
                    <span className="text-xs font-mono text-emerald-500 uppercase">{refCode}</span>
                </div>
                <p className="flex items-center gap-4 text-slate-300 font-bold"><Calendar className="w-5 h-5 text-primary" /> {date}</p>
                <p className="flex items-center gap-4 text-slate-300 font-bold"><Clock className="w-5 h-5 text-primary" /> {time}</p>
                <p className="flex items-center gap-4 text-slate-300 font-bold"><MapPin className="w-5 h-5 text-primary" /> {address}</p>
              </div>
              <Link to="/dashboard">
                <button className="mt-10 w-full bg-primary text-white font-black py-5 rounded-2xl shadow-3xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-[0.2em]">
                   Open Dashboard
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">Secure <span className="text-primary italic">Checkout</span></h1>
              <p className="mt-3 text-slate-400 font-medium">Verify your details and pay securely via UPI.</p>

              <div className="mt-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-6 sm:p-10 lg:p-12 space-y-10 border border-white/10 relative overflow-hidden">
                {!paymentStep && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 sm:p-8 rounded-[2rem] bg-white/5 border border-white/5 gap-4">
                    <div>
                        <h3 className="font-black text-2xl text-white tracking-tight leading-none">{service?.title}</h3>
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-3">Expert: {service?.provider?.name || 'Local Pro'}</p>
                    </div>
                    <span className="text-3xl font-black text-white tracking-tighter">₹{service?.price}</span>
                    </div>
                )}

                {!paymentStep && (
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
                 </div>
                )}

                {!paymentStep && (
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
                )}

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Base Service Price</span><span>₹{service?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span>Booking Fee (Secure Escrow)</span><span>₹29</span>
                  </div>
                  <div className="flex justify-between font-black text-3xl text-white mt-6 pt-6 border-t border-white/5 tracking-tighter">
                    <span>Total Amount</span><span className="text-primary">₹{(service?.price || 0) + 29}</span>
                  </div>
                </div>

                {(() => {
                  const finalTotal = (service?.price || 0) + 29;
                  const upiID = "pprai1009@okhdfcbank";
                  const upiString = `upi://pay?pa=${upiID}&pn=LocalLink&am=${finalTotal}&tn=${refCode}&cu=INR`;
                  
                  return !paymentStep ? (
                    <button className="w-full bg-primary text-white font-black py-6 rounded-2xl shadow-3xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-[0.3em]" onClick={handleProceedToPayment}>
                      Continue to Payment
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-10 border-t border-white/10 space-y-8">
                      {!isProcessing && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button onClick={() => setPaymentStep(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ArrowLeft className="w-5 h-5" /></button>
                            <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">Scan to Pay</h3>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                            <Clock className="w-3 h-3 text-red-500 animate-pulse" />
                            <span className="text-[10px] font-black font-mono text-red-500">{formatTime(timeLeft)}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="relative p-6 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden shadow-3xl border border-white/10 flex flex-col items-center">
                        {isProcessing ? (
                           <motion.div className="flex flex-col items-center justify-center py-12 z-10 w-full">
                             <div className="relative w-28 h-28 mb-8">
                               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 rounded-full border-[3px] border-white/5 border-t-primary shadow-[0_0_30px_rgba(232,78,27,0.3)]" />
                               <ShieldCheck className="w-10 h-10 text-primary absolute inset-0 m-auto animate-pulse" />
                             </div>
                             <h4 className="text-2xl font-black font-display text-white mb-2 tracking-tighter">Escrow Syncing...</h4>
                             <p className="text-slate-400 text-sm max-w-sm text-center leading-relaxed">Securing your funds in LocalLink's verified vault. Please do not close this window.</p>
                           </motion.div>
                        ) : (
                           <>
                             <div className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="text-left">
                                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LocalLink Escrow Active</p>
                                   <p className="text-[9px] text-slate-400 font-medium leading-tight mt-1">Your payment is held securely and only released after service completion.</p>
                                </div>
                             </div>

                             <div className="bg-white p-4 rounded-[2rem] mb-6 relative group transform transition-transform hover:scale-105 duration-500">
                                <QRCodeSVG value={upiString} size={200} level="H" />
                                <motion.div animate={{ top: [0, 200, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute left-0 w-full h-[3px] bg-primary shadow-[0_0_20px_5px_rgba(232,78,27,0.8)] z-20 pointer-events-none rounded-full" />
                             </div>

                             <div className="w-full space-y-4 mb-8">
                                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                                    <div className="text-left">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Merchant UPI ID</p>
                                        <p className="text-xs font-mono text-slate-200 mt-1">{upiID}</p>
                                    </div>
                                    <button onClick={() => copyToClipboard(upiID)} className="p-2 hover:bg-white/5 rounded-lg transition-all text-primary"><QrCode className="w-4 h-4" /></button>
                                </div>
                                
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-left">
                                    <p className="text-[8px] font-black text-primary uppercase tracking-widest">Transaction Note (Copy this)</p>
                                    <p className="text-sm font-black text-white mt-1 tracking-widest">{refCode}</p>
                                </div>
                                
                                {/* Mobile Deep Link Buttons */}
                                <div className="w-full sm:hidden space-y-3 mb-6">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">One-Click Pay with</p>
                                  <div className="grid grid-cols-3 gap-3">
                                    {[
                                      { name: "GPay", color: "bg-white", text: "text-blue-600", link: upiString },
                                      { name: "PhonePe", color: "bg-[#5f259f]", text: "text-white", link: upiString.replace('upi://', 'phonepe://') },
                                      { name: "Paytm", color: "bg-[#00baf2]", text: "text-white", link: upiString.replace('upi://', 'paytmmp://') },
                                    ].map((app) => (
                                      <a key={app.name} href={app.link} className="block">
                                         <button className={`w-full ${app.color} ${app.text} font-black py-3 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-90 transition-all text-[10px]`}>
                                            <Navigation className="w-3 h-3" />
                                            {app.name}
                                         </button>
                                      </a>
                                    ))}
                                  </div>
                                  <div className="h-px w-full bg-white/5 my-4" />
                                </div>
                             </div>

                             <button 
                               onClick={handlePaymentAndBooking} 
                               className="w-full bg-primary text-white font-black py-5 rounded-xl shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] relative overflow-hidden group"
                             >
                                <span className="relative z-10">Confirm Payment After Scanning</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                             </button>
                             
                             <p className="mt-6 text-[10px] text-slate-500 font-medium max-w-xs text-center">Reference: <span className="text-white font-mono">{refCode}</span> • Secured by LocalLink Anti-Fraud</p>
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
