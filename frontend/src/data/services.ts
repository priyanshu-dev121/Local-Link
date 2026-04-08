import { ServiceData } from "@/components/ServiceCard";

export const categories = [
  { name: "Plumbing", icon: "🔧", color: "bg-blue-100 text-blue-700" },
  { name: "Electrical", icon: "⚡", color: "bg-yellow-100 text-yellow-700" },
  { name: "Tutoring", icon: "📚", color: "bg-green-100 text-green-700" },
  { name: "Cleaning", icon: "🧹", color: "bg-purple-100 text-purple-700" },
  { name: "Mechanics", icon: "🔩", color: "bg-red-100 text-red-700" },
  { name: "Delivery", icon: "📦", color: "bg-orange-100 text-orange-700" },
  { name: "Painting", icon: "🎨", color: "bg-pink-100 text-pink-700" },
  { name: "Gardening", icon: "🌱", color: "bg-emerald-100 text-emerald-700" },
];

export const services: ServiceData[] = [
  { id: "1", name: "Pipe Repair & Installation", provider: "Rajesh Kumar", category: "Plumbing", price: 499, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop", location: "Koramangala", duration: "1-2 hrs" },
  { id: "2", name: "Home Wiring & Repair", provider: "Suresh Electricals", category: "Electrical", price: 699, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", location: "HSR Layout", duration: "2-3 hrs" },
  { id: "3", name: "Math & Science Tutor", provider: "Priya Sharma", category: "Tutoring", price: 399, rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop", location: "Indiranagar", duration: "1 hr" },
  { id: "4", name: "Deep Home Cleaning", provider: "CleanPro Services", category: "Cleaning", price: 1299, rating: 4.6, reviews: 201, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop", location: "Whitefield", duration: "3-4 hrs" },
  { id: "5", name: "Car Service & Repair", provider: "AutoFix Garage", category: "Mechanics", price: 1999, rating: 4.5, reviews: 78, image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop", location: "JP Nagar", duration: "4-5 hrs" },
  { id: "6", name: "Express Package Delivery", provider: "QuickShip", category: "Delivery", price: 149, rating: 4.4, reviews: 312, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop", location: "All Areas", duration: "1-2 hrs" },
  { id: "7", name: "Interior Wall Painting", provider: "ColorCraft", category: "Painting", price: 2499, rating: 4.8, reviews: 45, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop", location: "BTM Layout", duration: "1-2 days" },
  { id: "8", name: "Garden Maintenance", provider: "GreenThumb", category: "Gardening", price: 799, rating: 4.7, reviews: 67, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop", location: "Jayanagar", duration: "2-3 hrs" },
];

export const testimonials = [
  { name: "Ananya R.", text: "Found an amazing electrician within minutes. The booking process was seamless!", rating: 5, avatar: "https://i.pravatar.cc/100?img=1" },
  { name: "Vikram S.", text: "The plumber arrived on time and fixed everything perfectly. Highly recommend!", rating: 5, avatar: "https://i.pravatar.cc/100?img=3" },
  { name: "Meera P.", text: "Best platform for finding local services. The ratings really help choose the right provider.", rating: 4, avatar: "https://i.pravatar.cc/100?img=5" },
];
