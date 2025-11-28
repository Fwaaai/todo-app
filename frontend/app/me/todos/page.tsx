"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/sidebar";
import { isAuth } from "../isAuth";

type Task = {
  id: number;
  title: string;
  content: string;
  done: boolean;
  hoverClass: string;
};

const hoverEffects = [
  "hover:-translate-y-1 hover:shadow-2xl hover:bg-white/15",
  "hover:translate-x-1 hover:shadow-xl hover:bg-white/15",
  "hover:scale-[1.02] hover:shadow-xl hover:bg-white/15",
  "hover:-rotate-[0.5deg] hover:shadow-2xl hover:bg-white/15",
  "hover:skew-y-1 hover:shadow-xl hover:bg-white/15",
];

function randomHoverEffect() {
  return hoverEffects[Math.floor(Math.random() * hoverEffects.length)];
}

export default function TodosPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isAuth()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    // Simulate fetching todos
    const timer = setTimeout(() => {
      setTasks([
        { id: 1, title: "Plan sprint", content: "Outline deliverables for next week", done: false, hoverClass: randomHoverEffect() },
        { id: 2, title: "Code review", content: "Review PR #42 with the team", done: true, hoverClass: randomHoverEffect() },
        { id: 3, title: "Refactor auth", content: "Extract reusable hooks for auth state", done: false, hoverClass: randomHoverEffect() },
      ]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const doneCount = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  
  const toggleDone = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      setFormError("Please provide both a title and content.");
      return;
    }

    const nextId = Math.max(0, ...tasks.map((t) => t.id)) + 1;
    const nextTask: Task = {
      id: nextId,
      title: newTitle.trim(),
      content: newContent.trim(),
      done: false,
      hoverClass: randomHoverEffect(),
    };

    setTasks((prev) => [...prev, nextTask]);
    setNewTitle("");
    setNewContent("");
    setFormError("");
    setShowNewTask(false);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-12 space-y-8 overflow-y-auto">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Tasks</h1>
            <p className="text-slate-300 mt-2">
              {loading ? "Loading tasks..." : `${doneCount}/${tasks.length} done`}
            </p>
          </div>
          <button
            onClick={() => setShowNewTask(true)}
            className="px-6 py-3 rounded-xl bg-white/15 border border-white/20 hover:bg-white/25 transition shadow-lg"
          >
            + New Task
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <article
              key={task.id}
              className={`group rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg p-5 flex flex-col gap-4 transition duration-200 ${task.hoverClass}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                  className="mt-1 h-5 w-5 accent-emerald-400 cursor-pointer"
                  aria-label={`Mark ${task.title} as done`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className={`text-xl font-semibold ${task.done ? "line-through text-slate-300" : ""}`}>
                      {task.title}
                    </h2>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-red-400 transition"
                      aria-label={`Delete ${task.title}`}
                    >
                      🗑
                    </button>
                  </div>
                  <p className={`mt-2 text-slate-200 ${task.done ? "line-through text-slate-400" : ""}`}>
                    {task.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span className="px-3 py-1 rounded-full bg-black/30 border border-white/10">
                  {task.done ? "Done" : "In progress"}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition">Hover magic ✨</span>
              </div>
            </article>
          ))}
          {!loading && tasks.length === 0 && (
            <div className="col-span-full text-center text-slate-300">
              No tasks yet. Add one to get started.
            </div>
          )}
        </section>

        {showNewTask && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-slate-900/80 border border-white/15 rounded-2xl p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Create a new task</h2>
                <button
                  onClick={() => {
                    setShowNewTask(false);
                    setFormError("");
                  }}
                  className="text-slate-300 hover:text-white transition"
                  aria-label="Close new task form"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-200">
                  Title
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Give your task a name"
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-200">
                  Content
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="What needs to be done?"
                    rows={4}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </label>

                {formError && <p className="text-red-400 text-sm">{formError}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowNewTask(false);
                    setFormError("");
                    setNewTitle("");
                    setNewContent("");
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition shadow-lg"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
