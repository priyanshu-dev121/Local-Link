import ReviewModal from "@/components/ReviewModal";
import { format } from "date-fns";

const Dashboard = () => {

  const navigate = useNavigate();
  const socket = useSocket();

  const [activeTab, setActiveTab] = useState("My Bookings");
  const [user, setUser] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const tabs = ["My Bookings", "Profile", "Notifications"];
  const [bookings, setBookings] = useState([]);
  const [clearedNotifs, setClearedNotifs] = useState([]);

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
    setUser(parsedUser);

    fetchBookings();

    if (socket && parsedUser) {
      socket.emit('join_room', parsedUser._id);
      
      socket.on('booking_updated', (data) => {
        setBookings(prev => prev.map(b => 
          b._id === data.bookingId ? { ...b, status: data.status } : b
        ));
        toast.info(`Booking status updated to ${data.status}!`, {
            icon: <Bell className="w-4 h-4" />
        });
      });
    }

    return () => {
      if (socket) socket.off('booking_updated');
    };
  }, [navigate, socket]);

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
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-blob -z-0 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-blob animation-delay-2000 -z-0 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 100 }}>
              <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-3xl border border-white/10 p-10 relative overflow-hidden group">
                <div className="text-center mb-10 relative z-10">
                  <div className="relative mx-auto w-32 h-32 mb-6">
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
                </div>
                <nav className="space-y-3 relative z-10">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-500 font-bold flex items-center gap-4 text-sm tracking-tight ${
                        activeTab === tab ? "bg-primary text-white" : "text-slate-400"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  <button onClick={handleLogout} className="w-full text-left px-6 py-4 rounded-2xl text-red-400 flex items-center gap-4 font-bold">Sign Out</button>
                </nav>
              </div>
            </motion.div>

            <motion.div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                 {/* Stats cards... */}
                 <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <p className="text-4xl font-black text-white">{bookings.length}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-2">Bookings</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <p className="text-4xl font-black text-white">₹{totalSpentRupees}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-2">Spent</p>
                 </div>
              </div>

              <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 min-h-[600px]">
                <h2 className="text-3xl font-black mb-10 text-white tracking-tighter">{activeTab}</h2>
                {activeTab === "My Bookings" && (
                   <div className="space-y-6">
                      {bookings.map((b) => (
                        <div key={b._id} className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 flex justify-between items-center group">
                           <div className="flex gap-6 items-center">
                              <img src={b.service?.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6958"} className="w-20 h-20 rounded-2xl object-cover" />
                              <div>
                                 <h3 className="font-bold text-xl text-white">{b.service?.title}</h3>
                                 <p className="text-xs text-primary font-bold uppercase">{format(new Date(b.date), "PPP")}</p>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-3">
                              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-white/5 text-slate-400 border border-white/10">{b.status}</span>
                              {b.status === "completed" && !b.review && (
                                <Button size="sm" onClick={() => setSelectedBookingForReview(b)} className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white">Rate & Review</Button>
                              )}
                              {b.review && (
                                <div className="flex gap-1">
                                  {[...Array(b.review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ReviewModal 
        isOpen={!!selectedBookingForReview} 
        onClose={() => setSelectedBookingForReview(null)}
        booking={selectedBookingForReview || {}}
        onSuccess={fetchBookings}
      />
    </Layout>
  );
};

export default Dashboard;
