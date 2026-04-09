import React from 'react';
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Newspaper, ExternalLink } from 'lucide-react';

export default function Press() {
  const articles = [
    { source: "TechCrunch", title: "LocalLink raises Series A to accelerate verified neighborhood services", date: "Jan 12, 2026" },
    { source: "Forbes", title: "Why community marketplaces are the next unicorn breed", date: "Dec 05, 2025" },
    { source: "The Verge", title: "Testing the Sexy Dark UI that is taking over Indian markets", date: "Nov 20, 2025" },
    { source: "Economic Times", title: "How independent plumbers are earning 40% more natively", date: "Oct 11, 2025" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-8 animate-pulse-glow"><Newspaper className="w-10 h-10" /></div>
             <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-foreground">LocalLink in the <span className="text-primary">Press</span></h1>
             <p className="text-muted-foreground text-lg">See what the world is saying about our rapidly growing marketplace.</p>
          </motion.div>

          <div className="space-y-6">
             {articles.map((art, i) => (
                <motion.a 
                  href="#" 
                  key={i}
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  className="group block p-6 sm:p-8 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all"
                >
                   <div className="flex justify-between items-start gap-4">
                      <div>
                         <span className="text-sm font-bold text-accent tracking-widest uppercase mb-2 block">{art.source}</span>
                         <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors font-display mb-2">{art.title}</h3>
                         <span className="text-sm text-muted-foreground">{art.date}</span>
                      </div>
                      <ExternalLink className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-2" />
                   </div>
                </motion.a>
             ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
