export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export const isDateToday = (dateString: string): boolean => {
  const date = new Date(dateString).toDateString();
  const today = new Date().toDateString();
  return date === today;
};

export const isDatePast = (dateString: string): boolean => {
  const date = new Date(dateString).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return date < today;
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    high: 'bg-danger/10 text-danger',
    urgent: 'bg-danger/15 text-danger',
  };
  return colors[priority] || 'bg-slate-100 text-text-secondary';
};

export const getPriorityValue = (priority: string): number => {
  const values: Record<string, number> = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };
  return values[priority] || 0;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    todo: 'bg-slate-100 text-text-primary',
    in_progress: 'bg-warning/10 text-warning',
    done: 'bg-success/10 text-success',
  };
  return colors[status] || 'bg-slate-100 text-text-secondary';
};

export const calculateCanvasPoint = (
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};

export const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  label?: string,
  fillColor = 'rgba(91, 92, 235, 0.2)',
  strokeColor = 'rgb(91, 92, 235)'
): void => {
  if (points.length === 0) return;

  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  points.forEach((point) => {
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  if (label && points.length > 0) {
    const firstPoint = points[0];
    ctx.fillStyle = '#1F2937';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(label, firstPoint.x + 10, firstPoint.y - 10);
  }
};
