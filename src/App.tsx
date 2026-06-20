/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  Cpu, 
  Shield, 
  Activity, 
  Database, 
  Plus, 
  Terminal, 
  RefreshCw, 
  Wifi, 
  Fingerprint, 
  Globe, 
  Server, 
  Sliders, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  TrendingUp, 
  Trash2, 
  X,
  CheckCircle,
  Menu,
  SlidersHorizontal,
  Zap,
  ArrowRight,
  Send,
  Building2,
  Lock,
  Compass,
  FileCode,
  Sparkles,
  HelpCircle,
  Code,
  MousePointer,
  Target
} from 'lucide-react';

// Custom Types
interface NexaNode {
  id: string;
  name: string;
  cluster: 'Quantum Engine' | 'Telemetry Core' | 'Ledger Sync' | 'Access Gateway';
  synapseStrength: number;
  latency: number;
  status: 'Active' | 'Idle' | 'Degraded' | 'Offline';
  throughput: number; // in GB/s
  location: string;
}

interface PerformanceScore {
  efficiency: number;
  uptime: number;
  nodesCount: number;
  bandwidth: number;
}

export default function App() {
  // Navigation & Active Layouts
  const [activeTab, setActiveTab2] = useState<'Storefront' | 'Console' | 'Topology' | 'Sandbox'>('Storefront');
  const [activeNodeFilter, setActiveNodeFilter] = useState<'All' | 'Quantum Engine' | 'Telemetry Core' | 'Ledger Sync' | 'Access Gateway'>('All');
  
  // Mobile Support Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // SLA Solution Builder Sliders
  const [nodesCountInput, setNodesCountInput] = useState(6);
  const [bandwidthSla, setBandwidthSla] = useState(450); // GB/s
  const [syncRateSla, setSyncRateSla] = useState(85); // %
  const [securityGrade, setSecurityGrade] = useState<'Standard' | 'Zero-Trust' | 'Military-Grade'>('Zero-Trust');

  // Interactive Live Sandbox Provisioner State
  const [sandboxClientName, setSandboxClientName] = useState('Aashvee Solutions');
  const [sandboxPreset, setSandboxPreset] = useState<'Decentralized AI' | 'Quantum Secure Tunnel' | 'High-Frequency Sync' | 'Custom Infrastructure'>('Decentralized AI');
  const [isSandboxProvisioning, setIsSandboxProvisioning] = useState(false);
  const [sandboxProgress, setSandboxProgress] = useState(0);
  const [provisionedHistory, setProvisionedHistory] = useState<Array<{ id: string; client: string; type: string; timestamp: string; nodes: number; status: 'ACTIVE' | 'DECOMMISSIONED' }>>([
    { id: 'sb-1', client: 'Aashvee Tech Inc', type: 'Decentralized AI Grid', timestamp: '14:24:10', nodes: 8, status: 'ACTIVE' },
    { id: 'sb-2', client: 'Cognito Core Corp', type: 'Quantum Secure Tunnel', timestamp: '14:18:22', nodes: 4, status: 'ACTIVE' }
  ]);

  // Command Line CLI Console State
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<Array<{ text: string; type: 'command' | 'success' | 'info' | 'error' }>>([
    { text: 'Nexa Forge Advanced OS Shell v1.0.0', type: 'info' },
    { text: 'Type "help" to list available operational commands.', type: 'info' },
    { text: 'Initial handshake check: OK. Key systems online.', type: 'success' }
  ]);

  // Security Toggles
  const [ipFilterActive, setIpFilterActive] = useState(true);
  const [hardwareKeysMandatory, setHardwareKeysMandatory] = useState(true);
  const [mfaEnforcement, setMfaEnforcement] = useState(true);
  const [networkIsolation, setNetworkIsolation] = useState(false);

  // Dynamic Telemetry State variables
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  const [isOptimizingGrid, setIsOptimizingGrid] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(null);

  // Contact form state
  const [contactFormName, setContactFormName] = useState('');
  const [contactFormEmail, setContactFormEmail] = useState('');
  const [contactFormMessage, setContactFormMessage] = useState('');
  const [contactFormSuccess, setContactFormSuccess] = useState(false);

  // Active Live Nodes state (Focus on Nexa Forge Intelligence Systems)
  const [nodes, setNodes] = useState<NexaNode[]>([
    { id: '1', name: 'NEX_Quantum_Core_01', cluster: 'Quantum Engine', synapseStrength: 99.4, latency: 0.85, status: 'Active', throughput: 18.4, location: 'Virginia, US' },
    { id: '2', name: 'NEX_Telemetry_Sec_02', cluster: 'Telemetry Core', synapseStrength: 98.1, latency: 1.12, status: 'Active', throughput: 15.2, location: 'Dublin, IE' },
    { id: '3', name: 'NEX_Ledger_Balance_Alpha', cluster: 'Ledger Sync', synapseStrength: 99.6, latency: 0.74, status: 'Active', throughput: 22.1, location: 'Frankfurt, DE' },
    { id: '4', name: 'NEX_Edge_Node_04', cluster: 'Quantum Engine', synapseStrength: 92.4, latency: 3.10, status: 'Active', throughput: 12.8, location: 'Singapore, SG' },
    { id: '5', name: 'NEX_Access_Gateway_Beta', cluster: 'Access Gateway', synapseStrength: 85.0, latency: 12.42, status: 'Degraded', throughput: 4.5, location: 'Tokyo, JP' },
    { id: '6', name: 'NEX_Sync_Standby_Shadow', cluster: 'Ledger Sync', synapseStrength: 0, latency: 0, status: 'Offline', throughput: 0, location: 'Oregon, US' }
  ]);

  // Selected Node detailed inspector
  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>('1');

  // Form states for deploying a customized node
  const [isDeployNodeModalOpen, setIsDeployNodeModalOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeCluster, setNewNodeCluster] = useState<NexaNode['cluster']>('Quantum Engine');
  const [newNodeLocation, setNewNodeLocation] = useState('Frankfurt, DE');
  const [newNodePerformance, setNewNodePerformance] = useState<'Standard' | 'Hyper-Drive'>('Standard');

  // Dynamic values calculation via useMemo
  const metricsScore = useMemo<PerformanceScore>(() => {
    const activeNodes = nodes.filter(n => n.status === 'Active');
    const nodesCount = activeNodes.length;
    if (nodesCount === 0) {
      return { efficiency: 0, uptime: 95.0, nodesCount: 0, bandwidth: 0 };
    }
    const sumStrength = activeNodes.reduce((acc, n) => acc + n.synapseStrength, 0);
    const sumThroughput = activeNodes.reduce((acc, n) => acc + n.throughput, 0);
    const efficiency = parseFloat((sumStrength / nodesCount).toFixed(2));
    const bandwidth = parseFloat(sumThroughput.toFixed(1));
    return {
      efficiency,
      uptime: networkIsolation ? 99.99 : 99.92,
      nodesCount: nodes.length,
      bandwidth
    };
  }, [nodes, networkIsolation]);

  // Cursor Mode State and Coordinates System (Smooth interpolated tracking)
  const [cursorMode, setCursorMode] = useState<'standard' | 'crosshair' | 'reticle' | 'laser' | 'neural'>('standard');
  const [cursorTrailSpeed, setCursorTrailSpeed] = useState<'instant' | 'fluid' | 'cinematic'>('fluid');
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [mouseSmoothCenter, setMouseSmoothCenter] = useState({ x: -100, y: -100 });
  const [mouseSmoothOuter, setMouseSmoothOuter] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isCursorWidgetOpen, setIsCursorWidgetOpen] = useState(false);

  useEffect(() => {
    let targetX = -100;
    let targetY = -100;
    let centerX = -100;
    let centerY = -100;
    let outerX = -100;
    let outerY = -100;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updateSmoothCoords = () => {
      // Dynamic trail weights based on smooth mode
      let speedCenter = 0.22;
      let speedOuter = 0.082;
      
      if (cursorTrailSpeed === 'instant') {
        speedCenter = 1.0;
        speedOuter = 1.0;
      } else if (cursorTrailSpeed === 'cinematic') {
        speedCenter = 0.10;
        speedOuter = 0.04;
      }

      centerX += (targetX - centerX) * speedCenter;
      centerY += (targetY - centerY) * speedCenter;

      outerX += (targetX - outerX) * speedOuter;
      outerY += (targetY - outerY) * speedOuter;

      setMouseSmoothCenter({ x: centerX, y: centerY });
      setMouseSmoothOuter({ x: outerX, y: outerY });
      setMousePos({ x: targetX, y: targetY });

      // Detect interactable items under coordinates
      const element = document.elementFromPoint(targetX, targetY);
      if (element) {
        const style = window.getComputedStyle(element);
        const isClickable = 
          style.cursor === 'pointer' || 
          element.closest('button') || 
          element.closest('a') || 
          element.closest('[role="button"]') ||
          element.classList.contains('cursor-pointer');
        setIsHoveringClickable(!!isClickable);
      }

      animationFrameId = requestAnimationFrame(updateSmoothCoords);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updateSmoothCoords);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorTrailSpeed]);

  // Time & fluctuation loops
  useEffect(() => {
    const interval = setInterval(() => {
      // Dynamic fluctuations
      setNodes(prevNodes => prevNodes.map(node => {
        if (node.status === 'Active') {
          const deltaStrength = (Math.random() - 0.5) * 0.8;
          const deltaLatency = (Math.random() - 0.5) * 0.15;
          const deltaThroughput = (Math.random() - 0.5) * 1.2;

          return {
            ...node,
            synapseStrength: parseFloat(Math.min(100, Math.max(70, node.synapseStrength + deltaStrength)).toFixed(2)),
            latency: parseFloat(Math.max(0.1, node.latency + deltaLatency).toFixed(2)),
            throughput: parseFloat(Math.max(1, node.throughput + deltaThroughput).toFixed(2))
          };
        }
        return node;
      }));

      setCurrentTime(new Date().toISOString());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Preset configuration when SLA variables slide
  const calculatedPricingQuote = useMemo(() => {
    const baseValue = 1250;
    const nodeCost = nodesCountInput * 280;
    const bandwidthCost = bandwidthSla * 1.5;
    const gradeMultiplier = securityGrade === 'Military-Grade' ? 1.8 : securityGrade === 'Zero-Trust' ? 1.3 : 1.0;
    return Math.floor((baseValue + nodeCost + bandwidthCost) * gradeMultiplier);
  }, [nodesCountInput, bandwidthSla, securityGrade]);

  // Client Simulation Node provisioner
  const handleProvisionSandbox = () => {
    if (isSandboxProvisioning) return;
    setIsSandboxProvisioning(true);
    setSandboxProgress(0);

    // CLI Integration
    setCliHistory(prev => [
      ...prev,
      { text: `SDIR -> Initializing Sandbox cluster request: Client [${sandboxClientName}] Preset [${sandboxPreset}]`, type: 'info' }
    ]);

    const timer = setInterval(() => {
      setSandboxProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsSandboxProvisioning(false);
          
          // Generate new virtual node in current visible list
          const targetLocation = 'Global Edge Gateway';
          const nodeName = `V_GATE_${sandboxClientName.toUpperCase().replace(/\s+/g, '_')}_${Math.floor(Math.random() * 90 + 10)}`;
          
          const createdNode: NexaNode = {
            id: `sb-node-${Date.now()}`,
            name: nodeName,
            cluster: sandboxPreset === 'Quantum Secure Tunnel' ? 'Telemetry Core' : sandboxPreset === 'High-Frequency Sync' ? 'Ledger Sync' : 'Quantum Engine',
            synapseStrength: 98.8,
            latency: 0.92,
            status: 'Active',
            throughput: parseFloat((18 + Math.random() * 15).toFixed(1)),
            location: targetLocation
          };

          setNodes(prev => [...prev, createdNode]);
          setProvisionedHistory(prev => [
            {
              id: `sb-${Date.now()}`,
              client: sandboxClientName,
              type: `${sandboxPreset} Cluster Grid`,
              timestamp: new Date().toTimeString().split(' ')[0],
              nodes: 1,
              status: 'ACTIVE'
            },
            ...prev
          ]);

          setCliHistory(hist => [
            ...hist,
            { text: `SUCCESS -> Virtualized node [${nodeName}] provisioned. Sync established at 100% capacity.`, type: 'success' }
          ]);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Deployment handler for official custom Nexa node
  const handleOfficialNodeDeploy = (e: FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const cleanName = newNodeName.trim().toUpperCase().replace(/\s+/g, '_');
    const isHyperVal = newNodePerformance === 'Hyper-Drive';

    const freshlyProvisioned: NexaNode = {
      id: `${nodes.length + 1}`,
      name: `NEX_${cleanName}`,
      cluster: newNodeCluster,
      synapseStrength: isHyperVal ? 99.9 : 94.5,
      latency: isHyperVal ? 0.35 : 1.25,
      status: 'Active',
      throughput: isHyperVal ? 32.5 : 15.6,
      location: newNodeLocation
    };

    setNodes(prev => [...prev, freshlyProvisioned]);
    setCliHistory(prev => [
      ...prev,
      { text: `CMD -> Authorized provision of new nodeset: ${freshlyProvisioned.name} at location ${newNodeLocation}`, type: 'success' }
    ]);

    setIsDeployNodeModalOpen(false);
    setNewNodeName('');
  };

  // Toggle Nodes Online Offline Degradation
  const toggleNodeStatusCycle = (nodeId: string) => {
    setNodes(current => current.map(node => {
      if (node.id === nodeId) {
        const statuses: NexaNode['status'][] = ['Active', 'Idle', 'Degraded', 'Offline'];
        const currentIdx = statuses.indexOf(node.status);
        const nextStatus = statuses[(currentIdx + 1) % statuses.length];

        const outputStrength = nextStatus === 'Active' ? 99.0 : nextStatus === 'Idle' ? 45.0 : nextStatus === 'Degraded' ? 15.2 : 0;
        const outputLatency = nextStatus === 'Active' ? 0.75 : nextStatus === 'Idle' ? 4.10 : nextStatus === 'Degraded' ? 45.15 : 0;
        const outputTP = nextStatus === 'Active' ? 20.2 : nextStatus === 'Idle' ? 3.4 : nextStatus === 'Degraded' ? 0.5 : 0;

        return {
          ...node,
          status: nextStatus,
          synapseStrength: outputStrength,
          latency: outputLatency,
          throughput: outputTP
        };
      }
      return node;
    }));
  };

  // Terminate a node
  const terminateNodeHandle = (nodeId: string) => {
    const toDelete = nodes.find(n => n.id === nodeId);
    if (!toDelete) return;

    setNodes(prev => prev.filter(n => n.id !== nodeId));
    if (inspectedNodeId === nodeId) {
      setInspectedNodeId(null);
    }

    setCliHistory(prev => [
      ...prev,
      { text: `ALERT -> Terminated node transponder [${toDelete.name}] safely. Synaptic routes rerouted.`, type: 'error' }
    ]);
  };

  // Run Global Synapse Optimization progress bar
  const triggerGlobalCoreOptimization = () => {
    if (isOptimizingGrid) return;
    setIsOptimizingGrid(true);
    setOptimizationProgress(0);

    setCliHistory(prev => [
      ...prev,
      { text: 'CMD -> Initiated global system reweighting and load calibration.', type: 'info' }
    ]);

    const timer = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsOptimizingGrid(false);

          // Calibrate active nodes to absolute peak parameters
          setNodes(prevNodes => prevNodes.map(node => {
            if (node.status === 'Active') {
              return {
                ...node,
                synapseStrength: parseFloat((Math.min(99.9, node.synapseStrength + (100 - node.synapseStrength) * 0.5)).toFixed(2)),
                latency: parseFloat((Math.max(0.15, node.latency * 0.7)).toFixed(2))
              };
            }
            return node;
          }));

          setCliHistory(hist => [
            ...hist,
            { text: 'SUCCESS -> Grid optimization completed. Sub-microsecond latency boundaries reached.', type: 'success' }
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // CLI execute commands
  const handleCliSubmitCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const text = cliInput.trim();
    const commandLower = text.toLowerCase();
    
    let answerText = '';
    let responseType: 'success' | 'info' | 'error' = 'info';

    if (commandLower === 'help') {
      answerText = 'Available commands: help | sysinfo | status | verify | optimize | nodes | clear | ping <node_name>';
    } else if (commandLower === 'sysinfo') {
      answerText = `NEXA FORGE CORE OS v1.0 // Uptime Rate: ${metricsScore.uptime}% // Bandwidth limit: ${metricsScore.bandwidth} GB/s // Sync Strategy: Zero-Trust SHA256`;
      responseType = 'success';
    } else if (commandLower === 'status') {
      answerText = `System Status: NOMINAL // Active Core Processing Load: ${metricsScore.efficiency}% // Active Secure Sessions: 1,844`;
      responseType = 'success';
    } else if (commandLower === 'verify') {
      answerText = `Secured Key Gateway Access status: APPROVED [MFA Required: ${hardwareKeysMandatory ? 'YES' : 'NO'}]`;
      responseType = 'success';
    } else if (commandLower === 'optimize') {
      triggerGlobalCoreOptimization();
      answerText = 'Invoking global telemetry optimization system...';
    } else if (commandLower === 'nodes') {
      const activeText = nodes.map(n => `[${n.name}: ${n.status}]`).join(' , ');
      answerText = `Cluster Manifest: ${activeText}`;
    } else if (commandLower === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    } else if (commandLower.startsWith('ping ')) {
      const target = text.substring(5).toUpperCase();
      const match = nodes.find(n => n.name.toUpperCase() === target);
      if (match) {
        if (match.status === 'Active') {
          answerText = `Reply from ${match.name} [IP: 10.42.0.${match.id}]: time=${match.latency}ms strength=${match.synapseStrength}%`;
          responseType = 'success';
        } else {
          answerText = `Destination host [${match.name}] is unreachable. Current state is: ${match.status}`;
          responseType = 'error';
        }
      } else {
        answerText = `Unrecognized node signature: [${target}]. Double check typography.`;
        responseType = 'error';
      }
    } else {
      answerText = `Syntax Error: command "[${text}]" unrecognized. Query "help" for instructions list.`;
      responseType = 'error';
    }

    setCliHistory(prev => [
      ...prev,
      { text: `guest@nexaforge:~$ ${text}`, type: 'command' },
      { text: answerText, type: responseType }
    ]);
    setCliInput('');
  };

  // Submit Contact Form
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactFormName.trim() || !contactFormEmail.trim() || !contactFormMessage.trim()) return;
    setContactFormSuccess(true);
    setCliHistory(prev => [
      ...prev,
      { text: `OPERATOR -> Recorded incoming client enterprise request from ${contactFormName} [${contactFormEmail}]`, type: 'success' }
    ]);
    setTimeout(() => {
      setContactFormSuccess(false);
      setContactFormName('');
      setContactFormEmail('');
      setContactFormMessage('');
    }, 5000);
  };

  // Filtered list of nodes
  const filteredNodesList = useMemo(() => {
    if (activeNodeFilter === 'All') return nodes;
    return nodes.filter(n => n.cluster === activeNodeFilter);
  }, [nodes, activeNodeFilter]);

  // Visual latency graph simulation levels
  const currentLevelGraphSim = useMemo(() => {
    return [40, 52, 75, 82, 38, 92, 60, 48, 88, 56, 73, 44, 91, 79, 66, 85];
  }, []);

  return (
    <div className={`flex flex-col min-h-screen bg-[#070708] text-slate-300 font-sans antialiased overflow-x-hidden ${cursorMode !== 'standard' ? 'cursor-none' : ''}`}>
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <nav id="navbar-central" className="flex items-center justify-between h-16 shrink-0 px-4 md:px-8 bg-[#0B0B0D] border-b border-white/5 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburguer trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
            title="Menu"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>

          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/10 hover:skew-x-3 transition-transform duration-300 cursor-pointer">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-[0.15em] text-white">NEXA FORGE<span className="text-cyan-400">.</span></span>
            <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase">INTELLIGENCE SYSTEMS</span>
          </div>
        </div>

        {/* Desktop Main Navigation Tabs */}
        <div className="hidden md:flex gap-1.5 lg:gap-3 text-xs lg:text-sm font-semibold text-slate-400">
          {[
            { id: 'Storefront', label: 'Company Overview' },
            { id: 'Console', label: 'Operational Console' },
            { id: 'Topology', label: 'Network router topology' },
            { id: 'Sandbox', label: 'Client Provisioner sandbox' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                id={`central-tab-btn-${tab.id.toLowerCase()}`}
                key={tab.id}
                onClick={() => setActiveTab2(tab.id as any)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 relative cursor-pointer ${
                  isActive 
                    ? 'text-white bg-white/[0.04] border border-white/10 shadow-lg shadow-black/40' 
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global SLA quote estimation pill */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end border-r border-white/10 pr-4">
            <span className="text-[8px] text-slate-500 font-mono tracking-widest">ESTIMATED SLA STANDARD VALUE CODEBOOK</span>
            <span className="text-xs font-black text-cyan-400 font-mono">${calculatedPricingQuote.toLocaleString()}/mo</span>
          </div>

          {/* Secure Access Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">GATEWAY CONNECTED</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                NEX_ADMIN_SSL
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span className="text-sm font-extrabold tracking-[0.15em] text-white">NEXA FORGE</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium">
            {[
              { id: 'Storefront', label: 'Company Overview & Services' },
              { id: 'Console', label: 'Live Operational Console' },
              { id: 'Topology', label: 'Network Router Topology' },
              { id: 'Sandbox', label: 'Enterprise Provisioning Sandbox' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab2(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-500/40 text-cyan-400 font-bold' 
                      : 'border-transparent text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-2">DYNAMIC SOLUTIONS QUOTE</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">${calculatedPricingQuote.toLocaleString()}/mo</div>
            <p className="text-xs text-slate-500 mt-2">Adjust your infrastructure requirement SLA dynamically inside the Client Sandbox.</p>
          </div>
        </div>
      )}

      {/* 2. CORE LAYOUT VIEWPORTS */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* TAB 1: STOREFRONT & PRODUCTS SUITE */}
        {activeTab === 'Storefront' && (
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 flex flex-col gap-12 max-w-7xl mx-auto w-full">
            
            {/* HERO INTRODUCTION */}
            <header className="relative bg-[#0E0F12] border border-white/5 p-6 md:p-12 rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
              {/* Absolutes decorative glow circles */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex-1 flex flex-col gap-4 relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-full text-xs font-semibold self-center lg:self-start">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  NEXA FORGE ENTERPRISE PORTAL ACTIVE
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Nexa Forge <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Enterprise Intelligence</span>
                </h1>
                
                <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl">
                  Nexa Forge Intelligence Systems designs ultra-safe, high-performance distributed networking solutions. We architect decentralized cognitive networks, instant cryptographic synchronization registries, and military-grade SSL gateways to power multi-company consortium infrastructures with zero-trust integrity.
                </p>

                <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => setActiveTab2('Console')}
                    className="px-6 py-3 bg-white text-black hover:bg-slate-200 font-extrabold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-white/5"
                  >
                    Open Live Core Console
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                  <button 
                    onClick={() => setActiveTab2('Sandbox')}
                    className="px-6 py-3 bg-[#1A1B20] hover:bg-[#25272F] text-slate-300 border border-white/10 font-bold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    Launch Client Sandbox
                  </button>
                </div>
              </div>

              {/* STATS HIGHLIGHT COMPANION VISUAL */}
              <div className="w-full lg:w-96 bg-[#14151B] border border-white/5 p-6 rounded-2xl relative">
                <h4 className="text-xs uppercase font-extrabold font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Global Core Telemetry metrics
                </h4>

                <div className="space-y-4">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Operational Speed</span>
                      <span className="text-lg font-black text-white font-mono">{metricsScore.bandwidth} GB/s</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-cyan-950 text-cyan-400 rounded border border-cyan-500/20">Optimized</span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Encrypted Core Uptime</span>
                      <span className="text-lg font-black text-white font-mono">{metricsScore.uptime}%</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/20">Nominal Uptime</span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Core Sync Strength</span>
                      <span className="text-lg font-black text-white font-mono">{metricsScore.efficiency.toFixed(1)}%</span>
                    </div>
                    <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full" style={{ width: `${metricsScore.efficiency}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Micro Live ping indicators */}
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>SSL_SECURE_CIPHER</span>
                  <span className="text-cyan-400 animate-pulse">● TLS_1.3_AES_GCM</span>
                </div>
              </div>
            </header>

            {/* THREE COLUMN ADVANCED PRODUCT SHOWCASE */}
            <section className="flex flex-col gap-6">
              <div className="text-center md:text-left">
                <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">THE NEXA FORGE PRODUCT ARCHITECTURE</span>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-wide mt-1">Our Integrated Suite of High-Trust Solutions</h3>
                <p className="text-slate-400 text-xs mt-1">Robust components designed to integrate cleanly or deploy as independent networks.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Product 1: Quantum Bridge */}
                <div className="bg-[#0D0E11] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    
                    <h4 className="text-base font-bold text-white tracking-tight mb-2">Quantum Core Compute & Nodes</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Deploy virtual or bare-metal edge transponders with ultra-low overhead latencies. Dynamic node resource provisioning distributes high computational tasks with automatic fallback protection.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">CAPABILITY ACCELERATOR</span>
                    <span className="text-[11px] font-semibold text-cyan-400 font-mono">Dynamic Node Synthesis Engine</span>
                  </div>
                </div>

                {/* Product 2: High Frequency Sync */}
                <div className="bg-[#0D0E11] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 group">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    
                    <h4 className="text-base font-bold text-white tracking-tight mb-2">High-Frequency Ledger Sync Registry</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      A state-of-the-art secure synchronization hub providing 256-bit AES mirror encryption. Perfect for continuous database balance and real-time offline network resilience.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">SHARED STORAGE SCHEMATIC</span>
                    <span className="text-[11px] font-semibold text-indigo-400 font-mono">High-Throughput Cryptographic Mirroring</span>
                  </div>
                </div>

                {/* Product 3: Secure Zero Trust Access */}
                <div className="bg-[#0D0E11] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 group">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5" />
                    </div>
                    
                    <h4 className="text-base font-bold text-white tracking-tight mb-2">Zero-Trust Security & Access Gateway</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Implement strict endpoint security, mandatory physical hardware keys, hardware token checks, and instant global network isolation when potential drift is observed.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">PROTECTION ALGORITHM</span>
                    <span className="text-[11px] font-semibold text-emerald-400 font-mono">IP Filter Firewall & Hardware MFA</span>
                  </div>
                </div>

              </div>
            </section>

            {/* DYNAMIC CASE STUDY & CLIENT CORNER */}
            <section className="bg-[#0E0F12] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">NEXA FORGE CONSORTIUM PORTFOLIO</span>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Showcased Custom Deployment Configurations</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Companies deploy specialized configurations of Nexa Forge's dynamic architecture. Use our **Client Provisioner Sandbox** tab to mock configurations instantly, load balancing custom presets for standard algorithmic research, quantum data mirroring, or distributed ledger synchronization.
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex -space-x-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-900 border border-[#0E0F12] flex items-center justify-center text-[10px] font-extrabold text-white">AT</div>
                    <div className="w-8 h-8 rounded-full bg-indigo-900 border border-[#0E0F12] flex items-center justify-center text-[10px] font-extrabold text-white">CC</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-900 border border-[#0E0F12] flex items-center justify-center text-[10px] font-extrabold text-white">NG</div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Simulating live enterprise integrations</span>
                </div>
              </div>

              {/* DEMO INTEGRATION VISUAL */}
              <div className="w-full lg:w-[450px] bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3.5">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
                  <span>ACTIVE SANDBOX CLUSTERS</span>
                  <span className="text-cyan-400 text-[10px]">REAL-TIME ACTIVE</span>
                </div>

                <div className="space-y-2">
                  {provisionedHistory.slice(0, 3).map((hist) => (
                    <div key={hist.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center hover:border-cyan-500/20 transition-all font-mono">
                      <div>
                        <span className="text-xs font-bold text-white block">{hist.client}</span>
                        <span className="text-[9px] text-slate-500">{hist.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-semibold block">● ACTIVE</span>
                        <span className="text-[9px] text-slate-500">{hist.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab2('Sandbox')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/20 text-xs font-extrabold text-cyan-400 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Configure Custom Sandbox Enterprise Preset
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* HIGH-CONVERTING INQUIRY FORM */}
            <section className="bg-gradient-to-tr from-[#0F1015] to-[#0A0A0E] border border-cyan-500/10 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto w-full">
              <div className="text-center mb-6">
                <h4 className="text-lg font-black text-white tracking-wide">Request a Deployment Consultation</h4>
                <p className="text-xs text-slate-400 mt-1">Provide your details to speak with a Nexa Forge solutions architect regarding secure edge nodes or ledger registry.</p>
              </div>

              {contactFormSuccess ? (
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3 animate-fade-in">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h5 className="text-sm font-semibold text-white">Specification Payload Transmitted Successfully</h5>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">We have registered your payload variables. Our solutions design team will ping secure SSL handshakes down your provided port email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Full Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="John Doe"
                        value={contactFormName}
                        onChange={(e) => setContactFormName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Enterprise Email</label>
                      <input 
                        type="email"
                        required
                        placeholder="john@enterprise.com"
                        value={contactFormEmail}
                        onChange={(e) => setContactFormEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Integration Specification Details</label>
                    <textarea 
                      required
                      placeholder="Please details parameters for nodes, latency requirements, global security air-gaps, or database scale."
                      rows={4}
                      value={contactFormMessage}
                      onChange={(e) => setContactFormMessage(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-xs text-black font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transmit Specification Parameters
                  </button>
                </form>
              )}
            </section>

          </div>
        )}

        {/* TAB 2: LIVE OPERATIONAL CONSOLE */}
        {activeTab === 'Console' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[calc(100vh-4rem)]">
            
            {/* LEFT AREA: NODES CONTROLS */}
            <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto gap-5 min-w-0">
              
              {/* Context Header */}
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0E0F12] border border-white/5 p-4 rounded-2xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">Nexa Forge Live Transponders Node monitor</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide mt-1">Secure Grid Cluster Nodes</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Deploy, inspect and change live transponder performance limits in realtime.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-1">
                  {(['All', 'Quantum Engine', 'Telemetry Core', 'Ledger Sync', 'Access Gateway'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveNodeFilter(filter)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono tracking-tight transition-all cursor-pointer ${
                        activeNodeFilter === filter 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'bg-[#15161A] text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </header>

              {/* Optimizing banner check */}
              {isOptimizingGrid && (
                <div className="bg-[#0E1014] border border-cyan-500/20 p-4 rounded-2xl flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Load balancing transponders matrices...
                    </span>
                    <span className="text-cyan-400 font-bold font-mono">{optimizationProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${optimizationProgress}%` }} />
                  </div>
                </div>
              )}

              {/* CORE ACTIVE NODES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNodesList.map((node) => {
                  const isInspected = inspectedNodeId === node.id;
                  const statusColors = {
                    Active: 'bg-emerald-500 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
                    Idle: 'bg-amber-500 text-amber-500 border-amber-500/20 shadow-amber-500/10',
                    Degraded: 'bg-rose-500 text-rose-500 border-rose-500/20 shadow-rose-500/10',
                    Offline: 'bg-slate-700 text-slate-500 border-slate-500/20 shadow-none'
                  };

                  return (
                    <div 
                      key={node.id}
                      onClick={() => setInspectedNodeId(node.id)}
                      className={`relative bg-[#0E0F12] border p-4.5 rounded-2xl transition-all duration-150 flex flex-col justify-between cursor-pointer group ${
                        isInspected 
                          ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5' 
                          : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                      }`}
                    >
                      <div>
                        {/* Title block */}
                        <div className="flex justify-between items-start mb-2.5">
                          <div className="max-w-[75%]">
                            <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">{node.cluster}</span>
                            <h4 className="text-xs font-black text-white truncate tracking-wide mt-0.5">{node.name}</h4>
                          </div>
                          
                          {/* Circle state */}
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNodeStatusCycle(node.id);
                            }}
                            title="Cycle node state"
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${statusColors[node.status]} cursor-pointer`}
                          >
                            ● {node.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="text-[10px] text-slate-500 font-mono mb-3 flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-slate-500" />
                          {node.location}
                        </div>

                        {/* Mini telemetry rows */}
                        <div className="grid grid-cols-2 gap-2 bg-black/40 p-2 rounded-xl text-center font-mono text-[10px]">
                          <div>
                            <span className="block text-[8px] text-slate-600 uppercase">Throughput</span>
                            <span className="text-white font-bold">{node.status === 'Offline' ? '0.0' : node.throughput.toFixed(1)} GB/s</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-600 uppercase">Synapse Latency</span>
                            <span className="text-cyan-400 font-bold">{node.status === 'Offline' ? '---' : `${node.latency}ms`}</span>
                          </div>
                        </div>
                      </div>

                      {/* Small node interaction buttons */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10px] font-mono">
                        <span className="text-slate-600">STRENGTH: {node.status === 'Offline' ? '0%' : `${node.synapseStrength}%`}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNodeStatusCycle(node.id);
                            }}
                            className="bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 p-1 rounded transition-colors text-slate-500 cursor-pointer"
                            title="Toggle state"
                          >
                            <RefreshCw className="w-3 h-3 animate-pulse" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              terminateNodeHandle(node.id);
                            }}
                            className="bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 p-1 rounded transition-colors text-slate-500 cursor-pointer"
                            title="Terminate node safely"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Provision custom node trigger box */}
                <div 
                  onClick={() => setIsDeployNodeModalOpen(true)}
                  className="bg-black/30 border border-dashed border-white/10 hover:border-cyan-500/40 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 text-center group cursor-pointer transition-colors"
                >
                  <Plus className="w-8 h-8 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <div>
                    <h5 className="text-xs font-bold text-white tracking-wide">Configure New Official NEX Transponder</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Specify locations and sync presets.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN AREA: CENTRAL CONSOLE INTERFACE */}
            <aside className="w-full lg:w-96 bg-[#0B0B0D] border-l border-white/5 flex flex-col shrink-0">
              
              {/* Selected Node Detailed Profiler */}
              <div className="p-4 md:p-6 border-b border-white/5">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex justify-between items-center">
                  <span>Selected Node Inspector</span>
                  <Activity className="w-3.5 h-3.5" />
                </div>

                {inspectedNodeId ? (() => {
                  const match = nodes.find(n => n.id === inspectedNodeId);
                  if (!match) return <p className="text-xs text-slate-500">Transponder record not detected.</p>;
                  return (
                    <div className="space-y-4 font-mono select-text">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-white">{match.name}</h4>
                          <span className="text-[9px] text-slate-500">{match.cluster.toUpperCase()} SECURE SCHEME</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded uppercase font-bold">Node online</span>
                      </div>

                      <div className="space-y-2 bg-black/40 p-3.5 rounded-xl text-xs border border-white/5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Core ID:</span>
                          <span className="text-slate-300">00X42_NEX_{match.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Node Sync IP:</span>
                          <span className="text-cyan-400">10.42.0.{match.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Deployment SLA:</span>
                          <span className="text-slate-300">SLA-GRADE-99.98</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Deployment Location:</span>
                          <span className="text-white">{match.location}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-[10px]">
                          <span className="text-slate-500">NODE RESILIENCE CAPACITY</span>
                          <span className="text-cyan-400 font-bold">{match.synapseStrength}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full" style={{ width: `${match.synapseStrength}%` }}></div>
                        </div>
                      </div>

                      <button 
                        onClick={() => toggleNodeStatusCycle(match.id)}
                        className="w-full py-2 bg-[#17181C] hover:bg-[#202128] border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold font-mono transition-colors cursor-pointer"
                      >
                        Cycle Operational Mode
                      </button>
                    </div>
                  );
                })() : (
                  <p className="text-xs text-slate-500 italic">Select any active node in the grid console to begin secure inspection diagnostics.</p>
                )}
              </div>

              {/* INTEGRATED MANUAL COMMAND SHELL WINDOW */}
              <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden max-h-[400px] lg:max-h-none">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                  <span>NEX COMMAND SHELL</span>
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                </div>

                {/* Console Log Area */}
                <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-3.5 font-mono text-[10px] space-y-1.5 overflow-y-auto min-h-[140px] select-text">
                  {cliHistory.map((item, index) => {
                    const colorStyles = {
                      command: 'text-indigo-400 font-bold',
                      success: 'text-emerald-400',
                      info: 'text-slate-500',
                      error: 'text-rose-400 font-semibold'
                    };
                    return (
                      <div key={index} className="leading-relaxed">
                        <span className={colorStyles[item.type]}>{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Shell Input Form */}
                <form onSubmit={handleCliSubmitCommand} className="mt-3 flex gap-2">
                  <input 
                    type="text"
                    placeholder="Type sysinfo, status, verify, optimize, clear, help..."
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    className="flex-1 bg-[#121215] border border-white/10 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="px-3 py-2 bg-[#1C1D24] text-cyan-400 hover:text-white hover:bg-cyan-500 hover:text-black border border-cyan-400/20 hover:border-transparent rounded-xl transition-all cursor-pointer font-bold text-xs"
                  >
                    RUN
                  </button>
                </form>
              </div>

            </aside>

          </div>
        )}

        {/* TAB 3: NETWORK ROUTER TOPOLOGY */}
        {activeTab === 'Network Router Topology' || activeTab === 'Topology' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
            
            {/* Header schema */}
            <header className="bg-[#0E0F12] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">NEXA FORGE NETWORK ROUTING TOPOLOGY MAP</span>
                <h3 className="text-lg font-black text-white tracking-tight mt-0.5">Live Operational Router Map</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Interactive relationship visualizer highlighting direct sync tunnels, encryption gateways, and signal routes across our international node structure.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-xs font-mono text-cyan-400 font-bold">100% SIGNAL HEALTH</span>
              </div>
            </header>

            {/* ARTISTIC SCHEMATIC CANVAS DIAGRAM CONTAINER */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden min-h-[350px] md:min-h-[450px] flex items-center justify-center">
              {/* Subtle tech background circle lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1A1D24_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
              <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] border border-cyan-500/5 rounded-full animate-pulse pointer-events-none"></div>
              <div className="absolute w-[150px] h-[150px] md:w-[220px] md:h-[220px] border border-indigo-500/5 rounded-full pointer-events-none"></div>

              {/* CENTRAL NODE */}
              <div className="absolute z-20 flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 border border-cyan-400/40 flex items-center justify-center shadow-xl shadow-cyan-500/20 active:scale-95 transition-all">
                  <Cpu className="w-6 h-6 md:w-7 md:h-7 text-white animate-spin" style={{ animationDuration: '15s' }} />
                </div>
                <span className="text-[10px] font-mono text-white mt-2 bg-[#141519] border border-white/10 px-2.5 py-1 rounded-full font-bold">
                  NEX_CENTRAL_CORE
                </span>
              </div>

              {/* FLATING PERIPHERAL ACTIVE NODES MAP (Symmetrical alignment) */}
              {[
                { name: 'NEX_Quantum_Core_01', top: '15%', left: '20%', color: 'from-cyan-400 to-cyan-600', location: 'Virginia, US' },
                { name: 'NEX_Telemetry_Sec_02', top: '20%', left: '78%', color: 'from-indigo-400 to-indigo-600', location: 'Dublin, IE' },
                { name: 'NEX_Ledger_Balance_Alpha', top: '75%', left: '70%', color: 'from-purple-400 to-purple-600', location: 'Frankfurt, DE' },
                { name: 'NEX_Edge_Node_04', top: '70%', left: '25%', color: 'from-emerald-400 to-emerald-600', location: 'Singapore, SG' }
              ].map((point, index) => (
                <div key={index} className="absolute z-10 flex flex-col items-center group cursor-pointer" style={{ top: point.top, left: point.left }}>
                  {/* Floating ticker thread lines to center using CSS borders as pseudo connector bars */}
                  <div className="hidden md:block absolute top-1/2 left-1/2 -z-10 w-24 h-0.5 bg-gradient-to-r from-transparent to-cyan-500/20 origin-left rotate-45 transform pointer-events-none group-hover:bg-cyan-400/40 transition-colors"></div>
                  
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${point.color} p-0.5 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-black/50`}>
                    <div className="w-full h-full bg-[#121215] rounded-full flex items-center justify-center">
                      <Server className="w-4.5 h-4.5 text-white/90" />
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1.5 bg-black/80 px-2 py-0.5 rounded border border-white/5 font-semibold group-hover:text-white group-hover:border-cyan-500/20 transition-all">
                    {point.name}
                  </span>
                  <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">{point.location}</span>
                </div>
              ))}

              {/* Dynamic Connection Status Dashboard details overlay absolute */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0E0F12]/95 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-950/40 rounded-xl text-cyan-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black font-mono text-white tracking-wide uppercase">Multi-Path Signal Resiliency</h5>
                    <p className="text-[9px] text-[#A0A2AD]">Aashvee, Cognito and Sync infrastructures automatically inherit global fallback tunnels.</p>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[8px] uppercase">Routing tunnels</span>
                    <span className="text-white font-bold">12 Secure Pipes</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[8px] uppercase">Telemetry Jitter</span>
                    <span className="text-cyan-400 font-bold">&lt; 0.05 ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER STATS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-[#111113] border border-white/5 p-5 rounded-2xl">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Network Isolation Emergency Air-Gap</h4>
                <p className="text-slate-400 leading-relaxed mb-4">
                  In the event of network-wide cryptographic drift or suspicious access gateway attempts, administrators can isolate all active subnet router instances instantly.
                </p>

                <div className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4.5 h-4.5 ${networkIsolation ? 'text-rose-500 animate-bounce' : 'text-slate-500'}`} />
                    <span className="text-slate-300 font-mono font-semibold">Global Air-Gap Router State</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setNetworkIsolation(!networkIsolation);
                      setCliHistory(p => [
                        ...p,
                        { text: `SECURITY -> Global network isolation requested. Status: ${!networkIsolation ? 'ISOLATED' : 'NOMINAL'}`, type: !networkIsolation ? 'error' : 'success' }
                      ]);
                    }}
                    className={`px-3 py-1.5 rounded-xl border font-mono font-bold transition-all cursor-pointer ${
                      networkIsolation 
                        ? 'bg-rose-950/50 text-rose-400 border-rose-500/40' 
                        : 'bg-[#15161A] text-slate-400 hover:text-white border-transparent'
                    }`}
                  >
                    {networkIsolation ? 'DEACTIVATE GAP' : 'ACTIVATE AIR-GAP'}
                  </button>
                </div>
              </div>

              {/* Dynamic Jitter Graph Monitor simulation */}
              <div className="bg-[#111113] border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">Sub-Core Router Latency Monitor</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Continuous round-trip timing parameters down secondary nodes pipeline</p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 border border-cyan-500/20 rounded">LIVE TRANSMISSION</span>
                </div>

                <div className="flex items-end justify-between gap-1.5 h-20 pt-4 px-1">
                  {currentLevelGraphSim.map((level, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-cyan-900 to-indigo-700/80 rounded-t hover:bg-cyan-400 transition-all duration-300 relative group/bar"
                      style={{ height: `${level}%` }}
                    >
                      {/* Hover stats label */}
                      <div className="absolute bottom-full mb-1 bg-black text-white text-[8px] font-mono px-1 rounded hidden group-hover/bar:block left-1/2 -translate-x-1/2">
                        {Math.floor(level * 0.15 + 1)}ms
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-3 border-t border-white/5">
                  <span>SLA TARGET: &lt;5.0ms</span>
                  <span>CURRENT RECTIFIED AV: {metricsScore.uptime}%</span>
                </div>
              </div>
            </div>

          </div>
        ) : null}

        {/* TAB 4: CLIENT PROVISIONER SANDBOX */}
        {activeTab === 'Sandbox' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
            
            {/* Header description */}
            <header className="bg-[#0E0F12] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">DYNAMIC SLA CONFIGURATION SANDBOX</span>
                <h3 className="text-lg font-black text-white tracking-tight mt-0.5">Enterprise Infrastructure Sandbox</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Mock real company load requirements instantly. Specify bandwidth, security standards, and node density to evaluate performance indices and estimate SLAs.
                </p>
              </div>

              {/* SLA Pricing Quote Pill */}
              <div className="p-4 bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/25 rounded-2xl">
                <span className="text-[9px] font-mono text-cyan-400 block tracking-widest font-bold">ESTIMATED INTEGRATION SLA</span>
                <span className="text-xl font-black text-white font-mono">${calculatedPricingQuote.toLocaleString()}/mo</span>
              </div>
            </header>

            {/* MAIN TWO PANEL LAYOUT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: INTERACTIVE FORM & SLIDERS SLATE */}
              <div className="lg:col-span-7 bg-[#111113] border border-white/5 rounded-2xl p-6 space-y-5">
                
                <h4 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">Configure Custom Enterprise Sandbox Variables</h4>
                
                <div className="space-y-4">
                  {/* Client name input */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Hypothetical Client Company Name</label>
                    <input 
                      type="text"
                      value={sandboxClientName}
                      onChange={(e) => setSandboxClientName(e.target.value)}
                      placeholder="e.g. Aashvee Corp, Cognito Global"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Preset Template selectors */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Architectural Solution Preset</label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {[
                        { id: 'Decentralized AI', label: 'Decentralized AI Node' },
                        { id: 'Quantum Secure Tunnel', label: 'Quantum Secure Tunneling' },
                        { id: 'High-Frequency Sync', label: 'Ledger Sync Gateway' },
                        { id: 'Custom Infrastructure', label: 'Custom Specification' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSandboxPreset(item.id as any);
                            if (item.id === 'Decentralized AI') {
                              setNodesCountInput(8);
                              setBandwidthSla(650);
                              setSyncRateSla(95);
                              setSecurityGrade('Zero-Trust');
                            } else if (item.id === 'Quantum Secure Tunnel') {
                              setNodesCountInput(4);
                              setBandwidthSla(220);
                              setSyncRateSla(80);
                              setSecurityGrade('Military-Grade');
                            } else if (item.id === 'High-Frequency Sync') {
                              setNodesCountInput(12);
                              setBandwidthSla(950);
                              setSyncRateSla(99);
                              setSecurityGrade('Standard');
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer leading-tight ${
                            sandboxPreset === item.id 
                              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold' 
                              : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/10'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nodes Count slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-slate-400">
                      <span>Virtualized Sandbox Nodes</span>
                      <span className="text-cyan-400 font-extrabold">{nodesCountInput} Nodes</span>
                    </div>
                    <input 
                      type="range"
                      min="2"
                      max="24"
                      value={nodesCountInput}
                      onChange={(e) => setNodesCountInput(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-900 h-1 rounded flex cursor-pointer focus:outline-none"
                    />
                  </div>

                  {/* Bandwidth throughput slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-slate-400">
                      <span>Target Bandwidth Throughput</span>
                      <span className="text-indigo-400 font-extrabold">{bandwidthSla} GB/s</span>
                    </div>
                    <input 
                      type="range"
                      min="50"
                      max="1500"
                      step="50"
                      value={bandwidthSla}
                      onChange={(e) => setBandwidthSla(parseInt(e.target.value))}
                      className="w-full accent-indigo-400 bg-slate-900 h-1 rounded flex cursor-pointer focus:outline-none"
                    />
                  </div>

                  {/* Ledger Synchronization SLA slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-slate-400">
                      <span>Registry Synchronization SLA Rate</span>
                      <span className="text-amber-500 font-extrabold">{syncRateSla}% Sync Accuracy</span>
                    </div>
                    <input 
                      type="range"
                      min="50"
                      max="99"
                      value={syncRateSla}
                      onChange={(e) => setSyncRateSla(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-900 h-1 rounded flex cursor-pointer focus:outline-none"
                    />
                  </div>

                  {/* Security Clearance level */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Clearance & Security Standard</label>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                      {['Standard', 'Zero-Trust', 'Military-Grade'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSecurityGrade(level as any)}
                          className={`p-2 rounded-xl text-center border font-bold transition-all cursor-pointer ${
                            securityGrade === level 
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                              : 'bg-black/30 border-white/5 text-slate-500 hover:border-white/10'
                          }`}
                        >
                          {level.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Simulated provisioning trigger progress and execution button */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  {isSandboxProvisioning && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-cyan-400">
                        <span>Provisioning virtual ledger clusters...</span>
                        <span>{sandboxProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full transition-all duration-200" style={{ width: `${sandboxProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleProvisionSandbox}
                    disabled={isSandboxProvisioning}
                    className="w-full py-3 bg-white text-black hover:bg-slate-200 active:scale-95 disabled:opacity-50 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sliders className="w-4 h-4 text-black" />
                    Provision Sandbox Corporate Matrix
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: ESTIMATED PERFORMANCE SUMMARY */}
              <div className="lg:col-span-5 bg-[#0D0E11] border border-white/5 rounded-2xl p-6 space-y-5">
                
                <h4 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">Virtual Sandbox Telemetry Diagnostics</h4>

                {/* Estimated index KPI circles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                    <span className="text-[9px] text-slate-500 font-mono block mb-1">COMPUTATIVE WEIGHT</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {Math.round((nodesCountInput * 4.2) + (bandwidthSla * 0.05))}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono block mt-1">GigaFlops Equivalent</span>
                  </div>

                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                    <span className="text-[9px] text-slate-500 font-mono block mb-1">ESTIMATED JITTER RATE</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      {(15.2 / nodesCountInput + (100 - syncRateSla) * 0.08).toFixed(2)}ms
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono block mt-1">Round-trip precision</span>
                  </div>
                </div>

                {/* SLA Specifications review checklist */}
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-2.5 text-xs font-mono">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">SLA INTEGRATORS CHECKLIST</div>
                  
                  <div className="flex justify-between text-slate-300">
                    <span>SLA Guaranteed Uptime:</span>
                    <span className="text-white font-bold">{syncRateSla >= 95 ? '99.999% SLA' : '99.99% SLA'}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Encryption Tunneling:</span>
                    <span className="text-cyan-400 font-bold">{securityGrade === 'Military-Grade' ? 'Triple AES-256' : securityGrade === 'Zero-Trust' ? 'TLS 1.3 Key Gateway' : 'Single SSL-256'}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Load Fallback Pipeline:</span>
                    <span className="text-white font-bold">{nodesCountInput >= 8 ? 'Double Redundant Subnet' : 'Single Failover Subnet'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-cyan-400 text-[11px] leading-relaxed">
                  <span className="font-bold uppercase block text-[9px] tracking-wider mb-1">PROVISIONING COMPATIBILITY EXCLUSIVE</span>
                  All virtualized deployment structures sync instantly into our central OS console. Deploying a sandbox preset updates the Live Operational Grid and logs data flows down the telemetry shell command history.
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* 3. DOCK TELEMETRY BAR (Desktop lower edge footer) */}
      <footer id="central-telemetry-dock" className="h-10 shrink-0 bg-[#0A0A0C] border-t border-white/5 px-4 md:px-8 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>SYSTEM CONSOLE: <span className="text-[#A0A2AD] font-bold">NOMINAL STATUS</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-6">
            <span>CORE ACCURACY: <span className="text-[#A0A2AD] font-bold">{metricsScore.efficiency.toFixed(2)}% RES RESONANCE</span></span>
          </div>

          <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-6">
            <span>ACTIVE THROUGHPUT: <span className="text-cyan-400 font-bold">{metricsScore.bandwidth.toFixed(1)} GB/s CAPACITY</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-slate-600">ENCRYPTION ENGINE: NEXA_AES_CORE</span>
          <span className="text-slate-400 font-bold">{currentTime}</span>
        </div>
      </footer>

      {/* 4. DIALOG MODAL TYPE: PROVISION OFFICIAL NODE */}
      {isDeployNodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E0F12] border border-cyan-500/20 w-full max-w-md rounded-2xl overflow-hidden p-6 relative">
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-sm font-black text-white tracking-wide">Configure Official NEX Transponder</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Initialize a genuine Nexa Forge cluster transponder node.</p>
              </div>
              <button 
                onClick={() => setIsDeployNodeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfficialNodeDeploy} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Unique Transponder Code Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Edge_Node_Paris"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Target Core Cluster</label>
                  <select 
                    value={newNodeCluster}
                    onChange={(e) => setNewNodeCluster(e.target.value as any)}
                    className="w-full bg-[#16171B] border border-white/10 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Quantum Engine">Quantum Engine</option>
                    <option value="Telemetry Core">Telemetry Core</option>
                    <option value="Ledger Sync">Ledger Sync</option>
                    <option value="Access Gateway">Access Gateway</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Geographic Location</label>
                  <select 
                    value={newNodeLocation}
                    onChange={(e) => setNewNodeLocation(e.target.value)}
                    className="w-full bg-[#16171B] border border-white/10 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Frankfurt, DE">Frankfurt, DE</option>
                    <option value="Virginia, US">Virginia, US</option>
                    <option value="Dublin, IE">Dublin, IE</option>
                    <option value="Singapore, SG">Singapore, SG</option>
                    <option value="Tokyo, JP">Tokyo, JP</option>
                    <option value="Oregon, US">Oregon, US</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Performance Grade</label>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  {['Standard', 'Hyper-Drive'].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setNewNodePerformance(pref as any)}
                      className={`p-2 rounded-xl text-center border font-bold transition-all cursor-pointer ${
                        newNodePerformance === pref 
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' 
                          : 'bg-black/30 border-white/5 text-slate-500 hover:border-white/10'
                      }`}
                    >
                      {pref.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsDeployNodeModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#17181C] hover:bg-[#202128] text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-black rounded-xl font-black transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  Deploy Node
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. FLOATING CURSOR COMPONENT CONTROL HUD */}
      <div id="cursor-control-hud" className="fixed bottom-14 right-4 md:right-6 z-[49] flex flex-col items-end gap-2.5 pointer-events-auto">
        {/* Expanded Panel */}
        {isCursorWidgetOpen && (
          <div className="w-72 bg-[#0C0D11]/95 border border-white/15 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 backdrop-blur-xl animate-fade-in text-[11px] font-sans">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2 font-mono">
                <Target className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-extrabold tracking-widest text-[#E4E6EB] uppercase">CURSOR SYNAPSE CORE</span>
              </div>
              <button 
                onClick={() => setIsCursorWidgetOpen(false)}
                className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Trail / Smooth Transition speed picker */}
            <div>
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">INTELLIGENT SMOOTHING RANGE</span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                {[
                  { id: 'instant', label: 'INSTANT' },
                  { id: 'fluid', label: 'FLUID' },
                  { id: 'cinematic', label: 'CINEMATIC' }
                ].map((trailOpt) => (
                  <button
                    key={trailOpt.id}
                    onClick={() => setCursorTrailSpeed(trailOpt.id as any)}
                    className={`py-1 rounded-lg border text-[9px] font-bold cursor-pointer transition-all ${
                      cursorTrailSpeed === trailOpt.id
                        ? 'bg-[#121319] text-cyan-400 border-cyan-400/40 shadow-sm'
                        : 'bg-black/40 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'
                    }`}
                  >
                    {trailOpt.label}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-1.5 leading-normal font-mono h-8 flex items-center">
                {cursorTrailSpeed === 'instant' && 'No momentum interpolation. Responds with immediate pixel accuracy.'}
                {cursorTrailSpeed === 'fluid' && 'Dynamic double-layered easing. Provides responsive weight & focus.'}
                {cursorTrailSpeed === 'cinematic' && 'Deep kinematic spring lag effect. Smooth cinematic tracking.'}
              </p>
            </div>

            {/* Cursor Type selector */}
            <div className="space-y-1.5">
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider">SELECT SIMULATOR TARGET MODE</span>
              {[
                { id: 'standard', name: 'Standard Pointer', desc: 'Default system cursor behavior', icon: MousePointer },
                { id: 'crosshair', name: 'Grid Crosshair Lines', desc: 'Infinite laser alignment axis lines', icon: Compass },
                { id: 'reticle', name: 'Tactical Quantum Reticle', desc: 'Focus-ring outline with diagonal tick-marks', icon: Target },
                { id: 'laser', name: 'Plasma Beacon Glow', desc: 'Intense micro glowing core dot track', icon: Zap },
                { id: 'neural', name: 'Neural Link Tracker', desc: 'Scans coordinates X/Y real-time data', icon: Terminal }
              ].map((styleOpt) => {
                const IconComp = styleOpt.icon;
                const isSelected = cursorMode === styleOpt.id;
                return (
                  <button
                    key={styleOpt.id}
                    onClick={() => {
                      setCursorMode(styleOpt.id as any);
                    }}
                    className={`w-full text-left p-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-cyan-500/10 border-cyan-500/45 shadow shadow-cyan-500/10' 
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border ${isSelected ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-[#18191E] text-slate-500 border-white/5'}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold leading-none ${isSelected ? 'text-white' : 'text-slate-300'}`}>{styleOpt.name}</div>
                      <div className="text-[9px] text-slate-505 mt-0.5 truncate">{styleOpt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Coordinates Tracker footer info */}
            <div className="pt-2 border-t border-white/5 flex justify-between text-[8px] font-mono text-slate-500 leading-normal">
              <span>AXIS COORDS: X:{Math.floor(mousePos.x)} Y:{Math.floor(mousePos.y)}</span>
              <span>STATE: {isHoveringClickable ? 'CLICK HOVER' : 'TRACKING'}</span>
            </div>
          </div>
        )}

        {/* Trigger Button */}
        <button
          onClick={() => setIsCursorWidgetOpen(!isCursorWidgetOpen)}
          className={`px-4 py-2.5 rounded-full border flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg cursor-pointer ${
            isCursorWidgetOpen
              ? 'bg-[#101217] border-cyan-500/60 text-cyan-400 font-extrabold shadow-cyan-950/40'
              : 'bg-gradient-to-tr from-[#0E0F12] to-[#16171D] border-white/10 hover:border-cyan-500/30 text-white shadow-black/80 hover:shadow-cyan-950/20'
          }`}
        >
          <Target className="w-4 h-4 text-cyan-400 animate-pulse" style={{ animationDuration: '3s' }} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest block max-w-[120px] truncate">
            {cursorMode === 'standard' ? 'C-MODE/STANDARD' : `C-MODE/${cursorMode.toUpperCase()}`}
          </span>
          <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase font-mono font-black scale-95 ml-1">
            {cursorTrailSpeed === 'instant' ? 'INSTANT' : cursorTrailSpeed === 'fluid' ? 'SMOOTH' : 'CINEMATIC'}
          </span>
        </button>
      </div>

      {/* 6. FUTURISTIC ULTRA-SMOOTH QUANTUM CURSOR ENGINE */}
      {cursorMode !== 'standard' && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {/* Centered tracking dot */}
          <div 
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 ${
              isHoveringClickable ? 'scale-150 bg-cyan-400' : 'bg-cyan-500'
            }`}
            style={{
              left: `${mouseSmoothCenter.x}px`,
              top: `${mouseSmoothCenter.y}px`,
              width: cursorMode === 'laser' ? '8px' : '4px',
              height: cursorMode === 'laser' ? '8px' : '4px',
              boxShadow: cursorMode === 'laser' ? '0 0 12px #22d3ee' : '0 0 6px rgba(34, 211, 238, 0.6)',
            }}
          />

          {/* DYNAMIC SHAPE LAYER BASED ON CURSOR MODE */}
          {cursorMode === 'crosshair' && (
            <>
              {/* Dynamic crosshairs lines */}
              <div 
                className="absolute bg-cyan-500/10 transition-all duration-100"
                style={{
                  left: '0',
                  right: '0',
                  top: `${mouseSmoothCenter.y}px`,
                  height: '1px',
                }}
              />
              <div 
                className="absolute bg-cyan-500/10 transition-all duration-100"
                style={{
                  left: `${mouseSmoothCenter.x}px`,
                  top: '0',
                  bottom: '0',
                  width: '1px',
                }}
              />
              {/* Outer boundary box */}
              <div 
                className={`absolute -translate-x-1/2 -translate-y-1/2 border border-cyan-400/30 transition-all duration-200 ${
                  isHoveringClickable ? 'w-9 h-9 rotate-45 border-cyan-400 bg-cyan-500/5' : 'w-6 h-6'
                }`}
                style={{
                  left: `${mouseSmoothOuter.x}px`,
                  top: `${mouseSmoothOuter.y}px`,
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-0.5 bg-cyan-400"></div>
                <div className="absolute top-0 left-0 w-0.5 h-1 bg-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-1 h-0.5 bg-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-1 bg-cyan-400"></div>
              </div>
            </>
          )}

          {cursorMode === 'reticle' && (
            <div 
              className={`absolute -translate-x-1/2 -translate-y-1/2 border border-dashed rounded-full flex items-center justify-center transition-all duration-200 ${
                isHoveringClickable ? 'border-cyan-400 w-14 h-14 rotate-90 scale-110 bg-cyan-500/5' : 'border-indigo-500/60 w-10 h-10 animate-spin'
              }`}
              style={{
                left: `${mouseSmoothOuter.x}px`,
                top: `${mouseSmoothOuter.y}px`,
                animationDuration: '8s',
              }}
            >
              <div className={`w-6 h-6 border rounded-full transition-transform ${isHoveringClickable ? 'border-cyan-400 scale-75' : 'border-cyan-500/30'}`} />
              <div className="absolute top-0 w-0.5 h-1.5 bg-cyan-400"></div>
              <div className="absolute bottom-0 w-0.5 h-1.5 bg-cyan-400"></div>
              <div className="absolute left-0 h-0.5 w-1.5 bg-cyan-400"></div>
              <div className="absolute right-0 h-0.5 w-1.5 bg-cyan-400"></div>
            </div>
          )}

          {cursorMode === 'laser' && (
            <div 
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/30 transition-all duration-500 ease-out bg-cyan-500/5 ${
                isHoveringClickable ? 'w-14 h-14 bg-cyan-500/10' : 'w-8 h-8 scale-95'
              }`}
              style={{
                left: `${mouseSmoothOuter.x}px`,
                top: `${mouseSmoothOuter.y}px`,
                boxShadow: isHoveringClickable ? '0 0 20px rgba(34, 211, 238, 0.25)' : 'none',
              }}
            />
          )}

          {cursorMode === 'neural' && (
            <div 
              className={`absolute -translate-x-1/2 -translate-y-1/2 border border-cyan-400/40 bg-black/80 p-2 flex flex-col gap-0.5 rounded-xl transition-all duration-200 ${
                isHoveringClickable ? 'border-cyan-400 w-26 scale-110 bg-[#0E0F12]/95 shadow-md shadow-cyan-950/20' : 'w-22'
              }`}
              style={{
                left: `${mouseSmoothOuter.x}px`,
                top: `${mouseSmoothOuter.y}px`,
                minHeight: '34px',
              }}
            >
              <div className="flex justify-between items-center text-[7px] font-mono font-bold text-cyan-400 tracking-wider">
                <span>NEX_TRK</span>
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-[6px] font-mono text-slate-400 leading-none">
                X: {Math.floor(mousePos.x)}px
              </div>
              <div className="text-[6px] font-mono text-slate-400 leading-none">
                Y: {Math.floor(mousePos.y)}px
              </div>
              <div className="text-[6px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                {isHoveringClickable ? 'ACTIVE_LINK' : 'SCANNING'}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
