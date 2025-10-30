import React, { useEffect, useState } from "react";
import {
  History,
  Trash2,
  Search,
  MessageSquare,
  BookOpen,
  Cpu,
  Folder,
  Grid,
  User,
  Tag,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  Clock,
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

export function HistorySidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onClearHistory,
  onDeleteConversation,
}: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const [selectedSection, setSelectedSection] = useState<
    "dashboard" | "projects" | "assistant" | "library" | "history"
  >("dashboard");

  const [showHistoryList, setShowHistoryList] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<
    "dashboard" | "projects" | "assistant" | "library" | null
  >(null);

  // Rich project & library state
  const [projects, setProjects] = useState([
    {
      id: "p-1",
      name: "Research AI",
      desc: "Generative assistant for scientific literature",
      members: [
        { id: "u1", name: "Alice", role: "Lead" },
        { id: "u2", name: "Bob", role: "Data Scientist" },
      ],
      progress: 0.65,
      lastUpdated: "2 days ago",
      datasets: ["papers.csv", "experiments.zip"],
      milestones: [
        { id: "m1", title: "Dataset prepared", done: true, date: "2025-10-10" },
        { id: "m2", title: "Baseline model", done: false, date: "2025-11-02" },
      ],
      notes: "Focus on reproducible pipelines and prompt design for summarization.",
    },
    {
      id: "p-2",
      name: "Mobile UX",
      desc: "Prototype mobile flows",
      members: [{ id: "u3", name: "Clara", role: "Designer" }],
      progress: 0.4,
      lastUpdated: "1 week ago",
      datasets: ["user_tests.csv"],
      milestones: [{ id: "m3", title: "Wireframes", done: true, date: "2025-09-01" }],
      notes: "Gather accessibility feedback and optimize microcopy.",
    },
  ]);

  const [libraryItems, setLibraryItems] = useState([
    {
      id: "l-1",
      title: "Summarize Paper Prompt",
      type: "prompt",
      tags: ["summary", "paper"],
      versions: [
        { v: 1, date: "2025-08-01", note: "Initial" },
        { v: 2, date: "2025-10-01", note: "Added examples" },
      ],
      content: "Summarize the main contributions, methods and results in 5 bullet points.",
      sharedWith: ["Alice", "Bob"],
    },
    {
      id: "l-2",
      title: "Research Template",
      type: "template",
      tags: ["template", "report"],
      versions: [{ v: 1, date: "2025-07-10", note: "Initial" }],
      content: "Sections: Abstract, Intro, Methods, Results, Discussion.",
      sharedWith: ["Clara"],
    },
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");

  const [isDark, setIsDark] = useState<boolean>(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal wrapper with responsive behavior and theme-aware styles
  const ModalWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <div
      className={`fixed inset-0 md:left-[320px] z-50 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
      } border-l ${isDark ? "border-slate-700 shadow-xl" : "border-slate-200 shadow-lg"}`}
    >
      <div className="h-full flex flex-col">
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <span className={`text-sm ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
              ({t("preview") ?? "Preview"})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setModalOpen(false);
                setModalSection(null);
              }}
            >
              {t("close") ?? "Close"}
            </Button>
          </div>
        </div>
        <div className="p-4 overflow-auto flex-1">{children}</div>
      </div>
    </div>
  );

  // ------------------ Projects: very full detail ------------------
  const ProjectsModal = () => {
    const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

    const addMilestone = (title: string) => {
      if (!selectedProjectId) return;
      setProjects((s) =>
        s.map((p) =>
          p.id === selectedProjectId
            ? {
                ...p,
                milestones: [
                  ...p.milestones,
                  { id: `m-${Date.now()}`, title, done: false, date: new Date().toISOString().split("T")[0] },
                ],
              }
            : p
        )
      );
    };

    const toggleMilestone = (mid: string) => {
      if (!selectedProjectId) return;
      setProjects((s) =>
        s.map((p) =>
          p.id === selectedProjectId ? { ...p, milestones: p.milestones.map((m) => (m.id === mid ? { ...m, done: !m.done } : m)) } : p
        )
      );
    };

    return (
      <ModalWrapper title={t("projects")}>
        <div className="flex flex-col md:flex-row gap-6">
          <aside
            className={`md:w-1/3 rounded-lg p-3 ${isDark ? "bg-slate-800" : "bg-white"} border ${
              isDark ? "border-slate-700" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t("projects")}</h4>
              <div className={`text-xs ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{projects.length}</div>
            </div>

            <ul className="mt-4 space-y-3">
              {projects.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-3 rounded cursor-pointer flex items-start gap-3 ${
                    selectedProjectId === p.id ? (isDark ? "bg-slate-700" : "bg-primary/10 border") : isDark ? "hover:bg-slate-700" : "hover:bg-accent"
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{p.desc}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <Users className="h-4 w-4" />
                      <span>{p.members.length} {t("members") ?? "members"}</span>
                      <span>•</span>
                      <span>{t("lastUpdated") ?? "Last updated"}: {p.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div style={{ width: `${p.progress * 100}%` }} className={`h-2 ${isDark ? "bg-emerald-600" : "bg-primary"}`}></div>
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{Math.round(p.progress * 100)}%</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <Input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder={t("newProjectPlaceholder") ?? "New project name"} className="mb-2" />
              <Button
                size="sm"
                onClick={() => {
                  if (!newProjectName) return;
                  setProjects((s) => [
                    ...s,
                    { id: `p-${Date.now()}`, name: newProjectName, desc: "New project", members: [], progress: 0.01, lastUpdated: "now", datasets: [], milestones: [], notes: "" },
                  ]);
                  setNewProjectName("");
                }}
              >
                {t("create") ?? "Create"}
              </Button>
            </div>
          </aside>

          <main className={`flex-1 rounded-lg p-4 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <div className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{project.desc}</div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" /> {project.members.map((m) => m.name).join(", ")}
                  </div>
                  <div className="text-muted-foreground">•</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {t("lastUpdated") ?? "Last updated"}: {project.lastUpdated}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">{t("openWorkspace") ?? "Open Workspace"}</Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <section className={`p-3 border rounded ${isDark ? "border-slate-700" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs">{t("milestones") ?? "Milestones"}</div>
                  <div className="text-xs text-muted-foreground">{project.milestones.length}</div>
                </div>
                <ul className="mt-3 space-y-2">
                  {project.milestones.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleMilestone(m.id)} className={`p-1 rounded ${m.done ? "bg-emerald-600 text-white" : "bg-slate-100"}`}>
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <div>
                          <div className={`font-medium ${m.done ? "line-through" : ""}`}>{m.title}</div>
                          <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{m.date}</div>
                        </div>
                      </div>
                      <div className={`text-xs ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{m.done ? (t("done") ?? "Done") : (t("pending") ?? "Pending")}</div>
                    </li>
                  ))}
                </ul>

                <div className="mt-3">
                  <Input placeholder={t("newMilestonePlaceholder") ?? "New milestone title"} id="milestone-input" className="mb-2" />
                  <Button
                    size="sm"
                    onClick={() => {
                      const el = document.getElementById("milestone-input") as HTMLInputElement | null;
                      if (!el || !el.value) return;
                      addMilestone(el.value);
                      el.value = "";
                    }}
                  >
                    {t("addMilestone") ?? "Add milestone"}
                  </Button>
                </div>
              </section>

              <section className={`p-3 border rounded ${isDark ? "border-slate-700" : ""}`}>
                <div className="text-xs">{t("datasetsFiles") ?? "Datasets & Files"}</div>
                <ul className="mt-3 space-y-2 text-sm">
                  {project.datasets.map((f, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {f}
                      </div>
                      <div className={`text-xs ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{t("download") ?? "Download"}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <Button size="sm">{t("upload") ?? "Upload"}</Button>
                  <Button variant="ghost" size="sm">
                    {t("sync") ?? "Sync"}
                  </Button>
                </div>
              </section>

              <section className={`p-3 border rounded ${isDark ? "border-slate-700" : ""}`}>
                <div className="text-xs">{t("tasks") ?? "Tasks"}</div>
                <ul className="mt-3 text-sm space-y-2">
                  <li>• {t("task cleanDataset") ?? "Clean dataset"}</li>
                  <li>• {t("task runBaseline") ?? "Run baseline model"}</li>
                  <li>• {t("task draftIntro") ?? "Draft paper intro"}</li>
                </ul>
                <div className="mt-3">
                  <Button size="sm">{t("openBoard") ?? "Open Board"}</Button>
                </div>
              </section>
            </div>

            <div className="mt-6">
              <h5 className="font-medium">{t("notes") ?? "Notes"}</h5>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{project.notes}</p>
            </div>
          </main>
        </div>
      </ModalWrapper>
    );
  };

  // ------------------ Library: very full detail ------------------
  const LibraryModal = () => {
    const [selectedLibId, setSelectedLibId] = useState<string | null>(libraryItems[0]?.id ?? null);
    const [libSearch, setLibSearch] = useState("");
    const [versionNote, setVersionNote] = useState("");

    const filtered = libraryItems.filter(
      (l) => l.title.toLowerCase().includes(libSearch.toLowerCase()) || l.tags?.some((tag) => tag.includes(libSearch.toLowerCase()))
    );

    const addVersion = (id: string, note: string) => {
      setLibraryItems((s) => s.map((item) => (item.id === id ? { ...item, versions: [...item.versions, { v: item.versions.length + 1, date: new Date().toISOString().split("T")[0], note }] } : item)));
      setVersionNote("");
    };

    const selected = libraryItems.find((l) => l.id === selectedLibId) ?? libraryItems[0];

    return (
      <ModalWrapper title={t("library")}>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className={`md:w-1/3 rounded-lg p-3 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t("savedItems") ?? "Saved items"}</h4>
              <div className={`text-xs ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{libraryItems.length}</div>
            </div>

            <div className="mt-3">
              <Input value={libSearch} onChange={(e) => setLibSearch(e.target.value)} placeholder={t("searchLibrary") ?? "Search library..."} className="mb-2" />
            </div>

            <ul className="space-y-2 text-sm">
              {filtered.map((l) => (
                <li
                  key={l.id}
                  onClick={() => setSelectedLibId(l.id)}
                  className={`p-3 rounded cursor-pointer flex items-start justify-between ${
                    selectedLibId === l.id ? (isDark ? "bg-slate-700" : "bg-primary/10 border") : isDark ? "hover:bg-slate-700" : "hover:bg-accent"
                  }`}
                >
                  <div>
                    <div className="font-medium">{l.title}</div>
                    <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{l.type} • {l.tags.join(", ")}</div>
                    <div className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>v{l.versions.length} • {t("sharedWith") ?? "shared with"} {l.sharedWith.join(", ")}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" title={t("tags") ?? "Tags"}><Tag className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" title={t("owner") ?? "Owner"}><User className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              <Button size="sm">{t("import") ?? "Import"}</Button>
              <Button size="sm" variant="ghost">{t("new") ?? "New"}</Button>
            </div>
          </aside>

          <main className={`flex-1 rounded-lg p-4 ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            {selected ? (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{selected.title}</h3>
                    <div className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{selected.type} • {t("tagsLabel") ?? "Tags"}: {selected.tags.join(", ")}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">{t(".useInChat") ?? "Use in chat"}</Button>
                    <Button variant="ghost" size="sm">{t("edit") ?? "Edit"}</Button>
                    <Button variant="ghost" size="sm">{t("export") ?? "Export"}</Button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <section className={`p-3 border rounded ${isDark ? "border-slate-700" : ""}`}>
                    <div className="text-xs">{t("preview") ?? "Preview"}</div>
                    <div className={`mt-2 p-3 rounded border ${isDark ? "border-slate-700" : ""}`}>{selected.content}</div>
                    <div className="mt-3 text-xs">{t("sharedWith") ?? "Shared with"}: {selected.sharedWith.join(", ")}</div>
                  </section>

                  <section className={`p-3 border rounded ${isDark ? "border-slate-700" : ""}`}>
                    <div className="text-xs">{t("versions") ?? "Versions"}</div>
                    <ul className="mt-2 text-sm space-y-2">
                      {selected.versions.map((v) => (
                        <li key={v.v} className="flex items-center justify-between">
                          <div>v{v.v} — {v.date}</div>
                          <div className={`text-xs ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{v.note}</div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <Input value={versionNote} onChange={(e) => setVersionNote(e.target.value)} placeholder={t("versionNotePlaceholder") ?? "Version note"} className="mb-2" />
                      <Button size="sm" onClick={() => addVersion(selected.id, versionNote)}>{t("addVersion") ?? "Add version"}</Button>
                    </div>
                  </section>

                  <section className={`p-3 border rounded ${isDark ? "border-slate-700" : ""}`}>
                    <div className="text-xs">{t("usageMetadata") ?? "Usage & Metadata"}</div>
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {t("created") ?? "Created"}: {selected.versions[0]?.date}</div>
                      <div className="flex items-center gap-2 mt-2"><Users className="h-4 w-4" /> {t("shared") ?? "Shared"}: {selected.sharedWith.join(", ")}</div>
                      <div className="flex items-center gap-2 mt-2"><FileText className="h-4 w-4" /> {t("typeLabel") ?? "Type"}: {selected.type}</div>
                    </div>
                  </section>
                </div>

                <div className="mt-6">
                  <h5 className="font-medium">{t("notesComments") ?? "Notes / Collaborator comments"}</h5>
                  <div className={`mt-2 p-3 rounded border ${isDark ? "border-slate-700" : ""}`}>{t("noCommentsYet") ?? "No comments yet. Collaborators can leave notes about usage, improvements and examples."}</div>
                </div>
              </div>
            ) : (
              <div className={`text-sm ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{t("selectItemPreview") ?? "Select an item to preview. Use the search to find prompts or templates quickly."}</div>
            )}
          </main>
        </div>
      </ModalWrapper>
    );
  };

  // ------------------ Dashboard & Assistant kept as before (unchanged) ------------------
  const StatCard: React.FC<{ title: string; value: string; hint?: string }> = ({ title, value, hint }) => (
    <div className={`p-3 border rounded-lg ${isDark ? "bg-slate-800 border-slate-700" : "bg-gradient-to-b from-white to-slate-50 border-slate-200"}`}>
      <div className={`text-xs ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{title}</div>
      <div className="mt-2 font-semibold text-lg">{value}</div>
      {hint && <div className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{hint}</div>}
    </div>
  );

  const DashboardModal = () => (
    <ModalWrapper title={t("dashboard")}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title={t("activeConversations") ?? "Active conversations"} value={`${conversations.length}`} hint={t("activeConversationsHint") ?? "Conversations in this workspace"} />
        <StatCard title={t("savedPrompts") ?? "Saved prompts"} value={`${libraryItems.length}`} hint={t("savedPromptsHint") ?? "Useful templates & prompts"} />
        <StatCard title={t("projects") ?? "Projects"} value={`${projects.length}`} hint={t("projectsHint") ?? "Workspaces and collaborators"} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 ${isDark ? "border-slate-700 bg-slate-800" : ""}`}>
          <h4 className="font-medium">{t("recentConversations") ?? "Recent conversations"}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {conversations.slice(0, 8).map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className={`text-xs ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>{c.messageCount} {t("messages") ?? "messages"} — {new Date(c.timestamp).toLocaleString()}</div>
                </div>
                <div className={`text-xs ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{t("view") ?? "View"}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className={`border rounded-lg p-4 ${isDark ? "border-slate-700 bg-slate-800" : ""}`}>
          <h4 className="font-medium">{t("activityFeed") ?? "Activity feed"}</h4>
          <div className="mt-3 text-sm space-y-2">
            <div className={`${isDark ? "text-slate-300" : "text-muted-foreground"}`}>• {t("feed new Prompt") ?? 'New prompt saved: "Summarize Paper Prompt" — 3 hours ago'}</div>
            <div className={`${isDark ? "text-slate-300" : "text-muted-foreground"}`}>• {t("feed project Updated") ?? 'Project "Research AI" updated — 1 day ago'}</div>
            <div className={`${isDark ? "text-slate-300" : "text-muted-foreground"}`}>• {t("feed export Completed") ?? "Export completed — 2 days ago"}</div>
          </div>
        </div>
      </div>

      <div className={`mt-6 border rounded-lg p-4 ${isDark ? "border-slate-700 bg-slate-800" : ""}`}>
        <h4 className="font-medium">{t("quickCharts") ?? "Quick charts"}</h4>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`h-36 border rounded flex items-center justify-center text-sm ${isDark ? "border-slate-700 text-slate-400" : "text-muted-foreground"}`}>{t("chartMessages") ?? "[Chart placeholder: messages / week]"}</div>
          <div className={`h-36 border rounded flex items-center justify-center text-sm ${isDark ? "border-slate-700 text-slate-400" : "text-muted-foreground"}`}>{t("chartPrompts") ?? "[Chart placeholder: prompt usage]"}</div>
        </div>
      </div>
    </ModalWrapper>
  );

  const AssistantModal = () => {
    const [mode, setMode] = useState<"researcher" | "marketer" | "student">("researcher");
    const [prompt, setPrompt] = useState("Summarize the main contributions of the paper in 3 bullet points.");
    const [results, setResults] = useState<string | null>(null);
    const [temperature, setTemperature] = useState(0.7);

    const runAssistant = () => {
      const id = `run-${Date.now()}`;
      const simulated = `(Mode: ${mode}, Temp: ${temperature})
Generated output for prompt:

${prompt}`;
      setResults(simulated);
    };

    return (
      <ModalWrapper title={t("assistant")}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`col-span-1 border rounded-lg p-3 ${isDark ? "border-slate-700 bg-slate-800" : ""}`}>
            <h5 className="font-medium">{t("modesPresets") ?? "Modes & Presets"}</h5>
            <div className="mt-3 flex flex-col gap-2">
              <Button size="sm" variant={mode === "researcher" ? undefined : "ghost"} onClick={() => setMode("researcher")}>
                {t("mode researcher") ?? "Researcher"}
              </Button>
              <Button size="sm" variant={mode === "marketer" ? undefined : "ghost"} onClick={() => setMode("marketer")}>
                {t("mode marketer") ?? "Marketer"}
              </Button>
              <Button size="sm" variant={mode === "student" ? undefined : "ghost"} onClick={() => setMode("student")}>
                {t("mode student") ?? "Student"}
              </Button>
            </div>
          </div>

          <div className={`col-span-2 border rounded-lg p-3 ${isDark ? "border-slate-700 bg-slate-800" : ""}`}>
            <h5 className="font-medium">{t("prompt") ?? "Prompt"}</h5>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-32 mt-2 p-2 border rounded" />

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">{t("temperature") ?? "Temperature"}</div>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
                <div className="text-xs">{temperature}</div>
              </div>

              <Button size="sm" onClick={runAssistant}>{t("run") ?? "Run"}</Button>
              <Button variant="ghost" size="sm" onClick={() => { setPrompt(""); setResults(null); }}>{t("clear") ?? "Clear"}</Button>
            </div>

            {results && (
              <div className="mt-4">
                <h6 className="font-medium">{t("result") ?? "Result"}</h6>
                <pre className="mt-2 p-3 border rounded text-sm whitespace-pre-wrap">{results}</pre>
              </div>
            )}
          </div>
        </div>
      </ModalWrapper>
    );
  };

  // ------------------ Main render ------------------
  return (
    <div className={`h-full flex flex-col border-r ${isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-gradient-to-b from-white to-slate-50 border-border text-slate-900"}`}>
      <div className={`p-3 border-b ${isDark ? "border-slate-700" : "border-border"}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className={`h-5 w-5 ${isDark ? "text-sky-300" : "text-primary"}`} />
            <h2 className="font-semibold">{t("chat.conversation")}</h2>
          </div>
          {/*{conversations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}*/}
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <button onClick={() => { setModalSection("dashboard"); setModalOpen(true); setSelectedSection("dashboard"); }} className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${selectedSection === "dashboard" ? (isDark ? "bg-slate-800 border-slate-700" : "bg-primary/10 border-primary/20") : (isDark ? "hover:bg-slate-800" : "hover:bg-accent")}`} title={t("dashboard")}>
            <Grid className={`h-4 w-4 ${isDark ? "text-sky-300" : ""}`} />
            <span>{t("dashboard")}</span>
          </button>

          <button onClick={() => { setModalSection("projects"); setModalOpen(true); setSelectedSection("projects"); }} className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${selectedSection === "projects" ? (isDark ? "bg-slate-800 border-slate-700" : "bg-primary/10 border-primary/20") : (isDark ? "hover:bg-slate-800" : "hover:bg-accent")}`} title={t("projects")}>
            <Folder className={`h-4 w-4 ${isDark ? "text-amber-300" : ""}`} />
            <span>{t("projects")}</span>
          </button>

          <button onClick={() => { setModalOpen(false); setModalSection(null); setSelectedSection("assistant"); }} className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${selectedSection === "assistant" ? (isDark ? "bg-slate-800 border-slate-700" : "bg-primary/10 border-primary/20") : (isDark ? "hover:bg-slate-800" : "hover:bg-accent")}`} title={t("assistant")}>
            <Cpu className={`h-4 w-4 ${isDark ? "text-emerald-300" : ""}`} />
            <span>{t("assistant")}</span>
          </button>

          <button onClick={() => { setModalSection("library"); setModalOpen(true); setSelectedSection("library"); }} className={`w-full text-left py-3 px-3 rounded-md border transition-colors flex items-center gap-3 ${selectedSection === "library" ? (isDark ? "bg-slate-800 border-slate-700" : "bg-primary/10 border-primary/20") : (isDark ? "hover:bg-slate-800" : "hover:bg-accent")}`} title={t("library")}>
            <BookOpen className={`h-4 w-4 ${isDark ? "text-fuchsia-300" : ""}`} />
            <span>{t("library")}</span>
          </button>
        </div>

        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? "text-slate-400" : "text-muted-foreground"}`} />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("search")} className="pl-9 text-sm" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className={`p-3 border-b flex items-center justify-between ${isDark ? "border-slate-700" : "border-border"}`}>
          <div>
            <Button variant="ghost" size="sm" onClick={() => { if (selectedSection !== "history") { setSelectedSection("history"); setShowHistoryList(true); } else { setShowHistoryList((s) => !s); } }}>
              <History className="h-4 w-4 mr-2" />
              {t("history")}
            </Button>
          </div>
        </div>

        {!showHistoryList ? (
          <div className={`p-6 text-center text-sm ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{t("clickHistoryHint") ?? `Click ${t("history") ?? "History"} to show conversations`}</div>
        ) : filteredConversations.length === 0 ? (
          <div className={`p-6 text-center text-sm ${isDark ? "text-slate-300" : "text-muted-foreground"}`}>{searchQuery ? t("noResults") : t("noConversations")}</div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <button onClick={() => onSelectConversation(conv.id)} className={`w-full text-left p-3 pr-12 rounded-lg transition-fast group ${currentConversationId === conv.id ? (isDark ? "bg-slate-800 border border-slate-700" : "bg-primary/10 border border-primary/20") : (isDark ? "hover:bg-slate-800" : "hover:bg-accent")}`}>
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`h-4 w-4 ${isDark ? "text-sky-300" : "text-primary"} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary">{conv.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{conv.messageCount} {t("messages") ?? "messages"}</span>
                        <span>•</span>
                        <span>{new Date(conv.timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>
                </button>
                {onDeleteConversation && (
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 rounded transition-colors" onClick={() => onDeleteConversation(conv.id)} title={t("delete")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className={`p-3 border-t ${isDark ? "border-slate-700" : "border-border"}`}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>{t("Version 1.0") ?? "Version 1.0"}</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">{t("Dr Koffi junior") ?? "Dr Koffi junior"}</Button>
          </div>
        </div>
      </div>

      {modalOpen && modalSection === "dashboard" && <DashboardModal />}
      {modalOpen && modalSection === "projects" && <ProjectsModal />}
      {modalOpen && modalSection === "assistant" && <AssistantModal />}
      {modalOpen && modalSection === "library" && <LibraryModal />}
    </div>
  );
}
