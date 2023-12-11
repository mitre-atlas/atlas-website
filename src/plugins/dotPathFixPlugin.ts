import fs from 'fs';

// Plugin to allow dots in URLs (e.g 'tactics/AML.TA0000')
// https://github.com/vitejs/vite/issues/2415

const dotPathFixPlugin = () => ({
  name: 'dot-path-fix-plugin',
  configureServer: (system) => {
    system.middlewares.use((req,_,next) => {
      const reqPath = req.url.split('?', 2)[0];
      if (req.url.includes('AML.')) {
        console.log(req.url)
        // Construct new route path without dot
        const reqPath = req.url.split('.').join("");
        req.url = reqPath;
      }
      next();
    });
  }
});

export default dotPathFixPlugin;