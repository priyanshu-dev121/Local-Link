import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, LogOut, CheckCircle, DollarSign, Bell, Settings, FileText, X, CheckCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import API from "@/api/api";
import { toast } from "sonner";
import { format } from "date-fns";

const Dashboard = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("My Bookings");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  const tabs = ["My Bookings", "Profile", "Notifications"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  const [clearedNotifs, setClearedNotifs] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings");
        setBookings(res.data);
      } catch (error) {
        toast.error("Error fetching bookings");
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  if (!user) {
    return <p className="p-10">Loading dashboard...</p>;
  }

  const totalSpentRupees = bookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);
  const totalSpentDollars = (totalSpentRupees / 83.5).toFixed(2);

  return (
    <Layout>
      <section className="py-20 relative min-h-screen bg-slate-950 overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-blob -z-0 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-blob animation-delay-2000 -z-0 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 100 }}>
              <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-3xl border border-white/10 p-10 relative overflow-hidden group">
                {/* Spotlight effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/30 to-transparent rounded-full blur-3xl group-hover:bg-primary/40 transition-all opacity-50" />

                <div className="text-center mb-10 relative z-10">
                  <div className="relative mx-auto w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full animate-pulse blur-md opacity-40" />
                    <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center p-1.5 relative z-10 border-4 border-white/10 shadow-3xl">
                       {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                       ) : (
                          <span className="text-5xl font-display font-black text-white tracking-widest">{user.name.charAt(0).toUpperCase()}</span>
                       )}
                    </div>
                  </div>

                  <h3 className="font-display font-black text-3xl text-white tracking-tighter">{user.name}</h3>
                  <p className="text-sm font-bold text-primary mt-2 uppercase tracking-widest">{user.email}</p>
                  <span className="inline-block mt-4 px-4 py-1.5 bg-white/10 rounded-full text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black border border-white/5">Member</span>
                </div>

                <nav className="space-y-3 relative z-10">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-500 font-bold flex items-center gap-4 text-sm tracking-tight ${
                        activeTab === tab
                          ? "bg-primary text-white shadow-2xl shadow-primary/40 scale-105"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {tab === "My Bookings" && <FileText className="w-5 h-5" />}
                      {tab === "Profile" && <Settings className="w-5 h-5" />}
                      {tab === "Notifications" && <Bell className="w-5 h-5" />}
                      {tab}
                    </button>
                  ))}

                  <div className="pt-6 mt-8 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 flex items-center gap-4 font-bold transition-all text-sm group"
                    >
                      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring" }} className="lg:col-span-3">
              
              {/* Stats row - Always visible */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-3xl p-8 flex items-center gap-6 border border-white/10 group hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/10">
                     <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white tabular-nums tracking-tighter">{bookings.length}</p>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Total Bookings</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-3xl p-8 flex items-center gap-6 border border-white/10 group hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-emerald-500/10">
                     <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white tabular-nums tracking-tighter">
                      {bookings.filter(b => b.status === "completed" || b.status === "accepted").length}
                    </p>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Completed</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-3xl p-8 flex items-center gap-6 border border-white/10 group hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-orange-500/10">
                     <DollarSign className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white tabular-nums tracking-tighter">₹{totalSpentRupees}</p>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Spent / ${totalSpentDollars}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl border border-white/10 p-6 sm:p-10 min-h-[600px] relative overflow-hidden">
                <h2 className="text-2xl sm:text-3xl font-black mb-10 text-white tracking-tighter">{activeTab}</h2>
                {activeTab === "My Bookings" && (
                  <div className="space-y-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-500 shadow-inner">
                           <FileText className="w-10 h-10" />
                        </div>
                        <p className="text-slate-400 font-bold">No bookings found in your history.</p>
                      </div>
                    ) : (
                      bookings.map((b, i) => (
                        <motion.div 
                          key={b._id} 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-slate-900/50 backdrop-blur-md rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-primary/10 transition-all border border-white/5 hover:border-primary/30"
                        >
                          <div className="flex gap-6 items-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0">
                               <img src={b.service?.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=200"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Service" />
                            </div>
                            <div>
                              <h3 className="font-black text-xl text-white group-hover:text-primary transition-colors tracking-tight">{b.service?.title}</h3>
                              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-1">{b.service?.category}</p>
 
                              <div className="flex flex-wrap gap-4 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                  <Calendar className="w-3.5 h-3.5 text-primary" /> {format(new Date(b.date), "MMM dd, yyyy")}
                                </span>
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                  <Clock className="w-3.5 h-3.5 text-primary" /> {format(new Date(b.date), "hh:mm a")}
                                </span>
                              </div>
                            </div>
                          </div>
 
                          <div className="flex items-center justify-between md:flex-col md:items-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                            <span className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-black shadow-2xl ${
                              b.status === "pending"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : b.status === "rejected" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            }`}>
                              {b.status}
                            </span>
                            <span className="font-black text-2xl text-white tracking-tighter">₹{b.service?.price}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
 
                {activeTab === "Profile" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl space-y-8">
                    <p className="text-slate-400 font-medium leading-relaxed">Adjust your identity and secure your LocalLink experience.</p>
                    
                    <div className="space-y-3">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Full Name</label>
                       <input disabled value={user.name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white font-bold" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Email Address</label>
                       <input disabled value={user.email} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white font-bold" />
                    </div>
                    <div className="pt-6">
                       <button className="bg-primary text-white font-black px-10 py-4 rounded-2xl shadow-3xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-widest">
                          Update Profile
                       </button>
                    </div>
                  </motion.div>
                )}
 
                {activeTab === "Notifications" && (
                  <div className="space-y-6">
                    {bookings.filter(b => !clearedNotifs.includes(b._id)).length > 0 && (
                      <div className="flex justify-end mb-6">
                        <button 
                          onClick={() => setClearedNotifs([...clearedNotifs, ...bookings.map(b => b._id)])}
                          className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white transition-all uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-2xl border border-white/10"
                        >
                          <CheckCheck className="w-4 h-4" /> Clear All Notifs
                        </button>
                      </div>
                    )}
                    {bookings.filter(b => !clearedNotifs.includes(b._id)).length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mb-8 shadow-inner border border-white/5">
                           <Bell className="w-12 h-12 text-slate-600 opacity-30" />
                        </div>
                        <h3 className="font-black text-2xl text-white mb-2 tracking-tighter">Quietly productve...</h3>
                        <p className="text-slate-400 max-w-sm font-medium">You've cleared all alerts. We'll ping you as soon as something important happens.</p>
                      </motion.div>
                    ) : (
                      <AnimatePresence>
                        {bookings.filter(b => !clearedNotifs.includes(b._id)).map((b, i) => (
                          <motion.div 
                            key={b._id} 
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: -30, height: 0, marginTop: 0, marginBottom: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative flex gap-6 p-6 rounded-[2rem] bg-slate-900/50 border border-white/5 shadow-2xl hover:border-primary/30 transition-all group overflow-hidden"
                          >
                            <button 
                              onClick={() => setClearedNotifs([...clearedNotifs, b._id])}
                              className="absolute top-6 right-6 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 p-2 rounded-full"
                            >
                               <X className="w-4 h-4" />
                            </button>
                            <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center border ${
                              b.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              b.status === "rejected" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                              b.status === "accepted" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}>
                              <Bell className="w-6 h-6" />
                            </div>
                            <div className="pr-12">
                              <h4 className="font-black text-lg text-white tracking-tight">
                                Update on: <span className="text-primary">{b.service?.title}</span>
                              </h4>
                              <p className="text-sm text-slate-400 mt-2 leading-relaxed font-medium">
                                {b.status === "pending" && "Your booking request has been sent and is awaiting provider confirmation."}
                                {b.status === "accepted" && "Great news! Your booking has been accepted by the provider."}
                                {b.status === "completed" && "Your service has been successfully completed. Thank you!"}
                                {b.status === "rejected" && "Unfortunately, your booking request was declined."}
                              </p>
                              <p className="text-[10px] font-black text-slate-500 mt-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> {format(new Date(b.date), "MMM dd, yyyy 'at' hh:mm a")}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;