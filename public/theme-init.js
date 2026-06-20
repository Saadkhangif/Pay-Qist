(function () {
  var stored = localStorage.getItem('payqist-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';
  if (theme === 'dark') document.documentElement.classList.add('dark');
  document.documentElement.style.colorScheme = theme;
})();
