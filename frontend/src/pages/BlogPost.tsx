import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, ArrowLeft, User } from "lucide-react";
import { Button } from '@/components/ui/button';

const blogDatabase = {
  "1": { 
    title: "10 Reasons Why Local Services Are The Future", 
    date: "April 9, 2026", 
    author: "Rajan Bhatt",
    content: "The landscape of local services is radically changing. No longer are people willing to trust nameless multinational corporations to send anonymous contractors to their homes. \n\n1. Community Trust\nThere's an incredible power in hiring the plumber who lives just down the street. Community accountability ensures higher quality work. \n\n2. Faster Response Times\nWhen pipes burst, you need someone now. Hyper-localized marketplaces like LocalLink mean help arrives in minutes, not days. \n\n3. Fair Wages\nWithout massive corporate overhead, providers keep more of their earnings, and customers pay less. It’s a win-win." 
  },
  "2": { 
    title: "How to Safely Hire a Plumber during Emergencies", 
    date: "April 2, 2026", 
    author: "LocalLink Support",
    content: "When a pipe bursts at 2 AM, panic usually sets in. But taking 60 seconds to hire the right person can save you thousands in future repairs.\n\nFirst, always look for the 'Verified' badge on LocalLink. This guarantees their background check is active. Second, don't be afraid to ask for emergency dispatch rates upfront before they arrive. Honest plumbers will always provide transparent call-out fees."
  },
  "3": { 
    title: "The Ultimate Guide to Deep Cleaning Your Home", 
    date: "March 20, 2026", 
    author: "Elena Rodriguez",
    content: "Spring cleaning isn't just about sweeping. It's about rejuvenating your sanctuary. Start top-down: dust ceilings first, so the debris falls to the floor to be vacuumed last.\n\nUse microfiber cloths instead of paper towels. Not only is it better for the environment, but it captures dust much more effectively without leaving streaks."
  },
  "4": { 
    title: "Understanding LocalLink's verified Tag", 
    date: "March 15, 2026", 
    author: "Trust & Safety Team",
    content: "The blue \"Verified\" checkmark next to a provider's name is the most important badge on LocalLink.\n\nTo earn it, providers must pass a 4-step background check, verify their government ID, and maintain a minimum of 4.5 stars over 10 consecutive jobs. If you see this badge, you can book with total peace of mind."
  }
};

export default function BlogPost() {
  const { id } = useParams();
  const post = blogDatabase[id as keyof typeof blogDatabase];

  if (!post) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Post not found.</h1>
                <Link to="/blog"><Button>Back to Blog</Button></Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8 hover:bg-muted text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 text-sm text-primary font-semibold mb-6 border-b border-border pb-6">
               <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
               <span className="text-border">|</span>
               <span className="flex items-center gap-1.5 text-muted-foreground"><User className="w-4 h-4" /> {post.author}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 font-display text-foreground leading-tight">
              {post.title}
            </h1>
            
            <div className="mt-8 text-lg text-foreground/80 leading-relaxed font-body">
              {post.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="mb-6">{paragraph}</p> : <div key={idx} className="h-4" />
              ))}
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
