
import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer.tsx';
import { Logo } from './Logo.tsx';
import { BarChart3, Bot, Upload, Mail, ChevronDown, Linkedin, Facebook, TwitterX, Instagram, CheckCircle } from './Icons.tsx';
import { Button } from './ui/Button.tsx';
import { CreatorModal } from './CreatorModal.tsx';

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! For this demo, please use the direct email link. Your form data has been logged to the console.");
    const formData = new FormData(e.target as HTMLFormElement);
    console.log(Object.fromEntries(formData.entries()));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101010] text-black dark:text-white font-sans">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <Logo />
        <Button
          onClick={onLoginClick}
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          Sign In
        </Button>
      </header>

      <main>
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-black opacity-90 z-0"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%2D%3E')] opacity-50"></div>
          <div className="relative z-10 animate-fade-in space-y-6">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter">
              From Raw Data to Actionable Insights.
              <span className="block text-yellow-300 [text-shadow:0_0_15px_rgba(234,179,8,0.7)] mt-2">Instantly.</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-indigo-100">
              Watch how our AI-driven dashboard instantly transforms complex financial spreadsheets into clear, strategic intelligence for your organization.
            </p>
          </div>
        </section>

        <section className="relative -mt-32 z-20 p-6">
          <VideoPlayer />
        </section>
        
        <section className="py-20 px-6 text-center">
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

        <section id="pricing" className="py-20 px-6 bg-zinc-100 dark:bg-black text-center">
            <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">Miracle Pricing Tiers</h3>
            <p className="max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 mb-12">
                All plans include a dedicated onboarding specialist, secure access for your team, and powerful AI-driven insights.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                {/* Starter Tier */}
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 flex flex-col">
                    <h4 className="text-2xl font-bold text-black dark:text-white">Starter</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 flex-grow">For <span className="font-semibold text-black dark:text-white">startups & small businesses</span> under 30 people.</p>
                    <ul className="space-y-3 text-zinc-700 dark:text-zinc-300 flex-grow">
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Up to 10 users included</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Role-based access control</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Standard dashboard templates</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Import tools (Excel, CSV)</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Email support (2 business days)</li>
                    </ul>
                    <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700">Get Started</Button>
                </div>
                {/* Pro Tier (Most Popular) */}
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border-2 border-purple-500 space-y-6 relative flex flex-col shadow-2xl shadow-purple-500/20">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                    <h4 className="text-2xl font-bold text-black dark:text-white">Pro</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 flex-grow">For <span className="font-semibold text-black dark:text-white">growing teams</span> with complex needs.</p>
                    <ul className="space-y-3 text-zinc-700 dark:text-zinc-300 flex-grow">
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> <span className="font-semibold">All features in Starter</span></li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Support for 3+ data integrations</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Custom dashboards for your team</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Weekly check-ins with data experts</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Premium support (24-hour response)</li>
                    </ul>
                    <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">Get Started</Button>
                </div>
                {/* Enterprise Tier */}
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 flex flex-col">
                    <h4 className="text-2xl font-bold text-black dark:text-white">Enterprise</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 flex-grow">Works best for <span className="font-semibold text-black dark:text-white">large organizations & hospitals.</span></p>
                    <ul className="space-y-3 text-zinc-700 dark:text-zinc-300 flex-grow">
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> <span className="font-semibold">All features in Pro</span></li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Unlimited users and studies</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Dedicated premium support</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> Advanced user roles & security</li>
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-emerald-500" /> 1:1 strategic check-ins</li>
                    </ul>
                    <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700">Contact Us</Button>
                </div>
            </div>
        </section>

        <section className="py-20 px-6">
            <h3 className="text-center text-xl font-semibold text-zinc-600 dark:text-zinc-400 mb-12">Trusted by Leading Healthcare & Finance Companies</h3>
            <div className="max-w-5xl mx-auto flex justify-around items-center gap-8 flex-wrap grayscale opacity-60 dark:opacity-40">
                <div className="text-2xl font-bold tracking-widest">INNOVATECH</div>
                <div className="text-2xl font-bold tracking-widest">VISTAGEN</div>
                <div className="text-2xl font-bold tracking-widest">AXIAL</div>
                <div className="text-2xl font-bold tracking-widest">QUANTUM</div>
                <div className="text-2xl font-bold tracking-widest">NEXUS</div>
            </div>
        </section>

        <section className="py-20 px-6 bg-zinc-100 dark:bg-black">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-zinc-500 dark:text-zinc-400 mb-4 font-semibold">TESTIMONIALS</p>
            <blockquote className="text-2xl md:text-3xl font-medium text-black dark:text-white leading-snug">
              "Miracle's dashboard has become an invaluable tool for our operations team. We can integrate real-time metrics and alerts into a single platform which allows us to consolidate visibility and accelerate our decision-making capability."
            </blockquote>
            <div className="mt-8">
              <p className="font-bold text-lg text-black dark:text-white">Jane Doe, COO</p>
              <p className="text-zinc-600 dark:text-zinc-400">Odyssey Therapeutics</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
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

        <section id="contact" className="py-20 px-6 bg-zinc-100 dark:bg-black">
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

      <footer className="text-center p-8 text-sm text-zinc-500 dark:text-zinc-600 bg-zinc-100 dark:bg-black">
        <p>
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