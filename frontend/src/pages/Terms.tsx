import React from 'react';
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Book, FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Rulebook & <span className="text-primary">Conditions</span></h1>
            <p className="text-muted-foreground text-lg">Everything you need to know about playing by the rules on LocalLink.</p>
          </motion.div>

          <div className="space-y-8">
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3 font-display"><Book className="w-6 h-6 text-primary" /> Community Rulebook</h2>
              <ul className="space-y-4 text-muted-foreground list-disc list-inside">
                <li><strong className="text-foreground">Respect the Community:</strong> Treat all providers and customers with dignity. Zero tolerance for harassment.</li>
                <li><strong className="text-foreground">Transparent Pricing:</strong> Providers must list clear prices. Hidden fees are strictly prohibited.</li>
                <li><strong className="text-foreground">Punctuality Limit:</strong> Being late by more than 30 minutes without notice may result in account penalties.</li>
              </ul>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3 font-display"><FileText className="w-6 h-6 text-primary" /> Terms & Conditions</h2>
              <p className="text-muted-foreground mb-4">By booking a service on LocalLink, you agree to the following legally binding constraints:</p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>LocalLink acts exclusively as an intermediary matchmaking platform.</li>
                <li>Payments processed via our gateway are held securely until service completion.</li>
                <li>Disputes must be raised within 48 hours of service delivery to be eligible for review.</li>
              </ul>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3 font-display"><Shield className="w-6 h-6 text-primary" /> Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data is exclusively yours. We securely encrypt all location data and only share your address with a verified provider once a booking is officially confirmed. We never sell your personal footprint, email, or usage patterns to external parties. 
              </p>
            </motion.section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
