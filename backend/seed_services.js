const mongoose = require('mongoose');

// Service Model (inline to avoid path issues)
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  price: Number,
  description: String,
  image: String
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

const seedServices = async () => {
  try {
    const MONGO_URI = "mongodb+srv://priyanshurai108:DqS9XmS3yqO07M7m@cluster0.p83v9.mongodb.net/locallink";
    await mongoose.connect(MONGO_URI);
    
    // Find a provider to assign services to
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String }));
    const provider = await User.findOne({ role: 'provider' });
    
    if (!provider) {
      console.log("No provider found in DB. Please register a provider user first.");
      process.exit(1);
    }

    const services = [
      {
        title: "Home Deep Cleaning & Sanitization",
        category: "cleaning",
        price: 1200,
        description: "Complete deep cleaning of all rooms, including kitchen and bathroom sanitization. Eco-friendly products used.",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      },
      {
        title: "Emergency Pipe Leak Repair",
        category: "plumber",
        price: 450,
        description: "Fixing burst pipes, faucets, and drain blockages. 24/7 availability for emergency calls.",
        image: "https://images.unsplash.com/photo-1542013936693-884638324262?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      },
      {
        title: "Full House Wiring & Safety Check",
        category: "electrician",
        price: 2500,
        description: "Comprehensive inspection of your home's electrical system, fixing short circuits, and installing new points.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      },
      {
        title: "Professional Living Room Painting",
        category: "painter",
        price: 4000,
        description: "Texture painting and wall decals. Includes surface preparation and high-quality Asian Paints.",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      },
      {
        title: "Mathematics & Physics Home Tuition",
        category: "home tutor",
        price: 800,
        description: "Personalized coaching for Grade 8-12. Concept building and exam preparation by expert faculty.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      },
      {
        title: "Express Grocery & Package Delivery",
        category: "delivery",
        price: 99,
        description: "Need something delivered across the neighborhood? Safe and fast courier services within 2 hours.",
        image: "https://images.unsplash.com/photo-1586528116311-ad86d7c71798?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      },
      {
        title: "Premium Sofa & Carpet Shampooing",
        category: "cleaning",
        price: 1500,
        description: "Deep hot water extraction cleaning for carpets and sofas. Removes stains and allergens effectively.",
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      },
      {
        title: "Water Heater (Geyser) Installation",
        category: "electrician",
        price: 600,
        description: "Safe installation and testing of all geyser brands. Guaranteed shock-proof fitting.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
        provider: provider._id
      }
    ];

    await Service.deleteMany({}); // Clear existing to avoid duplicates during testing
    await Service.insertMany(services);
    
    console.log("SUCCESS: 8 Premium LocalLink Services Seeded!");
    process.exit(0);
  } catch (err) {
    console.error("SEED ALL ERR:", err);
    process.exit(1);
  }
};

seedServices();
