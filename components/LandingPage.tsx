
import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer.tsx';
import { Activity, BarChart3, Bot, Upload, Mail, ChevronDown, Linkedin, Facebook, TwitterX, Instagram, Home, Users, FileText, Sun, Moon } from './Icons.tsx';
import { Button } from './ui/Button.tsx';
import { CreatorModal } from './CreatorModal.tsx';
import { AnimatedHero } from './ui/animated-hero.tsx';
import { TestimonialsSection } from './ui/testimonials-with-marquee.tsx';
import { FloatingNav } from './ui/floating-navbar.tsx';
import { Logo } from './Branding.tsx';
import { useTheme } from '../ThemeContext';

interface LandingPageProps {
  onLoginClick: () => void;
}

const faqData = [
  {
    question: "What is Miracle Analytics?",
    answer: "Miracle Analytics is an AI-powered financial intelligence dashboard designed to transform complex spreadsheets into clear, interactive, and actionable insights. It helps businesses understand their financial health, track KPIs in real-time, and make data-driven decisions with confidence."
  },
  {
    question: "What kind of data can I upload?",
    answer: "Our platform is designed to be flexible. It's optimized for financial spreadsheets (like Excel .xlsx or .xls files) containing transactional data such as income, expenses, payment methods, and dates. We provide a concierge onboarding service to ensure your specific data format is perfectly integrated."
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. Security is our top priority. Each client operates in a completely separate and secure workspace. Your data is isolated and protected using industry-standard security measures, ensuring that only your authorized users can access it."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply fill out our contact form below or send us an email. Our team will reach out to you personally to understand your needs, set up your dedicated workspace, and provide you with your login credentials for a seamless onboarding experience."
  }
];

const testimonials = [
  {
    author: {
      name: "Sarah Jenkins",
      handle: "CFO @ HealthCare Plus",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Miracle Analytics completely transformed our monthly reporting. What used to take 3 days now takes 3 minutes.",
  },
  {
    author: {
      name: "David Okonkwo",
      handle: "Director @ Lagos Medical",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The AI insights are terrifyingly accurate. It found a 15% leakage in our expenses that we missed for years.",
  },
  {
    author: {
      name: "Elena Rodriguez",
      handle: "Admin @ City Clinics",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Finally, a dashboard that speaks my language. I don't need to be a data scientist to understand our profits.",
  },
  {
    author: {
      name: "James Carter",
      handle: "Founder @ Carter Logistics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "The secure file upload and instant visualization is a game changer for small business owners.",
  }
];

const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; }> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <button onClick={onClick} className="flex justify-between items-center w-full py-5 text-left">
        <span className="text-lg font-medium text-black dark:text-white">{question}</span>
        <ChevronDown className={`h-6 w-6 text-purple-500 dark:text-purple-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="pt-2 pb-5 text-zinc-600 dark:text-zinc-400">{answer}</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { theme, setTheme } = useTheme();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! For this demo, please use the direct email link. Your form data has been logged to the console.");
    const formData = new FormData(e.target as HTMLFormElement);
    console.log(Object.fromEntries(formData.entries()));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { name: "Home", link: "#home", icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "Features", link: "#features", icon: <BarChart3 className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "Testimonials", link: "#testimonials", icon: <Users className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "FAQ", link: "#faq", icon: <FileText className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "Contact", link: "#contact", icon: <Mail className="h-4 w-4 text-neutral-500 dark:text-white" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101010] text-black dark:text-white font-sans scroll-smooth">
      {/* Unified Header (Contains Logo + Nav + Actions) */}
      <FloatingNav navItems={navItems} onLoginClick={onLoginClick} />
      
      <main>
        <section id="home" className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center p-6 overflow-hidden scroll-mt-28">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-black opacity-90 z-0"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          <div className="relative z-10 animate-fade-in space-y-6 w-full pt-16">
            <AnimatedHero />
          </div>
        </section>

        <section id="demo" className="relative -mt-32 z-20 p-6 scroll-mt-28">
          <VideoPlayer />
        </section>
        
        <section id="features" className="py-20 px-6 text-center scroll-mt-28">
            <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">A Smarter Workflow in 3 Simple Steps</h3>
            <p className="max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 mb-12">
                Go from complex spreadsheets to actionable insights faster than ever before.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                    <div className="p-4 inline-block bg-blue-500/10 rounded-full mb-4 ring-8 ring-blue-500/5">
                        <Upload className="h-10 w-10 text-blue-500" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">1. Upload Your Data</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Securely upload your Excel file. Our platform intelligently parses your financial records, handling multiple months and formats with ease.</p>
                </div>
                <div className="text-center">
                    <div className="p-4 inline-block bg-purple-500/10 rounded-full mb-4 ring-8 ring-purple-500/5">
                        <BarChart3 className="h-10 w-10 text-purple-500" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">2. Visualize & Analyze</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Instantly see your data come to life. Interact with dynamic charts and graphs that reveal trends, KPIs, and key financial metrics at a glance.</p>
                </div>
                <div className="text-center">
                    <div className="p-4 inline-block bg-emerald-500/10 rounded-full mb-4 ring-8 ring-emerald-500/5">
                        <Bot className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">3. Gain AI Insights</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Chat with our AI Financial Analyst. Ask complex questions in plain language and get summaries, risk assessments, and strategic advice.</p>
                </div>
            </div>
        </section>

        <section id="faq" className="py-20 px-6 bg-zinc-100 dark:bg-black scroll-mt-28">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>

        <div id="testimonials" className="scroll-mt-28">
            <TestimonialsSection 
            title="Trusted by Industry Leaders" 
            description="See why hospital administrators and business owners rely on Miracle Analytics for their financial clarity."
            testimonials={testimonials}
            className="bg-white dark:bg-zinc-950"
            />
        </div>

        <section id="contact" className="py-20 px-6 scroll-mt-28">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
                <h3 className="text-3xl font-bold text-black dark:text-white">Get in Touch</h3>
                <p>
                    Ready to transform your financial reporting? Fill out the form or send us a direct email to start the conversation. Our team of experts is ready to provide a personalized onboarding experience and set you up with your dedicated analytics workspace.
                </p>
                <a href="mailto:fadahunsi.miracle@gmail.com" className="inline-flex items-center gap-3 text-lg font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <Mail className="h-6 w-6" />
                    fadahunsi.miracle@gmail.com
                </a>
                <div className="flex items-center gap-4 pt-4">
                    <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><TwitterX className="h-6 w-6"/></a>
                    <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Facebook className="h-6 w-6"/></a>
                    <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Instagram className="h-6 w-6"/></a>
                    <a href="https://www.linkedin.com/in/miracle-fadahunsi-897149295/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Linkedin className="h-6 w-6"/></a>
                </div>
            </div>
            <div className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">Full Name</label>
                            <input type="text" name="full-name" id="full-name" placeholder="ex. John Carter" required className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">Email Address</label>
                            <input type="email" name="email" id="email" placeholder="example@email.com" required className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">Subject</label>
                        <input type="text" name="subject" id="subject" placeholder="ex. Onboarding Request" required className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">Leave us a message</label>
                        <textarea name="message" id="message" rows={5} placeholder="Please type your message here..." required className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="w-full text-lg font-semibold bg-zinc-800 hover:bg-black dark:bg-zinc-200 dark:hover:bg-white text-white dark:text-black py-3 transition-all duration-300"
                        >
                            Send Message
                        </Button>
                    </div>
                </form>
            </div>
          </div>
        </section>

      </main>

      <footer className="flex flex-col items-center justify-center p-8 text-sm text-zinc-500 dark:text-zinc-600 bg-zinc-100 dark:bg-black gap-4">
        {/* Mobile-only Theme Toggle */}
        <div className="sm:hidden">
           <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full flex items-center gap-2 bg-white dark:bg-zinc-900"
          >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </Button>
        </div>
        <p className="text-center">
          © 2025 Miracle Analytics. The future of financial intelligence. A project by{' '}
          <button 
            onClick={() => setIsCreatorModalOpen(true)} 
            className="text-zinc-800 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 underline underline-offset-2 transition-colors"
          >
            Fadahunsi Miracle
          </button>.
        </p>
      </footer>

      <CreatorModal isOpen={isCreatorModalOpen} onClose={() => setIsCreatorModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
