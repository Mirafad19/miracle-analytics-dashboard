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

esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: path.join(outdir, 'index.js'),
  jsx: 'automatic',
  define: {
    // Vercel provides environment variables to the build process.
    // We read it here and embed it into the bundled JS file.
    'process.env.API_KEY': `"${process.env.API_KEY}"`,
  },
  // By removing the 'external' array, we tell esbuild to bundle
  // all dependencies (React, Firebase, etc.) into our output file.
  // This creates a self-contained application and is the fix for the blank screen.
}).then(() => console.log('✅ Build successful! The \'dist\' folder is ready for deployment.'))
  .catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
  });