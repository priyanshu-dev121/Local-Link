import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, Send } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import API from '@/api/api';

const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 5) {
      toast.error('Please write a slightly longer review (min 5 chars)');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.put(`/bookings/${booking._id}/review`, {
        rating,
        text: comment
      });
      toast.success('Thank you for your review!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-3xl relative z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Rate the Job</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">How was your experience with {booking.service?.title}?</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Your Feedback
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others what you think..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-medium"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-16 rounded-2xl bg-primary text-white font-black hover:scale-[1.02] active:scale-95 transition-all text-lg shadow-2xl shadow-primary/30"
              >
                {isSubmitting ? 'Submitting...' : 'Post Review'}
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
