import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Bell, User, ChevronDown, LogOut, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/api/api";
import { format } from "date-fns";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Our Centers", path: "/centers" },
  { label: "How it Works", path: "/how-it-works" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [userDropdown, setUserDropdown] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hiddenNotifs, setHiddenNotifs] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
        setNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      
      const fetchBookings = async () => {
        try {
          const res = await API.get("/bookings");
          setBookings(res.data);
        } catch (error) {
          console.error("Failed to fetch notifications");
        }
      };
      
      fetchBookings();
    }
  }, [location.pathname]); // re-evaluate on navigation

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out border-b ${
        scrolled 
          ? "bg-background/60 backdrop-blur-3xl shadow-sm border-border py-2" 
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
            LocalLink
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-semibold tracking-wide transition-colors group px-1 py-2 ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out rounded-full ${
                location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        <div ref={menuRef} className="hidden md:flex items-center gap-3 relative">
          {user && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => { setNotifDropdown(!notifDropdown); setUserDropdown(false); }}
                className="text-muted-foreground mr-2 hover:text-primary transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {bookings.filter(b => !hiddenNotifs.includes(b._id)).length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </Button>

              <AnimatePresence>
                {notifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl py-2 z-50 thin-scrollbar"
                  >
                    <div className="px-4 py-2 border-b border-border mb-2 flex justify-between items-center bg-muted/20">
                       <h3 className="font-bold text-foreground font-display">Notifications</h3>
                       {bookings.filter(b => !hiddenNotifs.includes(b._id)).length > 0 && (
                         <button 
                           onClick={() => setHiddenNotifs([...hiddenNotifs, ...bookings.map(b => b._id)])}
                           className="text-[10px] flex items-center gap-1 text-primary hover:text-primary/70 font-semibold uppercase tracking-wider"
                         >
                           <CheckCheck className="w-3 h-3" /> Clear All
                         </button>
                       )}
                    </div>
                    {bookings.filter(b => !hiddenNotifs.includes(b._id)).length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground flex flex-col items-center">
                        <CheckCheck className="w-8 h-8 mb-2 opacity-20" />
                        You're all caught up!
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 px-2">
                        <AnimatePresence>
                          {bookings.filter(b => !hiddenNotifs.includes(b._id)).map((b) => (
                            <motion.div 
                              key={b._id} 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, scale: 0.9, height: 0 }}
                              className="relative text-left px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors cursor-default select-none border border-transparent hover:border-primary/10 group overflow-hidden"
                            >
                              <button 
                                onClick={(e) => { e.stopPropagation(); setHiddenNotifs([...hiddenNotifs, b._id]); }}
                                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive bg-background/80 rounded-full p-1 shadow backdrop-blur"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <p className="text-xs font-semibold text-foreground mb-1 pr-6">
                                Update: <span className="text-primary">{b.service?.title}</span>
                              </p>
                              <p className="text-[10px] text-muted-foreground leading-snug mb-1.5">
                                {b.status === "pending" && "Your request is sent and awaiting confirmation."}
                                {b.status === "accepted" && "Great! Your booking is accepted."}
                                {b.status === "completed" && "Service completed successfully!"}
                                {b.status === "rejected" && "Your request was declined."}
                              </p>
                              <p className="text-[9px] text-muted-foreground/60 font-medium">
                                {format(new Date(b.date), "MMM dd, hh:mm a")}
                              </p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {user ? (
            <div className="relative">
              <button 
                onClick={() => { setUserDropdown(!userDropdown); setNotifDropdown(false); }}
                className="flex items-center gap-2 hover:bg-muted/50 p-1.5 rounded-full transition-all border border-transparent hover:border-border"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shadow-glow flex items-center justify-center text-primary-foreground font-bold overflow-hidden border-2 border-background">
                  {user.image ? <img src={user.image} alt="User" /> : user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50"
                  >
                    <Link to={user.role === 'provider' ? "/provider-dashboard" : "/dashboard"} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted font-medium transition-colors">
                      <User className="w-4 h-4 text-primary" /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-destructive/10 text-destructive font-medium w-full text-left transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary transition-colors">Log in</Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-foreground p-2 rounded-full hover:bg-muted/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-3xl border-t border-border shadow-2xl"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-semibold text-muted-foreground hover:text-primary hover:translate-x-1 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border flex gap-2 flex-col">
                {user ? (
                   <>
                     <Link to={user.role === 'provider' ? "/provider-dashboard" : "/dashboard"} onClick={() => setIsOpen(false)}>
                       <Button variant="outline" className="w-full justify-start text-primary border-primary/20">Dashboard</Button>
                     </Link>
                     <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:bg-destructive/10">Sign out</Button>
                   </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full shadow-primary/20">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
