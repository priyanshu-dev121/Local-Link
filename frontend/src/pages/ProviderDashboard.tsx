import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Users, Star, TrendingUp, CheckCircle, Clock, Calendar, MapPin, Plus, Trash2, X, LayoutGrid, Package, Settings, Briefcase, FileText } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from "@/api/api";
import { toast } from "sonner";
import { format } from "date-fns";

const CATEGORIES = ["electrician", "plumber", "delivery", "cleaning", "home tutor", "painter"];

const ProviderDashboard = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [myServices, setMyServices] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'profile'>('bookings');

  // New Service State
  const [newService, setNewService] = useState({
    title: "",
    category: "cleaning",
    price: "",
    description: "",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800"
  });

  // Profile State
  const [profileData, setProfileData] = useState({
    businessName: "",
    experience: "",
    bio: ""
  });

  const fetchData = async () => {
    try {
      const [bookingsRes, servicesRes, userRes] = await Promise.all([
        API.get("/bookings"),
        API.get("/services/my-services"),
        API.get("/user/me") // Assuming there's a route for this
      ]);
      setBookings(bookingsRes.data);
      setMyServices(servicesRes.data);
      if (userRes.data) {
        setProfileData({
          businessName: userRes.data.businessName || "",
          experience: userRes.data.experience || "",
          bio: userRes.data.bio || ""
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
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
    fetchData();
  }, [navigate]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Error updating booking status");
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/services", {
        ...newService,
        price: Number(newService.price)
      });
      toast.success("Service posted successfully!");
      setShowAddModal(false);
      setNewService({ title: "", category: "cleaning", price: "", description: "", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800" });
      fetchData();
    } catch (error) {
      toast.error("Error posting service");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await API.delete(`/services/${id}`);
      toast.success("Service deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting service");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put("/user/update-profile", { // Assuming this route exists
        ...profileData,
        experience: Number(profileData.experience)
      });
      toast.success("Profile updated successfully!");
      fetchData();
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  if (!user) return <div className="p-10 bg-slate-950 min-h-screen text-white">Loading LocalLink Dashboard...</div>;

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const acceptedBookings = bookings.filter(b => b.status === "completed" || b.status === "accepted");
  const totalEarnings = acceptedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);

  return (
  <Layout>
    <section className="py-20 relative min-h-screen bg-slate-950 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob -z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000 -z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter">Provider <span className="text-primary italic">Command</span></h1>
              <p className="mt-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Business Profile • {user.name}</p>
            </div>
            <div className="flex gap-4">
               {(['bookings', 'services', 'profile'] as const).map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 text-slate-500 border border-white/5'
                  }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Revenue", value: `₹${totalEarnings}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Appointments", value: bookings.length.toString(), icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
              { label: "Active Services", value: myServices.length.toString(), icon: Package, color: "text-accent", bg: "bg-accent/10" },
              { label: "Business Score", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-3xl rounded-3xl p-6 border border-white/10 group hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-white tracking-tighter tabular-nums">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-12">
            {activeTab === 'bookings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" /> New Requests
                  </h2>
                  {pendingBookings.length === 0 ? (
                    <div className="p-16 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Scanning for new jobs...</p>
                    </div>
                  ) : (
                    pendingBookings.map(b => (
                       <div key={b._id} className="bg-white/5 backdrop-blur-3xl rounded-3xl p-8 border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-8">
                         <div className="flex gap-6 items-center w-full">
                           <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-2xl text-primary border border-primary/20">
                             {b.user?.name.charAt(0)}
                           </div>
                           <div>
                             <h3 className="font-black text-xl text-white tracking-tight">{b.service?.title}</h3>
                             <p className="text-sm font-bold text-slate-400 mt-1">Client: {b.user?.name}</p>
                           </div>
                         </div>
                         <div className="flex gap-2 w-full sm:w-auto">
                            <Button onClick={() => handleStatusUpdate(b._id, 'accepted')} className="bg-primary hover:bg-primary/90 text-xs px-8 h-12 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">Accept</Button>
                            <Button onClick={() => handleStatusUpdate(b._id, 'rejected')} variant="ghost" className="text-slate-500 hover:text-white rounded-xl uppercase text-[10px] font-black tracking-widest">Pass</Button>
                         </div>
                       </div>
                    ))
                  )}
                </div>

                <div className="space-y-8">
                  <h2 className="text-2xl font-black text-white tracking-tight px-4">Job History</h2>
                  <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5 overflow-hidden">
                    {acceptedBookings.length === 0 ? (
                      <p className="p-10 text-center text-slate-600 font-bold text-xs uppercase tracking-widest">No history available</p>
                    ) : (
                      acceptedBookings.map(b => (
                        <div key={b._id} className="p-6 border-b border-white/5 last:border-0 flex justify-between items-center group">
                          <div>
                            <p className="font-black text-white group-hover:text-primary transition-colors">{b.service?.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{b.user?.name} • {format(new Date(b.date), "MMM dd")}</p>
                          </div>
                          <p className="font-black text-white tracking-tighter">₹{b.service?.price}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white tracking-tight">Active Listings</h2>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all"
                  >
                    <Plus className="w-5 h-5" /> Post Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {myServices.map(service => (
                    <motion.div 
                      key={service._id} 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 group relative"
                    >
                      <img src={service.image} className="w-full h-48 object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                           <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full">{service.category}</span>
                           <button onClick={() => handleDeleteService(service._id)} className="text-slate-600 hover:text-red-500 transition-colors">
                             <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                        <h3 className="font-black text-xl text-white tracking-tight">{service.title}</h3>
                        <p className="text-slate-400 text-sm mt-2 line-clamp-2 font-medium">{service.description}</p>
                        <p className="font-black text-2xl text-white mt-6 tracking-tighter">₹{service.price}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {myServices.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                      <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No services found. Post your first listing!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-black text-white tracking-tight mb-8">Business Profile Settings</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-3xl">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 flex items-center gap-2">
                         <Briefcase className="w-3 h-3" /> Shop / Business Name
                       </label>
                       <Input 
                        value={profileData.businessName} 
                        onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                        placeholder="e.g. Kumar's Premium Plumbing" 
                        className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-primary transition-all text-white font-bold"
                       />
                     </div>
                     <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 flex items-center gap-2">
                         <Star className="w-3 h-3" /> Years of Experience
                       </label>
                       <Input 
                        type="number"
                        value={profileData.experience} 
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        placeholder="e.g. 5" 
                        className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-primary transition-all text-white font-bold"
                       />
                     </div>
                   </div>
                   
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 flex items-center gap-2">
                       <FileText className="w-3 h-3" /> Professional Bio
                     </label>
                     <textarea 
                      value={profileData.bio} 
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Tell customers why you're the best for the job..." 
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white text-sm font-medium resize-none focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-slate-600"
                     />
                   </div>

                   <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-95">
                     Save Profile Details
                   </Button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal - Add Service */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-xl p-10 relative z-10 shadow-3xl text-white"
            >
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-3xl font-black text-white tracking-tighter">Post <span className="text-primary italic">Service</span></h2>
                 <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                   <X className="w-6 h-6 text-white" />
                 </button>
              </div>
              
              <form onSubmit={handleAddService} className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Service Title</label>
                   <Input 
                    value={newService.title} 
                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                    placeholder="e.g. Premium Home Deep Cleaning" 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-primary transition-all" 
                    required 
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Category</label>
                       <select 
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:ring-2 ring-primary focus:outline-none"
                       >
                         {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900 capitalize font-bold">{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Price (₹)</label>
                       <Input 
                        type="number"
                        value={newService.price} 
                        onChange={(e) => setNewService({...newService, price: e.target.value})}
                        placeholder="0.00" 
                        className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-primary transition-all" 
                        required 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Description</label>
                   <textarea 
                    value={newService.description} 
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    placeholder="Tell your clients what's included..." 
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-medium resize-none focus:ring-2 ring-primary focus:outline-none transition-all placeholder:text-slate-600" 
                    required 
                   />
                 </div>

                 <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-95">
                   Publish Listing
                 </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  </Layout>
  );
};

export default ProviderDashboard;
