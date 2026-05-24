export function register() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('ChoreWheel Service Worker registered successfully:', reg.scope);
        })
        .catch(err => {
          console.error('ChoreWheel Service Worker registration failed:', err);
        });
    });
  }
}
