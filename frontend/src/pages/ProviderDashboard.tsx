import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, Users, Star, TrendingUp, CheckCircle, Clock, Calendar, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import API from "@/api/api";
import { toast } from "sonner";
import { format } from "date-fns";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (error) {
      toast.error("Error fetching bookings");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'provider') {
      navigate("/dashboard");
      return;
    }
    setUser(parsedUser);
    fetchBookings();
  }, [navigate]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error("Error updating booking status");
    }
  };

  if (!user) return <div className="p-10">Loading dashboard...</div>;

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const acceptedBookings = bookings.filter(b => b.status === "completed" || b.status === "accepted");
  const totalEarnings = acceptedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);

  return (
  <Layout>
    <section className="py-20 relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Animated Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob -z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000 -z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter">Expert <span className="text-primary italic">Dashboard</span></h1>
            <p className="mt-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Command Center • Welcome back, {user.name}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { label: "Total Earnings", value: `₹${totalEarnings}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Service Requests", value: bookings.length.toString(), icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
              { label: "Expert Rating", value: "4.8", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Successful Jobs", value: acceptedBookings.length.toString(), icon: CheckCircle, color: "text-accent", bg: "bg-accent/10" },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl p-6 sm:p-8 border border-white/10 group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500 opacity-50" />
                </div>
                <p className="text-4xl font-black text-white tabular-nums tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 group-hover:text-primary transition-colors">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Pending Requests Column */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <h2 className="text-2xl font-black text-white tracking-tight">New Requests</h2>
              </div>
              
              {pendingBookings.length === 0 ? (
                <div className="p-12 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                   <Clock className="w-12 h-12 text-slate-600 opacity-20 mx-auto mb-4" />
                   <p className="text-slate-500 font-bold">Waiting for new customers...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((b) => (
                    <motion.div 
                      key={b._id} 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 backdrop-blur-3xl rounded-[2rem] p-6 lg:p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 group"
                    >
                      <div className="flex gap-6 items-center w-full">
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-2xl text-primary border border-white/5 group-hover:border-primary/50 transition-colors">
                           {b.user?.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-white tracking-tight">{b.service?.title}</h3>
                          <p className="text-sm font-bold text-slate-400 mt-1">Client: {b.user?.name}</p>
                          <div className="flex gap-4 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                              <Calendar className="w-3.5 h-3.5" /> {format(new Date(b.date), "MMM dd")}
                            </span>
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                              <MapPin className="w-3.5 h-3.5" /> {b.address?.split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleStatusUpdate(b._id, 'accepted')}
                          className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(b._id, 'rejected')}
                          className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white/5 text-slate-400 border border-white/10 font-black text-xs uppercase tracking-widest hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity Column */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-white tracking-tight px-4">Job History</h2>
              
              {acceptedBookings.length === 0 ? (
                <div className="p-12 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                   <p className="text-slate-500 font-bold">No completed jobs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedBookings.map((b) => (
                    <div key={b._id} className="bg-slate-900/50 backdrop-blur-md rounded-[2rem] p-6 lg:p-8 flex justify-between items-center border border-white/5 hover:border-emerald-500/30 transition-all group">
                      <div>
                        <h3 className="font-black text-white tracking-tight group-hover:text-emerald-500 transition-colors">{b.service?.title}</h3>
                        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                           Client: {b.user?.name} • {format(new Date(b.date), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3 text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest border ${
                          b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {b.status}
                        </span>
                        <span className="font-black text-xl text-white tracking-tighter">₹{b.service?.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
  );
};

export default ProviderDashboard;
