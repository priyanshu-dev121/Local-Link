import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Star, User, Settings, Bell, LogOut, ChevronRight, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const bookings = [
  { id: 1, service: "Pipe Repair", provider: "Rajesh Kumar", date: "Apr 15, 2026", time: "10:00 AM", status: "upcoming", price: 499 },
  { id: 2, service: "Home Wiring", provider: "Suresh Electricals", date: "Apr 10, 2026", time: "2:00 PM", status: "completed", price: 699 },
  { id: 3, service: "Deep Cleaning", provider: "CleanPro", date: "Apr 5, 2026", time: "9:00 AM", status: "completed", price: 1299 },
];

const tabs = ["My Bookings", "Profile", "Notifications"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("My Bookings");

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
                  <h3 className="font-display font-bold text-card-foreground">Ananya Rao</h3>
                  <p className="text-sm text-muted-foreground">ananya@email.com</p>
                </div>
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  <Link to="/">
                    <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </Link>
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Bookings", value: "12", icon: Calendar, color: "text-primary" },
                  { label: "Completed", value: "9", icon: CheckCircle, color: "text-success" },
                  { label: "Total Spent", value: "₹8,450", icon: DollarSign, color: "text-warning" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl shadow-card p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-card-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-display font-bold text-foreground mb-4">{activeTab}</h2>

              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-card rounded-xl shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{b.service}</h3>
                      <p className="text-sm text-muted-foreground">by {b.provider}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === "upcoming" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                      }`}>
                        {b.status === "upcoming" ? "Upcoming" : "Completed"}
                      </span>
                      <span className="font-display font-bold text-card-foreground">₹{b.price}</span>
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
