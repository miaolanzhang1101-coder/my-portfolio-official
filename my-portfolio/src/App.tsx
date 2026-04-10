import { useState, useEffect, useRef } from "react";
import type { FC, CSSProperties } from "react";
import aatcImg from "./assets/aatc.png";
import asset05Img from "./assets/asset05.png";
import ebayVideo from "./assets/ebay-01.mp4";
import tiktok2 from "./assets/tiktok2.mov";
import tencent1 from "./assets/tencent1.mov";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: number;
  tag: string;
  company: string | null;
  title: string | null;
  description: string;
  image: string | null;
  video: string | null;
  link: string | null;
  tall: boolean;
  date: string;
}

interface NavItem    { label: string; href: string; }
interface FooterLink { label: string; href: string; }

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    id: 1, tag: "JavaAI", company: null, title: "AI Code Editor",
    description: "I built and shipped the MVP and V1 of an AI code editor (IDE) for developer interaction with AI-generated code operations.",
    image: asset05Img, video: null,
    link: "https://miaolanzhang.notion.site/JavaAI-31420807957280df90afea70b81c1028",
    tall: false, date: "spring 2025",
  },
  {
    id: 2, tag: "eBay", company: null, title: "B2B Data Pipeline Platform",
    description: "I redesigned B2B data pipeline platform to improve tool discoverability.",
    image: null, video: ebayVideo,
    link: "https://miaolanzhang.notion.site/eBay-32520807957280a4a4c7e51c1076415f",
    tall: false, date: "fall 2024",
  },
  {
    id: 3, tag: "Colgate-Palmolive", company: null, title: "Enterprise Design System",
    description: "I adopted and scaled enterprise design system for AI workflows.",
    image: aatcImg, video: null,
    link: "https://miaolanzhang.notion.site/Colgate-Palmolive-31c208079572804a953dcf105d353f2a",
    tall: false, date: "spring 2024",
  },
  {
    id: 4, tag: "ClipAI", company: null, title: "Automated Video Clipping",
    description: "I initiated a new content creation workflow for automated video clipping.",
    image: null, video: null,
    link: "https://miaolanzhang.notion.site/ClipAI-31c2080795728096a762c78c32bd7ffa",
    tall: false, date: "fall 2023",
  },
  {
    id: 5, tag: "TikTok", company: null, title: "Creator Discovery Flow",
    description: "I redesigned the creator discovery flow for TikTok two-sided creator marketplace.",
    image: null, video: tiktok2,
    link: "https://miaolanzhang.notion.site/TikTok-3252080795728008a60bf9b2518c89b1",
    tall: false, date: "spring 2023",
  },
  {
    id: 6, tag: "Tencent", company: null, title: "Creator Discovery Flow",
    description: "I redesigned the creator discovery flow for TikTok two-sided creator marketplace.",
    image: null, video: tencent1,
    link: "https://miaolanzhang.notion.site/Tencent-3252080795728008a60bf9b2518c89b1",
    tall: false, date: "spring 2023",
  },
];

const footerLinks: FooterLink[] = [
  { label: "LinkedIn", href: "#" },
  { label: "Resume",   href: "#" },
];

const navItems: NavItem[] = [
  { label: "work",    href: "#" },
  { label: "gallery", href: "#" },
  { label: "play",    href: "#" },
  { label: "about",   href: "#" },
];

const ASCII_TREES = `  .   \\|/   ^^^   .   \\|/   .   |   ..   .   \\|
^^^   vVv   \\|/   ^^^   v   Y   ^^^^^   ,   |
^^^   v   Y   ^^^^^   (*)   >/   (*)   >\\   (o)
\\|/   (o)   \\|/   ,,,   \\|/   ^^^^^   ,,,   ~Y~
\\|/   ^^^^^   ,,,   ~Y~   \\|/   ^^^^^   \\ | /
vvv   Y   ^^^^^   .   \\(| ,-   \\|/   (*)   >/
.   ^^^   @   \\|/   ^^^   .   \\(| ,-   \\|/   \\ | /
(*)   >/   vVv   (_)   \\|   ^^^^^   vVv   (_)   \\|
^^^^^   vVv   (_)   \\|/   ^^^   ..   \\ |/   \\ |/`;

// ─── ClipAI Motion Preview ────────────────────────────────────────────────────

const CLIP_LABELS   = ["Venue Atmos", "Opening Looks", "Mid Collection", "Statement Pieces", "Finale Walk"];
const CLIP_WIDTHS   = [14, 22, 26, 22, 16];
const CLIP_BG       = ["#2a1f0a","#1a1a2a","#1a2a1a","#2a1a1a","#1a2a2a"];
const SCREEN_TINTS  = [
  "linear-gradient(135deg,#3a2010 0%,#1a1008 100%)",
  "linear-gradient(135deg,#10102a 0%,#08081a 100%)",
  "linear-gradient(135deg,#0a1a0a 0%,#081208 100%)",
  "linear-gradient(135deg,#2a0a0a 0%,#1a0808 100%)",
  "linear-gradient(135deg,#081a1a 0%,#081212 100%)",
];

const ClipAIMotion: FC = () => {
  const [activeClip, setActiveClip] = useState<number>(4);
  const [tcSecs,     setTcSecs]     = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => setActiveClip(p => (p + 1) % CLIP_LABELS.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTcSecs(p => (p + 1) % 455), 900);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(tcSecs / 60)).padStart(2, "0");
  const ss = String(tcSecs % 60).padStart(2, "0");

  return (
    <div style={{ width:"100%", height:"100%", background:"#141414", borderRadius:"8px", overflow:"hidden", display:"flex", flexDirection:"column", fontFamily:"-apple-system,sans-serif", userSelect:"none" }}>
      <style>{`
        @keyframes clipPulse     { 0%,100%{opacity:1}  50%{opacity:0.4} }
        @keyframes playheadSweep { from{left:0%} to{left:100%} }
        @keyframes waveA { 0%,100%{transform:scaleY(1)}   50%{transform:scaleY(1.9)} }
        @keyframes waveB { 0%,100%{transform:scaleY(0.6)} 50%{transform:scaleY(1.5)} }
        @keyframes waveC { 0%,100%{transform:scaleY(1.3)} 50%{transform:scaleY(0.5)} }
        @keyframes waveD { 0%,100%{transform:scaleY(0.8)} 50%{transform:scaleY(1.7)} }
        @keyframes waveE { 0%,100%{transform:scaleY(1.5)} 50%{transform:scaleY(0.6)} }
      `}</style>

      {/* top bar */}
      <div style={{ background:"#1c1c1c", borderBottom:"1px solid #2a2a2a", padding:"0 8px", height:"22px", display:"flex", alignItems:"center", flexShrink:0 }}>
        {["Video Gen","AI Clipping","Templates"].map((t,i) => (
          <div key={t} style={{ fontSize:"7px", color:i===1?"#fff":"#555", padding:"0 6px", height:"100%", display:"flex", alignItems:"center", position:"relative", borderBottom:i===1?"1.5px solid #fff":"none" }}>{t}</div>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"3px" }}>
          <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#e8a84c", animation:"clipPulse 2s infinite" }} />
          <span style={{ fontSize:"7px", color:"#888" }}>Gemini 2.0</span>
        </div>
      </div>

      {/* mode bar */}
      <div style={{ background:"#1a1a1a", borderBottom:"1px solid #222", height:"18px", display:"flex", alignItems:"center", justifyContent:"center", gap:"4px", flexShrink:0 }}>
        {["Detect & Edit","Match","Auto-clip"].map((m,i) => (
          <div key={m} style={{ fontSize:"7px", padding:"2px 7px", borderRadius:"10px", background:i===0?"#fff":"none", color:i===0?"#000":"#666", fontWeight:i===0?500:400 }}>{m}</div>
        ))}
      </div>

      {/* body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* sidebar */}
        <div style={{ width:"60px", background:"#1a1a1a", borderRight:"1px solid #222", padding:"6px", display:"flex", flexDirection:"column", gap:"5px", flexShrink:0 }}>
          <div style={{ background:"#252525", border:"1px solid #333", borderRadius:"3px", padding:"3px 4px", fontSize:"6px", color:"#555" }}>YouTube URL…</div>
          <div style={{ border:"1px dashed #3a3a3a", borderRadius:"4px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"3px" }}>
            <div style={{ width:"14px", height:"14px", background:"#2a2a2a", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", color:"#666" }}>↓</div>
            <div style={{ fontSize:"6px", color:"#aaa", textAlign:"center", lineHeight:1.3 }}>Drop a<br />video clip</div>
          </div>
          <div style={{ background:"#2a2a2a", borderRadius:"3px", padding:"3px", fontSize:"6px", color:"#888", textAlign:"center" }}>Add footage →</div>
        </div>

        {/* preview area */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, background:SCREEN_TINTS[activeClip], position:"relative", overflow:"hidden", transition:"background 0.6s ease" }}>
            <svg viewBox="0 0 200 120" style={{ width:"100%", height:"100%", position:"absolute", inset:0, opacity:0.35 }} preserveAspectRatio="xMidYMid slice">
              {Array.from({ length: 30 }, (_,i) => <circle key={i} cx={10+i*6.5} cy={55+Math.sin(i)*8} r="4" fill="#ffffff" opacity="0.08" />)}
              <ellipse cx="100" cy="22" rx="10" ry="12" fill="#d4b896" />
              <path d="M88 34 Q100 42 112 34 L118 90 Q100 96 82 90 Z" fill="#c8a070" />
              <path d="M82 90 L76 118 L88 118 L94 90 Z" fill="#b89060" />
              <path d="M118 90 L124 118 L112 118 L106 90 Z" fill="#b89060" />
              <ellipse cx="52" cy="28" rx="7" ry="9" fill="#8a7060" opacity="0.6" />
              <path d="M44 38 Q52 44 60 38 L64 85 Q52 90 40 85 Z" fill="#7a6050" opacity="0.6" />
              <ellipse cx="148" cy="26" rx="7" ry="9" fill="#8a7060" opacity="0.5" />
              <path d="M140 36 Q148 42 156 36 L160 85 Q148 90 136 85 Z" fill="#7a6050" opacity="0.5" />
            </svg>
            <div style={{ position:"absolute", bottom:"6px", left:"8px", display:"flex", alignItems:"center", gap:"4px" }}>
              <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#e8a84c" }} />
              <span style={{ fontSize:"7px", color:"#fff" }}>{CLIP_LABELS[activeClip]} · Reference</span>
            </div>
          </div>

          {/* controls */}
          <div style={{ background:"#1c1c1c", borderTop:"1px solid #222", borderBottom:"1px solid #222", padding:"3px 6px", display:"flex", alignItems:"center", gap:"5px", flexShrink:0 }}>
            <div style={{ width:"14px", height:"14px", borderRadius:"50%", border:"1px solid #555", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"6px", color:"#fff" }}>▶</div>
            <span style={{ fontSize:"6px", color:"#ccc", fontVariantNumeric:"tabular-nums" }}>{mm}:{ss} / 07:35</span>
            <div style={{ background:"#2a2a2a", border:"1px solid #3a3a3a", borderRadius:"2px", padding:"1px 4px", fontSize:"6px", color:"#ccc" }}>⊞ Split</div>
            <div style={{ background:"#2a2a2a", border:"1px solid #5a2a2a", borderRadius:"2px", padding:"1px 4px", fontSize:"6px", color:"#e66" }}>✕ Remove</div>
            <span style={{ marginLeft:"auto", fontSize:"6px", color:"#666" }}>{CLIP_LABELS[activeClip]} · 01:12</span>
          </div>

          {/* timeline */}
          <div style={{ background:"#111", flexShrink:0, padding:"3px 6px 2px" }}>
            <div style={{ display:"flex", marginBottom:"2px" }}>
              {["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00"].map(tc => (
                <div key={tc} style={{ flex:1, fontSize:"5px", color:"#444", textAlign:"center" }}>{tc}</div>
              ))}
            </div>
            <div style={{ position:"relative", height:"26px", display:"flex", gap:"1px" }}>
              <div style={{ position:"absolute", top:0, bottom:0, width:"1.5px", background:"#e8a84c", zIndex:10, animation:"playheadSweep 8s linear infinite" }} />
              {CLIP_LABELS.map((label, i) => (
                <div key={label} style={{ height:"100%", width:`${CLIP_WIDTHS[i]}%`, background:CLIP_BG[i], borderRadius:"2px", overflow:"hidden", position:"relative", flexShrink:0, outline:activeClip===i?"1.5px solid #e8a84c":"none", transition:"outline 0.3s ease" }}>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 60%)" }} />
                  <span style={{ position:"absolute", bottom:"2px", left:"3px", fontSize:"5px", color:"#fff", textShadow:"0 1px 2px rgba(0,0,0,0.8)", whiteSpace:"nowrap" }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1px", alignItems:"flex-end", height:"8px", marginTop:"2px" }}>
              {Array.from({ length: 80 }, (_,i) => {
                const anims = ["waveA","waveB","waveC","waveD","waveE"];
                return <div key={i} style={{ flex:1, background:"#2e2e2e", borderRadius:"1px", height:`${30+Math.sin(i*0.4)*20+Math.sin(i*0.9)*15}%`, animation:`${anims[i%5]} 1.${i%4+1}s ease-in-out infinite`, animationDelay:`${i*0.03}s` }} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Custom Cursor ────────────────────────────────────────────────────────────

interface CursorConfig {
  bg: string;
  border: string;
  glow: string;
  label: string;
  labelColor: string;
  size: number;
  shape: "circle" | "pill";
}

const CURSOR_CONFIGS: Record<number, CursorConfig> = {
  1: {
    bg: "rgba(180,210,255,0.18)", border: "rgba(120,170,255,0.55)",
    glow: "rgba(100,149,237,0.35)", label: "JavaAI",
    labelColor: "rgba(80,130,230,0.9)", size: 80, shape: "pill",
  },
  2: {
    bg: "rgba(255,200,80,0.14)", border: "rgba(230,160,40,0.5)",
    glow: "rgba(220,150,30,0.3)", label: "eBay",
    labelColor: "rgba(190,120,20,0.9)", size: 72, shape: "circle",
  },
  3: {
    bg: "rgba(140,220,160,0.14)", border: "rgba(80,180,110,0.5)",
    glow: "rgba(60,160,90,0.28)", label: "Colgate",
    labelColor: "rgba(40,140,70,0.9)", size: 84, shape: "pill",
  },
  4: {
    bg: "rgba(30,30,30,0.45)", border: "rgba(232,168,76,0.6)",
    glow: "rgba(232,168,76,0.3)", label: "ClipAI",
    labelColor: "rgba(232,168,76,1)", size: 76, shape: "circle",
  },
  5: {
    bg: "rgba(255,100,140,0.13)", border: "rgba(220,70,110,0.48)",
    glow: "rgba(220,70,110,0.25)", label: "TikTok",
    labelColor: "rgba(200,50,90,0.9)", size: 76, shape: "circle",
  },
  6: {
    bg: "rgba(255,100,140,0.13)", border: "rgba(220,70,110,0.48)",
    glow: "rgba(220,70,110,0.25)", label: "TikTok",
    labelColor: "rgba(200,50,90,0.9)", size: 76, shape: "circle",
  },
};

interface CustomCursorProps {
  projectId: number | null;
  x: number;
  y: number;
}
const CustomCursor = ({ projectId, x, y }: CustomCursorProps) => {
  const [visible, setVisible]   = useState(false);
  const [pos, setPos]           = useState({ x: 0, y: 0 });
  const rafRef                  = useRef<number>(0);
  const targetRef               = useRef({ x: 0, y: 0 });
  const currentRef              = useRef({ x: 0, y: 0 });

  useEffect(() => { targetRef.current = { x, y }; }, [x, y]);

  useEffect(() => {
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.14;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.14;
      setPos({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => { setVisible(projectId !== null); }, [projectId]);

  if (!projectId) return null;
  const cfg = CURSOR_CONFIGS[projectId];
  if (!cfg) return null;

  const half         = cfg.size / 2;
  const borderRadius = cfg.shape === "circle" ? "50%" : `${cfg.size}px`;

  return (
    <div style={{
      position: "fixed",
      left: pos.x - half,
      top: pos.y - half,
      width: cfg.size,
      height: cfg.size,
      borderRadius,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      backdropFilter: "blur(12px) saturate(1.6)",
      WebkitBackdropFilter: "blur(12px) saturate(1.6)",
      boxShadow: `0 0 18px 2px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 9999,
      transition: "opacity 0.2s ease, transform 0.2s ease",
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.7)",
    }}>
      {/* inner shimmer ring */}
      <div style={{ position:"absolute", inset:4, borderRadius, border:"0.5px solid rgba(255,255,255,0.2)", pointerEvents:"none" }} />
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.08em",
        color: cfg.labelColor,
        fontWeight: 400,
        position: "relative",
        zIndex: 1,
        whiteSpace: "nowrap",
      }}>
        {cfg.label}
      </span>
    </div>
  );
};

// ─── Shared noise helper ───────────────────────────────────────────────────────

function smoothNoise(x: number, y: number, t: number): number {
  return (
    Math.sin(x*1.3+t)*Math.cos(y*0.9-t*0.7) +
    Math.cos(x*0.7-t*0.4)*Math.sin(y*1.1+t*0.5)
  ) * 0.5;
}

// ─── Gallery Sketches ─────────────────────────────────────────────────────────

function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth*window.devicePixelRatio;
    canvas.height = canvas.offsetHeight*window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const particles = Array.from({length:180},()=>({x:Math.random()*w,y:Math.random()*h,age:Math.random()*80}));
    let t=0,raf=0;
    const draw=()=>{
      ctx.fillStyle="rgba(245,243,240,0.18)";ctx.fillRect(0,0,w,h);
      for(const p of particles){
        const angle=smoothNoise(p.x/w*3,p.y/h*3,t)*Math.PI*2;
        p.x+=Math.cos(angle)*1.2;p.y+=Math.sin(angle)*1.2;p.age++;
        if(p.x<0||p.x>w||p.y<0||p.y>h||p.age>120){p.x=Math.random()*w;p.y=Math.random()*h;p.age=0;}
        const alpha=Math.sin((p.age/120)*Math.PI)*0.7;
        ctx.beginPath();ctx.arc(p.x,p.y,1.2,0,Math.PI*2);ctx.fillStyle=`rgba(80,70,60,${alpha})`;ctx.fill();
      }
      t+=0.006;raf=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
};

const LissajousWeb: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;
    canvas.width=canvas.offsetWidth*window.devicePixelRatio;
    canvas.height=canvas.offsetHeight*window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w=canvas.offsetWidth,h=canvas.offsetHeight,cx=w/2,cy=h/2,r=Math.min(w,h)*0.38;
    let t=0,raf=0;
    const draw=()=>{
      ctx.fillStyle="rgba(245,243,240,0.12)";ctx.fillRect(0,0,w,h);
      [{a:3,b:2,delta:t},{a:5,b:4,delta:t*0.7+0.3},{a:2,b:3,delta:t*1.3+1.0}].forEach(({a,b,delta},ci)=>{
        ctx.beginPath();
        for(let i=0;i<=360;i++){const ang=(i/360)*Math.PI*2;i===0?ctx.moveTo(cx+r*Math.sin(a*ang+delta),cy+r*Math.sin(b*ang)):ctx.lineTo(cx+r*Math.sin(a*ang+delta),cy+r*Math.sin(b*ang));}
        ctx.strokeStyle=(["rgba(180,100,80,","rgba(80,120,160,","rgba(100,160,120,"][ci])+"0.35)";
        ctx.lineWidth=1.2;ctx.stroke();
      });
      t+=0.004;raf=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
};

const DotGrid: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;
    canvas.width=canvas.offsetWidth*window.devicePixelRatio;
    canvas.height=canvas.offsetHeight*window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w=canvas.offsetWidth,h=canvas.offsetHeight,ROWS=12,COLS=18;
    let t=0,raf=0;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);ctx.fillStyle="#f5f3f0";ctx.fillRect(0,0,w,h);
      for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){
        const x=(col+0.5)*(w/COLS),y=(row+0.5)*(h/ROWS),n=smoothNoise(col/COLS*4,row/ROWS*4,t);
        ctx.beginPath();ctx.arc(x,y,Math.max(0.5,2+n*6),0,Math.PI*2);
        ctx.fillStyle=`rgba(60,55,50,${0.25+(n+1)*0.3})`;ctx.fill();
      }
      t+=0.012;raf=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
};

const OrbitRings: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;
    canvas.width=canvas.offsetWidth*window.devicePixelRatio;
    canvas.height=canvas.offsetHeight*window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w=canvas.offsetWidth,h=canvas.offsetHeight,cx=w/2,cy=h/2;
    const rings=Array.from({length:6},(_,i)=>({r:18+i*22,speed:0.008+i*0.003*(i%2===0?1:-1),dotCount:3+i*2,dotR:3.5-i*0.3,phase:(i/6)*Math.PI*2}));
    let t=0,raf=0;
    const draw=()=>{
      ctx.fillStyle="rgba(245,243,240,0.22)";ctx.fillRect(0,0,w,h);
      rings.forEach((ring,ri)=>{
        ctx.beginPath();ctx.arc(cx,cy,ring.r,0,Math.PI*2);ctx.strokeStyle="rgba(160,150,140,0.18)";ctx.lineWidth=0.8;ctx.stroke();
        for(let d=0;d<ring.dotCount;d++){
          const angle=ring.phase+t*ring.speed*60+(d/ring.dotCount)*Math.PI*2;
          ctx.beginPath();ctx.arc(cx+ring.r*Math.cos(angle),cy+ring.r*Math.sin(angle),Math.max(0.5,ring.dotR),0,Math.PI*2);
          ctx.fillStyle=ri%2===0?"rgba(180,100,70,0.75)":"rgba(70,110,160,0.75)";ctx.fill();
        }
      });
      t+=0.016;raf=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
};

// ─── GalleryPage ──────────────────────────────────────────────────────────────

interface SketchCardProps { title:string; subtitle:string; height:number; children:React.ReactNode; index:number; }

const SketchCard: FC<SketchCardProps> = ({ title, subtitle, height, children, index }) => (
  <div style={{opacity:0,animation:"fadeUp 0.6s ease forwards",animationDelay:`${index*0.12}s`}}>
    <div style={{width:"100%",height,borderRadius:"10px",overflow:"hidden",background:"#f5f3f0",marginBottom:"12px",position:"relative"}}>{children}</div>
    <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#999",letterSpacing:"0.01em",marginBottom:"3px"}}>{title}</p>
    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"12px",color:"#bbb",fontWeight:300}}>{subtitle}</p>
  </div>
);

const GalleryPage: FC = () => (
  <div style={{opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards"}}>
    <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"40px"}}>generative experiments</p>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"24px",marginBottom:"24px",alignItems:"start"}}>
      <SketchCard title="flow field" subtitle="particles following a noise vector field" height={300} index={0}><FlowField /></SketchCard>
      <SketchCard title="orbit rings" subtitle="concentric motion, alternating directions" height={300} index={1}><OrbitRings /></SketchCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"24px",alignItems:"start"}}>
      <SketchCard title="lissajous web" subtitle="layered parametric curves in slow drift" height={280} index={2}><LissajousWeb /></SketchCard>
      <SketchCard title="dot grid" subtitle="noise-driven breathing grid" height={280} index={3}><DotGrid /></SketchCard>
    </div>
  </div>
);

// ─── SplashScreen ─────────────────────────────────────────────────────────────

const SplashScreen: FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const [nameVisible, setNameVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [ready,       setReady]       = useState(false);
  const [exiting,     setExiting]     = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W=0,H=0;
    const resize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    resize();window.addEventListener("resize",resize);
    const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
    const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
    const easeOutCubic=(t:number)=>1-Math.pow(1-t,3);
    const easeOutQuart=(t:number)=>1-Math.pow(1-t,4);
    const easeInOutCubic=(t:number)=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    const drawPencilRing=(cx:number,cy:number,radius:number,progress:number,alpha:number,seed:number,lineW:number)=>{
      const N=90;ctx.beginPath();
      for(let i=0;i<=N*progress;i++){
        const a=(i/N)*Math.PI*2,wobble=Math.sin(4*a+seed)*2.8+Math.sin(9*a+seed*1.6)*1.1,r=radius+wobble;
        const px=cx+r*Math.cos(a),py=cy+(r+wobble*0.2)*0.32*Math.sin(a);
        i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
      }
      ctx.strokeStyle=`rgba(40,36,44,${alpha})`;ctx.lineWidth=lineW;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();
    };
    const drawDribble=(cx:number,cy:number,angle:number,len:number,alpha:number,seed:number)=>{
      ctx.beginPath();
      const x0=cx+18*Math.cos(angle),y0=cy+18*0.32*Math.sin(angle);
      const mx=cx+(len*0.55+Math.sin(seed)*6)*Math.cos(angle),my=cy+(len*0.55+Math.sin(seed)*3)*0.32*Math.sin(angle);
      const ex=cx+len*Math.cos(angle)+Math.sin(seed*2.3)*5,ey=cy+len*0.32*Math.sin(angle)+Math.cos(seed*1.7)*2;
      ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,ex,ey);
      ctx.strokeStyle=`rgba(40,36,44,${alpha})`;ctx.lineWidth=0.8+Math.sin(seed)*0.4;ctx.lineCap="round";ctx.stroke();
      ctx.beginPath();ctx.arc(ex,ey,1.4+Math.abs(Math.sin(seed))*1.2,0,Math.PI*2);
      ctx.fillStyle=`rgba(40,36,44,${alpha*0.85})`;ctx.fill();
    };
    const FALL_END=1.20,SPLAT_END=1.45,RINGS_END=2.80;
    const rings=[{maxR:22,delay:0.00,lw:1.2,seed:1.1},{maxR:45,delay:0.10,lw:1.0,seed:2.4},{maxR:72,delay:0.22,lw:0.9,seed:0.7},{maxR:100,delay:0.36,lw:0.85,seed:3.2},{maxR:132,delay:0.52,lw:0.75,seed:1.8}];
    const dribbles=[0.15,0.9,1.7,2.5,3.4,4.3,5.1,5.8].map((a,i)=>({angle:a,len:28+i*6,seed:a*3.7}));
    let startTs=0,raf=0,nameTriggered=false;
    const frame=(ts:number)=>{
      if(!startTs)startTs=ts;
      const elapsed=(ts-startTs)/1000;
      ctx.clearRect(0,0,W,H);
      const cx=W/2,cy=H/2;
      const fallPrg=easeOutCubic(clamp(elapsed/FALL_END,0,1));
      const dropY=lerp(-H*0.44,0,fallPrg);
      const splatPrg=easeInOutCubic(clamp((elapsed-FALL_END)/(SPLAT_END-FALL_END),0,1));
      const dropRx=lerp(16,34,splatPrg),dropRy=lerp(16,0,splatPrg);
      if(elapsed<SPLAT_END+0.05){
        const da=elapsed<SPLAT_END?1:Math.max(0,1-(elapsed-SPLAT_END)*8);
        if(da>0){
          const grad=ctx.createRadialGradient(cx-dropRx*0.28,cy+dropY-dropRy*0.28,dropRy*0.1,cx,cy+dropY,dropRx);
          grad.addColorStop(0,`rgba(228,244,255,${da*0.97})`);grad.addColorStop(0.35,`rgba(158,208,240,${da*0.88})`);
          grad.addColorStop(0.72,`rgba(86,152,210,${da*0.76})`);grad.addColorStop(1,`rgba(44,110,178,${da*0.62})`);
          ctx.beginPath();ctx.ellipse(cx,cy+dropY,Math.max(0.1,dropRx),Math.max(0.1,dropRy),0,0,Math.PI*2);
          ctx.fillStyle=grad;ctx.fill();
          if(dropRy>3){ctx.beginPath();ctx.ellipse(cx-dropRx*0.26,cy+dropY-dropRy*0.25,dropRx*0.22,dropRy*0.32,-0.4,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${da*0.72})`;ctx.fill();}
        }
      }
      if(elapsed>FALL_END){
        const re=elapsed-FALL_END,rd=RINGS_END-FALL_END;
        rings.forEach((ring,i)=>{
          const rt=clamp((re-ring.delay)/((rd-ring.delay)*0.62),0,1);
          if(rt<=0)return;
          const fadeIn=clamp(rt*6,0,1),fadeOut=clamp(1-(re-ring.delay-(rd-ring.delay)*0.62*0.5)/(rd*0.55),0,1);
          const ringAlpha=fadeIn*fadeOut*(0.55-i*0.07);
          if(ringAlpha>0.005&&ring.maxR*easeOutQuart(rt)>0.5)drawPencilRing(cx,cy,ring.maxR*easeOutQuart(rt),clamp(rt*1.35,0,1),ringAlpha,ring.seed,ring.lw);
        });
        if(re>0.18){
          const dAlpha=easeOutCubic(clamp((re-0.18)/0.6,0,1))*0.38*Math.max(0,1-(re-0.9)/1.4);
          if(dAlpha>0.005)dribbles.forEach(d=>drawDribble(cx,cy,d.angle,d.len,dAlpha,d.seed));
        }
      }
      if(!nameTriggered&&elapsed>FALL_END+0.25){nameTriggered=true;setNameVisible(true);setTimeout(()=>{setHintVisible(true);setReady(true);},1400);}
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);

  return (
    <div onClick={()=>{if(!ready)return;setExiting(true);setTimeout(onEnter,700);}} style={{position:"fixed",inset:0,zIndex:999,background:"linear-gradient(to top,#ede5ff 0%,#ffffff 32%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:ready?"pointer":"default",opacity:exiting?0:1,transition:exiting?"opacity 0.7s ease":"none",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        .splash-name{font-family:'DM Serif Display',Georgia,serif;font-size:clamp(48px,9.5vw,128px);font-weight:400;letter-spacing:-0.02em;line-height:1;background-image:url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80');background-size:cover;background-position:center 30%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;user-select:none;padding:0 16px;text-align:center;position:relative;z-index:1;opacity:0;filter:blur(10px);transform:translateY(8px);transition:opacity 1.5s cubic-bezier(0.16,1,0.3,1),filter 1.5s cubic-bezier(0.16,1,0.3,1),transform 1.5s cubic-bezier(0.16,1,0.3,1);}
        .splash-name.visible{opacity:1;filter:blur(0px);transform:translateY(0);}
        .splash-hint{font-family:'DM Mono',monospace;font-size:10px;color:#aaa;letter-spacing:0.16em;text-transform:uppercase;margin-top:28px;opacity:0;transition:opacity 1s ease;position:relative;z-index:1;}
        .splash-hint.visible{opacity:1;}
      `}</style>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,pointerEvents:"none"}} />
      <div className={`splash-name${nameVisible?" visible":""}`}>miao lan zhang</div>
      <p className={`splash-hint${hintVisible?" visible":""}`}>click anywhere to enter</p>
    </div>
  );
};

// ─── ScribbleM ────────────────────────────────────────────────────────────────

const ScribbleM: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const dpr=window.devicePixelRatio||1,W=38,H=34;
    canvas.width=W*dpr;canvas.height=H*dpr;
    const ctx=canvas.getContext("2d")!;ctx.scale(dpr,dpr);
    const segments=[{p0:[4,29],p1:[4,5],perp:[1,0],amp:9,loops:2,steps:60},{p0:[4,5],p1:[19,18],perp:[-0.68,0.73],amp:6,loops:1.5,steps:45},{p0:[19,18],p1:[34,5],perp:[0.68,0.73],amp:6,loops:1.5,steps:45},{p0:[34,5],p1:[34,29],perp:[-1,0],amp:9,loops:2,steps:60}];
    const lN=(a:number,b:number,t:number)=>a+(b-a)*t;
    const buildPath=()=>{
      const pts:[number,number][]=[];
      segments.forEach(s=>{for(let i=0;i<=s.steps;i++){const t=i/s.steps,mx=lN(s.p0[0],s.p1[0],t),my=lN(s.p0[1],s.p1[1],t),loop=s.amp*Math.sin(t*Math.PI*2*s.loops);pts.push([mx+loop*s.perp[0]+(Math.random()-0.5)*0.7,my+loop*s.perp[1]+(Math.random()-0.5)*0.7]);}});
      return pts;
    };
    let path=buildPath(),drawn=0,pausing=false,raf=0;
    const frame=()=>{
      if(!pausing){drawn+=4;if(drawn>=path.length){drawn=path.length;pausing=true;setTimeout(()=>{path=buildPath();drawn=0;pausing=false;},420);}}
      ctx.clearRect(0,0,W,H);if(drawn<2){raf=requestAnimationFrame(frame);return;}
      const end=Math.min(drawn,path.length);
      ctx.lineCap="round";ctx.lineJoin="round";
      for(let start=0;start<end-1;start+=8){const chunk=Math.min(8,end-start),progress=start/path.length;ctx.beginPath();ctx.moveTo(path[start][0],path[start][1]);for(let j=1;j<chunk;j++)ctx.lineTo(path[start+j][0],path[start+j][1]);ctx.strokeStyle=`rgba(28,26,36,${0.72+0.18*Math.sin(progress*Math.PI*5)})`;ctx.lineWidth=1.1+0.55*Math.sin(progress*Math.PI*8);ctx.stroke();}
      const[nx,ny]=path[end-1];ctx.beginPath();ctx.arc(nx,ny,1.0,0,Math.PI*2);ctx.fillStyle="rgba(28,26,36,0.92)";ctx.fill();
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"38px",height:"34px",display:"block",cursor:"pointer"}} />;
};

// ─── ProjectCard ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  index: number;
  onCursorEnter: (id: number, x: number, y: number) => void;
  onCursorMove: (x: number, y: number) => void;
  onCursorLeave: () => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, index, onCursorEnter, onCursorMove, onCursorLeave }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(()=>{
    const v=videoRef.current;if(!v)return;
    hovered?v.play().catch(()=>{}):v.pause();
  },[hovered]);

  const cardStyle: CSSProperties = {
    display:"block", textDecoration:"none", color:"inherit",
    cursor: project.link ? "none" : "default",
    opacity:0, transform:"translateY(24px)",
    animation:"fadeUp 0.6s ease forwards",
    animationDelay:`${index*0.1}s`,
  };

  const mediaWrapperStyle: CSSProperties = {
    width:"100%", borderRadius:"8px", overflow:"hidden",
    background: project.id===4 ? "#141414" : project.video ? "#f4d2b7" : "#f0eeeb",
    marginBottom:"14px", aspectRatio:"4/3", position:"relative",
  };

  const overlayStyle: CSSProperties = {
    position:"absolute", inset:0,
    background:hovered?"rgba(0,0,0,0.04)":"rgba(0,0,0,0)",
    transition:"background 0.3s ease",
  };

  const imgStyle: CSSProperties = {
    width:"100%", height:"100%", objectFit:"cover", display:"block",
    transition:"transform 0.5s ease",
    transform:hovered?"scale(1.03)":"scale(1)",
  };

  const arrowStyle: CSSProperties = {
    display:"inline-block",
    transform:hovered?"translate(2px,-2px)":"translate(0,0)",
    transition:"transform 0.2s ease",
    opacity:0.4, fontSize:"11px",
  };

  const inner = (
    <>
      <div style={mediaWrapperStyle}>
        {project.id === 4 ? (
          <ClipAIMotion />
        ) : project.video ? (
          <video ref={videoRef} src={project.video} muted loop playsInline autoPlay
            style={{width:"100%",height:"100%",objectFit:"contain",display:"block",padding:"12px"}} />
        ) : project.image ? (
          <img src={project.image} alt={project.title??project.company??""} style={imgStyle} />
        ) : null}
        {project.link && project.id !== 4 && <div style={overlayStyle} />}
      </div>

      <div style={{paddingLeft:"2px",textAlign:"left"}}>
        <p style={{margin:"0 0 4px 0",fontSize:"11px",color:"#999",letterSpacing:"0.01em",fontFamily:"'DM Mono','Courier New',monospace",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>{project.tag}</span>
          <span style={{color:"#bbb"}}>{project.date}</span>
        </p>
        <h3 style={{margin:"0 0 6px 0",fontSize:"14px",fontWeight:500,fontFamily:"'DM Sans','Helvetica Neue',sans-serif",color:"#111",letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:"4px"}}>
          {project.title??project.company}
          {project.link && <span style={arrowStyle}>↗</span>}
        </h3>
        <p style={{margin:0,fontSize:"12.5px",color:"#666",lineHeight:1.55,fontFamily:"'DM Sans','Helvetica Neue',sans-serif",textAlign:"left"}}>
          {project.description}
        </p>
      </div>
    </>
  );

  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener noreferrer"
      className="project-card" style={cardStyle}
      onMouseEnter={(e) => { setHovered(true); onCursorEnter(project.id, e.clientX, e.clientY); }}
      onMouseMove={(e)  => onCursorMove(e.clientX, e.clientY)}
      onMouseLeave={()  => { setHovered(false); onCursorLeave(); }}
    >{inner}</a>
  ) : (
    <div className="project-card" style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >{inner}</div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

type SectionId = "work" | "about" | "play" | "gallery";

const MiaoLanPortfolio: FC = () => {
  const [activeSection,   setActiveSection]   = useState<SectionId>("work");
  const [showSplash,      setShowSplash]      = useState<boolean>(true);
  const [cursorProjectId, setCursorProjectId] = useState<number | null>(null);
  const [cursorPos,       setCursorPos]       = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: SectionId): void => {
    e.preventDefault(); setActiveSection(section);
  };

  return (
    <>
      {showSplash && <SplashScreen onEnter={()=>setShowSplash(false)} />}
      <CustomCursor projectId={cursorProjectId} x={cursorPos.x} y={cursorPos.y} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{margin:0;padding:0;width:100%;overflow-x:hidden;}
        body{background:linear-gradient(to top,#ede5ff 0%,#ffffff 32%);min-height:100vh;color:#111;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .nav-link{font-family:'DM Mono',monospace;font-size:12px;color:#999;text-decoration:none;transition:color 0.2s;letter-spacing:0.02em;}
        .nav-link:hover{color:#111;}.nav-link.active{color:#111;}
        .project-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px 32px;}
        @media(max-width:680px){.project-grid{grid-template-columns:1fr;}}
        .footer-link{font-family:'DM Mono',monospace;font-size:11px;color:#999;text-decoration:none;letter-spacing:0.08em;transition:color 0.2s;text-transform:uppercase;}
        .footer-link:hover{color:#111;}
        .ascii-art{font-family:'DM Mono',monospace;font-size:10px;color:#c8c4bc;line-height:1.6;white-space:pre-wrap;word-break:break-all;max-width:100%;overflow:hidden;animation:fadeIn 1.2s ease 0.8s forwards;opacity:0;}
      `}</style>

      <div style={{minHeight:"100vh",background:"linear-gradient(to top,#ede5ff 0%,#ffffff 32%)",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",textAlign:"left"}}>

        {/* NAV */}
        <nav style={{position:"sticky",top:0,zIndex:100,background:"transparent",padding:"0 24px",height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeIn 0.5s ease forwards"}}>
          <a href="#" onClick={(e)=>{e.preventDefault();setActiveSection("work");}} style={{display:"flex",alignItems:"center",textDecoration:"none"}}><ScribbleM /></a>
          <div style={{display:"flex",gap:"28px",alignItems:"center"}}>
            {(["work","gallery","play","about"] as SectionId[]).map(item=>(
              <a key={item} href="#" className={`nav-link${activeSection===item?" active":""}`} onClick={e=>handleNavClick(e,item)}>{item}</a>
            ))}
          </div>
        </nav>

        {/* MAIN */}
        <main style={{maxWidth:"none",margin:"0",padding:"60px 24px 100px"}}>
          <div style={{marginBottom:"48px",opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards",textAlign:"left"}}>
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:"22px",fontWeight:400,color:"#111",letterSpacing:"-0.02em",marginBottom:"6px",lineHeight:1.3,textAlign:"left"}}>
              Miao Lan <span style={{fontStyle:"italic",color:"#888",fontSize:"14px",fontWeight:300}}>/mee-ow lɑːn/</span> Zhang
            </h1>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"14px",color:"#777",fontWeight:300,letterSpacing:"0.01em",textAlign:"left"}}>
              I design simple experiences for complex systems.
            </p>
          </div>

          {activeSection === "gallery" ? (
            <GalleryPage />
          ) : activeSection === "about" ? (
            <div style={{opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards",maxWidth:"560px"}}>
              <div style={{marginBottom:"48px"}}>
                <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"20px"}}>more about me</p>
                <p style={{fontSize:"14px",color:"#444",lineHeight:1.75,fontWeight:300,marginBottom:"16px"}}>Hello! 👋🏻 I'm Miao Lan, a product designer, builder, and design strategist with over three years of experience, working on a variety of software projects.</p>
                <p style={{fontSize:"14px",color:"#444",lineHeight:1.75,fontWeight:300,marginBottom:"16px"}}>I don't have a clear label for what kind of designer I am. I enjoy building. I enjoy experimenting. I enjoy thinking. What I have is a set of questions I keep returning to. A deep suspicion. A stubborn belief that the emotional layer of a product carries weight.</p>
                <p style={{fontSize:"14px",color:"#444",lineHeight:1.75,fontWeight:300}}>I've always been more interested in the <em>why</em> behind things than the <em>what</em>. Why does someone hesitate before trusting an AI suggestion? Why does one interaction feel collaborative while another feels like a form to fill?</p>
              </div>
              <div style={{marginBottom:"48px"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"14px",fontWeight:500,color:"#111",letterSpacing:"-0.01em",marginBottom:"14px"}}>The Problem With Knowing What You're Designing</p>
                <p style={{fontSize:"14px",color:"#444",lineHeight:1.75,fontWeight:300,marginBottom:"16px"}}>There's a version of design work that feels very clean. Someone hands you a brief. You understand the user, you know the goal, you make the thing. It's satisfying in the way that solving a math problem is satisfying.</p>
                <p style={{fontSize:"14px",color:"#444",lineHeight:1.75,fontWeight:300}}>The best design problems I've worked on are the ones that, at the start, I couldn't fully articulate. Where the "user problem" on the surface is really just a symptom of something else happening underneath.</p>
              </div>
              <div style={{marginBottom:"48px"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"14px",fontWeight:500,color:"#111",letterSpacing:"-0.01em",marginBottom:"14px"}}>AI in Design</p>
                <p style={{fontSize:"14px",color:"#444",lineHeight:1.75,fontWeight:300,marginBottom:"16px"}}>Designing for agentic systems means thinking about how autonomy is shared. Philosophers call this <em>epistemic dependence</em>: most of what we know, we know because we trust a chain of other knowers. AI introduces a new link in that chain.</p>
                <p style={{fontSize:"14px",color:"#444",lineHeight:1.75,fontWeight:300}}>This is the design problem that excites me most. What people believe knowledge is. How people think, act, and reason with AI at scale.</p>
              </div>
            </div>
          ) : (
            <>
              <div style={{marginBottom:"32px",opacity:0,animation:"fadeIn 0.5s ease 0.2s forwards"}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase"}}>selected work</span>
              </div>
              <div className="project-grid">
                {projects.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    onCursorEnter={(id, x, y) => { setCursorProjectId(id); setCursorPos({ x, y }); }}
                    onCursorMove={(x, y) => setCursorPos({ x, y })}
                    onCursorLeave={() => setCursorProjectId(null)}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* FOOTER */}
        <footer style={{borderTop:"1px solid rgba(0,0,0,0.07)",background:"transparent"}}>
          <div style={{padding:"32px 24px 24px",overflow:"hidden"}}><p className="ascii-art">{ASCII_TREES}</p></div>
          <div style={{padding:"24px 24px 40px",display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-end",gap:"32px",animation:"fadeIn 0.8s ease 1s forwards",opacity:0}}>
            <div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"12px",color:"#aaa",fontStyle:"italic",marginBottom:"6px",letterSpacing:"0.01em"}}>Design is making complexity feel simple.</p>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#ccc",letterSpacing:"0.05em"}}>made with &lt;3 and lots of coffee</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"flex-end"}}>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"4px"}}>say hi</p>
              <div style={{display:"flex",gap:"20px"}}>
                {footerLinks.map(({label,href})=><a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-link">{label}</a>)}
              </div>
              <div style={{display:"flex",gap:"20px"}}>
                {navItems.map(({label,href})=><a key={label} href={href} className="footer-link" style={{opacity:0.6}}>{label}</a>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MiaoLanPortfolio;