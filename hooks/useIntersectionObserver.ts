// hooks/useIntersectionObserver.ts
"use client";

import { useState, useEffect, RefObject } from 'react';

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0.1, // How much of the element needs to be visible (0 to 1)
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false, // Stop observing after it becomes visible once
  }: Args = {},
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    // Do nothing if the element ref is not provided
    if (!node) return;

    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);

  return entry;
}

export default useIntersectionObserver;