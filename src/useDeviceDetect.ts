import {
  useEffect,
  useState,
} from 'react';

/**
 * The type of device detected.
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Device detection information.
 */
export interface DeviceInfo {
  /** Whether the device is a mobile phone */
  isMobile: boolean;
  /** Whether the device is a tablet */
  isTablet: boolean;
  /** Whether the device is a desktop */
  isDesktop: boolean;
  /** The detected device type */
  device: DeviceType;
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const MOBILE_UA_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function detectDevice(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const isMobileUA = MOBILE_UA_REGEX.test(navigator.userAgent);

  if (width < MOBILE_BREAKPOINT) {
    return 'mobile';
  }

  if (width <= TABLET_BREAKPOINT || (isMobileUA && width <= TABLET_BREAKPOINT)) {
    return 'tablet';
  }

  // Large-screen mobile UA (e.g. iPad in landscape) treated as tablet
  if (isMobileUA) {
    return 'tablet';
  }

  return 'desktop';
}

function buildDeviceInfo(device: DeviceType): DeviceInfo {
  return {
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    device,
  };
}

/**
 * useDeviceDetect hook
 *
 * Detects whether the current device is a mobile phone, tablet, or desktop
 * using a combination of viewport width and user agent string. Automatically
 * updates when the window is resized.
 *
 * @returns Device detection information
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, device } = useDeviceDetect();
 *
 * if (isMobile) {
 *   return <MobileLayout />;
 * }
 *
 * return <DesktopLayout />;
 * ```
 */
export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() =>
    buildDeviceInfo(detectDevice()),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newDevice = detectDevice();
        setDeviceInfo((prev) => {
          if (prev.device === newDevice) return prev;
          return buildDeviceInfo(newDevice);
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceInfo;
}
