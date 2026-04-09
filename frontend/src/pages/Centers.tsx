import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, PhoneCall, Mail, Compass } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

const customIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="relative flex items-center justify-center">
          <div class="w-5 h-5 rounded-full bg-primary/80 hover:bg-primary shadow-[0_0_15px_rgba(232,78,27,0.8)] border border-primary/50 hover:border-white transition-all duration-300 flex items-center justify-center cursor-pointer relative z-10">
             <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <div class="absolute inset-0 rounded-full border border-primary animate-ping opacity-70 pointer-events-none"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const generateDummyCenters = () => {
   const cities = [
    { name: "Delhi", lat: 28.7041, lng: 77.1025 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { name: "Kochi", lat: 9.9312, lng: 76.2673 },
    { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
    { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
    { name: "Indore", lat: 22.7196, lng: 75.8577 },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882 }
   ];

   return cities.map((city, i) => ({
      id: i + 1,
      name: `${city.name} Support Hub`,
      address: `100 Main Road, ${city.name}, India`,
      phone: `+91 98000 ${String(1000 + i)}`,
      email: `${city.name.toLowerCase()}@locallink.in`,
      lat: city.lat,
      lng: city.lng
   }));
};

const dummyCenters = generateDummyCenters();

const Centers = () => {
  const [activeCenter, setActiveCenter] = useState<number | null>(null);

  const handleGetDirections = (center: typeof dummyCenters[0]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(center.address)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">India <span className="text-primary">Locations</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our real interactive map of India! Hover over any of our 15 prime locations for details, 
              or <strong className="text-foreground">click a pin for instant directions</strong>.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 min-h-[700px]">
            {/* The "Map" Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-border shadow-xl bg-secondary flex items-center justify-center z-0"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] z-0" />

              <MapContainer 
                center={[22.5937, 78.9629]} 
                zoom={5} 
                scrollWheelZoom={false}
                className="w-full h-[700px] z-10 bg-transparent rounded-3xl"
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {dummyCenters.map((center) => (
                  <Marker 
                    key={center.id}
                    position={[center.lat, center.lng]}
                    title={center.name}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => handleGetDirections(center),
                      mouseover: () => setActiveCenter(center.id),
                      mouseout: () => setActiveCenter(null)
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip" permanent={activeCenter === center.id}>
                       <div className="p-1 min-w-[200px]">
                          <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2 font-display">
                             <Navigation className="w-4 h-4 text-primary" /> {center.name}
                          </h4>
                          <div className="space-y-1.5 text-xs text-white/70">
                             <p className="flex items-start gap-2 max-w-[250px] whitespace-normal"><MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> <span>{center.address}</span></p>
                             <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary shrink-0" /> <span>{center.email}</span></p>
                             <p className="flex items-center gap-2"><PhoneCall className="w-3.5 h-3.5 text-primary shrink-0" /> <span>{center.phone}</span></p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-white/10 text-primary font-semibold text-[10px] text-center flex items-center justify-center gap-1 bg-primary/10 rounded-md py-1 whitespace-nowrap px-2">
                             <Compass className="w-3 h-3" /> Click pin for directions
                          </div>
                       </div>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>

            {/* The List of Centers */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 rounded-2xl h-[700px]" style={{ scrollbarWidth: 'thin' }}>
              {dummyCenters.map((center, i) => (
                <motion.div
                  key={center.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  onMouseEnter={() => setActiveCenter(center.id)}
                  onMouseLeave={() => setActiveCenter(null)}
                  onClick={() => handleGetDirections(center)}
                  className={`group p-5 rounded-2xl transition-all cursor-pointer bg-card shadow-sm shrink-0 border ${
                    activeCenter === center.id ? 'border-primary shadow-md scale-[1.02] ring-1 ring-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <div className="p-1.5 bg-muted rounded-lg border border-border transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                      <Navigation className="w-4 h-4 text-primary" />
                    </div>
                    {center.name}
                  </h3>
                  <div className="space-y-2 text-xs text-muted-foreground font-medium">
                    <p className="flex items-center gap-3"><MapPin className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" /> {center.address}</p>
                    <p className="flex items-center gap-3"><PhoneCall className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" /> {center.phone}</p>
                    <p className="flex items-center gap-3"><Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" /> {center.email}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Centers;
