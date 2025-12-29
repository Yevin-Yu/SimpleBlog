import { useEffect, useRef } from 'react';
import { RIPPLE_CONFIG, RIPPLE_SIZE_MULTIPLIERS } from '../../utils/ripple.config';
import './InkBackground.css';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
  maxLife: number;
  speed: number;
  intensity: number;
  waveCount: number;
}

export function InkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const ripplesRef = useRef<Ripple[]>([]);
  const lastRippleTimeRef = useRef(0);
  const createRippleRef = useRef<((x: number, y: number, intensity?: number) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getSizeMultiplier = (intensity: number): number => {
      const { small, medium, large } = RIPPLE_SIZE_MULTIPLIERS;
      const { INTENSITY_THRESHOLDS } = RIPPLE_CONFIG;
      
      if (intensity < INTENSITY_THRESHOLDS.small) {
        return small.min + intensity * (small.max - small.min);
      }
      if (intensity < INTENSITY_THRESHOLDS.medium) {
        return medium.min + (intensity - INTENSITY_THRESHOLDS.small) * (medium.max - medium.min);
      }
      return large.min + (intensity - INTENSITY_THRESHOLDS.medium) * (large.max - large.min);
    };

    const getWaveCount = (intensity: number): number => {
      const { INTENSITY_THRESHOLDS, WAVE_COUNT } = RIPPLE_CONFIG;
      if (intensity > INTENSITY_THRESHOLDS.medium) return WAVE_COUNT.large;
      return WAVE_COUNT.medium;
    };

    const createRipple = (x: number, y: number, intensity: number = Math.random()): Ripple => {
      const sizeMultiplier = getSizeMultiplier(intensity);
      const { BASE_MAX_RADIUS_RATIO, INITIAL_RADIUS, LIFETIME, BASE_SPEED, OPACITY } = RIPPLE_CONFIG;
      
      const baseMaxRadius = Math.max(canvas.width, canvas.height) * BASE_MAX_RADIUS_RATIO;
      const maxRadius = baseMaxRadius * sizeMultiplier + Math.random() * 40 * sizeMultiplier;
      const maxLife = (LIFETIME.min + Math.random() * (LIFETIME.max - LIFETIME.min)) * sizeMultiplier;
      const baseSpeed = BASE_SPEED.min + Math.random() * (BASE_SPEED.max - BASE_SPEED.min);
      const speed = baseSpeed * (1 + sizeMultiplier * 0.2);
      
      return {
        x,
        y,
        radius: INITIAL_RADIUS.min + Math.random() * (INITIAL_RADIUS.max - INITIAL_RADIUS.min),
        maxRadius,
        opacity: (OPACITY.min + Math.random() * (OPACITY.max - OPACITY.min)) * (0.8 + intensity * 0.2),
        life: maxLife,
        maxLife,
        speed,
        intensity,
        waveCount: getWaveCount(intensity),
      };
    };

    createRippleRef.current = (x: number, y: number, intensity: number = Math.random()) => {
      const rippleCount = getWaveCount(intensity);
      
      for (let i = 0; i < rippleCount; i++) {
        const ripple = createRipple(x, y, intensity);
        ripple.radius = i * (8 + intensity * 8);
        ripple.speed = (0.5 + i * 0.08) * (1 + intensity * 0.2);
        ripplesRef.current.push(ripple);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      const { GENERATION_INTERVAL } = RIPPLE_CONFIG;
      
      if (currentTime - lastRippleTimeRef.current > GENERATION_INTERVAL.min + Math.random() * (GENERATION_INTERVAL.max - GENERATION_INTERVAL.min)) {
        const centerX = Math.random() * canvas.width;
        const centerY = Math.random() * canvas.height;
        createRippleRef.current?.(centerX, centerY, Math.random());
        lastRippleTimeRef.current = currentTime;
      }

      // 更新和绘制涟漪
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += ripple.speed;
        ripple.life--;
        
        const lifeRatio = ripple.life / ripple.maxLife;
        const radiusRatio = ripple.radius / ripple.maxRadius;
        const currentOpacity = ripple.opacity * lifeRatio * (1 - radiusRatio * 0.4);
        
        if (currentOpacity <= 0 || ripple.radius > ripple.maxRadius) {
          return false;
        }

        const baseLineWidth = (1 + ripple.intensity * 1.5) * (1 - radiusRatio * 0.8);
        
        for (let wave = 0; wave < ripple.waveCount; wave++) {
          const waveRadius = ripple.radius - wave * (ripple.radius / ripple.waveCount * 0.25);
          if (waveRadius <= 0) continue;
          
          const waveOpacity = currentOpacity * (1 - wave * 0.3) * (1 - radiusRatio * 0.6);
          if (waveOpacity <= 0) continue;
          
          const gradient = ctx.createRadialGradient(
            ripple.x,
            ripple.y,
            waveRadius * 0.85,
            ripple.x,
            ripple.y,
            waveRadius * 1.1
          );
          
          const edgeOpacity = waveOpacity * 0.15;
          const midOpacity = waveOpacity * 0.7;
          const peakOpacity = waveOpacity * 0.9;
          gradient.addColorStop(0, `rgba(0, 0, 0, ${edgeOpacity})`);
          gradient.addColorStop(0.2, `rgba(0, 0, 0, ${midOpacity})`);
          gradient.addColorStop(0.5, `rgba(0, 0, 0, ${peakOpacity})`);
          gradient.addColorStop(0.8, `rgba(0, 0, 0, ${midOpacity})`);
          gradient.addColorStop(1, `rgba(0, 0, 0, ${edgeOpacity})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = Math.max(0.5, baseLineWidth * (1 - wave * 0.25));
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (radiusRatio < 0.2) {
          const centerSize = (4 + ripple.intensity * 4) * (1 - radiusRatio);
          const centerGradient = ctx.createRadialGradient(
            ripple.x,
            ripple.y,
            0,
            ripple.x,
            ripple.y,
            centerSize
          );
          centerGradient.addColorStop(0, `rgba(0, 0, 0, ${currentOpacity * 0.7})`);
          centerGradient.addColorStop(0.5, `rgba(0, 0, 0, ${currentOpacity * 0.4})`);
          centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = centerGradient;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, centerSize, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (e: MouseEvent) => {
      if (e.target === canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clickIntensity = 0.4 + Math.random() * 0.4;
        createRippleRef.current?.(x, y, clickIntensity);
      }
    };

    canvas.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick, true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-background" />;
}
