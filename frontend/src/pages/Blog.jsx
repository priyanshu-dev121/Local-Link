import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, ArrowRight } from "lucide-react";

export default function Blog() {
  const navigate = useNavigate();
  
  const posts = [
    { id: 1, title: "10 Reasons Why Local Services Are The Future", date: "April 9, 2026", excerpt: "Discover why community-driven service markets are overtaking global gig platforms." },
    { id: 2, title: "How to Safely Hire a Plumber during Emergencies", date: "April 2, 2026", excerpt: "Step by step rulebook for vetting plumbers fast when pipes burst." },
    { id: 3, title: "The Ultimate Guide to Deep Cleaning Your Home", date: "March 20, 2026", excerpt: "Top tips from our highly rated 5-star cleaners to keep your environment pristine." },
    { id: 4, title: "Understanding LocalLink's verified Tag", date: "March 15, 2026", excerpt: "What it takes for a provider to earn the verified badge and why it matters." }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">LocalLink <span className="text-primary">Blog</span></h1>
            <p className="text-muted-foreground text-lg">Insights, tips, and community rules for the neighbourhood marketplace.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <motion.article 
                key={post.id} 
                onClick={() => navigate(`/blog/${post.id}`)}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }} 
                className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-[0_10px_40px_rgba(232,78,27,0.1)] hover:border-primary/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-3">
                  <Calendar className="w-4 h-4" /> {post.date}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors font-display">{post.title}</h2>
                <p className="text-muted-foreground mb-6 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
