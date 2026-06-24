export function canViewPathname(auth, pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return false;
  }

  if (auth.role === 'admin') {
    return (
      pathname.startsWith('applications/') ||
      pathname.startsWith('uploads/') ||
      pathname.startsWith('avatars/')
    );
  }

  return (
    pathname.startsWith(`avatars/${auth.id}/`) ||
    pathname.includes(`/${auth.id}/`)
  );
}
