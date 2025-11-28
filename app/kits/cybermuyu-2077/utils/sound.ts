/**
 * Synthesizes a "wooden block" style sound using Web Audio API.
 * This avoids the need for external assets and allows for dynamic pitch shifting.
 */
export const playWoodenFishSound = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const t = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Fundamental frequency for a wood block is usually mid-range
  // Adding a slight random variance to make it feel more organic/cyber
  const variance = Math.random() * 20 - 10;
  oscillator.frequency.setValueAtTime(800 + variance, t);
  oscillator.type = 'sine';

  // Envelope for the "thock" sound
  // Attack
  gainNode.gain.setValueAtTime(0, t);
  gainNode.gain.linearRampToValueAtTime(1, t + 0.01);
  // Decay (short and sharp)
  gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

  oscillator.start(t);
  oscillator.stop(t + 0.2);
};
