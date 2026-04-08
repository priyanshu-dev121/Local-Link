import { motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface ServiceData {
  id: string;
  name: string;
  provider: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  duration: string;
}

const ServiceCard = ({ service }: { service: ServiceData }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
    className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow group"
  >
    <div className="relative h-44 overflow-hidden">
      <img
        src={service.image}
        alt={service.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
        {service.category}
      </span>
    </div>
    <div className="p-5">
      <h3 className="font-display font-semibold text-card-foreground">{service.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">by {service.provider}</p>
      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{service.location}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration}</span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-semibold text-card-foreground">{service.rating}</span>
          <span className="text-xs text-muted-foreground">({service.reviews})</span>
        </div>
        <span className="font-display font-bold text-lg text-primary">₹{service.price}</span>
      </div>
      <Link to={`/provider/${service.id}`}>
        <Button className="w-full mt-4" size="sm">Book Now</Button>
      </Link>
    </div>
  </motion.div>
);

export default ServiceCard;
