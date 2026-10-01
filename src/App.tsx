import { useState, useEffect } from 'react';
import './App.css';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { AICopilot } from '@/components/AICopilot';
import { CommandPalette } from '@/components/CommandPalette';
import { ArchCanvas } from '@/components/ArchCanvas';
import { Overview } from '@/components/views/Overview';
import { NewDesign } from '@/components/views/NewDesign';
import { Requirements } from '@/components/views/Requirements';
import { CapacityPlanner } from '@/components/views/CapacityPlanner';
import { DatabaseView } from '@/components/views/DatabaseView';
import { ApiDesign } from '@/components/views/ApiDesign';
import { TradeOffs } from '@/components/views/TradeOffs';
import { FailureSimulation } from '@/components/views/FailureSimulation';
import { InterviewMode } from '@/components/views/InterviewMode';
import { KnowledgeBase } from '@/components/views/KnowledgeBase';
import { Templates } from '@/components/views/Templates';
import { MyDesigns } from '@/components/views/MyDesigns';
import type { ViewKey } from '@/lib/types';
import { useTheme } from '@/lib/theme';

const BREADCRUMBS: Record<ViewKey, string[]> = {
  'overview': ['My Designs', 'Overview'],
  'new-design': ['New Design'],
  'my-designs': ['My Designs'],
  'templates': ['Templates'],
  'knowledge': ['Knowledge Base'],
  'interview': ['Interview Mode'],
  'architecture': ['My Designs', 'Instagram Clone', 'Architecture'],
  'requirements': ['My Designs', 'Instagram Clone', 'Requirements'],
  'apis': ['My Designs', 'Instagram Clone', 'APIs'],
  'database': ['My Designs', 'Instagram Clone', 'Database'],
  'capacity': ['My Designs', 'Instagram Clone', 'Capacity'],
  'tradeoffs': ['My Designs', 'Instagram Clone', 'Trade-offs'],
  'simulations': ['My Designs', 'Instagram Clone', 'Simulations'],
};

const AI_PANEL_VIEWS: ViewKey[] = [
  'architecture', 'requirements', 'apis', 'database', 'capacity', 'tradeoffs', 'simulations',
];

function App() {
  const [activeView, setActiveView] = useState<ViewKey>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [failureNode, setFailureNode] = useState<string | null>(null);
  const [version] = useState(0.8);
  const { toggleTheme } = useTheme();

  // Command palette keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-collapse AI panel on non-workspace views
  useEffect(() => {
    if (!AI_PANEL_VIEWS.includes(activeView)) {
      setAiCollapsed(true);
    }
  }, [activeView]);

  const handleNavigate = (view: ViewKey) => {
    setActiveView(view);
    if (view === 'simulations') setFailureNode(null);
  };

  const handleCommandAction = (action: string) => {
    switch (action) {
      case 'generate': setActiveView('new-design'); break;
      case 'simulate': setActiveView('simulations'); break;
      case 'export': break;
      case 'theme': toggleTheme(); break;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <Overview onNavigate={handleNavigate} onNewDesign={() => setActiveView('new-design')} />;
      case 'new-design': return <NewDesign onGenerate={() => {}} onNavigate={handleNavigate} />;
      case 'my-designs': return <MyDesigns onNavigate={handleNavigate} onNewDesign={() => setActiveView('new-design')} />;
      case 'templates': return <Templates onNavigate={handleNavigate} onUseTemplate={() => {}} />;
      case 'knowledge': return <KnowledgeBase />;
      case 'interview': return <InterviewMode />;
      case 'architecture': return <ArchCanvas selectedNodeId={selectedNode} onSelectNode={setSelectedNode} failureNode={failureNode} />;
      case 'requirements': return <Requirements />;
      case 'apis': return <ApiDesign />;
      case 'database': return <DatabaseView />;
      case 'capacity': return <CapacityPlanner />;
      case 'tradeoffs': return <TradeOffs />;
      case 'simulations': return <FailureSimulation onNavigate={handleNavigate} failureNode={failureNode} onSetFailure={setFailureNode} />;
      default: return <Overview onNavigate={handleNavigate} onNewDesign={() => setActiveView('new-design')} />;
    }
  };

  const showAiPanel = AI_PANEL_VIEWS.includes(activeView);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-base)]">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          breadcrumb={BREADCRUMBS[activeView]}
          onCommandPalette={() => setCommandOpen(true)}
          version={version}
        />

        {/* Workspace */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0 overflow-hidden">
            {renderView()}
          </div>

          {/* AI Copilot */}
          {showAiPanel && (
            <AICopilot
              collapsed={aiCollapsed}
              onToggle={() => setAiCollapsed((c) => !c)}
            />
          )}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={handleNavigate}
        onAction={handleCommandAction}
      />
    </div>
  );
}

export default App;
