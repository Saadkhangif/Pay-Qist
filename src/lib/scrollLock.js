let lockCount = 0;
let previousPaddingRight = '';
let previousOverflow = '';

export function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  previousOverflow = document.body.style.overflow;
  previousPaddingRight = document.body.style.paddingRight;

  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  document.documentElement.classList.add('scroll-locked');
}

export function unlockScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  document.body.style.overflow = previousOverflow;
  document.body.style.paddingRight = previousPaddingRight;
  document.documentElement.classList.remove('scroll-locked');
}
