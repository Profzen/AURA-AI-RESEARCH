import React, { useState } from "react";
import {
  History,
  Trash2,
  Search,
  MessageSquare,
  BookOpen,
  Cpu,
  Folder,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

export interface ConversationItem {
  id: string;
  title: string;
  timestamp: Date | string;
  messageCount: number;
}

interface HistorySidebarProps {
  conversations: ConversationItem[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onClearHistory: () => void;
  onDeleteConversation?: (id: string) => void;
}

/**
 * Enhanced HistorySidebar
 * - Adds top navigation sections: Dashboard, Projects, AI Assistant, Library, History
 * - History can be toggled to show/hide the conversation list (dropdown-like)
 * - Clicking other sections shows a rich preview (placeholder content that you can adapt)
 *
 * The component is kept self-contained for easy integration. It uses the same
 * visual patterns as the original file and keeps compatibility with the props.
 */
export function HistorySidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onClearHistory,
  onDeleteConversation,
}: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  // UI state for the sidebar sections
  const [selectedSection, setSelectedSection] = useState<
    "dashboard" | "projects" | "assistant" | "library" | "history"
  >("dashboard");

  // When history section is selected, we allow toggling the list visibility
  const [showHistoryList, setShowHistoryList] = useState(true);

  // Modal state to cover the chat area on the right
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<
    "dashboard" | "projects" | "assistant" | "library" | null
  >(null);

  // Local state for example project/library/assistant data (mocked for demo)
  const [projects, setProjects] = useState([
    { id: "p-1", name: "Research AI", desc: "Scientific assistant workspace", members: 3, lastUpdated: "2 days ago" },
    { id: "p-2", name: "Mobile UX", desc: "Prototype mobile flows", members: 2, lastUpdated: "1 week ago" },
  ]);
  const [libraryItems, setLibraryItems] = useState([
    { id: "l-1", title: "Summarize Paper Prompt", type: "prompt", tags: ["summary", "paper"] },
    { id: "l-2", title: "Research Template", type: "template", tags: ["template", "report"] },
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");

  // Assistant state
  const [assistantPresets, setAssistantPresets] = useState([
    { id: 'ap-1', name: 'Quick Summary', prompt: 'Summarize the document in 5 bullet points.' },
    { id: 'ap-2', name: 'Extract Methods', prompt: 'List the methods used and their input/output.' },
  ]);
  const [assistantHistory, setAssistantHistory] = useState<Array<{ id: string; prompt: string; result: string; date: string }>>([]);

  // filter conversations by title or other fields if needed
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---------- Modal content components (exhaustive and interactive) ----------
  // Note: layout is responsive: on mobile the modal is full-screen, on desktop it covers the right area
  const ModalWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="fixed top-0 bottom-0 right-0 left-0 md:left-[320px] bg-popover z-50 border-l border-border shadow-lg">
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <span className="text-sm text-muted-foreground">(Preview)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setModalOpen(false); setModalSection(null); }}>
              Close
            </Button>
          </div>
        </div>
        <div className="p-4 overflow-auto flex-1">{children}</div>
      </div>
    </div>
  );

  // Utility small card used in dashboard
  const StatCard: React.FC<{ title: string; value: string; hint?: string }> = ({ title, value, hint }) => (
    <div className="p-3 border rounded-lg bg-gradient-to-b from-white to-slate-50">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-2 font-semibold text-lg">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );

  const DashboardModal = () => (
    <ModalWrapper title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active conversations" value={`${conversations.length}`} hint="Conversations in this workspace" />
        <StatCard title="Saved prompts" value={`${libraryItems.length}`} hint="Useful templates & prompts" />
        <StatCard title="Projects" value={`${projects.length}`} hint="Workspaces and collaborators" />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium">Recent conversations</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {conversations.slice(0, 8).map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.messageCount} messages — {new Date(c.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-xs text-muted-foreground">View</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium">Activity feed</h4>
          <div className="mt-3 text-sm text-muted-foreground space-y-2">
            <div>• New prompt saved: "Summarize Paper Prompt" — 3 hours ago</div>
            <div>• Project "Research AI" updated — 1 day ago</div>
            <div>• Export completed — 2 days ago</div>
          </div>
        </div>
      </div>

      <div className="mt-6 border rounded-lg p-4">
        <h4 className="font-medium">Quick charts</h4>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="h-36 border rounded flex items-center justify-center text-sm text-muted-foreground">[Chart placeholder: messages / week]</div>
          <div className="h-36 border rounded flex items-center justify-center text-sm text-muted-foreground">[Chart placeholder: prompt usage]</div>
        </div>
      </div>
    </ModalWrapper>
  );

  const ProjectsModal = () => (
    <ModalWrapper title="Projects">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Your Projects</h4>
            <div className="text-xs text-muted-foreground">{projects.length}</div>
          </div>

          <ul className="mt-3 space-y-2 text-sm">
            {projects.map((p) => (
              <li key={p.id} className={`p-2 rounded transition-colors cursor-pointer ${selectedProjectId === p.id ? 'bg-primary/10 border' : 'hover:bg-accent'}`} onClick={() => setSelectedProjectId(p.id)}>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.desc}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.members} members — {p.lastUpdated}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <Input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="New project name" className="mb-2" />
            <Button size="sm" onClick={() => { if (!newProjectName) return; setProjects((s) => [...s, { id: `p-${Date.now()}`, name: newProjectName, desc: 'Created project', members: 1, lastUpdated: 'now' }]); setNewProjectName(''); }}>Create</Button>
          </div>
        </div>

        <div className="flex-1 border rounded-lg p-4">
          {selectedProjectId ? (
            (() => {
              const p = projects.find((x) => x.id === selectedProjectId)!;
              return (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{p.name}</h4>
                      <div className="text-xs text-muted-foreground">Members: {p.members}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Open Workspace</Button>
                      <Button variant="ghost" size="sm">Export</Button>
                      <Button variant="ghost" size="sm">Settings</Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-3">
                      <div className="text-xs text-muted-foreground">Recent files</div>
                      <ul className="mt-2 text-sm space-y-1">
                        <li>• literature_review.pdf</li>
                        <li>• experiment_results.csv</li>
                        <li>• prompts.json</li>
                      </ul>
                    </div>
                    <div className="border rounded p-3">
                      <div className="text-xs text-muted-foreground">Tasks</div>
                      <ul className="mt-2 text-sm space-y-1">
                        <li>• Clean dataset</li>
                        <li>• Run baseline model</li>
                        <li>• Draft paper intro</li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-sm text-muted-foreground">Select a project to see details and workspace preview.</div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );

  const AssistantModal = () => {
    const [mode, setMode] = useState<'researcher'|'marketer'|'student'>('researcher');
    const [prompt, setPrompt] = useState('Summarize the main contributions of the paper in 3 bullet points.');
    const [results, setResults] = useState<string | null>(null);
    const [temperature, setTemperature] = useState(0.7);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    const runAssistant = () => {
      // mock run: store into assistantHistory and show result
      const id = `run-${Date.now()}`;
      const simulated = `(Mode: ${mode}, Temp: ${temperature})
Generated output for prompt:

${prompt}`;
      setResults(simulated);
      setAssistantHistory((s) => [{ id, prompt, result: simulated, date: new Date().toLocaleString() }, ...s]);
    };

    const savePreset = (name: string) => {
      setAssistantPresets((s) => [...s, { id: `ap-${Date.now()}`, name, prompt }]);
    };

    const sendToChat = (text: string) => {
      // Ideally this would call a prop to insert into main chat; here we simulate by adding to history
      const id = `send-${Date.now()}`;
      setAssistantHistory((s) => [{ id, prompt: `Sent to chat: ${text}`, result: '', date: new Date().toLocaleString() }, ...s]);
      setModalOpen(false);
      setModalSection(null);
    };

    return (
      <ModalWrapper title="AI Assistant">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-1 border rounded-lg p-3">
            <h5 className="font-medium">Modes & Presets</h5>
            <div className="mt-3 flex flex-col gap-2">
              <Button size="sm" variant={mode==='researcher'?undefined:'ghost'} onClick={() => setMode('researcher')}>Researcher</Button>
              <Button size="sm" variant={mode==='marketer'?undefined:'ghost'} onClick={() => setMode('marketer')}>Marketer</Button>
              <Button size="sm" variant={mode==='student'?undefined:'ghost'} onClick={() => setMode('student')}>Student</Button>
            </div>

            <div className="mt-4">
              <h6 className="text-xs text-muted-foreground">Presets</h6>
              <ul className="mt-2 space-y-2">
                {assistantPresets.map((p) => (
                  <li key={p.id} className={`p-2 rounded cursor-pointer ${selectedPreset === p.id ? 'bg-primary/10' : 'hover:bg-accent'}`} onClick={() => { setSelectedPreset(p.id); setPrompt(p.prompt); }}>{p.name}</li>
                ))}
              </ul>
              <div className="mt-3">
                <Button size="sm" onClick={() => savePreset(prompt)}>Save current as preset</Button>
              </div>
            </div>
          </div>

          <div className="col-span-2 border rounded-lg p-3">
            <h5 className="font-medium">Prompt</h5>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-32 mt-2 p-2 border rounded" />

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Temperature</div>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
                <div className="text-xs">{temperature}</div>
              </div>

              <Button size="sm" onClick={runAssistant}>Run</Button>
              <Button variant="ghost" size="sm" onClick={() => { setPrompt(''); setResults(null); }}>Clear</Button>
              <Button variant="ghost" size="sm" onClick={() => sendToChat(prompt)}>Send to chat</Button>
            </div>

            {results && (
              <div className="mt-4">
                <h6 className="font-medium">Result</h6>
                <pre className="mt-2 p-3 border rounded text-sm whitespace-pre-wrap">{results}</pre>
              </div>
            )}

            <div className="mt-4 border-t pt-3">
              <h6 className="font-medium">History of runs</h6>
              <ul className="mt-2 text-sm space-y-2 text-muted-foreground">
                {assistantHistory.map((h) => (
                  <li key={h.id} className="border rounded p-2">
                    <div className="font-medium">{h.date}</div>
                    <div className="text-xs">{h.prompt}</div>
                    <div className="text-xs mt-2 whitespace-pre-wrap">{h.result}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ModalWrapper>
    );
  };

  const LibraryModal = () => {
    const [selectedLibId, setSelectedLibId] = useState<string | null>(null);
    const [libSearch, setLibSearch] = useState('');

    const filtered = libraryItems.filter(l => l.title.toLowerCase().includes(libSearch.toLowerCase()) || l.tags?.some(tag => tag.includes(libSearch.toLowerCase())));

    return (
      <ModalWrapper title="Library">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Saved items</h4>
              <div className="text-xs text-muted-foreground">{libraryItems.length}</div>
            </div>

            <div className="mt-3">
              <Input value={libSearch} onChange={(e) => setLibSearch(e.target.value)} placeholder="Search library..." className="mb-2" />
            </div>

            <ul className="space-y-2 text-sm">
              {filtered.map((l) => (
                <li key={l.id} className={`p-2 rounded hover:bg-accent cursor-pointer ${selectedLibId === l.id ? 'bg-primary/10 border' : ''}`} onClick={() => setSelectedLibId(l.id)}>
                  <div className="font-medium">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.type} • {l.tags?.join(', ')}</div>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              <Button size="sm">Import</Button>
              <Button size="sm" variant="ghost">New</Button>
            </div>
          </div>

          <div className="flex-1 border rounded-lg p-4">
            {selectedLibId ? (
              (() => {
                const item = libraryItems.find((x) => x.id === selectedLibId)!;
                return (
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <div className="mt-2 text-sm text-muted-foreground">Type: {item.type}</div>
                    <div className="mt-3 text-sm whitespace-pre-wrap">Example content: This is a saved prompt or template that can be used directly in the assistant or shared with collaborators.</div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Use in chat</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Export</Button>
                    </div>
                    <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">Tags: {item.tags?.join(', ')}</div>
                  </div>
                );
              })()
            ) : (
              <div className="text-sm text-muted-foreground">Select an item to preview. Use the search to find prompts or templates quickly.</div>
            )}
          </div>
        </div>
      </ModalWrapper>
    );
  };

  // ---------- Main render ----------
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-slate-50 border-r border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">{t("chat.conversation")}</h2>
          </div>
          {conversations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Vertical primary sections (one per line) */}
        <div className="flex flex-col gap-2 mb-3">
          <button
            onClick={() => {
              // Open dashboard modal
              setModalSection('dashboard');
              setModalOpen(true);
              setSelectedSection('dashboard');
            }}
            className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${
              selectedSection === "dashboard"
                ? "bg-primary/10 border-primary/20"
                : "hover:bg-accent"
            }`}
            title="Dashboard"
          >
            <Grid className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setModalSection('projects');
              setModalOpen(true);
              setSelectedSection('projects');
            }}
            className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${
              selectedSection === "projects"
                ? "bg-primary/10 border-primary/20"
                : "hover:bg-accent"
            }`}
            title="Projects"
          >
            <Folder className="h-4 w-4" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => {
              // AI button resets to initial homepage state (close any modal)
              setModalOpen(false);
              setModalSection(null);
              setSelectedSection('assistant');
            }}
            className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${
              selectedSection === "assistant"
                ? "bg-primary/10 border-primary/20"
                : "hover:bg-accent"
            }`}
            title="AI Assistant (home)"
          >
            <Cpu className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => {
              setModalSection('library');
              setModalOpen(true);
              setSelectedSection('library');
            }}
            className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${
              selectedSection === "library"
                ? "bg-primary/10 border-primary/20"
                : "hover:bg-accent"
            }`}
            title="Library"
          >
            <BookOpen className="h-4 w-4" />
            <span>Library</span>
          </button>
        </div>

        {/* Search field shown for the whole sidebar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("sidebar.search")}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Content area: history list or small preview (history remains at bottom like before) */}
      <ScrollArea className="flex-1">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <h3 className="text-sm font-medium">History</h3>
          </div>

          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Toggle history list visibility; if switching to history ensure selectedSection updated
                if (selectedSection !== "history") {
                  setSelectedSection("history");
                  setShowHistoryList(true);
                } else {
                  setShowHistoryList((s) => !s);
                }
              }}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        {!showHistoryList ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Click <strong>History</strong> to show conversations</div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">{searchQuery ? t("sidebar.noResults") : t("sidebar.noConversations")}</div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full text-left p-3 pr-12 rounded-lg transition-fast group ${
                    currentConversationId === conv.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary">{conv.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{conv.messageCount} messages</span>
                        <span>•</span>
                        <span>{new Date(conv.timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", })}</span>
                      </div>
                    </div>
                  </div>
                </button>
                {onDeleteConversation && (
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 rounded transition-colors" onClick={() => onDeleteConversation(conv.id)} title={t("sidebar.delete")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer area: quick helpers */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>Version 1.0</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">Settings</Button>
            <Button size="sm">Export</Button>
          </div>
        </div>
      </div>

      {/* Render modals that cover right chat area */}
      {modalOpen && modalSection === 'dashboard' && <DashboardModal />}
      {modalOpen && modalSection === 'projects' && <ProjectsModal />}
      {modalOpen && modalSection === 'assistant' && <AssistantModal />}
      {modalOpen && modalSection === 'library' && <LibraryModal />}
    </div>
  );
}

