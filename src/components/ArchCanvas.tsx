import { useRef, useState, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Grid3x3, MousePointer2, Hand } from 'lucide-react';
import type { ArchNode, ArchConnection } from '@/lib/types';
import { ARCH_NODES, ARCH_CONNECTION, COMPONENT_LIBRARY } from '@/lib/mock-data';
import { NODE_ICONS, NODE_COLORS, STATUS_COLORS } from '@/lib/node-icons';
import { cx } from '@/lib/helpers';

interface ArchCanvasProps {
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  failureNode?: string | null;
}

const NODE_W = 200;
const NODE_H = 80;
const GRID = 20;

export function ArchCanvas({ selectedNodeId, onSelectNode, failureNode }: ArchCanvasProps) {
  const [nodes, setNodes] = useState<ArchNode[]>(ARCH_NODES);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'pan'>('select');
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (tool === 'pan') return;
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId)!;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom - node.x;
    const y = (e.clientY - rect.top - pan.y) / zoom - node.y;
    setDragOffset({ x, y });
    setDragging(nodeId);
    onSelectNode(nodeId);
  }, [nodes, pan, zoom, tool, onSelectNode]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (tool === 'pan' || e.button === 1) {
      setPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else {
      onSelectNode(null);
    }
  }, [tool, pan, onSelectNode]);

  useEffect(() => {
    if (!dragging && !panning) return;
    const handleMove = (e: MouseEvent) => {
      if (dragging) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
        const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;
        setNodes((prev) =>
          prev.map((n) =>
            n.id === dragging
              ? { ...n, x: Math.round(x / GRID) * GRID, y: Math.round(y / GRID) * GRID }
              : n
          )
        );
      } else if (panning) {
        setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      }
    };
    const handleUp = () => {
      setDragging(null);
      setPanning(false);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, panning, dragOffset, pan, panStart, zoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.4, Math.min(2, z + delta)));
  }, []);

  const connections: ArchConnection[] = ARCH_CONNECTION;
  const getNode = (id: string) => nodes.find((n) => n.id === id);

  // Connection path calculation
  const getConnectionPath = (conn: ArchConnection) => {
    const from = getNode(conn.from);
    const to = getNode(conn.to);
    if (!from || !to) return '';
    const x1 = from.x + from.width / 2;
    const y1 = from.y + from.height;
    const x2 = to.x + to.width / 2;
    const y2 = to.y;
    const dy = y2 - y1;
    const cp = Math.abs(dy) * 0.5;
    return `M ${x1} ${y1} C ${x1} ${y1 + cp}, ${x2} ${y2 - cp}, ${x2} ${y2}`;
  };

  // Horizontal connections (same row)
  const getHConnectionPath = (conn: ArchConnection) => {
    const from = getNode(conn.from);
    const to = getNode(conn.to);
    if (!from || !to) return '';
    const x1 = from.x + from.width;
    const y1 = from.y + from.height / 2;
    const x2 = to.x;
    const y2 = to.y + to.height / 2;
    const dx = x2 - x1;
    const cp = Math.abs(dx) * 0.4;
    return `M ${x1} ${y1} C ${x1 + cp} ${y1}, ${x2 - cp} ${y2}, ${x2} ${y2}`;
  };

  const isHorizontal = (conn: ArchConnection) => {
    const from = getNode(conn.from);
    const to = getNode(conn.to);
    if (!from || !to) return false;
    return Math.abs(from.y - to.y) < 30;
  };

  return (
    <div className="flex h-full">
      {/* Component Library */}
      <div className="w-44 border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-y-auto shrink-0">
        <div className="px-3 py-2.5 border-b border-[var(--border-subtle)]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Components</span>
        </div>
        {COMPONENT_LIBRARY.map((group) => (
          <div key={group.category} className="py-2">
            <div className="px-3 pb-1">
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">{group.category}</span>
            </div>
            {group.items.map((item) => {
              const Icon = NODE_ICONS[item.type];
              const color = NODE_COLORS[item.type];
              return (
                <button
                  key={item.label}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors group"
                >
                  <Icon size={13} strokeWidth={1.6} style={{ color }} />
                  <span className="text-[11px] font-medium">{item.label}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] text-[var(--text-muted)]">+</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative flex-1 overflow-hidden bg-grid-dots"
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        style={{ cursor: tool === 'pan' ? (panning ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* Canvas content */}
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                width: '2000px', height: '1200px',
                backgroundImage: 'radial-gradient(var(--grid-dot) 1px, transparent 1px)',
                backgroundSize: `${GRID}px ${GRID}px`,
              }}
            />
          )}

          {/* Connections SVG */}
          <svg className="absolute top-0 left-0 pointer-events-none" style={{ width: '2000px', height: '1200px', overflow: 'visible' }}>
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="var(--border-strong)" />
              </marker>
              <marker id="arrowhead-accent" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="var(--accent-primary)" />
              </marker>
              <marker id="arrowhead-error" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="var(--error)" />
              </marker>
            </defs>
            {connections.map((conn) => {
              const path = isHorizontal(conn) ? getHConnectionPath(conn) : getConnectionPath(conn);
              const isFailed = failureNode && (conn.from === failureNode || conn.to === failureNode);
              const isSelected = selectedNodeId && (conn.from === selectedNodeId || conn.to === selectedNodeId);
              return (
                <g key={conn.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke={isFailed ? 'var(--error)' : isSelected ? 'var(--accent-primary)' : 'var(--border-strong)'}
                    strokeWidth={isSelected ? 1.5 : 1}
                    strokeDasharray={conn.animated ? '5 5' : isFailed ? '4 4' : undefined}
                    markerEnd={`url(#${isFailed ? 'arrowhead-error' : isSelected ? 'arrowhead-accent' : 'arrowhead'})`}
                    className={cx(conn.animated && !isFailed && 'animate-connection-flow', isFailed && 'animate-failure-pulse')}
                    opacity={isFailed ? 0.6 : 1}
                  />
                  {conn.label && (
                    <text
                      x={(() => {
                        const from = getNode(conn.from);
                        const to = getNode(conn.to);
                        if (!from || !to) return 0;
                        return (from.x + from.width / 2 + to.x + to.width / 2) / 2;
                      })()}
                      y={(() => {
                        const from = getNode(conn.from);
                        const to = getNode(conn.to);
                        if (!from || !to) return 0;
                        return (from.y + from.height + to.y) / 2;
                      })()}
                      fill="var(--text-muted)"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                      dy="-2"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = NODE_ICONS[node.category];
            const color = NODE_COLORS[node.category];
            const statusColor = STATUS_COLORS[node.status];
            const isSelected = selectedNodeId === node.id;
            const isFailed = failureNode === node.id;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                className={cx(
                  'absolute animate-node-appear select-none transition-shadow',
                  tool === 'select' && 'cursor-move'
                )}
                style={{
                  left: node.x, top: node.y, width: node.width, height: node.height,
                }}
              >
                <div
                  className={cx(
                    'relative w-full h-full bg-[var(--bg-elevated)] border transition-all',
                    isSelected
                      ? 'border-[var(--accent-primary)] glow-accent'
                      : isFailed
                      ? 'border-[var(--error)]'
                      : 'border-[var(--border-default)]'
                  )}
                >
                  {/* Corner marks */}
                  <span className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-[var(--accent-primary)]" />
                  <span className="absolute -top-px -right-px w-1.5 h-1.5 border-t border-r border-[var(--accent-primary)]" />
                  <span className="absolute -bottom-px -left-px w-1.5 h-1.5 border-b border-l border-[var(--accent-primary)]" />
                  <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-[var(--accent-primary)]" />

                  <div className="flex items-start gap-2 px-3 py-2">
                    <Icon size={14} strokeWidth={1.6} style={{ color }} className="shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-semibold tracking-tight text-[var(--text-primary)] truncate">{node.label}</span>
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: isFailed ? 'var(--error)' : statusColor }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)] truncate">{node.subtitle}</span>
                      <span className="font-mono text-[9px] text-[var(--text-muted)] mt-1 truncate">{node.metadata}</span>
                    </div>
                  </div>
                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px]"
                    style={{
                      width: isFailed ? '100%' : '30%',
                      background: isFailed ? 'var(--error)' : color,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Canvas overlay controls */}
        <div className="absolute top-3 left-3 flex items-center gap-1">
          <button
            onClick={() => setTool('select')}
            className={cx(
              'w-7 h-7 flex items-center justify-center border transition-colors',
              tool === 'select'
                ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)] text-[var(--accent-primary)]'
                : 'border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
            title="Select tool"
          >
            <MousePointer2 size={14} strokeWidth={1.6} />
          </button>
          <button
            onClick={() => setTool('pan')}
            className={cx(
              'w-7 h-7 flex items-center justify-center border transition-colors',
              tool === 'pan'
                ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)] text-[var(--accent-primary)]'
                : 'border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
            title="Pan tool"
          >
            <Hand size={14} strokeWidth={1.6} />
          </button>
          <div className="w-px h-5 bg-[var(--border-default)] mx-1" />
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={cx(
              'w-7 h-7 flex items-center justify-center border transition-colors',
              showGrid
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            )}
            title="Toggle grid"
          >
            <Grid3x3 size={14} strokeWidth={1.6} />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))} className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ZoomOut size={14} strokeWidth={1.6} />
          </button>
          <span className="font-mono text-[10px] text-[var(--text-secondary)] min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ZoomIn size={14} strokeWidth={1.6} />
          </button>
          <div className="w-px h-4 bg-[var(--border-default)]" />
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Reset view"
          >
            <Maximize size={14} strokeWidth={1.6} />
          </button>
        </div>

        {/* Minimap */}
        <div className="absolute bottom-3 right-3 w-32 h-20 bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
          <div className="absolute top-1 left-1 font-mono text-[8px] uppercase tracking-wider text-[var(--text-muted)]">MINIMAP</div>
          <svg viewBox="0 0 1000 600" className="w-full h-full">
            {connections.map((conn) => {
              const from = getNode(conn.from);
              const to = getNode(conn.to);
              if (!from || !to) return null;
              return (
                <line
                  key={conn.id}
                  x1={from.x + from.width / 2} y1={from.y + from.height / 2}
                  x2={to.x + to.width / 2} y2={to.y + to.height / 2}
                  stroke="var(--border-strong)" strokeWidth="2"
                />
              );
            })}
            {nodes.map((node) => (
              <rect
                key={node.id}
                x={node.x} y={node.y}
                width={node.width} height={node.height}
                fill={selectedNodeId === node.id ? 'var(--accent-primary)' : 'var(--bg-surface-2)'}
                stroke="var(--border-default)" strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        {/* Canvas label */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-0.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">ARCHITECTURE CANVAS</span>
          <span className="font-mono text-[9px] text-[var(--text-muted)]">{nodes.length} nodes · {connections.length} connections</span>
        </div>
      </div>
    </div>
  );
}
