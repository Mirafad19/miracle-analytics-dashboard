
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outdir = 'dist';

// Ensure the output directory exists
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}

// Copy the HTML and favicon files to the output directory, creating a complete package
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(outdir, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'favicon.svg'), path.join(outdir, 'favicon.svg'));

// Vercel provides environment variables to the build process.
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: path.join(outdir, 'index.js'),
  jsx: 'automatic',
  format: 'esm', // Output as ES Module to support external imports via Import Map
  define: {
    'process.env.API_KEY': `"${apiKey}"`,
  },
  // Externalize standard dependencies to use CDN versions via Import Map
  external: [
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'framer-motion',
    'recharts',
    'xlsx',
    'firebase/app',
    'firebase/auth',
    'firebase/compat/app',
    'firebase/compat/auth',
    '@google/genai',
    'clsx',
    'tailwind-merge',
    'lucide-react',
    '@radix-ui/react-slot',
    '@radix-ui/react-avatar',
    'class-variance-authority'
  ],
}).then(() => console.log('✅ Build successful! Dependencies are externalized for Import Map.'))
  .catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
  });
