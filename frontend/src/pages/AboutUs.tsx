import React from 'react';
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Target, Heart } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display text-foreground">Changing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Neighbourhood</span></h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">LocalLink was born out of a simple idea: in an age of global separation, true community value comes from connecting neighbors with the verified local experts right next door.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card p-8 rounded-3xl border border-border shadow-sm text-center hover:-translate-y-2 hover:border-primary/50 transition-all hover:shadow-xl">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary"><Users className="w-8 h-8" /></div>
               <h3 className="text-xl font-bold mb-3 text-foreground font-display">Who We Are</h3>
               <p className="text-muted-foreground">A dedicated team of community-builders aiming to support local economies instead of faceless global monopolies.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card p-8 rounded-3xl border border-border shadow-sm text-center hover:-translate-y-2 hover:border-primary/50 transition-all hover:shadow-xl">
               <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent"><Target className="w-8 h-8" /></div>
               <h3 className="text-xl font-bold mb-3 text-foreground font-display">Our Mission</h3>
               <p className="text-muted-foreground">To empower local micro-entrepreneurs by giving them a premium, frictionless platform to thrive and scale.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card p-8 rounded-3xl border border-border shadow-sm text-center hover:-translate-y-2 hover:border-primary/50 transition-all hover:shadow-xl">
               <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500"><Heart className="w-8 h-8" /></div>
               <h3 className="text-xl font-bold mb-3 text-foreground font-display">Our Values</h3>
               <p className="text-muted-foreground">Total transparency, rigorous safety standards, and keeping local money circulating inside local communities.</p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
