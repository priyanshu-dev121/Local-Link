import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, LogOut, CheckCircle, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("My Bookings");
  const [user, setUser] = useState<any>(null);

  const tabs = ["My Bookings", "Profile", "Notifications"];

  const bookings = [
    { id: 1, service: "Pipe Repair", provider: "Rajesh Kumar", date: "Apr 15, 2026", time: "10:00 AM", status: "upcoming", price: 499 },
    { id: 2, service: "Home Wiring", provider: "Suresh Electricals", date: "Apr 10, 2026", time: "2:00 PM", status: "completed", price: 699 },
    { id: 3, service: "Deep Cleaning", provider: "CleanPro", date: "Apr 5, 2026", time: "9:00 AM", status: "completed", price: 1299 },
  ];

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  if (!user) {
    return <p className="p-10">Loading dashboard...</p>;
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-card rounded-2xl shadow-card p-6">

                <div className="text-center mb-6">

                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-primary" />
                  </div>

                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>

                </div>

                <nav className="space-y-1">

                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-2 rounded-xl ${
                        activeTab === tab
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-xl text-red-500 hover:bg-red-100 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>

                </nav>

              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                <div className="bg-card rounded-xl shadow p-5 flex items-center gap-4">
                  <Calendar />
                  <div>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </div>
                </div>

                <div className="bg-card rounded-xl shadow p-5 flex items-center gap-4">
                  <CheckCircle />
                  <div>
                    <p className="text-2xl font-bold">
                      {bookings.filter(b => b.status === "completed").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>

                <div className="bg-card rounded-xl shadow p-5 flex items-center gap-4">
                  <DollarSign />
                  <div>
                    <p className="text-2xl font-bold">
                      ₹{bookings.reduce((sum, b) => sum + b.price, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>

              </div>

              <h2 className="text-xl font-bold mb-4">{activeTab}</h2>

              {/* Bookings */}
              <div className="space-y-3">

                {bookings.map((b) => (
                  <div key={b.id} className="bg-card rounded-xl shadow p-5 flex justify-between">

                    <div>
                      <h3 className="font-semibold">{b.service}</h3>
                      <p className="text-sm text-muted-foreground">by {b.provider}</p>

                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {b.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {b.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        b.status === "upcoming"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {b.status}
                      </span>

                      <span className="font-bold">₹{b.price}</span>
                    </div>

                  </div>
                ))}

              </div>

            </motion.div>

          </div>

        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;