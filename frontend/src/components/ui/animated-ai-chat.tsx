"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, Sparkles, XIcon, FileIcon, Home, Server, FileJson, FileCode2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedAIChat() {
    const [file, setFile] = useState<File | null>(null);
    const [taskDesc, setTaskDesc] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Instead of complex routing, we use simple location matching for our two pages
    const isReservePage = typeof window !== 'undefined' && window.location.pathname === "/mcp-reserve";
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleGenerate = () => {
        if (!taskDesc.trim() && !file) return;
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setTaskDesc("");
            setFile(null);
        }, 3000);
    };

    return (
        <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col p-6 z-20 shrink-0">
                <div className="mb-10 pl-2">
                    <h2 className="text-xl font-heading font-black tracking-widest text-neutral-200 select-none">
                        MCP<span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">FORGE</span>
                    </h2>
                </div>
                
                <nav className="flex flex-col gap-2">
                    <a 
                        href="/"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                            !isReservePage 
                                ? "bg-white/10 text-white shadow-sm" 
                                : "text-white/40 hover:bg-white/5 hover:text-white/80"
                        )}
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </a>
                    <a 
                        href="/mcp-reserve"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                            isReservePage 
                                ? "bg-white/10 text-white shadow-sm" 
                                : "text-white/40 hover:bg-white/5 hover:text-white/80"
                        )}
                    >
                        <Server className="w-4 h-4" />
                        MCP Reserve
                    </a>
                </nav>
            </aside>

            {/* Main Area */}
            <main className="flex-1 relative overflow-y-auto flex flex-col">
                {/* Background effects */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
                    <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto p-8 flex flex-col gap-10 mt-12 pb-24">
                    
                    {/* Header */}
                    <motion.div
                        className="text-center relative inline-block mx-auto mb-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-6xl font-heading tracking-[-0.04em] flex items-center justify-center gap-3 select-none">
                            <span className="font-light text-neutral-400">MCP</span>
                            <span className="font-black bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                                FORGE
                            </span>
                        </h1>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-neutral-600/60 to-transparent" />
                    </motion.div>

                    {isReservePage ? (
                        /* --- MCP Reserve Empty State --- */
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="flex flex-col items-center justify-center w-full min-h-[300px] mt-10"
                        >
                            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 relative overflow-hidden backdrop-blur-sm group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent pointer-events-none" />
                                <Server className="w-10 h-10 text-white/20 group-hover:text-white/60 transition-colors" />
                            </div>
                            <h2 className="text-2xl font-heading font-medium tracking-tight text-white/90 mb-3">No reserves available right now</h2>
                            <p className="text-white/40 text-sm max-w-sm text-center leading-relaxed">
                                You currently have no active MCP server reserves. Start by configuring a new reserve on the home page.
                            </p>
                        </motion.div>
                    ) : (
                        /* --- Home Form Layout --- */
                        <>
                            <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                                {/* 1. File Upload Box */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                    className={cn(
                                        "relative backdrop-blur-3xl bg-white/[0.02] rounded-3xl border border-white/[0.05] shadow-xl overflow-hidden transition-colors h-[140px]",
                                        "hover:bg-white/[0.03]",
                                        file ? "border-violet-500/30 bg-violet-500/[0.02]" : ""
                                    )}
                                >
                                    <input
                                        type="file"
                                        accept=".har"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    
                                    <div 
                                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {file ? (
                                                <motion.div 
                                                    key="file"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex flex-col items-center gap-2 text-white/90"
                                                >
                                                    <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-300">
                                                        <FileIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-xs font-medium font-mono text-center truncate max-w-[200px]">
                                                        {file.name}
                                                    </div>
                                                    <button 
                                                        className="text-[10px] text-white/40 hover:text-white/90 mt-1 flex items-center gap-1 z-10 relative"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFile(null);
                                                        }}
                                                    >
                                                        <XIcon className="w-3 h-3" />
                                                        Remove
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    key="empty"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex flex-col items-center gap-3 text-white/40 group"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] group-hover:bg-white/[0.08] transition-colors flex items-center justify-center cursor-pointer">
                                                        <UploadCloud className="w-5 h-5 group-hover:text-white/90 transition-colors" />
                                                    </div>
                                                    <div className="text-xs font-medium">
                                                        Click to attach a .har file
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* 2. Task Description & Generate Box */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                    className="relative backdrop-blur-3xl bg-white/[0.02] rounded-3xl border border-white/[0.05] shadow-xl p-2 transition-all focus-within:border-white/20 focus-within:bg-white/[0.03]"
                                >
                                    <textarea
                                        ref={textareaRef}
                                        value={taskDesc}
                                        onChange={(e) => setTaskDesc(e.target.value)}
                                        placeholder="Describe your task here..."
                                        className="w-full min-h-[100px] h-auto resize-y bg-transparent border-none text-white/90 text-sm focus:outline-none placeholder:text-white/30 p-4 leading-relaxed"
                                        disabled={isGenerating}
                                    />
                                    
                                    <div className="flex justify-between items-center px-2 pb-2 pt-2">
                                        <span className="text-[10px] text-white/20 pl-2">
                                            {taskDesc.length} chars
                                        </span>
                                        <motion.button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || (!taskDesc.trim() && !file)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2",
                                                isGenerating 
                                                    ? "bg-white/10 text-white/50 cursor-not-allowed"
                                                    : (taskDesc.trim() || file)
                                                        ? "bg-white text-black shadow-lg shadow-white/20 hover:shadow-white/30"
                                                        : "bg-white/[0.05] text-white/30 cursor-not-allowed"
                                            )}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="w-3 h-3 rounded-full border border-white/20 border-t-white/80 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-3 h-3" />
                                                    Generate
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* 3 empty file spaces / Output Cards */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                                className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
                            >
                                {/* File 1 */}
                                <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.03] transition-colors relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-300">
                                            <FileCode2 className="w-5 h-5" />
                                        </div>
                                        <div className="font-heading font-medium text-sm">File 1 — The AI Tool</div>
                                    </div>
                                    <div className="text-xs font-mono text-white/40 truncate">github_search_mcp.py</div>
                                </div>

                                {/* File 2 */}
                                <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.03] transition-colors relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300">
                                            <FileJson className="w-5 h-5" />
                                        </div>
                                        <div className="font-heading font-medium text-sm">File 2 — The Config</div>
                                    </div>
                                    <div className="text-xs font-mono text-white/40 truncate">claude_config.json</div>
                                </div>

                                {/* File 3 */}
                                <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.03] transition-colors relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                        <div className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-300">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div className="font-heading font-medium text-sm">File 3 — The README</div>
                                    </div>
                                    <div className="text-xs font-mono text-white/40 truncate">README.md</div>
                                </div>
                            </motion.div>
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}
