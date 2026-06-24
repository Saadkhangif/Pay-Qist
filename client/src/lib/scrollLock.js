let lockCount = 0;
let previousPaddingRight = '';
let previousOverflow = '';
let previousTop = '';
let scrollY = 0;

export function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  previousOverflow = document.body.style.overflow;
  previousPaddingRight = document.body.style.paddingRight;
  previousTop = document.body.style.top;

  document.body.style.overflow = 'hidden';
  document.body.style.top = `-${scrollY}px`;
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
  document.body.style.top = previousTop;
  document.documentElement.classList.remove('scroll-locked');
  window.scrollTo(0, scrollY);
}
