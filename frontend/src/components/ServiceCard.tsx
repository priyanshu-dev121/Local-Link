import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface ServiceData {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

const ServiceCard = ({ service }: { service: ServiceData }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500 group border border-white/10 hover:border-primary/50"
  >
    {/* Service Image */}
    <div className="relative h-56 overflow-hidden">
      <img
         src={service.image}
         alt={service.title}
         className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-2xl">
        {service.category}
      </span>
    </div>

    {/* Service Info */}
    <div className="p-8 relative">
      <h3 className="font-black text-xl text-white tracking-tight group-hover:text-primary transition-colors">
        {service.title}
      </h3>

      <p className="text-sm text-slate-400 mt-3 line-clamp-2 font-medium leading-relaxed h-10">
        {service.description}
      </p>

      <div className="flex items-center justify-between mt-8">
        <span className="font-black text-2xl text-white tracking-tighter">
          ₹{service.price}
        </span>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      <Link to={`/booking/${service._id}`}>
        <button className="w-full mt-8 bg-white/5 text-white hover:bg-primary py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-primary active:scale-95">
          Select Service
        </button>
      </Link>
    </div>
  </motion.div>
);

export default ServiceCard;