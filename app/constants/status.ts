export const STATUS_CONFIG: Record<string, { label: string, color: string, bg: string, border: string }> = {
  'completed': {
    label: 'COMPLETED',
    color: '#3fb950',
    bg: 'rgba(63, 185, 80, 0.1)',
    border: 'rgba(63, 185, 80, 0.2)'
  },
  'in-progress': {
    label: 'IN PROGRESS',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.2)'
  },
  'backlog': {
    label: 'BACKLOG',
    color: '#8b949e',
    bg: 'rgba(139, 148, 158, 0.1)',
    border: 'rgba(139, 148, 158, 0.2)'
  }
};
