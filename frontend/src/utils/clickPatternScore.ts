// clickPatternScore.ts

export interface ClickEvent {
    time: number;
    x: number;
    y: number;
    tag: string;
  }
  
  export function calculateClickPatternScore(clickEvents: ClickEvent[]): number {
    if (clickEvents.length < 2) return 1; // Not enough data to judge
  
    // ---- 1. Time Intervals & Entropy ----
    const intervals = clickEvents.slice(1).map((e, i) => e.time - clickEvents[i].time);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  
    const freqMap: Record<number, number> = {};
    intervals.forEach((val) => {
      freqMap[val] = (freqMap[val] || 0) + 1;
    });
  
    const entropy = Object.values(freqMap).reduce((sum, freq) => {
      const p = freq / intervals.length;
      return sum - p * Math.log2(p);
    }, 0);
    const normEntropy = Math.min(entropy / 3, 1); // Cap entropy at 3 bits
  
    // ---- 2. Click Tag Diversity ----
    const tagSet = new Set(clickEvents.map(e => e.tag));
    const tagDiversity = Math.min(tagSet.size / 4, 1); // Normalize with cap of 4 types
  
    // ---- 3. Spatial Spread Score ----
    const coords = clickEvents.map(({ x, y }) => [x, y]);
    const distances = coords.map(([x, y], i) => {
      if (i === 0) return 0;
      const [prevX, prevY] = coords[i - 1];
      return Math.hypot(x - prevX, y - prevY);
    });
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const spreadScore = avgDistance > 100 ? 1 : avgDistance / 100;
  
    // ---- 4. Final Weighted Score ----
    const finalScore =
      (normEntropy * 0.4) +
      (tagDiversity * 0.2) +
      (spreadScore * 0.4);
  
    return parseFloat(finalScore.toFixed(2));
  }
  
  // Optional: utility to track click events
  export function trackClickEvents(clickEvents: ClickEvent[]): void {
    window.addEventListener('click', (e) => {
      clickEvents.push({
        time: Date.now(),
        x: e.clientX,
        y: e.clientY,
        tag: (e.target as HTMLElement).tagName,
      });
    });
  } 
  
  // Sample test data
  export function mockClickEvents(): ClickEvent[] {
    return [
      { time: 1000, x: 50, y: 60, tag: 'BUTTON' },
      { time: 1800, x: 52, y: 63, tag: 'A' },
      { time: 2500, x: 300, y: 100, tag: 'DIV' },
      { time: 3900, x: 305, y: 95, tag: 'SPAN' },
    ];
  }
  
  // Sample usage
  if (typeof window === 'undefined') {
    const score = calculateClickPatternScore(mockClickEvents());
    console.log('Sample click pattern score:', score);
  }
  