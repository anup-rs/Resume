import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Mail, Copy, Check,
  Code, Database, Cpu, Award, BookOpen, ExternalLink,
  Send, Terminal, ChevronRight, MapPin
} from 'lucide-react';
import { RevealLayer } from './components/RevealLayer';

const BG_IMAGE_1 = import.meta.env.VITE_BG_IMAGE_1 || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop";
const BG_IMAGE_2 = import.meta.env.VITE_BG_IMAGE_2 || "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1920&auto=format&fit=crop";

export default function App() {
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Forms and state handlers
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSending, setFormSending] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.x === -999) {
        smoothRef.current = { x: e.clientX, y: e.clientY };
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updateSpotlight = () => {
      if (mouseRef.current.x !== -999) {
        smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
        smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
        setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      }
      rafRef.current = requestAnimationFrame(updateSpotlight);
    };

    rafRef.current = requestAnimationFrame(updateSpotlight);

    // Watch positions for active section highlighting
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sections = ['home', 'projects', 'skills', 'achievements', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section.charAt(0).toUpperCase() + section.slice(1));
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleCopyEmail = () => {
    const contactEmail = "anupkushwaha470@gmail.com";
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    showToast("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill out all fields.");
      return;
    }
    setFormSending(true);
    try {
      const emailEndpoint = "anupkushwaha470@gmail.com";
      const response = await fetch(`https://formsubmit.co/ajax/${emailEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`
        })
      });
      const result = await response.json();
      if (response.ok && (result.success === "true" || result.success === true)) {
        setFormSubmitted(true);
        showToast("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormSubmitted(false), 4500);
      } else {
        showToast(result.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      showToast("Network error. Please check your connection.");
    } finally {
      setFormSending(false);
    }
  };

  const handleScrollToSection = (id: string, name: string) => {
    setActiveTab(name);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-black text-white tracking-[-0.02em] selection:bg-[#e8702a]/30 selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Toast Notification */}
      {toastMessage && (
        <div id="toast-notify" className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900 border border-white/10 px-6 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-2xl animate-fade-in transition-all">
          <Terminal size={16} className="text-[#e8702a]" />
          <span className="text-sm font-medium text-white/90">{toastMessage}</span>
        </div>
      )}

      {/* Navigation (fixed, over hero) */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 bg-black/40 backdrop-blur-md border-b border-white/5">
        {/* Left branding */}
        <div id="brand-logo" className="flex items-center gap-2.5 z-[110] cursor-pointer" onClick={() => handleScrollToSection('home', 'Home')}>
          <svg className="w-6.5 h-6.5" viewBox="0 0 256 256" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2.5xl font-playfair italic">Anup Kumar Kushwaha</span>
        </div>

        {/* Center pill (desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md border border-white/15 rounded-full p-1.5 items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              id={`nav-${item.name.toLowerCase()}`}
              onClick={() => handleScrollToSection(item.id, item.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === item.name
                ? 'bg-white text-black font-semibold shadow-md scale-102'
                : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Right (desktop) */}
        <div className="hidden md:block">
          <button
            id="btn-hire-me-desktop"
            onClick={() => handleScrollToSection('contact', 'Contact')}
            className="inline-block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer"
          >
            Hire Me
          </button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-white/80 p-2 z-[110] transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-300">
          <div className="flex flex-col items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                id={`nav-mobile-${item.name.toLowerCase()}`}
                onClick={() => handleScrollToSection(item.id, item.name)}
                className={`text-2xl font-medium transition-colors cursor-pointer ${activeTab === item.name ? 'text-[#e8702a] font-bold' : 'text-white hover:text-[#e8702a]'
                  }`}
              >
                {item.name}
              </button>
            ))}
            <button
              id="btn-hire-me-mobile"
              onClick={() => handleScrollToSection('contact', 'Contact')}
              className="mt-4 bg-white text-gray-900 text-base font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
            >
              Hire Me
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>

        {/* Particle Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-30">
          <div className="particle w-1.5 h-1.5 top-[15%] left-[20%]" />
          <div className="particle w-2 h-2 top-[35%] left-[65%]" />
          <div className="particle w-1 h-1 top-[55%] left-[10%]" />
          <div className="particle w-2.5 h-2.5 top-[75%] left-[45%]" />
          <div className="particle w-1.5 h-1.5 top-[25%] left-[80%]" />
          <div className="particle w-2 h-2 top-[70%] left-[85%]" />
          <div className="particle w-1 h-1 top-[85%] left-[15%]" />
        </div>

        {/* Base image (z-10) with slow scale zoom-out animation */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom brightness-[0.7]"
          style={{
            backgroundImage: `url(${BG_IMAGE_1})`,
          }}
        />

        {/* Reveal layer (z-30) */}
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Dynamic Interactive Cursor Ring */}
        {cursorPos.x !== -999 && (
          <div
            className="absolute rounded-full border border-white/2 pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 hidden md:block transition-all duration-75 mix-blend-difference"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              width: 520,
              height: 520,
            }}
          />
        )}

        {/* Heading (z-50) */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95] drop-shadow-md">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Code meets
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              curiosity
            </span>
          </h1>
        </div>

        {/* Bottom-left paragraph (z-50) */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[280px] z-50 hero-anim hero-fade bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/5"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            First-year ECE student at NIELIT Gorakhpur building advanced Python bots and backend structures, with an ultimate goal in cybersecurity and ethical hacking.
          </p>
        </div>

        {/* Bottom-right: Upgraded Glassmorphic Connect Console (z-50) */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[340px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Python, SQL, Flask, Django & React — from DSA algorithms to production codebases, I construct automation, manage persistent databases, and break systems down.
          </p>

          <div className="w-full bg-[#121214]/65 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-1.5">
              <a
                id="social-github"
                href="https://github.com/anup-rs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-[#e8702a] text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/5 hover:border-transparent flex items-center justify-center cursor-pointer"
                title="GitHub Profile"
              >
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                id="social-linkedin"
                href="https://linkedin.com/in/anup-rs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-[#e8702a] text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/5 hover:border-transparent flex items-center justify-center cursor-pointer"
                title="LinkedIn Profile"
              >
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            <button
              id="btn-copy-email"
              onClick={handleCopyEmail}
              className="flex-1 flex items-center justify-between gap-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/5 hover:border-white/10 text-white rounded-xl text-xs font-mono transition-all duration-200 hover:scale-[1.01] active:scale-98 group cursor-pointer"
            >
              <span className="truncate">anupkushwaha470@gmail.com</span>
              {copied ? (
                <Check size={14} className="text-emerald-400 shrink-0" />
              ) : (
                <Copy size={14} className="text-white/60 group-hover:text-white shrink-0 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-16 lg:px-24 bg-black relative border-t border-white/10 bg-grid-cyber">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-[#e8702a] font-bold mb-2">Portfolio</span>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-medium text-white mb-4">Featured Projects</h2>
            <div className="w-12 h-1 bg-[#e8702a] rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Project 1 */}
            <div id="project-lumio" className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 glow-hover-orange">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-[#e8702a]/15 text-[#e8702a] rounded-xl flex items-center justify-center">
                    <Terminal size={20} />
                  </div>
                  <a href="https://github.com/anup-rs/lumio" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors cursor-pointer">
                    <ExternalLink size={18} />
                  </a>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Lumio</h3>
                <span className="text-xs font-semibold text-white/50 block mb-3">Discord Community Bot</span>
                <p className="text-xs text-white/70 leading-relaxed mb-6">
                  Built and deployed a Discord bot for the "Section Zero" community featuring terminal-themed, dynamically generated welcome/goodbye image cards using Pillow, connected with active Supabase persistence.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {['Python', 'Flask', 'Pillow', 'Supabase', 'Railway'].map(tag => (
                  <span key={tag} className="text-[9px] font-semibold bg-white/5 border border-white/15 px-2 py-0.5 rounded-full text-white/80">{tag}</span>
                ))}
              </div>
            </div>

            {/* Project 2 */}
            <div id="project-artscape" className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 glow-hover-purple">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-[#e8702a]/15 text-[#e8702a] rounded-xl flex items-center justify-center">
                    <Code size={20} />
                  </div>
                  <a href="https://github.com/Anup4503/artscape.git" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors cursor-pointer">
                    <ExternalLink size={18} />
                  </a>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Artscape Studio</h3>
                <span className="text-xs font-semibold text-white/50 block mb-3">E-commerce Backend</span>
                <p className="text-xs text-white/70 leading-relaxed mb-6">
                  Developed an e-commerce platform with Django and Supabase, implementing secure authentication, production verification checkpoints, and active checkout flows.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {['Python', 'Django', 'SQL', 'Supabase', 'React'].map(tag => (
                  <span key={tag} className="text-[9px] font-semibold bg-white/5 border border-white/15 px-2 py-0.5 rounded-full text-white/80">{tag}</span>
                ))}
              </div>
            </div>

            {/* Project 3 */}
            <div id="project-election" className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 glow-hover-orange">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center">
                    <Database size={20} />
                  </div>
                  <span className="text-white/40"><ExternalLink size={18} className="opacity-20" /></span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Election Management</h3>
                <span className="text-xs font-semibold text-white/50 block mb-3">Desktop DB System</span>
                <p className="text-xs text-white/70 leading-relaxed mb-6">
                  Developed a desktop application to manage voter registration, candidate schedules, and automated ballot computation using an interactive Tkinter GUI hooked with a relational SQLite configuration.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {['Python', 'Tkinter', 'SQL', 'Relational DB'].map(tag => (
                  <span key={tag} className="text-[9px] font-semibold bg-white/5 border border-white/15 px-2 py-0.5 rounded-full text-white/80">{tag}</span>
                ))}
              </div>
            </div>

            {/* Project 4 */}
            <div id="project-hospital" className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 glow-hover-purple">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                    <Cpu size={20} />
                  </div>
                  <span className="text-white/40"><ExternalLink size={18} className="opacity-20" /></span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Hospital Management</h3>
                <span className="text-xs font-semibold text-white/50 block mb-3">Health Systems DB</span>
                <p className="text-xs text-white/70 leading-relaxed mb-6">
                  Built patient diagnostics record system, booking scheduler, invoicing, and patient ledger logs complete with database updates in Python and Tkinter UI dashboards.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {['Python', 'Tkinter', 'SQL', 'SQLite'].map(tag => (
                  <span key={tag} className="text-[9px] font-semibold bg-white/5 border border-white/15 px-2 py-0.5 rounded-full text-white/80">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 md:px-16 lg:px-24 bg-zinc-950 relative border-t border-white/10 overflow-hidden">
        {/* Subtle grid elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#e8702a]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-[#e8702a] font-bold mb-2">Expertise</span>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-medium text-white mb-4">Technical Stack</h2>
            <div className="w-12 h-1 bg-[#e8702a] rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Box 1: Languages & AI */}
            <div id="skills-languages" className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Code className="text-[#e8702a]" size={20} />
                <h3 className="font-bold text-white">Languages & AI</h3>
              </div>
              <ul className="space-y-3.5 mt-2">
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Python</span>
                    <span>90%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#e8702a] rounded-full" style={{ width: '90%' }} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Prompt Engineering</span>
                    <span>70%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#e8702a]/80 rounded-full" style={{ width: '70%' }} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>C (Basics)</span>
                    <span>50%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#e8702a]/60 rounded-full" style={{ width: '50%' }} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Kotlin (Basics)</span>
                    <span>40%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#e8702a]/40 rounded-full" style={{ width: '40%' }} />
                  </div>
                </li>
              </ul>
              <div className="mt-5 pt-4 border-t border-white/5 flex gap-2 flex-wrap">
                <span className="text-[10px] bg-white/5 text-white/70 px-2 py-0.5 rounded-full">English</span>
                <span className="text-[10px] bg-white/5 text-white/70 px-2 py-0.5 rounded-full">Hindi</span>
              </div>
            </div>

            {/* Box 2: Databases & Web */}
            <div id="skills-databases" className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-violet-400" size={20} />
                <h3 className="font-bold text-white">Databases & Web</h3>
              </div>
              <ul className="space-y-3.5 mt-2">
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>HTML</span>
                    <span>100%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400 rounded-full" style={{ width: '100%' }} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>npm</span>
                    <span>90%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400/90 rounded-full" style={{ width: '90%' }} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>SQL / MySQL</span>
                    <span>80%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400/80 rounded-full" style={{ width: '80%' }} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>CSS</span>
                    <span>80%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400/80 rounded-full" style={{ width: '80%' }} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Supabase</span>
                    <span>75%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400/70 rounded-full" style={{ width: '75%' }} />
                  </div>
                </li>
              </ul>
            </div>

            {/* Box 3: Tools & OS */}
            <div id="skills-tools" className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-emerald-400" size={20} />
                <h3 className="font-bold text-white">Tools & OS</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Tkinter', 'Pillow', 'Git', 'GitHub', 'Railway', 'Kali Linux (Basics)'].map(tool => (
                  <span
                    key={tool}
                    className="text-xs bg-white/5 border border-white/10 hover:border-emerald-400/30 px-3 py-1.5 rounded-xl text-white/80 transition-colors"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 4: Learning Focus */}
            <div id="skills-learning" className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-amber-500/10 text-amber-400 rounded-bl-xl text-[10px] font-bold tracking-wider uppercase">
                Active
              </div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-amber-400" size={20} />
                <h3 className="font-bold text-white">Currently Learning</h3>
              </div>
              <ul className="space-y-3 mt-3 text-xs text-white/80 leading-relaxed">
                <li className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-[#e8702a]" /> Javascript (DSA, OOP)
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-[#e8702a]" /> React
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-[#e8702a]" /> Tailwind (CSS Framework)
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-[#e8702a]" /> Vitest
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Experience & Milestones Section */}
      <section id="achievements" className="py-24 px-6 md:px-16 lg:px-24 bg-black relative border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col mb-12 sm:mb-16 md:items-center md:text-center animate-fade-in">
            <span className="text-xs uppercase tracking-widest text-[#e8702a] font-bold mb-2">Milestones</span>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-medium text-white mb-4">Achievements & Education</h2>
            <div className="w-12 h-1 bg-[#e8702a] rounded md:mx-auto" />
          </div>

          <div className="relative border-l border-white/10 pl-6 sm:pl-8 ml-2 sm:ml-4 space-y-12">

            {/* Milestone Cert */}
            <div id="milestone-sql-cert" className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 bg-[#e8702a] text-black w-6.5 h-6.5 rounded-full flex items-center justify-center border border-black z-40 transition-transform duration-300 group-hover:scale-110">
                <Award size={13} className="shrink-0" />
              </div>
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/15">
                <span className="text-[#e8702a] text-xs font-semibold uppercase tracking-wider block mb-1">SQL Credential</span>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Advanced SQL Certification</h3>
                    <span className="text-sm font-semibold text-white/50 block mb-3">HackerRank Verification</span>
                  </div>
                  <a
                    href="https://www.hackerrank.com/certificates/3c3ea3195b67"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:bg-[#e8702a] text-white rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <span>Verify</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Passed the Advanced SQL standard evaluation demonstrating proficiency in complex queries, subqueries, relational database schemas, multi-table joins, aggregations, and performance index mapping.
                </p>
                <div className="w-full max-w-xl aspect-[1.414/1] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  <iframe
                    src="https://www.hackerrank.com/certificates/iframe/3c3ea3195b67"
                    title="HackerRank Advanced SQL Certificate"
                    className="w-full h-full border-none"
                    style={{ minHeight: '320px' }}
                  />
                </div>
              </div>
            </div>

            {/* Milestone 1 */}
            <div id="milestone-college" className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 bg-[#e8702a] text-black w-6.5 h-6.5 rounded-full flex items-center justify-center border border-black z-40 transition-transform duration-300 group-hover:scale-110">
                <BookOpen size={13} />
              </div>
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/15">
                <span className="text-[#e8702a] text-xs font-semibold uppercase tracking-wider block mb-1">Graduation 2029</span>
                <h3 className="text-lg sm:text-xl font-bold text-white">National Institute of Electronics & Information Technology (NIELIT)</h3>
                <span className="text-sm font-semibold text-white/50 block mb-3">Gorakhpur, India</span>
                <p className="text-sm text-white/70 leading-relaxed">
                  B.Tech in Electronics & Communication Engineering (ECE). Successfully finished 1st year with core physics foundation, electronics basic setups, and algorithm structuring classes.
                </p>
              </div>
            </div>

            {/* Milestone 2 */}
            <div id="milestone-hackstorm" className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 bg-violet-400 text-black w-6.5 h-6.5 rounded-full flex items-center justify-center border border-black z-40 transition-transform duration-300 group-hover:scale-110">
                <Award size={13} className="shrink-0" />
              </div>
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/15">
                <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider block mb-1">National Finalist</span>
                <h3 className="text-lg sm:text-xl font-bold text-white">Hackstorm Hackathon</h3>
                <span className="text-sm font-semibold text-white/50 block mb-3">Ranked Top 50 Country-wide</span>
                <p className="text-sm text-white/70 leading-relaxed">
                  Competed against 2500+ teams across India. Successfully cleared multiple rounds and qualified for the national final bracket showcasing robust problem resolving modules in backend structures.
                </p>
              </div>
            </div>

            {/* Milestone 3 */}
            <div id="milestone-cyber" className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 bg-emerald-400 text-black w-6.5 h-6.5 rounded-full flex items-center justify-center border border-black z-40 transition-transform duration-300 group-hover:scale-110">
                <Cpu size={13} />
              </div>
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/15">
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider block mb-1">Core Goals</span>
                <h3 className="text-lg sm:text-xl font-bold text-white">Aspiring Cybersecurity Specialist</h3>
                <span className="text-sm font-semibold text-white/50 block mb-3">Active Focus</span>
                <p className="text-sm text-white/70 leading-relaxed">
                  Strengthening security engineering frameworks, backend auth parameters, Kali Linux testing configs, and API encryption workflows alongside active coding projects.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-16 lg:px-24 bg-zinc-950 relative border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Info Column */}
            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-[#e8702a] font-bold mb-2">Connect</span>
              <h2 className="text-3xl sm:text-5xl font-playfair italic font-medium text-white mb-6">Let's build something securely.</h2>
              <p className="text-white/60 leading-relaxed max-w-md mb-8">
                I am open to collaborations, backend automation building, or cybersecurity research internship opportunities. Feel free to reach out via form or direct mail channels.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 text-white/80">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <Mail size={18} className="text-[#e8702a]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">Email Address</span>
                    <a href="mailto:anupkushwaha470@gmail.com" className="text-sm font-medium hover:text-[#e8702a] transition-colors cursor-pointer">
                      anupkushwaha470@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-white/80">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <MapPin size={18} className="text-[#e8702a]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">Location</span>
                    <span className="text-sm font-medium">Alwar, Rajasthan, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Terminal size={18} className="text-[#e8702a]" /> Send Message
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="form-name" className="text-[10px] uppercase font-bold text-white/40 block mb-1">Your Name</label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#e8702a]/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label htmlFor="form-email" className="text-[10px] uppercase font-bold text-white/40 block mb-1">Email Address</label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#e8702a]/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label htmlFor="form-message" className="text-[10px] uppercase font-bold text-white/40 block mb-1">Message</label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#e8702a]/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                    placeholder="Write message content here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSending || formSubmitted}
                  className="w-full bg-[#e8702a] hover:bg-[#d2611f] disabled:bg-emerald-600/80 text-white font-medium py-3 px-6 rounded-xl text-sm transition-all duration-200 hover:scale-[1.01] active:scale-98 hover:shadow-lg hover:shadow-[#e8702a]/15 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {formSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      Sending Encryption...
                    </>
                  ) : formSubmitted ? (
                    <>
                      <Check size={16} /> Message Sent
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Encryption
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 border-t border-white/5 text-center text-xs text-white/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Anup Kumar Kushwaha. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com/anup-rs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">GitHub</a>
            <a href="https://linkedin.com/in/anup-rs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
