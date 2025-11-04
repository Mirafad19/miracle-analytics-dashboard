
import React from 'react';
import VideoPlayer from './VideoPlayer.tsx';
import { Activity, BarChart3, TrendingUp, Bot, Upload, Mail } from './Icons.tsx';
import { Button } from './ui/Button.tsx';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101010] text-black dark:text-white font-sans">
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Miracle Analytics</h1>
        </div>
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
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
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

        <section className="py-20 px-6 text-center">
          <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">The Cure for Manual Reporting</h3>
          <p className="max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 mb-12">
            Stop wasting hours on spreadsheets. Our dashboard provides the immediate clarity you need to optimize performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl">
              <div className="p-3 inline-block bg-emerald-500/10 rounded-lg mb-4"><TrendingUp className="h-8 w-8 text-emerald-500" /></div>
              <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">Track KPIs in Real-Time</h4>
              <p className="text-zinc-600 dark:text-zinc-400">Monitor income, expenses, and profit margins as they happen, not weeks later.</p>
            </div>
            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl">
              <div className="p-3 inline-block bg-blue-500/10 rounded-lg mb-4"><BarChart3 className="h-8 w-8 text-blue-500" /></div>
              <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">Visualize Financial Health</h4>
              <p className="text-zinc-600 dark:text-zinc-400">Interactive charts and graphs make complex data easy to understand and act upon.</p>
            </div>
            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl">
              <div className="p-3 inline-block bg-purple-500/10 rounded-lg mb-4"><Bot className="h-8 w-8 text-purple-500" /></div>
              <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">AI-Powered Analysis</h4>
              <p className="text-zinc-600 dark:text-zinc-400">Leverage our AI Analyst to get instant summaries, identify risks, and uncover opportunities.</p>
            </div>
          </div>
        </section>

        <section className="py-16 text-center bg-zinc-100 dark:bg-black">
          <h3 className="text-3xl font-bold text-black dark:text-white mb-4">Ready to See It in Action?</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">Access the full, interactive dashboard.</p>
          <Button
            onClick={onLoginClick}
            className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-4 px-8 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Access the Live Dashboard
          </Button>
        </section>

        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-12 rounded-2xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-4">Get Started with Miracle Analytics</h3>
                <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
                    Ready to transform your financial reporting? Contact our team today to set up your account and receive your login credentials. We'll get you started on the path to data-driven success.
                </p>
                <a href="mailto:fadahunsi.miracle@gmail.com"
                   className="inline-flex items-center justify-center gap-2 text-lg font-semibold bg-white text-indigo-600 py-3 px-8 rounded-lg transition-all duration-300 hover:bg-indigo-100 hover:scale-105 shadow-lg">
                    <Mail className="h-5 w-5" />
                    Contact for Access
                </a>
            </div>
        </section>

      </main>

      <footer className="text-center p-8 text-sm text-zinc-500 dark:text-zinc-600">
        <p>© 2025 Miracle Analytics. The future of financial intelligence.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
