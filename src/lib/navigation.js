export const PRIMARY_NAV_ITEMS = [
  { to: '/home', label: 'Home', shortLabel: 'Home', icon: 'Home', end: true, showInBottomNav: true },
  {
    to: '/products',
    label: 'Products',
    shortLabel: 'Products',
    icon: 'Package',
    showInBottomNav: true,
    alsoMatch: ['/product'],
  },
  { to: '/about', label: 'About Us', shortLabel: 'About', icon: 'Info', showInBottomNav: true },
  { to: '/cart', label: 'Cart', shortLabel: 'Cart', icon: 'ShoppingCart', showInBottomNav: true, showCartBadge: true },
  { to: '/admin', label: 'Admin', icon: 'Shield', adminOnly: true, showInBottomNav: false },
];

export const BOTTOM_NAV_ITEMS = PRIMARY_NAV_ITEMS.filter((item) => item.showInBottomNav);

const STATIC_PAGE_TITLES = {
  '/home': 'Home',
  '/products': 'Products',
  '/about': 'About Us',
  '/cart': 'Your Cart',
  '/admin': 'Admin',
  '/signup': 'Sign Up',
  '/complete-profile': 'Complete Profile',
  '/apply': 'Apply for Installment',
  '/contact-us': 'Contact Us',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/refund-and-return-policy': 'Refund & Returns',
};

export function isNavActive(pathname, item) {
  if (item.end) {
    return pathname === item.to || pathname === '/';
  }

  if (item.alsoMatch?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  return pathname === item.to || pathname.startsWith(`${item.to}/`);
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
  return pathname.startsWith('/admin');
}
