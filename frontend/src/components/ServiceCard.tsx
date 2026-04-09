import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
  >
    {/* Service Image */}
    <div className="relative h-44 overflow-hidden">
      <img
         src={service.image}
         alt={service.title}
         className="w-full h-full object-cover rounded-t-xl shadow-md group-hover:scale-110 transition-transform duration-500"
        />
      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
        {service.category}
      </span>
    </div>

    {/* Service Info */}
    <div className="p-5">

      <h3 className="font-semibold text-lg">
        {service.title}
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        {service.description}
      </p>

      <div className="flex items-center justify-between mt-4">

        <span className="font-bold text-lg text-primary">
          ₹{service.price}
        </span>
        <span className="absolute bottom-3 right-3 bg-white text-black text-xs px-2 py-1 rounded shadow">
         ₹{service.price}
        </span>

      </div>

      <Link to={`/booking/${service._id}`}>
        <Button className="w-full mt-4" size="sm">
          Book Now
        </Button>
      </Link>

    </div>
  </motion.div>
);

export default ServiceCard;