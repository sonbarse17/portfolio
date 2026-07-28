'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiTerminal as TerminalIcon,
  FiCornerDownLeft as CornerDownLeft,
  FiPlay as Play,
  FiRefreshCw as RefreshCw,
} from 'react-icons/fi'

interface CommandOutput {
  id: string
  command: string
  output: React.ReactNode
  timestamp: string
}

const INITIAL_COMMANDS: CommandOutput[] = [
  {
    id: 'init-1',
    command: 'whoami',
    output: (
      <div className="text-emerald-400 font-mono">
        Sushant Sonbarse - DevOps & Cloud Infrastructure Engineer
        <br />
        <span className="text-gray-400">
          Specialized in Kubernetes orchestration, CI/CD automation, and resilient AWS
          architectures.
        </span>
      </div>
    ),
    timestamp: 'Just now',
  },
  {
    id: 'init-2',
    command: 'help',
    output: (
      <div className="text-gray-300 font-mono space-y-1">
        <div>Available DevOps commands:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-2 text-sm">
          <div>
            <span className="text-cyan-400 font-bold">whoami</span> - Display engineer profile
          </div>
          <div>
            <span className="text-cyan-400 font-bold">kubectl get pods</span> - Check production
            cluster pods
          </div>
          <div>
            <span className="text-cyan-400 font-bold">terraform status</span> - Inspect AWS
            infrastructure state
          </div>
          <div>
            <span className="text-cyan-400 font-bold">cat skills.json</span> - Output DevOps tools &
            proficiency
          </div>
          <div>
            <span className="text-cyan-400 font-bold">pipeline status</span> - View latest CI/CD
            workflow runs
          </div>
          <div>
            <span className="text-cyan-400 font-bold">clear</span> - Clear terminal screen
          </div>
        </div>
      </div>
    ),
    timestamp: 'Just now',
  },
]

export function TerminalSandbox() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<CommandOutput[]>(INITIAL_COMMANDS)
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [commandList, setCommandList] = useState<string[]>(['whoami', 'help'])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [history])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    let outputNode: React.ReactNode = null

    if (trimmed === 'clear') {
      setHistory([])
      setInput('')
      return
    } else if (trimmed === 'whoami') {
      outputNode = (
        <div className="text-emerald-400 font-mono">
          Sushant Sonbarse - DevOps & Cloud Infrastructure Engineer
          <br />
          <span className="text-gray-400">
            Specialized in Kubernetes orchestration, CI/CD automation, and resilient AWS
            architectures.
          </span>
        </div>
      )
    } else if (trimmed === 'help') {
      outputNode = (
        <div className="text-gray-300 font-mono space-y-1">
          <div>Available DevOps commands:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-2 text-sm">
            <div>
              <span className="text-cyan-400 font-bold">whoami</span> - Display engineer profile
            </div>
            <div>
              <span className="text-cyan-400 font-bold">kubectl get pods</span> - Check production
              cluster pods
            </div>
            <div>
              <span className="text-cyan-400 font-bold">terraform status</span> - Inspect AWS
              infrastructure state
            </div>
            <div>
              <span className="text-cyan-400 font-bold">cat skills.json</span> - Output DevOps tools
              & proficiency
            </div>
            <div>
              <span className="text-cyan-400 font-bold">pipeline status</span> - View latest CI/CD
              workflow runs
            </div>
            <div>
              <span className="text-cyan-400 font-bold">clear</span> - Clear terminal screen
            </div>
          </div>
        </div>
      )
    } else if (
      trimmed === 'kubectl get pods' ||
      trimmed === 'kubectl get pod' ||
      trimmed === 'kgp'
    ) {
      outputNode = (
        <div className="font-mono text-xs md:text-sm overflow-x-auto bg-black/40 p-3 rounded border border-gray-800">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800 pb-1">
                <th className="pb-1 pr-4">NAME</th>
                <th className="pb-1 pr-4">READY</th>
                <th className="pb-1 pr-4">STATUS</th>
                <th className="pb-1 pr-4">RESTARTS</th>
                <th className="pb-1">AGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-gray-300">
              <tr>
                <td className="py-1 pr-4 text-blue-400">api-gateway-7d8b9c-2x4v</td>
                <td className="py-1 pr-4">1/1</td>
                <td className="py-1 pr-4">
                  <span className="text-emerald-400 font-semibold">Running</span>
                </td>
                <td className="py-1 pr-4">0</td>
                <td className="py-1 text-gray-500">14d</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 text-blue-400">auth-service-5f6a7d-9k2l</td>
                <td className="py-1 pr-4">1/1</td>
                <td className="py-1 pr-4">
                  <span className="text-emerald-400 font-semibold">Running</span>
                </td>
                <td className="py-1 pr-4">0</td>
                <td className="py-1 text-gray-500">14d</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 text-blue-400">billing-engine-8a9b0c-4p5q</td>
                <td className="py-1 pr-4">2/2</td>
                <td className="py-1 pr-4">
                  <span className="text-emerald-400 font-semibold">Running</span>
                </td>
                <td className="py-1 pr-4">0</td>
                <td className="py-1 text-gray-500">7d</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 text-purple-400">prometheus-k8s-0</td>
                <td className="py-1 pr-4">2/2</td>
                <td className="py-1 pr-4">
                  <span className="text-emerald-400 font-semibold">Running</span>
                </td>
                <td className="py-1 pr-4">0</td>
                <td className="py-1 text-gray-500">30d</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 text-yellow-400">grafana-core-6c7d8e-1z2y</td>
                <td className="py-1 pr-4">1/1</td>
                <td className="py-1 pr-4">
                  <span className="text-emerald-400 font-semibold">Running</span>
                </td>
                <td className="py-1 pr-4">0</td>
                <td className="py-1 text-gray-500">30d</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else if (trimmed === 'terraform status' || trimmed === 'terraform plan' || trimmed === 'tf') {
      outputNode = (
        <div className="font-mono text-xs md:text-sm bg-black/40 p-3 rounded border border-gray-800 space-y-1">
          <div className="text-gray-400">
            Acquiring state lock for{' '}
            <span className="text-yellow-400">s3://devops-portfolio-tfstate/prod.tfstate</span>...
          </div>
          <div className="text-emerald-400 font-bold">
            No changes. Your infrastructure matches the configuration.
          </div>
          <div className="text-gray-300">
            Terraform has compared your real infrastructure against your configuration and found no
            differences, so no changes are needed.
          </div>
          <div className="pt-1 text-xs text-gray-500 border-t border-gray-800">
            Outputs: <span className="text-cyan-400">vpc_id</span> =
            &quot;vpc-0a1b2c3d4e5f6g7h8&quot; | <span className="text-cyan-400">cluster_name</span>{' '}
            = &quot;prod-eks-cluster-v2&quot; | <span className="text-cyan-400">cdn_domain</span> =
            &quot;d1a2b3c4d5e6f7.cloudfront.net&quot;
          </div>
        </div>
      )
    } else if (trimmed === 'cat skills.json' || trimmed === 'skills') {
      outputNode = (
        <div className="font-mono text-xs md:text-sm bg-black/40 p-3 rounded border border-gray-800 overflow-x-auto">
          <pre className="text-gray-300">
            {`{
  "engineer": "Sushant Sonbarse",
  "role": "DevOps & Cloud Architect",
  "core_competencies": {
    "containers": ["Docker", "Kubernetes (EKS/GKE)", "Helm"],
    "iac": ["Terraform", "Ansible", "CloudFormation"],
    "ci_cd": ["Jenkins", "GitLab CI", "GitHub Actions", "ArgoCD"],
    "monitoring": ["Prometheus", "Grafana", "ELK Stack", "Datadog"],
    "cloud_providers": ["AWS (Certified)", "Google Cloud Platform", "Microsoft Azure"]
  },
  "automation_mindset": "100% Infrastructure as Code | Zero-downtime Deployments"
}`}
          </pre>
        </div>
      )
    } else if (trimmed === 'pipeline status' || trimmed === 'pipeline' || trimmed === 'ci') {
      outputNode = (
        <div className="font-mono text-xs md:text-sm bg-black/40 p-3 rounded border border-gray-800 space-y-2">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1 text-gray-400">
            <span>WORKFLOW</span>
            <span>STATUS</span>
            <span>DURATION</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-blue-400">prod-deploy.yml</span> (main)
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              PASSED
            </span>
            <span className="text-gray-500">2m 14s</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-blue-400">security-scan.yml</span> (daily)
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              0 VULNERABILITIES
            </span>
            <span className="text-gray-500">45s</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-blue-400">terraform-validate.yml</span> (PR #42)
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              PASSED
            </span>
            <span className="text-gray-500">1m 02s</span>
          </div>
        </div>
      )
    } else if (trimmed === '') {
      return
    } else {
      outputNode = (
        <div className="text-rose-400 font-mono">
          Command not found: &quot;{cmd}&quot;. Type{' '}
          <span
            className="text-cyan-400 underline cursor-pointer"
            onClick={() => executeCommand('help')}
          >
            help
          </span>{' '}
          to view available commands.
        </div>
      )
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: cmd,
        output: outputNode,
        timestamp,
      },
    ])
    setCommandList((prev) => [...prev, cmd])
    setHistoryIndex(-1)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandList.length > 0 && historyIndex < commandList.length - 1) {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setInput(commandList[commandList.length - 1 - nextIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1
        setHistoryIndex(nextIndex)
        setInput(commandList[commandList.length - 1 - nextIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  const quickCommands = [
    { label: 'whoami', cmd: 'whoami' },
    { label: 'kubectl get pods', cmd: 'kubectl get pods' },
    { label: 'terraform status', cmd: 'terraform status' },
    { label: 'skills.json', cmd: 'cat skills.json' },
    { label: 'pipeline status', cmd: 'pipeline status' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 shadow-2xl backdrop-blur-xl my-12"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-blue-500" />
            sushant@devops-cluster:~ (zsh)
          </span>
        </div>
        <button
          onClick={() => setHistory(INITIAL_COMMANDS)}
          className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          title="Reset terminal session"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Command Pills */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-black/40 border-b border-gray-200/60 dark:border-gray-800/60 overflow-x-auto text-xs">
        <span className="text-gray-400 font-mono flex items-center gap-1 shrink-0">
          <Play className="w-3 h-3 text-emerald-500" /> Quick runs:
        </span>
        {quickCommands.map((q) => (
          <button
            key={q.cmd}
            onClick={() => executeCommand(q.cmd)}
            className="px-2.5 py-1 rounded-md bg-gray-200/70 dark:bg-gray-800/70 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 font-mono text-gray-700 dark:text-gray-300 transition-all duration-200 shrink-0 border border-transparent hover:border-blue-400/30"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Terminal Output Window */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className="p-4 md:p-6 h-[340px] overflow-y-auto font-mono text-sm space-y-4 cursor-text bg-slate-900 dark:bg-black/80 text-gray-200"
      >
        <div className="text-xs text-gray-500 border-b border-gray-800/80 pb-2 mb-3">
          Type <span className="text-cyan-400 font-bold">help</span> to see available commands or
          click quick run buttons above.
        </div>

        <AnimatePresence>
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                <span className="text-emerald-400 font-bold">sushant@k8s-prod</span>
                <span className="text-gray-600">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-400">$</span>
                <span className="text-white font-semibold">{item.command}</span>
                <span className="ml-auto text-[10px] text-gray-600 select-none">
                  {item.timestamp}
                </span>
              </div>
              <div className="pl-4 border-l-2 border-gray-800/80 text-gray-300">{item.output}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input prompt line */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-emerald-400 font-bold text-xs md:text-sm shrink-0">
            sushant@k8s-prod
          </span>
          <span className="text-gray-600">:</span>
          <span className="text-blue-400 text-xs md:text-sm shrink-0">~</span>
          <span className="text-gray-400 text-xs md:text-sm shrink-0">$</span>
          <div className="flex-1 flex items-center relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type a command (e.g. whoami, kubectl get pods, help)..."
              className="w-full bg-transparent border-none outline-none text-white font-mono text-xs md:text-sm placeholder:text-gray-600 focus:ring-0 p-0"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={() => executeCommand(input)}
              className="text-gray-500 hover:text-cyan-400 p-1 shrink-0 transition-colors"
              title="Execute command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
