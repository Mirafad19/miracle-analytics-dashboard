const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outdir = 'dist';

// Ensure the output directory exists
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}

// Copy the HTML file to the output directory, creating a complete package
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(outdir, 'index.html'));

esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: path.join(outdir, 'index.js'),
  jsx: 'automatic', // This is the crucial line that fixes the blank screen issue
  define: {
    // Vercel provides environment variables to the build process.
    // We read it here and embed it into the bundled JS file.
    'process.env.GEMINI_API_KEY': `"${process.env.GEMINI_API_KEY}"`,
  },
  // These packages are marked as external because they are loaded 
  // from a CDN via the importmap in index.html
  external: [
    'react',
    'react/jsx-runtime', // Added to support the automatic JSX transform
    'react-dom',
    'react-dom/client',
    'recharts',
    'xlsx',
    '@google/genai',
    'firebase/app',
    'firebase/auth',
    'firebase/*'
  ],
}).then(() => console.log('✅ Build successful! The \'dist\' folder is ready for deployment.'))
  .catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
  });