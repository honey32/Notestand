interface WakeLock {
  release(): void;
}

declare interface Navigator {
  wakeLock?: {
    request(s: string): Promise<WakeLock>;
  };
}
