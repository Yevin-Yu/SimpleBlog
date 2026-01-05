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
  phase: number;
}

export function InkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const ripplesRef = useRef<Ripple[]>([]);
  const lastRippleTimeRef = useRef(0);
  const createRippleRef = useRef<((x: number, y: number, intensity?: number) => void) | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMouseRippleRef = useRef(0);

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
      const { BASE_MAX_RADIUS_RATIO, INITIAL_RADIUS, LIFETIME, BASE_SPEED, OPACITY } =
        RIPPLE_CONFIG;

      const baseMaxRadius = Math.max(canvas.width, canvas.height) * BASE_MAX_RADIUS_RATIO;
      const maxRadius = baseMaxRadius * sizeMultiplier + Math.random() * 50 * sizeMultiplier;
      const maxLife =
        (LIFETIME.min + Math.random() * (LIFETIME.max - LIFETIME.min)) * sizeMultiplier;
      const baseSpeed = BASE_SPEED.min + Math.random() * (BASE_SPEED.max - BASE_SPEED.min);
      const speed = baseSpeed * (1 + sizeMultiplier * 0.15);

      return {
        x,
        y,
        radius: INITIAL_RADIUS.min + Math.random() * (INITIAL_RADIUS.max - INITIAL_RADIUS.min),
        maxRadius,
        opacity:
          (OPACITY.min + Math.random() * (OPACITY.max - OPACITY.min)) * (0.85 + intensity * 0.15),
        life: maxLife,
        maxLife,
        speed,
        intensity,
        waveCount: getWaveCount(intensity),
        phase: Math.random() * Math.PI * 2,
      };
    };

    createRippleRef.current = (x: number, y: number, intensity: number = Math.random()) => {
      const rippleCount = getWaveCount(intensity);

      for (let i = 0; i < rippleCount; i++) {
        const ripple = createRipple(x, y, intensity);
        ripple.radius = i * (6 + intensity * 10);
        ripple.speed = (0.4 + i * 0.1) * (1 + intensity * 0.15);
        ripple.phase = i * Math.PI * 0.5;
        ripplesRef.current.push(ripple);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now();
      const { GENERATION_INTERVAL, HIGHLIGHT } = RIPPLE_CONFIG;

      // 自动生成涟漪
      if (
        currentTime - lastRippleTimeRef.current >
        GENERATION_INTERVAL.min +
          Math.random() * (GENERATION_INTERVAL.max - GENERATION_INTERVAL.min)
      ) {
        const centerX = Math.random() * canvas.width;
        const centerY = Math.random() * canvas.height;
        createRippleRef.current?.(centerX, centerY, Math.random());
        lastRippleTimeRef.current = currentTime;
      }

      // 更新和绘制涟漪
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += ripple.speed;
        ripple.life--;
        ripple.phase += 0.08;

        const lifeRatio = ripple.life / ripple.maxLife;
        const radiusRatio = ripple.radius / ripple.maxRadius;

        // 使用更自然的衰减曲线
        const lifeDecay = Math.pow(lifeRatio, 0.7);
        const radiusDecay = 1 - Math.pow(radiusRatio, 0.8);
        const waveModulation = Math.sin(ripple.phase) * 0.1 + 0.9;

        const currentOpacity = ripple.opacity * lifeDecay * radiusDecay * waveModulation;

        if (currentOpacity <= 0.005 || ripple.radius > ripple.maxRadius) {
          return false;
        }

        const baseLineWidth = (0.8 + ripple.intensity * 1.2) * (1 - radiusRatio * 0.7);

        for (let wave = 0; wave < ripple.waveCount; wave++) {
          const waveOffset = wave * (12 + ripple.intensity * 8);
          const waveRadius = ripple.radius - waveOffset * radiusRatio;
          if (waveRadius <= 0) continue;

          const waveOpacity = currentOpacity * (1 - wave * 0.2) * (1 - radiusRatio * 0.5);
          if (waveOpacity <= 0.005) continue;

          // 主波纹渐变 - 更柔和的边缘
          const gradient = ctx.createRadialGradient(
            ripple.x,
            ripple.y,
            waveRadius * 0.8,
            ripple.x,
            ripple.y,
            waveRadius * 1.15
          );

          const edgeOpacity = waveOpacity * 0.08;
          const midOpacity = waveOpacity * 0.6;
          const peakOpacity = waveOpacity * 0.85;

          gradient.addColorStop(0, `rgba(0, 0, 0, ${edgeOpacity})`);
          gradient.addColorStop(0.25, `rgba(0, 0, 0, ${midOpacity})`);
          gradient.addColorStop(0.45, `rgba(0, 0, 0, ${peakOpacity})`);
          gradient.addColorStop(0.55, `rgba(0, 0, 0, ${peakOpacity * 0.95})`);
          gradient.addColorStop(0.75, `rgba(0, 0, 0, ${midOpacity})`);
          gradient.addColorStop(1, `rgba(0, 0, 0, ${edgeOpacity})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = Math.max(0.3, baseLineWidth * (1 - wave * 0.2));
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2);
          ctx.stroke();

          // 添加高光效果（仅在波纹较新时）
          if (HIGHLIGHT.enabled && radiusRatio < 0.4 && wave === 0) {
            const highlightRadius = waveRadius * (1 + HIGHLIGHT.offset);
            const highlightGradient = ctx.createRadialGradient(
              ripple.x - highlightRadius * 0.3,
              ripple.y - highlightRadius * 0.3,
              0,
              ripple.x,
              ripple.y,
              highlightRadius
            );

            const highlightOpacity = waveOpacity * HIGHLIGHT.opacity * (1 - radiusRatio * 2);
            highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${highlightOpacity})`);
            highlightGradient.addColorStop(0.3, `rgba(255, 255, 255, ${highlightOpacity * 0.5})`);
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.strokeStyle = highlightGradient;
            ctx.lineWidth = baseLineWidth * 0.6;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, highlightRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // 中心水滴效果（仅在初期显示）
        if (radiusRatio < 0.25) {
          const centerSize = (3 + ripple.intensity * 3) * (1 - radiusRatio * 4);
          const centerGradient = ctx.createRadialGradient(
            ripple.x,
            ripple.y,
            0,
            ripple.x,
            ripple.y,
            centerSize
          );

          const centerOpacity = currentOpacity * 0.8 * (1 - radiusRatio * 3);
          centerGradient.addColorStop(0, `rgba(0, 0, 0, ${centerOpacity * 0.9})`);
          centerGradient.addColorStop(0.4, `rgba(0, 0, 0, ${centerOpacity * 0.5})`);
          centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = centerGradient;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, centerSize, 0, Math.PI * 2);
          ctx.fill();

          // 中心高光
          if (HIGHLIGHT.enabled) {
            const highlightGradient = ctx.createRadialGradient(
              ripple.x - centerSize * 0.3,
              ripple.y - centerSize * 0.3,
              0,
              ripple.x,
              ripple.y,
              centerSize * 0.8
            );

            const hlOpacity = centerOpacity * HIGHLIGHT.opacity * 1.5;
            highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${hlOpacity})`);
            highlightGradient.addColorStop(0.5, `rgba(255, 255, 255, ${hlOpacity * 0.4})`);
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = highlightGradient;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, centerSize * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const { MOUSE_MOVE } = RIPPLE_CONFIG;

    const handleClick = (e: MouseEvent) => {
      if (e.target === canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clickIntensity = 0.5 + Math.random() * 0.5;
        createRippleRef.current?.(x, y, clickIntensity);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!MOUSE_MOVE.enabled) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 计算鼠标移动距离
      const dx = x - mousePosRef.current.x;
      const dy = y - mousePosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      mousePosRef.current = { x, y };

      // 当移动距离超过阈值时创建微小涟漪
      if (distance > MOUSE_MOVE.minDistance) {
        const currentTime = Date.now();
        // 限制鼠标涟漪的生成频率
        if (currentTime - lastMouseRippleRef.current > 150) {
          // 限制鼠标涟漪的总数量
          const mouseRipples = ripplesRef.current.filter((r) => r.intensity < 0.3);
          if (mouseRipples.length < MOUSE_MOVE.maxCount) {
            createRippleRef.current?.(x, y, MOUSE_MOVE.intensity + Math.random() * 0.1);
          }
          lastMouseRippleRef.current = currentTime;
        }
      }
    };

    canvas.addEventListener('click', handleClick, true);
    canvas.addEventListener('mousemove', handleMouseMove, true);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick, true);
      canvas.removeEventListener('mousemove', handleMouseMove, true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-background" />;
}
