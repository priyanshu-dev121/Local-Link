import { motion } from "framer-motion";
import { DollarSign, Users, Star, TrendingUp, CheckCircle, Clock, Calendar } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const pendingBookings = [
  { id: 1, customer: "Ananya R.", service: "Pipe Repair", date: "Apr 15, 2026", time: "10:00 AM", location: "Koramangala" },
  { id: 2, customer: "Vikram S.", service: "Pipe Installation", date: "Apr 16, 2026", time: "2:00 PM", location: "HSR Layout" },
];

const ProviderDashboard = () => (
  <Layout>
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground">Provider Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back, Rajesh Kumar</p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Earnings", value: "₹24,500", icon: DollarSign, color: "text-success" },
              { label: "Total Bookings", value: "45", icon: Calendar, color: "text-primary" },
              { label: "Avg Rating", value: "4.8", icon: Star, color: "text-warning" },
              { label: "Active Customers", value: "32", icon: Users, color: "text-accent" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl shadow-card p-5">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <p className="mt-3 text-2xl font-display font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pending Bookings */}
          <h2 className="text-xl font-display font-bold text-foreground mt-10 mb-4">Pending Requests</h2>
          <div className="space-y-3">
            {pendingBookings.map((b) => (
              <div key={b.id} className="bg-card rounded-xl shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-card-foreground">{b.service}</h3>
                  <p className="text-sm text-muted-foreground">Customer: {b.customer}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.time}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Accept</Button>
                  <Button size="sm" variant="outline">Decline</Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default ProviderDashboard;
