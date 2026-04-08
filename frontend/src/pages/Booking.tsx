import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, MapPin, CreditCard } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Booking = () => {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md mx-auto text-center bg-card rounded-2xl shadow-card p-10"
            >
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-card-foreground">Booking Confirmed!</h2>
              <p className="mt-2 text-muted-foreground">Your service has been booked successfully. You'll receive a confirmation shortly.</p>
              <div className="mt-6 p-4 rounded-xl bg-muted/50 text-left space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 text-primary" /> April 15, 2026</p>
                <p className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4 text-primary" /> 10:00 AM</p>
                <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 text-primary" /> Koramangala, Bangalore</p>
              </div>
              <Link to="/dashboard">
                <Button className="mt-6 w-full">View My Bookings</Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-foreground">Confirm Booking</h1>
            <p className="mt-2 text-muted-foreground">Review your booking details below</p>

            <div className="mt-8 bg-card rounded-2xl shadow-card p-6 space-y-6">
              <div className="flex justify-between items-start p-4 rounded-xl bg-muted/50">
                <div>
                  <h3 className="font-display font-semibold text-card-foreground">Pipe Repair & Installation</h3>
                  <p className="text-sm text-muted-foreground">by Rajesh Kumar</p>
                </div>
                <span className="text-xl font-display font-bold text-primary">₹499</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground block mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground block mb-1">Time</label>
                  <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none">
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground block mb-1">Address</label>
                <input placeholder="Enter your full address" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground block mb-1">Notes (optional)</label>
                <textarea rows={3} placeholder="Any special instructions..." className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Service charge</span><span>₹499</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Platform fee</span><span>₹29</span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg text-card-foreground mt-3 pt-3 border-t border-border">
                  <span>Total</span><span className="text-primary">₹528</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={() => setConfirmed(true)}>
                <CreditCard className="w-4 h-4 mr-2" /> Confirm & Pay
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
