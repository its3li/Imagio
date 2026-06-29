import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ADSENSE_CLIENT = 'ca-pub-8379022414897462';
const ADSENSE_SCRIPT_ID = 'imagio-adsense-script';

const adEligiblePaths = [
  /^\/guides\/[a-z0-9-]+$/,
];

function isAdEligiblePath(pathname: string) {
  return adEligiblePaths.some((pattern) => pattern.test(pathname));
}

export function AdSenseScript() {
  const { pathname } = useLocation();

  useEffect(() => {
    const existingScript = document.getElementById(ADSENSE_SCRIPT_ID);

    if (!isAdEligiblePath(pathname)) {
      existingScript?.remove();
      return;
    }

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }, [pathname]);

  return null;
}
