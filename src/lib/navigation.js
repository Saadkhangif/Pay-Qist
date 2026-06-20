export const PRIMARY_NAV_ITEMS = [
  { to: '/home', label: 'Home', shortLabel: 'Home', icon: 'Home', end: true, showInBottomNav: true, bottomNavOrder: 1 },
  {
    to: '/products',
    label: 'Products',
    shortLabel: 'Shop',
    icon: 'Package',
    showInBottomNav: true,
    bottomNavOrder: 2,
    alsoMatch: ['/product'],
  },
  {
    to: '/about',
    label: 'About Us',
    shortLabel: 'About',
    icon: 'Info',
    showInBottomNav: true,
    bottomNavOrder: 4,
    guestOnlyBottomNav: true,
  },
  {
    to: '/cart',
    label: 'Cart',
    shortLabel: 'Cart',
    icon: 'ShoppingCart',
    showInBottomNav: true,
    bottomNavOrder: 3,
    showCartBadge: true,
  },
  {
    to: '/account',
    label: 'My Account',
    shortLabel: 'Account',
    icon: 'User',
    authRequired: true,
    showInBottomNav: true,
    bottomNavOrder: 4,
    alsoMatch: ['/apply'],
  },
  { to: '/admin', label: 'Admin', icon: 'Shield', adminOnly: true, showInBottomNav: false },
];

export const FOOTER_QUICK_LINKS = [
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/home#how-it-works', label: 'How It Works' },
  { to: '/home#faq', label: 'FAQ' },
  { to: '/contact-us', label: 'Contact' },
  { to: '/account', label: 'My Account', authRequired: true },
];

const STATIC_PAGE_TITLES = {
  '/home': 'Home',
  '/products': 'Products',
  '/about': 'About Us',
  '/cart': 'Your Cart',
  '/account': 'My Account',
  '/admin': 'Admin',
  '/signup': 'Sign Up',
  '/complete-profile': 'Complete Profile',
  '/apply': 'Apply for Installment',
  '/contact-us': 'Contact Us',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/refund-and-return-policy': 'Refund & Returns',
};

const FOCUSED_FLOW_PREFIXES = ['/signup', '/complete-profile', '/apply'];

export function isNavActive(pathname, item) {
  if (item.end) {
    return pathname === item.to || pathname === '/';
  }

  if (item.alsoMatch?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export function getHeaderNavItems({ user, isAdmin }) {
  return PRIMARY_NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.authRequired && !user) return false;
    return true;
  });
}

export function getBottomNavItems({ user }) {
  return PRIMARY_NAV_ITEMS.filter((item) => {
    if (!item.showInBottomNav) return false;
    if (item.authRequired && !user) return false;
    if (item.guestOnlyBottomNav && user) return false;
    return true;
  }).sort((a, b) => (a.bottomNavOrder || 0) - (b.bottomNavOrder || 0));
}

export function getFooterQuickLinks({ user }) {
  return FOOTER_QUICK_LINKS.filter((item) => !item.authRequired || user);
}

export function getPageTitle(pathname) {
  if (STATIC_PAGE_TITLES[pathname]) {
    return STATIC_PAGE_TITLES[pathname];
  }

  if (pathname.startsWith('/product/')) {
    return 'Product Details';
  }

  const navItem = PRIMARY_NAV_ITEMS.find((item) => isNavActive(pathname, item));
  if (navItem) {
    return navItem.label;
  }

  return 'Page Not Found';
}

export function shouldHideBottomNav(pathname) {
  if (pathname.startsWith('/admin')) return true;
  return FOCUSED_FLOW_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
