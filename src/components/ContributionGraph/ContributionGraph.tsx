import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { BASE_PATH } from '../../config';
import { logger } from '../../utils/logger';
import './ContributionGraph.css';

interface ContributionData {
  generatedAt: string;
  contributions: Record<string, number>;
  totalCommits: number;
}

interface DayData {
  date: string;
  count: number;
  level: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  date: string;
  count: number;
}

const DAYS_IN_MONTH = 30;
const TOOLTIP_OFFSET_Y = 60;

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] as const;

export function ContributionGraph() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    date: '',
    count: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const getLevel = useCallback((count: number): number => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  }, []);

  const formatDateString = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const days = useMemo((): DayData[] => {
    if (!data) return [];

    const days: DayData[] = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const todayStr = formatDateString(today);
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - DAYS_IN_MONTH + 1);
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < DAYS_IN_MONTH; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = formatDateString(date);

      if (dateStr > todayStr) {
        days.push({ date: '', count: 0, level: 0 });
        continue;
      }
      
      const count = data.contributions[dateStr] || 0;
      const level = getLevel(count);
      days.push({ date: dateStr, count, level });
    }

    return days;
  }, [data, getLevel, formatDateString]);

  const formatDate = useCallback((dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const weekday = WEEKDAYS[date.getDay()];
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${weekday}, ${year}年${month}${day}日`;
  }, []);

  const updateTooltipPosition = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - TOOLTIP_OFFSET_Y,
    };
  }, []);

  const handleDayMouseEnter = useCallback((e: React.MouseEvent, day: DayData) => {
    if (!day.date) return;

    const position = updateTooltipPosition(e);
    if (!position) return;

    setTooltip({
      visible: true,
      ...position,
      date: day.date,
      count: day.count,
    });
  }, [updateTooltipPosition]);

  const handleDayMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleDayMouseMove = useCallback((e: React.MouseEvent) => {
    if (!tooltip.visible) return;

    const position = updateTooltipPosition(e);
    if (!position) return;

    setTooltip((prev) => ({
      ...prev,
      ...position,
    }));
  }, [tooltip.visible, updateTooltipPosition]);

  useEffect(() => {
    fetch(`${BASE_PATH}/contributions.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json: ContributionData) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        logger.error('加载贡献数据失败', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="contribution-graph">
        <div className="contribution-graph-loading">加载中...</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="contribution-graph"
      onMouseMove={handleDayMouseMove}
      onMouseLeave={handleDayMouseLeave}
    >
      <div className="contribution-graph-container">
        <div className="contribution-graph-grid">
          {days.map((day, index) => (
            <div
              key={day.date || `empty-${index}`}
              className={`contribution-graph-day level-${day.level}`}
              data-date={day.date}
              data-count={day.count}
              onMouseEnter={(e) => handleDayMouseEnter(e, day)}
              onMouseLeave={handleDayMouseLeave}
            />
          ))}
        </div>
      </div>
      {tooltip.visible && tooltip.date && (
        <div
          className="contribution-graph-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className="contribution-graph-tooltip-content">
            <div className="contribution-graph-tooltip-count">
              {tooltip.count === 0 ? (
                <span>没有提交</span>
              ) : (
                <span>
                  <strong>{tooltip.count}</strong> 个提交
                </span>
              )}
            </div>
            <div className="contribution-graph-tooltip-date">
              {formatDate(tooltip.date)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

