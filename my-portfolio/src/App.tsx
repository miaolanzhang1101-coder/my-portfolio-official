import React, { useState, useEffect, useRef } from "react";
import type { FC, CSSProperties } from "react";
import aatcImg from "./assets/aatc.png";
import javaai from "./assets/javaai.png";
import dashboard6 from "./assets/dashboard6.mp4";
import tiktoknew from "./assets/tiktoknew.mp4";
import tencent1 from "./assets/tencent1.mov";
import fashion from "./assets/fashion.mp4";
import photoCafe from "./assets/photo_cafe.jpg";
import photoAward from "./assets/photo_award.jpg";
import photoHackathon from "./assets/photo_hackathon.jpg";

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
  tags: string[];
}

interface NavItem    { label: string; href: string; }
interface FooterLink { label: string; href: string; }

interface PlayNodeProps {
  pos: PlayVec2;
  drag: (e: React.MouseEvent<HTMLDivElement>) => void;
  width?: number;
  label: string;
  icon: string;
  accent?: boolean;
  delay?: number;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    id: 1, tag: "JavaAI", company: null, title: "AI Code Editor",
    description: "I built and shipped the MVP and V1 of an AI code editor (IDE) for developer interaction with AI-generated code operations.",
    image: javaai, video: null,
    link: "https://miaolanzhang.notion.site/JavaAI-31420807957280df90afea70b81c1028",
    tall: false, date: "spring 2025", tags: ["AI Startup", "End to end"],
  },
  {
    id: 2, tag: "eBay", company: null, title: "B2B Data Pipeline Platform",
    description: "I redesigned B2B data pipeline platform to improve tool discoverability.",
    image: null, video: dashboard6,
    link: "https://miaolanzhang.notion.site/eBay-32520807957280a4a4c7e51c1076415f",
    tall: false, date: "fall 2024", tags: ["Enterprise SaaS", "Systems Design"],
  },
  {
    id: 3, tag: "Colgate-Palmolive", company: null, title: "Enterprise Design System",
    description: "I adopted and scaled enterprise design system for AI workflows.",
    image: aatcImg, video: null,
    link: "https://miaolanzhang.notion.site/Colgate-Palmolive-31c208079572804a953dcf105d353f2a",
    tall: false, date: "spring 2024", tags: ["Design System", "AI Features"],
  },
  {
    id: 4, tag: "ClipAI", company: null, title: "Automated Video Clipping",
    description: "I initiated a new content creation workflow for automated video clipping.",
    image: null, video: fashion,
    link: "https://miaolanzhang.notion.site/ClipAI-31c2080795728096a762c78c32bd7ffa",
    tall: false, date: "fall 2023", tags: ["Creative Workflow Automation"],
  },
  {
    id: 5, tag: "TikTok", company: null, title: "Creator Discovery Experience",
    description: "I redesigned the creator discovery flow for TikTok two-sided creator marketplace.",
    image: null, video: tiktoknew,
    link: "https://miaolanzhang.notion.site/TikTok-3252080795728008a60bf9b2518c89b1",
    tall: false, date: "spring 2023", tags: ["Growth & Conversion Optimization"],
  },
  {
    id: 6, tag: "Tencent", company: null, title: "eCommerce Subscription",
    description: "I redesigned the consumer subscription flow for WeChat Stores.",
    image: null, video: tencent1,
    link: null,
    tall: false, date: "spring 2023", tags: ["Search & Recommendation"],
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
    labelColor: "rgb(255,255,255)", size: 80, shape: "pill",
  },
  2: {
    bg: "rgba(210,205,250,0.28)", border: "rgba(190,185,240,0.6)",
    glow: "rgba(170,165,230,0.28)", label: "eBay",
    labelColor: "rgb(90,80,150)", size: 72, shape: "circle",
  },
  3: {
    bg: "rgba(140,220,160,0.14)", border: "rgba(15,3,250,0.48)",
    glow: "rgba(60,160,90,0.28)", label: "Colgate",
    labelColor: "rgb(9,9,9)", size: 84, shape: "pill",
  },
  4: {
    bg: "rgba(30,30,30,0.45)", border: "rgb(255,255,255)",
    glow: "rgba(232,168,76,0.3)", label: "ClipAI",
    labelColor: "rgb(255,255,255)", size: 76, shape: "circle",
  },
  5: {
    bg: "rgba(255,100,140,0.13)", border: "rgba(220,70,110,0.48)",
    glow: "rgba(220,70,110,0.25)", label: "TikTok",
    labelColor: "rgb(255,255,255)", size: 76, shape: "circle",
  },
  6: {
    bg: "rgba(255,100,140,0.13)", border: "rgba(220,70,110,0.48)",
    glow: "rgba(220,70,110,0.25)", label: "Building",
    labelColor: "rgb(255,255,255)", size: 76, shape: "circle",
  },
};

interface CustomCursorProps { projectId: number | null; x: number; y: number; titleHovered: boolean; }
const CustomCursor = ({ projectId, x, y, titleHovered }: CustomCursorProps) => {
  const [pos, setPos]      = useState({ x: -100, y: -100 });
  const rafRef             = useRef<number>(0);
  const targetRef          = useRef({ x: -100, y: -100 });
  const currentRef         = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
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

  const cfg  = projectId ? CURSOR_CONFIGS[projectId] : null;
  const half = cfg ? cfg.size / 2 : 0;
  const br   = cfg ? (cfg.shape === "circle" ? "50%" : `${cfg.size}px`) : "50%";
  const active = cfg || titleHovered;

  return (
    <>
      <style>{`@keyframes flowerSpin{from{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.15)}to{transform:rotate(360deg) scale(1)}}`}</style>
      <div style={{ position:"fixed", left:pos.x-8, top:pos.y-8, width:16, height:16, borderRadius:"50%", background:"rgba(255,255,255,0.55)", border:"1px solid rgba(180,180,200,0.5)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", boxShadow:"0 2px 10px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.9)", pointerEvents:"none", zIndex:9999, transition:"transform 0.15s ease,opacity 0.2s ease", transform:active?"scale(0.5)":"scale(1)", opacity:active?0.4:1, mixBlendMode:"normal" as const }} />

      {titleHovered && !cfg && (
        <div style={{ position:"fixed", left:pos.x-24, top:pos.y-24, width:48, height:48, borderRadius:"50%", background:"rgba(255,255,255,0.22)", border:"1px solid rgba(200,180,255,0.5)", backdropFilter:"blur(14px) saturate(1.8)", WebkitBackdropFilter:"blur(14px) saturate(1.8)", boxShadow:"0 0 14px 3px rgba(200,180,255,0.25), inset 0 1px 0 rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:9998 }}>
          <span style={{ fontSize:"18px", lineHeight:1, display:"block", animation:"flowerSpin 4s linear infinite", transformOrigin:"center" }}>✿</span>
        </div>
      )}

      {cfg && (
        <div style={{ position:"fixed", left:pos.x-half, top:pos.y-half, width:cfg.size, height:cfg.size, borderRadius:br, background:cfg.bg, border:`1px solid ${cfg.border}`, backdropFilter:"blur(12px) saturate(1.6)", WebkitBackdropFilter:"blur(12px) saturate(1.6)", boxShadow:`0 0 18px 2px ${cfg.glow},inset 0 1px 0 rgba(255,255,255,0.25)`, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:9998 }}>
          <div style={{ position:"absolute", inset:4, borderRadius:br, border:"0.5px solid rgba(255,255,255,0.2)", pointerEvents:"none" }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", letterSpacing:"0.08em", color:cfg.labelColor, fontWeight:400, position:"relative", zIndex:1, whiteSpace:"nowrap" }}>{cfg.label}</span>
        </div>
      )}
    </>
  );
};

// ─── Shared noise helper ───────────────────────────────────────────────────────

function smoothNoise(x: number, y: number, t: number): number {
  return (Math.sin(x*1.3+t)*Math.cos(y*0.9-t*0.7)+Math.cos(x*0.7-t*0.4)*Math.sin(y*1.1+t*0.5))*0.5;
}

// ─── Gallery Sketches ─────────────────────────────────────────────────────────

function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width=canvas.offsetWidth*window.devicePixelRatio; canvas.height=canvas.offsetHeight*window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w=canvas.offsetWidth,h=canvas.offsetHeight;
    const particles=Array.from({length:180},()=>({x:Math.random()*w,y:Math.random()*h,age:Math.random()*80}));
    let t=0,raf=0;
    const draw=()=>{ ctx.fillStyle="rgba(245,243,240,0.18)"; ctx.fillRect(0,0,w,h); for(const p of particles){const angle=smoothNoise(p.x/w*3,p.y/h*3,t)*Math.PI*2; p.x+=Math.cos(angle)*1.2; p.y+=Math.sin(angle)*1.2; p.age++; if(p.x<0||p.x>w||p.y<0||p.y>h||p.age>120){p.x=Math.random()*w;p.y=Math.random()*h;p.age=0;} const alpha=Math.sin((p.age/120)*Math.PI)*0.7; ctx.beginPath();ctx.arc(p.x,p.y,1.2,0,Math.PI*2);ctx.fillStyle=`rgba(80,70,60,${alpha})`;ctx.fill();} t+=0.006;raf=requestAnimationFrame(draw);};
    draw(); return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
}

const LissajousWeb: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    canvas.width=canvas.offsetWidth*window.devicePixelRatio; canvas.height=canvas.offsetHeight*window.devicePixelRatio; ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w=canvas.offsetWidth,h=canvas.offsetHeight,cx=w/2,cy=h/2,r=Math.min(w,h)*0.38; let t=0,raf=0;
    const draw=()=>{ ctx.fillStyle="rgba(245,243,240,0.12)";ctx.fillRect(0,0,w,h); [{a:3,b:2,delta:t},{a:5,b:4,delta:t*0.7+0.3},{a:2,b:3,delta:t*1.3+1.0}].forEach(({a,b,delta},ci)=>{ ctx.beginPath(); for(let i=0;i<=360;i++){const ang=(i/360)*Math.PI*2;i===0?ctx.moveTo(cx+r*Math.sin(a*ang+delta),cy+r*Math.sin(b*ang)):ctx.lineTo(cx+r*Math.sin(a*ang+delta),cy+r*Math.sin(b*ang));} ctx.strokeStyle=(["rgba(180,100,80,","rgba(80,120,160,","rgba(100,160,120,"][ci])+"0.35)"; ctx.lineWidth=1.2;ctx.stroke();}); t+=0.004;raf=requestAnimationFrame(draw);};
    draw(); return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
};

const DotGrid: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    canvas.width=canvas.offsetWidth*window.devicePixelRatio; canvas.height=canvas.offsetHeight*window.devicePixelRatio; ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w=canvas.offsetWidth,h=canvas.offsetHeight,ROWS=12,COLS=18; let t=0,raf=0;
    const draw=()=>{ ctx.clearRect(0,0,w,h);ctx.fillStyle="#f5f3f0";ctx.fillRect(0,0,w,h); for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){const x=(col+0.5)*(w/COLS),y=(row+0.5)*(h/ROWS),n=smoothNoise(col/COLS*4,row/ROWS*4,t); ctx.beginPath();ctx.arc(x,y,Math.max(0.5,2+n*6),0,Math.PI*2); ctx.fillStyle=`rgba(60,55,50,${0.25+(n+1)*0.3})`;ctx.fill();} t+=0.012;raf=requestAnimationFrame(draw);};
    draw(); return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
};

const OrbitRings: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    canvas.width=canvas.offsetWidth*window.devicePixelRatio; canvas.height=canvas.offsetHeight*window.devicePixelRatio; ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
    const w=canvas.offsetWidth,h=canvas.offsetHeight,cx=w/2,cy=h/2;
    const rings=Array.from({length:6},(_,i)=>({r:18+i*22,speed:0.008+i*0.003*(i%2===0?1:-1),dotCount:3+i*2,dotR:3.5-i*0.3,phase:(i/6)*Math.PI*2})); let t=0,raf=0;
    const draw=()=>{ ctx.fillStyle="rgba(245,243,240,0.22)";ctx.fillRect(0,0,w,h); rings.forEach((ring,ri)=>{ ctx.beginPath();ctx.arc(cx,cy,ring.r,0,Math.PI*2);ctx.strokeStyle="rgba(160,150,140,0.18)";ctx.lineWidth=0.8;ctx.stroke(); for(let d=0;d<ring.dotCount;d++){const angle=ring.phase+t*ring.speed*60+(d/ring.dotCount)*Math.PI*2; ctx.beginPath();ctx.arc(cx+ring.r*Math.cos(angle),cy+ring.r*Math.sin(angle),Math.max(0.5,ring.dotR),0,Math.PI*2); ctx.fillStyle=ri%2===0?"rgba(180,100,70,0.75)":"rgba(70,110,160,0.75)";ctx.fill();}}); t+=0.016;raf=requestAnimationFrame(draw);};
    draw(); return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}} />;
};

// ─── KanbanSketch ─────────────────────────────────────────────────────────────

type KanbanCard = { id: number; col: number; label: string; color: string; };

const KANBAN_INITIAL: KanbanCard[] = [
  { id:1, col:0, label:"User Research",  color:"#ede0f7" },
  { id:2, col:0, label:"Journey Map",    color:"#ddeef7" },
  { id:3, col:0, label:"A/B Testing",    color:"#f7dde6" },
  { id:4, col:1, label:"Wireframes",     color:"#f7eedd" },
  { id:5, col:1, label:"Prototype v1",   color:"#ddf7e6" },
  { id:6, col:2, label:"Dev Handoff",    color:"#ede0f7" },
  { id:7, col:3, label:"Shipped ✓",      color:"#ddf7e6" },
];

const KanbanSketch: FC = () => {
  const COLS = ["Backlog","In Progress","Review","Done"];
  const [cards, setCards] = useState<KanbanCard[]>(KANBAN_INITIAL);
  const [flashId, setFlashId] = useState<number|null>(null);

  useEffect(() => {
    const tick = setInterval(() => {
      setCards(prev => {
        const movable = prev.filter(c => c.col < 3);
        if (movable.length === 0) return KANBAN_INITIAL;
        const pick = movable[Math.floor(Math.random() * movable.length)];
        setFlashId(pick.id);
        setTimeout(() => setFlashId(null), 500);
        return prev.map(c => c.id === pick.id ? { ...c, col: c.col + 1 } : c);
      });
    }, 2200);
    return () => clearInterval(tick);
  }, []);

  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px",gap:"10px",fontFamily:"'DM Mono',monospace"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:"9px",color:"#999",letterSpacing:"0.1em",textTransform:"uppercase"}}>Sprint 12</span>
        <span style={{fontSize:"9px",color:"#3333ee",letterSpacing:"0.04em"}}>Day 8 / 14</span>
      </div>
      <div style={{height:"2px",background:"#f0f0f0",borderRadius:"2px",overflow:"hidden"}}>
        <div style={{height:"100%",width:"57%",background:"#3333ee",borderRadius:"2px"}} />
      </div>
      <div style={{flex:1,display:"flex",gap:"8px",overflow:"hidden"}}>
        {COLS.map((col, ci) => (
          <div key={col} style={{flex:1,display:"flex",flexDirection:"column",gap:"4px",minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"3px"}}>
              <span style={{fontSize:"6.5px",color:"#bbb",letterSpacing:"0.06em",textTransform:"uppercase",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{col}</span>
              <span style={{fontSize:"6.5px",color:"#ccc",background:"#f5f5f5",borderRadius:"8px",padding:"0 4px",lineHeight:"13px",flexShrink:0}}>{cards.filter(c=>c.col===ci).length}</span>
            </div>
            {cards.filter(c=>c.col===ci).map(card => (
              <div key={card.id} style={{
                background:flashId===card.id?"rgba(51,51,238,0.06)":"#fafafa",
                border:`1px solid ${flashId===card.id?"rgba(51,51,238,0.3)":"#ebebeb"}`,
                borderRadius:"4px", padding:"5px 7px",
                fontSize:"7px", color:flashId===card.id?"#3333ee":"#555", lineHeight:1.4,
                transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                opacity:flashId===card.id ? 0.6 : 1,
                transform:flashId===card.id ? "scale(0.93)" : "scale(1)",
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
              }}>{card.label}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"3px",alignItems:"flex-end",height:"18px",paddingTop:"6px",borderTop:"1px solid #f0f0f0"}}>
        <span style={{fontSize:"6.5px",color:"#ccc",marginRight:"3px",alignSelf:"center"}}>velocity</span>
        {[8,12,10,14,11,13].map((v,i) => (
          <div key={i} style={{flex:1,height:`${Math.round(v*1.1)}px`,background:i===5?"#3333ee":"#e8e8e8",borderRadius:"2px 2px 0 0",transition:"background 0.3s"}} />
        ))}
      </div>
    </div>
  );
};

// ─── WCAGSketch ───────────────────────────────────────────────────────────────

const WCAGSketch: FC = () => {
  const CHECKS = [
    { label:"Color Contrast",  detail:"7.2 : 1",    level:"AAA", color:"#4a8a5a" },
    { label:"Focus Visible",   detail:"3px outline", level:"AA",  color:"#4a7a9a" },
    { label:"Text Resize",     detail:"200% zoom",   level:"AA",  color:"#4a7a9a" },
    { label:"Alt Text",        detail:"img[alt] ✓",  level:"A",   color:"#8a6a4a" },
    { label:"Keyboard Nav",    detail:"Tab order ✓", level:"AA",  color:"#4a7a9a" },
  ];

  const [step, setStep]         = useState(0);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setScanning(true);
      setTimeout(() => { setScanning(false); setStep(s => (s + 1) % CHECKS.length); }, 600);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const cur = CHECKS[step];

  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px",gap:"10px",fontFamily:"'DM Mono',monospace"}}>
      <span style={{fontSize:"9px",color:"#999",letterSpacing:"0.1em",textTransform:"uppercase"}}>WCAG Audit</span>
      {/* FIX: removed duplicate `border` property — keep only the ternary version */}
      <div style={{background:"#fafafa",borderRadius:"6px",padding:"10px 12px",border:scanning?"1px solid #3333ee":"1px solid #ebebeb",transition:"border 0.25s"}}>
        <div style={{fontSize:"6.5px",color:"#bbb",marginBottom:"6px",letterSpacing:"0.04em"}}>UI Component under review</div>
        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
          <div style={{height:"18px",background:"#111",borderRadius:"3px",padding:"0 10px",display:"flex",alignItems:"center",outline:step===1?"2px solid #3333ee":"none",outlineOffset:"2px",transition:"outline 0.2s"}}>
            <span style={{fontSize:"6.5px",color:"#fff",letterSpacing:"0.04em"}}>Submit</span>
          </div>
          <div style={{height:"18px",background:"#fff",borderRadius:"3px",flex:1,display:"flex",alignItems:"center",paddingLeft:"7px",border:"1px solid #e8e8e8"}}>
            <span style={{fontSize:"6.5px",color:"#ccc"}}>Enter email…</span>
          </div>
        </div>
        {scanning && <div style={{height:"1px",background:"linear-gradient(90deg,transparent,#3333ee,transparent)",marginTop:"6px"}} />}
      </div>
      <div style={{background:"rgba(51,51,238,0.04)",border:"1px solid rgba(51,51,238,0.2)",borderRadius:"6px",padding:"8px 10px",transition:"all 0.35s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"3px"}}>
          <span style={{fontSize:"7.5px",color:"#3333ee",fontWeight:500}}>{cur.label}</span>
          <span style={{fontSize:"6.5px",background:"#3333ee",color:"#fff",borderRadius:"3px",padding:"1px 6px",letterSpacing:"0.04em"}}>{cur.level}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
          <span style={{fontSize:"6.5px",color:"#999"}}>{cur.detail}</span>
          <span style={{fontSize:"9px",color:"#3333ee"}}>✓</span>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:"2px",overflow:"hidden"}}>
        {CHECKS.map((c,i) => (
          <div key={c.label} style={{display:"flex",alignItems:"center",gap:"6px",padding:"4px 6px",borderRadius:"4px",background:i===step?"rgba(51,51,238,0.04)":"transparent",transition:"background 0.3s"}}>
            <span style={{fontSize:"8px",color:i<=step?"#3333ee":"#ddd"}}>✓</span>
            <span style={{fontSize:"7px",color:i===step?"#111":i<step?"#bbb":"#ddd",flex:1,transition:"color 0.3s"}}>{c.label}</span>
            <span style={{fontSize:"6px",color:"#bbb",background:"#f5f5f5",borderRadius:"2px",padding:"1px 5px"}}>{c.level}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:"6px"}}>
        {(["A","AA","AAA"] as const).map(l => (
          <div key={l} style={{background:l==="AA"?"#3333ee":"transparent",color:l==="AA"?"#fff":"#bbb",border:`1px solid ${l==="AA"?"#3333ee":"#e8e8e8"}`,borderRadius:"3px",padding:"2px 8px",fontSize:"7px",letterSpacing:"0.06em"}}>WCAG {l}</div>
        ))}
      </div>
    </div>
  );
};

// ─── DesignThinkingSketch ─────────────────────────────────────────────────────

const DesignThinkingSketch: FC = () => {
  const STAGES = ["Empathize","Define","Ideate","Prototype","Test"];
  const DESC   = ["User interviews & field research","Problem framing & HMW statements","Brainstorm · Crazy 8s · Sketches","Lo-fi wireframes · click-through","Usability testing & iteration"];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a+1) % STAGES.length), 2200);
    return () => clearInterval(id);
  },[]);
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"24px 20px",fontFamily:"'DM Mono',monospace"}}>
      <span style={{fontSize:"9px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"auto"}}>Design Thinking</span>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"10px"}}>
        <span style={{fontSize:"11px",color:"#3333ee",letterSpacing:"0.08em",fontFamily:"'DM Mono',monospace"}}>{String(active+1).padStart(2,"0")} / {STAGES.length}</span>
        <div style={{fontSize:"28px",fontWeight:700,color:"#111",letterSpacing:"-0.03em",lineHeight:1,fontFamily:"'Inter',sans-serif",transition:"all 0.35s"}}>{STAGES[active]}</div>
        <div style={{width:"28px",height:"2px",background:"#3333ee",borderRadius:"1px"}} />
        <div style={{fontSize:"10px",color:"#999",lineHeight:1.65,letterSpacing:"0.01em"}}>{DESC[active]}</div>
      </div>
      <div style={{display:"flex",gap:"5px",paddingTop:"16px"}}>
        {STAGES.map((s,i) => (
          <div key={s} style={{flex:i===active?3:1,height:"2px",borderRadius:"2px",background:i===active?"#3333ee":i<active?"#ddd":"#f0f0f0",transition:"all 0.45s cubic-bezier(0.4,0,0.2,1)"}} />
        ))}
      </div>
    </div>
  );
};

// ─── UserResearchSketch ───────────────────────────────────────────────────────

const UserResearchSketch: FC = () => {
  const METHODS = [
    { label:"User Interviews",  n:"12",  sub:"60-min sessions"  },
    { label:"Surveys",          n:"248", sub:"68% response rate" },
    { label:"Usability Tests",  n:"6",   sub:"think-aloud"       },
    { label:"Analytics",        n:"90d", sub:"event tracking"    },
  ];
  const INSIGHT = [
    "Users abandon at step 3 of checkout",
    "Navigation labels cause confusion",
    "Mobile tap targets too small",
    "Search results lack filtering",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i+1) % METHODS.length), 1800);
    return () => clearInterval(id);
  },[]);
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px",fontFamily:"'DM Mono',monospace",gap:"12px"}}>
      <span style={{fontSize:"9px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase"}}>User Research</span>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
        {METHODS.map((m,i) => (
          <div key={m.label} style={{background:i===idx?"rgba(51,51,238,0.04)":"#fafafa",border:`1px solid ${i===idx?"rgba(51,51,238,0.25)":"#ebebeb"}`,borderRadius:"6px",padding:"8px 10px",transition:"all 0.35s"}}>
            <div style={{fontSize:"18px",fontWeight:700,color:i===idx?"#3333ee":"#111",fontFamily:"'Inter',sans-serif",lineHeight:1,marginBottom:"3px",transition:"color 0.35s"}}>{m.n}</div>
            <div style={{fontSize:"7.5px",color:i===idx?"#555":"#bbb",lineHeight:1.4,transition:"color 0.35s"}}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",background:"#fafafa",borderRadius:"6px",border:"1px solid #ebebeb",padding:"12px 14px",gap:"5px"}}>
        <span style={{fontSize:"7px",color:"#3333ee",letterSpacing:"0.1em",textTransform:"uppercase"}}>Key Insight</span>
        <span style={{fontSize:"11px",color:"#333",lineHeight:1.55,fontStyle:"italic",fontFamily:"'DM Serif Display',Georgia,serif"}}>"{INSIGHT[idx]}"</span>
      </div>
    </div>
  );
};

// ─── FigmaSketch ──────────────────────────────────────────────────────────────

const FigmaSketch: FC = () => {
  const LAYERS = [
    { id:0, name:"Frame / Checkout", indent:0 },
    { id:1, name:"Card",             indent:1 },
    { id:2, name:"Button / Primary", indent:2 },
    { id:3, name:"Label",            indent:3 },
    { id:4, name:"Input Field",      indent:2 },
    { id:5, name:"Footer",           indent:1 },
  ];
  const [sel, setSel] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setSel(l => (l+1) % LAYERS.length), 1800);
    return () => clearInterval(id);
  },[]);
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",fontFamily:"'DM Mono',monospace",overflow:"hidden"}}>
      <div style={{width:"55%",borderRight:"1px solid #f0f0f0",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"8px 10px",borderBottom:"1px solid #f0f0f0",fontSize:"7.5px",color:"#bbb",letterSpacing:"0.08em",textTransform:"uppercase"}}>Layers</div>
        <div style={{flex:1,paddingTop:"4px"}}>
          {LAYERS.map(l => (
            <div key={l.id} style={{display:"flex",alignItems:"center",padding:"4px 10px",paddingLeft:`${10+l.indent*10}px`,background:l.id===sel?"rgba(51,51,238,0.05)":"transparent",borderLeft:l.id===sel?"2px solid #3333ee":"2px solid transparent",transition:"all 0.3s"}}>
              <div style={{width:"5px",height:"5px",borderRadius:"1px",border:`1px solid ${l.id===sel?"#3333ee":"#ddd"}`,marginRight:"6px",flexShrink:0,transition:"border-color 0.3s"}} />
              <span style={{fontSize:"7px",color:l.id===sel?"#111":"#bbb",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",transition:"color 0.3s"}}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"8px 10px",borderBottom:"1px solid #f0f0f0",fontSize:"7.5px",color:"#bbb",letterSpacing:"0.08em",textTransform:"uppercase"}}>Inspect</div>
        <div style={{padding:"10px",display:"flex",flexDirection:"column",gap:"7px"}}>
          <div style={{fontSize:"7px",color:"#3333ee",marginBottom:"-2px"}}>{LAYERS[sel].name}</div>
          {[["W","320"],["H","52"],["R","8"],["Gap","12"]].map(([k,v]) => (
            <div key={k} style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <span style={{fontSize:"6.5px",color:"#ccc",width:"12px"}}>{k}</span>
              <div style={{flex:1,background:"#fafafa",border:"1px solid #ebebeb",borderRadius:"3px",padding:"2px 7px",fontSize:"7px",color:"#666"}}>{v}</div>
            </div>
          ))}
          <div style={{display:"flex",gap:"5px",alignItems:"center",marginTop:"2px"}}>
            <div style={{width:"12px",height:"12px",borderRadius:"2px",background:"#3333ee",flexShrink:0}} />
            <span style={{fontSize:"6.5px",color:"#bbb"}}>3333EE · 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DesignSystemSketch ───────────────────────────────────────────────────────

const DesignSystemSketch: FC = () => {
  const COMPONENTS = ["Button","Input","Card","Modal","Badge","Toast","Tag","Avatar"];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(c => (c+1) % COMPONENTS.length), 1400);
    return () => clearInterval(id);
  },[]);
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px",fontFamily:"'DM Mono',monospace",gap:"14px"}}>
      <span style={{fontSize:"9px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase"}}>Design System</span>
      <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
        {["#111","#3333ee","#7a6fff","#ebebeb","#fff"].map((c) => (
          <div key={c} style={{width:"20px",height:"20px",borderRadius:"50%",background:c,border:c==="#fff"?"1px solid #e8e8e8":"none",flexShrink:0}} />
        ))}
        <span style={{fontSize:"7px",color:"#ccc",fontFamily:"'DM Mono',monospace",marginLeft:"4px"}}>tokens</span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap" as const,gap:"5px",flex:1,alignContent:"flex-start" as const}}>
        {COMPONENTS.map((c,i) => (
          <div key={c} style={{background:i===active?"#3333ee":"transparent",border:`1px solid ${i===active?"#3333ee":"#e8e8e8"}`,borderRadius:"4px",padding:"5px 10px",fontSize:"9px",color:i===active?"#fff":"#bbb",transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",fontFamily:"'DM Mono',monospace"}}>{c}</div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"6px",paddingTop:"6px",borderTop:"1px solid #f0f0f0"}}>
        {["Atoms","Molecules","Organisms"].map((a,i) => (
          <React.Fragment key={a}>
            <span style={{fontSize:"7.5px",color:i===0?"#3333ee":"#ccc",fontFamily:"'DM Mono',monospace"}}>{a}</span>
            {i<2 && <span style={{fontSize:"9px",color:"#ddd"}}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ─── PrototypingSketch ────────────────────────────────────────────────────────

const PrototypingSketch: FC = () => {
  const SCREENS = [
    { id:0, label:"Home",     x:10,  y:22  },
    { id:1, label:"Search",   x:110, y:5   },
    { id:2, label:"Detail",   x:110, y:90  },
    { id:3, label:"Cart",     x:210, y:22  },
    { id:4, label:"Checkout", x:210, y:95  },
  ];
  const FLOWS = [[0,1],[0,2],[1,3],[2,3],[3,4]];
  const [af, setAf] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAf(f => (f+1) % FLOWS.length), 1500);
    return () => clearInterval(id);
  },[]);
  const [a,b] = FLOWS[af];
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px",fontFamily:"'DM Mono',monospace",gap:"10px"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:"9px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase"}}>User Flow</span>
        <span style={{fontSize:"9px",color:"#3333ee"}}>{SCREENS[a].label} → {SCREENS[b].label}</span>
      </div>
      <div style={{flex:1,position:"relative"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible"}}>
          {FLOWS.map(([from,to],i) => {
            const s=SCREENS[from],e=SCREENS[to],isA=i===af;
            return <line key={i} x1={`${s.x+48}px`} y1={`${s.y+18}px`} x2={`${e.x}px`} y2={`${e.y+18}px`} stroke={isA?"#3333ee":"#e8e8e8"} strokeWidth={isA?1.5:1} strokeDasharray={isA?"5 3":"none"} style={{transition:"stroke 0.3s"}} />;
          })}
        </svg>
        {SCREENS.map(s => {
          const isActive = s.id===a||s.id===b;
          return (
            <div key={s.id} style={{position:"absolute",left:`${s.x}px`,top:`${s.y}px`,width:"52px",height:"38px",background:isActive?"rgba(51,51,238,0.04)":"#fafafa",border:`1px solid ${isActive?"rgba(51,51,238,0.3)":"#e8e8e8"}`,borderRadius:"5px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"4px",transition:"all 0.35s"}}>
              <div style={{width:"26px",height:"2px",background:isActive?"#3333ee":"#e0e0e0",borderRadius:"1px",transition:"background 0.35s"}} />
              <div style={{width:"18px",height:"2px",background:"#f0f0f0",borderRadius:"1px"}} />
              <span style={{fontSize:"5.5px",color:isActive?"#3333ee":"#bbb",marginTop:"1px",transition:"color 0.35s"}}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── ColorContrastSketch ──────────────────────────────────────────────────────

const ColorContrastSketch: FC = () => {
  const PAIRS = [
    { fg:"#111",    bg:"#fff",    ratio:21.0, level:"AAA", label:"Black / White"    },
    { fg:"#fff",    bg:"#111",    ratio:21.0, level:"AAA", label:"White / Black"    },
    { fg:"#fff",    bg:"#3333ee", ratio:5.8,  level:"AA",  label:"White / Purple"   },
    { fg:"#3333ee", bg:"#fff",    ratio:5.8,  level:"AA",  label:"Purple / White"   },
    { fg:"#111",    bg:"#ebebeb", ratio:14.7, level:"AAA", label:"Black / Light"    },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i+1) % PAIRS.length), 2000);
    return () => clearInterval(id);
  },[]);
  const cur = PAIRS[idx];
  const isAAA = cur.level==="AAA";
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px",fontFamily:"'Inter',sans-serif",gap:"12px"}}>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase"}}>Colour Contrast</span>
      <div style={{background:cur.bg,border:"1px solid #e8e8e8",borderRadius:"6px",padding:"16px",display:"flex",flexDirection:"column",gap:"4px",flex:1,justifyContent:"center",transition:"background 0.5s"}}>
        <span style={{color:cur.fg,fontSize:"14px",fontWeight:700,letterSpacing:"-0.02em",transition:"color 0.5s"}}>{cur.label}</span>
        <span style={{color:cur.fg,fontSize:"9px",opacity:0.65,fontFamily:"'DM Mono',monospace",letterSpacing:"0.03em",transition:"color 0.5s"}}>The quick brown fox jumps</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:"4px"}}>
          <span style={{fontSize:"24px",fontWeight:700,color:"#111",fontFamily:"'DM Mono',monospace"}}>{cur.ratio}</span>
          <span style={{fontSize:"9px",color:"#bbb",fontFamily:"'DM Mono',monospace"}}> : 1</span>
        </div>
        <div style={{background:isAAA?"#3333ee":"transparent",border:`1px solid ${isAAA?"#3333ee":"#e8e8e8"}`,borderRadius:"4px",padding:"3px 10px",fontSize:"8px",color:isAAA?"#fff":"#bbb",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>{cur.level}</div>
      </div>
      <div style={{height:"2px",background:"#f0f0f0",borderRadius:"2px",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.min(100,(cur.ratio/21)*100)}%`,background:"#3333ee",borderRadius:"2px",transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)"}} />
      </div>
    </div>
  );
};

// ─── ScreenReaderSketch ───────────────────────────────────────────────────────

const ScreenReaderSketch: FC = () => {
  const NODES = [
    { label:"<header>",  aria:"role=banner",      depth:0 },
    { label:"<nav>",     aria:"role=navigation",  depth:1 },
    { label:"<main>",    aria:"role=main",         depth:0 },
    { label:"<h1>",      aria:"aria-level=1",      depth:1 },
    { label:"<button>",  aria:"aria-label=submit", depth:1 },
    { label:"<footer>",  aria:"role=contentinfo",  depth:0 },
  ];
  const [focused, setFocused] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFocused(f => (f+1) % NODES.length), 1600);
    return () => clearInterval(id);
  },[]);
  const cur = NODES[focused];
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",flexDirection:"column",padding:"20px",fontFamily:"'DM Mono',monospace",gap:"10px"}}>
      <span style={{fontSize:"9px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase"}}>Screen Reader</span>
      <div style={{display:"flex",flexDirection:"column",gap:"2px",flex:1}}>
        {NODES.map((n,i) => (
          <div key={n.label} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 8px",paddingLeft:`${8+n.depth*14}px`,borderRadius:"4px",background:i===focused?"rgba(51,51,238,0.04)":"transparent",border:`1px solid ${i===focused?"rgba(51,51,238,0.2)":"transparent"}`,transition:"all 0.3s"}}>
            {n.depth>0 && <div style={{width:"8px",height:"1px",background:"#e8e8e8",flexShrink:0}} />}
            <span style={{fontSize:"9px",color:i===focused?"#3333ee":"#bbb",transition:"color 0.3s",fontWeight:i===focused?600:400}}>{n.label}</span>
            {i===focused && <span style={{fontSize:"7px",color:"#ccc",marginLeft:"auto"}}>{n.aria}</span>}
          </div>
        ))}
      </div>
      <div style={{background:"rgba(51,51,238,0.04)",border:"1px solid rgba(51,51,238,0.15)",borderRadius:"6px",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"3px"}}>
        <span style={{fontSize:"7px",color:"#3333ee",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"2px"}}>Reading aloud</span>
        <span style={{fontSize:"10px",color:"#111",fontWeight:600}}>{cur.label}</span>
        <span style={{fontSize:"7.5px",color:"#bbb"}}>{cur.aria}</span>
      </div>
    </div>
  );
};

// ─── ProtoPieSketch ───────────────────────────────────────────────────────────

const ProtoPieSketch: FC = () => {
  const TRIGGERS = [
    { event: "Tap",    response: "Scale 1.0 → 1.08",    color: "#3333ee" },
    { event: "Drag",   response: "Translate X + Y",      color: "#7a6fff" },
    { event: "Scroll", response: "Opacity 1.0 → 0.0",    color: "#3333ee" },
    { event: "Swipe",  response: "Navigate → Detail",    color: "#5555cc" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % TRIGGERS.length), 1800);
    return () => clearInterval(id);
  }, []);
  const cur = TRIGGERS[active];
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", display:"flex", flexDirection:"column", padding:"20px", fontFamily:"'DM Mono',monospace", gap:"10px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"9px", color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase" }}>ProtoPie</span>
        <span style={{ fontSize:"8px", background:"rgba(51,51,238,0.08)", color:"#3333ee", borderRadius:"4px", padding:"2px 8px" }}>Interaction</span>
      </div>
      <div style={{ display:"flex", gap:"8px", flex:1 }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"4px" }}>
          <span style={{ fontSize:"7px", color:"#ccc", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"2px" }}>Trigger</span>
          {TRIGGERS.map((t, i) => (
            <div key={t.event} style={{ padding:"6px 8px", borderRadius:"4px", border:`1px solid ${i === active ? "rgba(51,51,238,0.3)" : "#ebebeb"}`, background: i === active ? "rgba(51,51,238,0.04)" : "#fafafa", fontSize:"8px", color: i === active ? "#3333ee" : "#bbb", transition:"all 0.3s" }}>{t.event}</div>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"20px" }}>
          <div style={{ width:"100%", height:"1px", background:"#e0e0e0", position:"relative" }}>
            <div style={{ position:"absolute", top:"-3px", right:"-3px", width:0, height:0, borderTop:"3px solid transparent", borderBottom:"3px solid transparent", borderLeft:`6px solid ${cur.color}`, transition:"border-left-color 0.3s" }} />
          </div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"4px" }}>
          <span style={{ fontSize:"7px", color:"#ccc", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"2px" }}>Response</span>
          <div style={{ padding:"6px 8px", borderRadius:"4px", border:`1px solid ${cur.color}44`, background:`${cur.color}08`, fontSize:"8px", color: cur.color, transition:"all 0.35s", flex:1 }}>{cur.response}</div>
        </div>
      </div>
      <div style={{ height:"2px", background:"#f0f0f0", borderRadius:"2px", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${((active + 1) / TRIGGERS.length) * 100}%`, background:"#3333ee", borderRadius:"2px", transition:"width 0.45s ease" }} />
      </div>
    </div>
  );
};

// ─── FramerSketch ─────────────────────────────────────────────────────────────

const FramerSketch: FC = () => {
  const VARIANTS = [
    { name: "Default", props: "opacity: 1 · scale: 1"    },
    { name: "Hover",   props: "scale: 1.05 · y: -2px"    },
    { name: "Tap",     props: "scale: 0.97 · opacity: .9" },
    { name: "Focus",   props: "outline: 2px · ring: blue" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % VARIANTS.length), 1700);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", display:"flex", flexDirection:"column", padding:"20px", fontFamily:"'DM Mono',monospace", gap:"12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:"9px", color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase" }}>Framer Motion</span>
        <span style={{ fontSize:"8px", background:"rgba(0,0,0,0.04)", color:"#888", borderRadius:"4px", padding:"2px 8px" }}>animate=</span>
      </div>
      <div style={{ background:"#fafafa", border:"1px solid #ebebeb", borderRadius:"8px", padding:"16px", display:"flex", alignItems:"center", justifyContent:"center", flex:1 }}>
        <div style={{
          width:"72px", height:"40px", background:"#3333ee", borderRadius:"8px",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"9px", color:"#fff", letterSpacing:"0.06em",
          transform: active === 1 ? "scale(1.05) translateY(-2px)" : active === 2 ? "scale(0.97)" : "scale(1)",
          opacity: active === 2 ? 0.9 : 1,
          outline: active === 3 ? "2px solid rgba(51,51,238,0.5)" : "none",
          outlineOffset: "3px",
          transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}>Button</div>
      </div>
      <div style={{ display:"flex", gap:"4px" }}>
        {VARIANTS.map((v, i) => (
          <div key={v.name} style={{ flex:1, padding:"5px 6px", borderRadius:"4px", background: i === active ? "#3333ee" : "#f5f5f5", color: i === active ? "#fff" : "#bbb", fontSize:"7px", textAlign:"center" as const, transition:"all 0.3s" }}>{v.name}</div>
        ))}
      </div>
      <div style={{ background:"rgba(51,51,238,0.04)", border:"1px solid rgba(51,51,238,0.15)", borderRadius:"4px", padding:"6px 10px", fontSize:"7.5px", color:"#3333ee", transition:"all 0.35s" }}>{VARIANTS[active].props}</div>
    </div>
  );
};

// ─── CursorAISketch ───────────────────────────────────────────────────────────

const CursorAISketch: FC = () => {
  const STEPS = [
    { label: "Prompt",   line: "Design a subscription modal with...", color: "#888"    },
    { label: "Generate", line: "→ Scaffolding component structure",   color: "#3333ee" },
    { label: "Refine",   line: "→ Adjusting layout + interaction",    color: "#5555cc" },
    { label: "Ship",     line: "✓ Merged to main · 47 lines",         color: "#2a9a60" },
  ];
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setTyping(true);
      setTimeout(() => { setTyping(false); setStep(s => (s + 1) % STEPS.length); }, 500);
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ width:"100%", height:"100%", background:"#fff", display:"flex", flexDirection:"column", padding:"20px", fontFamily:"'DM Mono',monospace", gap:"10px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"9px", color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase" }}>Cursor + Claude Code</span>
        <div style={{ display:"flex", gap:"4px" }}>
          {["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width:"7px", height:"7px", borderRadius:"50%", background:c }} />)}
        </div>
      </div>
      <div style={{ background:"#fafafa", border:"1px solid #ebebeb", borderRadius:"6px", padding:"10px 12px", flex:1, display:"flex", flexDirection:"column", gap:"8px" }}>
        {STEPS.map((s, i) => (
          <div key={s.label} style={{ display:"flex", gap:"8px", alignItems:"flex-start", opacity: i <= step ? 1 : 0.22, transition:"opacity 0.4s" }}>
            <span style={{ fontSize:"7px", color: i === step ? "#3333ee" : "#ccc", width:"44px", flexShrink:0, marginTop:"1px" }}>{s.label}</span>
            <span style={{ fontSize:"7.5px", color: i === step ? s.color : "#bbb", lineHeight:1.5, transition:"color 0.3s", fontStyle: i === 0 ? "italic" : "normal" }}>
              {s.line}{i === step && typing ? "▌" : ""}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background: step === 3 ? "#34d399" : "#3333ee", transition:"background 0.4s" }} />
        <span style={{ fontSize:"7px", color:"#aaa" }}>{step === 3 ? "ready to ship" : "generating…"}</span>
      </div>
    </div>
  );
};

// ─── PhoneShell ──────────────────────────────────────────────────────────────

// ─── NotionAIFillSketch ───────────────────────────────────────────────────────

const NotionAIFillSketch: FC = () => {
  const ROWS = [
    { date:"Nov 11, 2024", author:"XRay Tutorials", tag:"Base de datos",   tagBg:"#ffe8e8", tagColor:"#cc4444" },
    { date:"Dec 9, 2024",  author:"XRay Tutorials", tag:"Flujo de trabajo",tagBg:"#e8f5e8", tagColor:"#2a7a2a" },
    { date:"Nov 4, 2024",  author:"XRay Tutorials", tag:"Automatizar",     tagBg:"#e8eeff", tagColor:"#3344cc" },
    { date:"Oct 28, 2024", author:"XRay Tutorials", tag:"Zapier",          tagBg:"#fff0e0", tagColor:"#aa6622" },
    { date:"Oct 7, 2024",  author:"XRay Tutorials", tag:"IA Autorrelleno", tagBg:"#f0e8ff", tagColor:"#7744aa" },
  ];
  type Phase = "idle"|"filling"|"done";
  const [phase, setPhase] = useState<Phase>("idle");
  const [filled, setFilled] = useState(0);
  const [toggleOn, setToggleOn] = useState(true);
  useEffect(() => {
    let fillInterval: ReturnType<typeof setInterval>;
    const cycle = () => {
      setPhase("idle"); setFilled(0);
      const t = setTimeout(() => {
        setPhase("filling"); let n=0;
        fillInterval = setInterval(() => {
          n++; setFilled(n);
          if (n >= ROWS.length) { clearInterval(fillInterval); setPhase("done"); setTimeout(cycle, 2800); }
        }, 520);
      }, 1600);
      return t;
    };
    const t = cycle(); return () => { clearTimeout(t); clearInterval(fillInterval); };
  }, []);

  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",overflow:"hidden",fontFamily:"'Inter','DM Sans',sans-serif",position:"relative",fontSize:12}}>
      <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {/* Table */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{display:"flex",background:"#fafafa",borderBottom:"1px solid #e9e9e9",flexShrink:0}}>
          {[["📅","Publication Date",150],["👥","Author",120],["✦","AI translation",100]].map(([icon,label,w],i)=>(
            <div key={label as string} style={{width:i<2?(w as number):undefined,flex:i===2?1:undefined,padding:"7px 12px",fontSize:11,color:i===2?"#7B68EE":"#999",fontWeight:500,borderRight:i<2?"1px solid #e9e9e9":"none",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap" as const}}>
              <span style={{opacity:i===2?1:0.45,fontSize:i===2?11:10}}>{icon as string}</span>{label as string}
            </div>
          ))}
        </div>
        {ROWS.map((row,i)=>(
          <div key={i} style={{display:"flex",borderBottom:"1px solid #f2f2f2",background:i===filled&&phase==="filling"?"rgba(123,104,238,0.025)":"#fff",transition:"background 0.3s",flexShrink:0}}>
            <div style={{width:150,padding:"9px 12px",color:"#333",borderRight:"1px solid #f2f2f2",whiteSpace:"nowrap" as const,overflow:"hidden"}}>{row.date}</div>
            <div style={{width:120,padding:"9px 12px",color:"#333",borderRight:"1px solid #f2f2f2",display:"flex",alignItems:"center",gap:5,overflow:"hidden"}}>
              <span style={{width:13,height:13,borderRadius:"50%",border:"1.5px solid #ddd",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#ccc",flexShrink:0}}>×</span>
              <span style={{whiteSpace:"nowrap" as const,overflow:"hidden",textOverflow:"ellipsis"}}>{row.author}</span>
            </div>
            <div style={{flex:1,padding:"9px 12px",display:"flex",alignItems:"center",minWidth:0}}>
              {i < filled ? (
                <span style={{background:row.tagBg,color:row.tagColor,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:500,whiteSpace:"nowrap" as const,animation:"fadeSlideIn 0.35s ease"}}>{row.tag}</span>
              ) : i===filled&&phase==="filling" ? (
                <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                  <span style={{width:11,height:11,borderRadius:"50%",border:"2px solid #7B68EE",borderTopColor:"transparent",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>
                  <span style={{fontSize:11,color:"#bbb"}}>Translating…</span>
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Floating AI Panel */}
      <div style={{position:"absolute",right:10,top:8,bottom:8,width:248,background:"#fff",borderRadius:10,boxShadow:"0 4px 30px rgba(0,0,0,0.18),0 1px 6px rgba(0,0,0,0.08)",border:"1px solid #e4e4e4",display:"flex",flexDirection:"column",overflow:"hidden",zIndex:10}}>
        <div style={{padding:"11px 13px 10px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:12,color:"#bbb"}}>←</span>
          <span style={{flex:1,fontSize:12.5,fontWeight:600,color:"#111",letterSpacing:"-0.01em",whiteSpace:"nowrap" as const,overflow:"hidden",textOverflow:"ellipsis"}}>Fill "AI translation" with AI</span>
          <span style={{fontSize:13,color:"#bbb"}}>×</span>
        </div>
        <div style={{padding:"9px 13px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #f0f0f0"}}>
          <span style={{color:"#333"}}>Fill with</span>
          <span style={{color:"#7B68EE",fontWeight:500,display:"flex",alignItems:"center",gap:3}}>Aあ Translate <span style={{color:"#ccc",fontSize:10}}>›</span></span>
        </div>
        <div style={{padding:"9px 13px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #f0f0f0"}}>
          <span style={{color:"#333"}}>Auto-update on page edits</span>
          <div style={{width:30,height:17,borderRadius:9,background:toggleOn?"#2563eb":"#ddd",position:"relative",cursor:"pointer",flexShrink:0,transition:"background 0.2s"}} onClick={()=>setToggleOn(t=>!t)}>
            <div style={{position:"absolute",top:2,left:toggleOn?13:2,width:13,height:13,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.25)"}}/>
          </div>
        </div>
        <div style={{padding:"7px 13px 3px",fontSize:10,color:"#b0b0b0",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase" as const}}>Options</div>
        {[["What to translate?","Blog T…"],["Translate to","Span…"]].map(([k,v])=>(
          <div key={k} style={{padding:"7px 13px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #f7f7f7"}}>
            <span style={{color:"#333"}}>{k}</span>
            <span style={{color:"#aaa",display:"flex",alignItems:"center",gap:3}}>{v}<span style={{fontSize:10,color:"#ccc"}}>›</span></span>
          </div>
        ))}
        <div style={{margin:"9px 13px 5px",padding:"8px",background:"rgba(123,104,238,0.07)",border:"1px solid rgba(123,104,238,0.15)",borderRadius:7,textAlign:"center" as const,cursor:"pointer"}}>
          <span style={{fontSize:12,color:"#7B68EE",fontWeight:500}}>✦ Try on this view</span>
        </div>
        <div style={{margin:"0 13px 8px",padding:"8px",background:phase==="done"?"#16a34a":"#2563eb",borderRadius:7,textAlign:"center" as const,cursor:"pointer",transition:"background 0.5s"}}>
          <span style={{fontSize:12.5,color:"white",fontWeight:600}}>{phase==="done"?"✓ 5 rows translated":"Save changes"}</span>
        </div>
        <div style={{borderTop:"1px solid #f0f0f0",paddingTop:3}}>
          {[["⚡","Autofill all pages"],["🗑","Turn off AI autofill"],["?","Learn about AI autofill"]].map(([icon,label])=>(
            <div key={label} style={{padding:"6px 13px",display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
              <span style={{fontSize:11,opacity:0.35}}>{icon}</span>
              <span style={{color:label==="Learn about AI autofill"?"#aaa":"#444"}}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// ─── ReplitAISketch ───────────────────────────────────────────────────────────

const ReplitAISketch: FC = () => {
  type Stage = "typing"|"thinking"|"streaming"|"done";
  const [stage, setStage]   = useState<Stage>("typing");
  const [chars, setChars]   = useState(0);
  const [codeLines, setCodeLines] = useState(0);

  const PROMPT = "Add error handling + return structured JSON with summary, key_points, confidence";
  const CODE_LINES = [
    "def summarize_document(text: str) -> dict:",
    "    \"\"\"AI-powered doc summary with error handling.\"\"\"",
    "    client = openai.OpenAI()",
    "    try:",
    "        response = client.chat.completions.create(",
    "            model=\"gpt-4o-mini\",",
    "            messages=[{\"role\":\"system\",",
    "                       \"content\":\"Summarize concisely.\"},",
    "                      {\"role\":\"user\",\"content\":text}]",
    "        )",
    "        return {",
    "            \"summary\": response.choices[0].message.content,",
    "            \"key_points\": [],",
    "            \"confidence\": 0.94",
    "        }",
    "    except openai.OpenAIError as e:",
    "        return {\"error\": str(e), \"confidence\": 0.0}",
  ];

  useEffect(()=>{
    const cycle=()=>{
      setStage("typing"); setChars(0); setCodeLines(0);
      let c=0;
      const typeTick=setInterval(()=>{ c++; setChars(c); if(c>=PROMPT.length){ clearInterval(typeTick); setStage("thinking");
        setTimeout(()=>{ setStage("streaming"); let l=0;
          const codeTick=setInterval(()=>{ l++; setCodeLines(l); if(l>=CODE_LINES.length){ clearInterval(codeTick); setStage("done"); setTimeout(cycle,3000); }},80);
        },900);
      }},28+Math.random()*14);
    };
    cycle();
  },[]);

  const TOKEN_COLORS: Record<string,string> = {
    "def":"#c586c0","return":"#c586c0","try":"#c586c0","except":"#c586c0","import":"#c586c0",
    "str":"#4ec9b0","dict":"#4ec9b0","openai":"#4ec9b0",
  };

  const colorizeCode = (line: string) => {
    // Simple tokenizer for display
    const parts: React.ReactNode[] = [];
    const tokens=line.match(/(".*?"|#.*|[\w.]+|[^"#\w. ]+| +)/g)||[];
    tokens.forEach((tok,i)=>{
      const col = TOKEN_COLORS[tok] || (tok.startsWith('"')||tok.startsWith("'") ? "#ce9178" : /^\d/.test(tok) ? "#b5cea8" : tok.startsWith("#") ? "#6a9955" : "#d4d4d4");
      parts.push(<span key={i} style={{color:col}}>{tok}</span>);
    });
    return parts;
  };

  return (
    <div style={{width:"100%",height:"100%",background:"#1e1e1e",display:"flex",overflow:"hidden",fontFamily:"'Menlo','Monaco','Courier New',monospace",fontSize:11}}>
      {/* Left: Code Editor */}
      <div style={{flex:"0 0 58%",display:"flex",flexDirection:"column",borderRight:"1px solid #333"}}>
        {/* Tab bar */}
        <div style={{display:"flex",background:"#2d2d2d",borderBottom:"1px solid #1e1e1e",flexShrink:0}}>
          {["main.py","utils.py"].map((f,i)=>(
            <div key={f} style={{padding:"7px 14px",fontSize:11,color:i===0?"#d4d4d4":"#888",background:i===0?"#1e1e1e":"transparent",borderRight:"1px solid #333",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:i===0?"#e8521a":"#555"}}/>
              {f}
            </div>
          ))}
        </div>
        {/* Gutter + code */}
        <div style={{flex:1,overflow:"hidden",padding:"10px 0",position:"relative"}}>
          {/* Static top lines */}
          {["import openai, json","from typing import Optional","",""].map((line,i)=>(
            <div key={i} style={{display:"flex",lineHeight:"18px",paddingRight:12}}>
              <span style={{width:32,textAlign:"right" as const,color:"#858585",paddingRight:16,flexShrink:0,userSelect:"none"}}>{i+1}</span>
              <span style={{color:line.startsWith("import")||line.startsWith("from")?"#c586c0":line.startsWith("#")?"#6a9955":"#d4d4d4"}}>{line}</span>
            </div>
          ))}
          {/* AI-generated code lines streaming in */}
          {CODE_LINES.slice(0,codeLines).map((line,i)=>(
            <div key={i} style={{display:"flex",lineHeight:"18px",paddingRight:12,background:i===codeLines-1&&stage==="streaming"?"rgba(51,51,238,0.06)":"transparent"}}>
              <span style={{width:32,textAlign:"right" as const,color:"#858585",paddingRight:16,flexShrink:0,userSelect:"none"}}>{i+5}</span>
              <span>{colorizeCode(line)}</span>
            </div>
          ))}
          {/* Cursor */}
          {stage!=="done" && codeLines < CODE_LINES.length && (
            <div style={{display:"flex",lineHeight:"18px"}}>
              <span style={{width:32,textAlign:"right" as const,color:"#858585",paddingRight:16,flexShrink:0}}>{codeLines+5}</span>
              <span style={{display:"inline-block",width:7,height:14,background:"#aeafad",animation:"cursorBlink 1s step-start infinite",verticalAlign:"middle"}}/>
            </div>
          )}
        </div>
        {/* Status bar */}
        <div style={{height:20,background:"#007acc",display:"flex",alignItems:"center",padding:"0 10px",gap:12,flexShrink:0}}>
          <span style={{color:"white",fontSize:10,opacity:0.9}}>main.py</span>
          <span style={{color:"white",fontSize:10,opacity:0.7}}>Python 3.11</span>
          <span style={{color:"white",fontSize:10,opacity:0.7,marginLeft:"auto"}}>UTF-8</span>
        </div>
      </div>

      {/* Right: Ghostwriter AI Panel */}
      <div style={{flex:1,display:"flex",flexDirection:"column",background:"#252526",overflow:"hidden"}}>
        {/* Panel header */}
        <div style={{padding:"10px 14px",borderBottom:"1px solid #333",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{width:22,height:22,borderRadius:6,background:"linear-gradient(135deg,#e8521a,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"white",fontSize:12,fontFamily:"sans-serif",fontWeight:700}}>G</span>
          </div>
          <span style={{color:"#d4d4d4",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Ghostwriter</span>
          <div style={{marginLeft:"auto",width:8,height:8,borderRadius:"50%",background:stage==="done"?"#4ec9b0":stage==="thinking"||stage==="streaming"?"#e8521a":"#555",transition:"background 0.4s"}}/>
        </div>
        {/* Chat area */}
        <div style={{flex:1,overflow:"hidden",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
          {/* User message */}
          <div>
            <div style={{fontSize:10,color:"#888",fontFamily:"'Inter',sans-serif",marginBottom:5}}>You</div>
            <div style={{background:"rgba(51,51,238,0.15)",border:"1px solid rgba(51,51,238,0.25)",borderRadius:6,padding:"8px 10px",fontSize:10.5,color:"#ccc",lineHeight:1.55,fontFamily:"'Inter',sans-serif",minHeight:18}}>
              {PROMPT.slice(0,chars)}{chars < PROMPT.length ? "▌" : ""}
            </div>
          </div>
          {/* AI response */}
          {(stage==="thinking"||stage==="streaming"||stage==="done") && (
            <div>
              <div style={{fontSize:10,color:"#888",fontFamily:"'Inter',sans-serif",marginBottom:5}}>Ghostwriter</div>
              {stage==="thinking" ? (
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px"}}>
                  {[0,0.15,0.3].map((d,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#888",animation:`dotPulse 1.2s ${d}s ease-in-out infinite`}}/>)}
                </div>
              ) : (
                <div style={{background:"#2d2d2d",border:"1px solid #3c3c3c",borderRadius:6,overflow:"hidden"}}>
                  <div style={{padding:"6px 10px",borderBottom:"1px solid #3c3c3c",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:9.5,color:"#888",fontFamily:"'Inter',sans-serif"}}>Suggested completion</span>
                    <span style={{fontSize:9.5,color:"#4ec9b0",fontFamily:"'Inter',sans-serif"}}>{codeLines}/{CODE_LINES.length} lines</span>
                  </div>
                  <div style={{padding:"8px 10px",maxHeight:120,overflow:"hidden"}}>
                    {CODE_LINES.slice(0,Math.min(codeLines,6)).map((line,i)=>(
                      <div key={i} style={{lineHeight:"16px",color:"#aaa",fontSize:9.5,whiteSpace:"pre" as const}}>{line}</div>
                    ))}
                    {codeLines>6 && <div style={{color:"#555",fontSize:9.5}}>…+{codeLines-6} more lines</div>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Accept bar */}
        {(stage==="streaming"||stage==="done") && (
          <div style={{padding:"10px 14px",borderTop:"1px solid #333",display:"flex",gap:7,flexShrink:0}}>
            <div style={{flex:1,padding:"6px 10px",background:"rgba(78,201,176,0.12)",border:"1px solid rgba(78,201,176,0.3)",borderRadius:5,textAlign:"center" as const,cursor:"pointer"}}>
              <span style={{fontSize:11,color:"#4ec9b0",fontFamily:"'Inter',sans-serif",fontWeight:500}}>Tab  ✓  Accept</span>
            </div>
            <div style={{padding:"6px 10px",background:"rgba(255,255,255,0.05)",border:"1px solid #444",borderRadius:5,cursor:"pointer"}}>
              <span style={{fontSize:11,color:"#888",fontFamily:"'Inter',sans-serif"}}>Esc</span>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}@keyframes dotPulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.4);opacity:1}}`}</style>
    </div>
  );
};

// ─── LinearAISketch ───────────────────────────────────────────────────────────

const LinearAISketch: FC = () => {
  type Phase = "idle"|"typing"|"thinking"|"generated"|"created";
  const [phase, setPhase]   = useState<Phase>("idle");
  const [chars, setChars]   = useState(0);
  const QUERY = "mobile checkout timeout when cart has 6+ items";

  useEffect(()=>{
    const cycle=()=>{
      setPhase("idle"); setChars(0);
      const t=setTimeout(()=>{
        setPhase("typing"); let c=0;
        const tick=setInterval(()=>{ c++; setChars(c);
          if(c>=QUERY.length){ clearInterval(tick); setPhase("thinking");
            setTimeout(()=>{setPhase("generated");
              setTimeout(()=>{setPhase("created"); setTimeout(cycle,2800);},1400);
            },900);
          }
        },32+Math.random()*18);
      },1000);
      return t;
    };
    const t=cycle(); return ()=>clearTimeout(t);
  },[]);

  const ISSUES = [
    {id:"ENG-142",title:"Auth session expires on tab reload",priority:"🟠",label:"Bug",age:"2h"},
    {id:"ENG-143",title:"Search results missing after filter reset",priority:"🔴",label:"Bug",age:"4h"},
    {id:"ENG-144",title:"Dashboard chart lag on 90-day range",priority:"🟡",label:"Perf",age:"1d"},
    {id:"ENG-145",title:"Export CSV truncates past 500 rows",priority:"🟠",label:"Bug",age:"1d"},
  ];

  return (
    <div style={{width:"100%",height:"100%",background:"#f9f9f9",display:"flex",flexDirection:"column",overflow:"hidden",fontFamily:"'Inter','DM Sans',sans-serif",position:"relative"}}>
      {/* Background: issue list */}
      <div style={{padding:"16px 20px 8px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <span style={{fontSize:13,fontWeight:600,color:"#111"}}>Engineering</span>
        <span style={{fontSize:12,color:"#aaa",background:"#f0f0f0",borderRadius:4,padding:"2px 8px"}}>144 issues</span>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {["Filter","Sort","Group"].map(l=><span key={l} style={{fontSize:11,color:"#999",cursor:"pointer"}}>{l}</span>)}
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",opacity:phase==="idle"?1:0.35,transition:"opacity 0.3s"}}>
        {ISSUES.map((issue)=>(
          <div key={issue.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",borderBottom:"1px solid #f0f0f0",background:"#fff",cursor:"pointer"}}>
            <span style={{fontSize:14}}>{issue.priority}</span>
            <span style={{fontSize:11,color:"#bbb",width:52,flexShrink:0,fontFamily:"'DM Mono',monospace"}}>{issue.id}</span>
            <span style={{flex:1,fontSize:12.5,color:"#222",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{issue.title}</span>
            <span style={{fontSize:10,color:"#888",background:"#f5f5f5",border:"1px solid #e8e8e8",borderRadius:4,padding:"2px 7px"}}>{issue.label}</span>
            <span style={{fontSize:11,color:"#ccc"}}>{issue.age}</span>
          </div>
        ))}
      </div>

      {/* Command palette overlay */}
      {phase !== "idle" && (
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:40,background:"rgba(0,0,0,0.25)",backdropFilter:"blur(2px)"}}>
          <div style={{width:"82%",maxWidth:520,background:"#fff",borderRadius:12,boxShadow:"0 12px 60px rgba(0,0,0,0.22)",border:"1px solid #e0e0e0",overflow:"hidden"}}>
            {/* Input */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderBottom:"1px solid #f0f0f0"}}>
              <span style={{fontSize:16,color:"#bbb"}}>✦</span>
              <div style={{flex:1,fontSize:13.5,color:"#111",minHeight:18,letterSpacing:"-0.01em"}}>
                {QUERY.slice(0,chars)}{phase==="typing"?"▌":""}
              </div>
              <span style={{fontSize:11,color:"#ccc",background:"#f5f5f5",border:"1px solid #e8e8e8",borderRadius:4,padding:"2px 7px"}}>⌘K</span>
            </div>

            {/* AI section header */}
            {(phase==="thinking"||phase==="generated"||phase==="created") && (
              <div style={{padding:"8px 16px",borderBottom:"1px solid #f5f5f5",display:"flex",alignItems:"center",gap:7}}>
                {phase==="thinking" ? (
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    {[0,0.18,0.36].map((d,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#7B68EE",animation:`dotPulse2 1s ${d}s ease-in-out infinite`}}/>)}
                    <span style={{fontSize:11,color:"#aaa"}}>AI is analyzing…</span>
                  </div>
                ) : (
                  <span style={{fontSize:11,color:"#7B68EE",fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase" as const}}>✦ AI Draft</span>
                )}
              </div>
            )}

            {/* Generated fields */}
            {(phase==="generated"||phase==="created") && (
              <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:9}}>
                <div>
                  <div style={{fontSize:10,color:"#bbb",marginBottom:3,letterSpacing:"0.04em",textTransform:"uppercase" as const}}>Title</div>
                  <div style={{fontSize:13,color:"#111",fontWeight:500,letterSpacing:"-0.01em"}}>Mobile checkout timeout (6+ cart items)</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["Priority","🔴 Urgent"],["Team","Frontend"],["Estimate","L · ~5 days"],["Cycle","Sprint 24"]].map(([k,v])=>(
                    <div key={k}>
                      <div style={{fontSize:10,color:"#bbb",marginBottom:2,letterSpacing:"0.04em",textTransform:"uppercase" as const}}>{k}</div>
                      <div style={{fontSize:12,color:"#333"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{fontSize:10,color:"#bbb",marginBottom:3,letterSpacing:"0.04em",textTransform:"uppercase" as const}}>Labels</div>
                  <div style={{display:"flex",gap:5}}>
                    {["bug","performance","mobile","checkout"].map(l=>(
                      <span key={l} style={{fontSize:10.5,color:"#555",background:"#f0f0f0",border:"1px solid #e0e0e0",borderRadius:4,padding:"2px 8px"}}>{l}</span>
                    ))}
                  </div>
                </div>
                <div style={{fontSize:11,color:"#888",lineHeight:1.55,borderLeft:"2px solid #e8e8e8",paddingLeft:10,fontStyle:"italic"}}>
                  "Users with 6+ items in cart experience connection timeouts on the /checkout/confirm endpoint…"
                </div>
              </div>
            )}

            {/* CTA buttons */}
            {(phase==="generated"||phase==="created") && (
              <div style={{padding:"10px 16px",borderTop:"1px solid #f0f0f0",display:"flex",gap:8}}>
                <div style={{padding:"8px 14px",border:"1px solid #e0e0e0",borderRadius:7,fontSize:12,color:"#888",cursor:"pointer"}}>Cancel</div>
                <div style={{flex:1,padding:"8px 14px",background:phase==="created"?"#16a34a":"#111",borderRadius:7,fontSize:12,color:"white",fontWeight:600,textAlign:"center" as const,cursor:"pointer",transition:"background 0.4s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  {phase==="created"?"✓ ENG-145 created":"✦ Create issue"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes dotPulse2{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.5);opacity:1}}`}</style>
    </div>
  );
};

// ─── GalleryPage ──────────────────────────────────────────────────────────────
interface SketchCardProps { title:string; subtitle:string; height:number; children:React.ReactNode; index:number; }
const SketchCard: FC<SketchCardProps> = ({ title, subtitle, height, children, index }) => (
  <div style={{opacity:0,animation:"fadeUp 0.6s ease forwards",animationDelay:`${index*0.12}s`}}>
    <div style={{width:"100%",height,borderRadius:"10px",overflow:"hidden",background:"#f5f3f0",marginBottom:"12px",position:"relative",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>{children}</div>
    <p style={{fontFamily:"'DM Mono',monospace",fontSize:"13px",color:"#555",letterSpacing:"0.01em",marginBottom:"5px",textAlign:"left"}}>{title}</p>
    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:"#999",fontWeight:300,textAlign:"left"}}>{subtitle}</p>
  </div>
);

const SectionLabel: FC<{label:string; index:number}> = ({ label, index }) => (
  <p style={{fontFamily:"'Inter',sans-serif",fontSize:"20px",fontWeight:600,color:"#111",letterSpacing:"-0.02em",marginBottom:"36px",textAlign:"left",opacity:0,animation:"fadeIn 0.5s ease forwards",animationDelay:`${index*0.08}s`}}>{label}</p>
);

const GalleryPage: FC = () => (
  <div style={{opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards"}}>
    <SectionLabel label="Generative Motion" index={0} />
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"24px",marginBottom:"24px",alignItems:"start"}}>
      <SketchCard title="flow field" subtitle="particles following a noise vector field" height={300} index={0}><FlowField /></SketchCard>
      <SketchCard title="orbit rings" subtitle="concentric motion, alternating directions" height={300} index={1}><OrbitRings /></SketchCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="lissajous web" subtitle="layered parametric curves in slow drift" height={280} index={2}><LissajousWeb /></SketchCard>
      <SketchCard title="dot grid" subtitle="noise-driven breathing grid" height={280} index={3}><DotGrid /></SketchCard>
    </div>

    <SectionLabel label="Design Process" index={1} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="design thinking" subtitle="5-stage human-centered design framework" height={280} index={4}><DesignThinkingSketch /></SketchCard>
      <SketchCard title="user research" subtitle="interviews · surveys · key insights" height={280} index={5}><UserResearchSketch /></SketchCard>
      <SketchCard title="agile · scrum · kanban" subtitle="sprint planning & iterative delivery" height={280} index={6}><KanbanSketch /></SketchCard>
    </div>

    <SectionLabel label="Design Tools" index={2} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="figma" subtitle="layers · inspect · component tokens" height={280} index={7}><FigmaSketch /></SketchCard>
      <SketchCard title="design system" subtitle="atomic design · tokens · component library" height={280} index={8}><DesignSystemSketch /></SketchCard>
      <SketchCard title="prototyping" subtitle="user flows · interaction design · handoff" height={280} index={9}><PrototypingSketch /></SketchCard>
    </div>

    <SectionLabel label="Accessibility" index={3} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="wcag compliance" subtitle="AA / AAA audit · focus · keyboard nav" height={280} index={10}><WCAGSketch /></SketchCard>
      <SketchCard title="colour contrast" subtitle="WCAG contrast ratio · black · white · purple" height={280} index={11}><ColorContrastSketch /></SketchCard>
      <SketchCard title="screen reader" subtitle="ARIA roles · semantic HTML · a11y tree" height={280} index={12}><ScreenReaderSketch /></SketchCard>
    </div>

    <SectionLabel label="Prototyping Tools" index={4} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="protopie" subtitle="trigger/response interaction authoring" height={280} index={13}><ProtoPieSketch /></SketchCard>
      <SketchCard title="framer motion" subtitle="code-based animation and state variants" height={280} index={14}><FramerSketch /></SketchCard>
      <SketchCard title="cursor + claude code" subtitle="AI-accelerated prototype-to-production" height={280} index={15}><CursorAISketch /></SketchCard>
    </div>

    <SectionLabel label="AI Product Interactions" index={5} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="notion AI — fill with AI" subtitle="database column filled row-by-row via AI translation · auto-update toggle · save flow" height={340} index={16}><NotionAIFillSketch /></SketchCard>
      <SketchCard title="replit ghostwriter" subtitle="inline code generation · streaming suggestions · tab-to-accept interaction" height={340} index={17}><ReplitAISketch /></SketchCard>
    </div>

    <SectionLabel label="AI-Native Workflows" index={6} />
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"24px",marginBottom:"32px",alignItems:"start"}}>
      <SketchCard title="linear — AI issue creation" subtitle="natural language → structured issue · priority, team, labels, estimate auto-populated" height={420} index={18}><LinearAISketch /></SketchCard>
      <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
        <div style={{background:"rgba(51,51,238,0.03)",border:"1px solid rgba(51,51,238,0.1)",borderRadius:"10px",padding:"20px",opacity:0,animation:"fadeUp 0.6s ease forwards",animationDelay:"0.3s"}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#3333ee",letterSpacing:"0.06em",marginBottom:"10px",textTransform:"uppercase"}}>Pattern</p>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:"#666",lineHeight:1.65,fontWeight:300,marginBottom:"12px"}}>The best AI interactions reduce friction without removing agency. Users feel faster, not replaced.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
            {["Natural language → structured output","Streaming so users see AI thinking","One-action confirmation gate","Escape hatch always visible"].map(point => (
              <div key={point} style={{display:"flex",alignItems:"flex-start",gap:"7px"}}>
                <span style={{color:"#3333ee",fontSize:"9px",marginTop:"2px",flexShrink:0}}>◆</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#888",lineHeight:1.5}}>{point}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#fafafa",border:"1px solid #ebebeb",borderRadius:"10px",padding:"20px",opacity:0,animation:"fadeUp 0.6s ease forwards",animationDelay:"0.42s"}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#bbb",letterSpacing:"0.06em",marginBottom:"10px",textTransform:"uppercase"}}>Applied in</p>
          {["JavaAI · code editor","Colgate · AI workflows","eBay · pipeline config"].map(item => (
            <div key={item} style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#aaa",padding:"5px 0",borderBottom:"1px solid #f0f0f0",lineHeight:1.4}}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── SplashScreen ─────────────────────────────────────────────────────────────

const SplashScreen: FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nameVisible, setNameVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [ready,       setReady]       = useState(false);
  const [exiting,     setExiting]     = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W=0,H=0;
    const resize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
    const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
    const easeOutCubic=(t:number)=>1-Math.pow(1-t,3);
    const easeOutQuart=(t:number)=>1-Math.pow(1-t,4);
    const easeInOutCubic=(t:number)=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    const drawPencilRing=(cx:number,cy:number,radius:number,progress:number,alpha:number,seed:number,lineW:number)=>{
      const N=90; ctx.beginPath();
      for(let i=0;i<=N*progress;i++){const a=(i/N)*Math.PI*2,wobble=Math.sin(4*a+seed)*2.8+Math.sin(9*a+seed*1.6)*1.1,r=radius+wobble; const px=cx+r*Math.cos(a),py=cy+(r+wobble*0.2)*0.32*Math.sin(a); i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);}
      ctx.strokeStyle=`rgba(40,36,44,${alpha})`;ctx.lineWidth=lineW;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();
    };
    const drawDribble=(cx:number,cy:number,angle:number,len:number,alpha:number,seed:number)=>{
      ctx.beginPath();
      const x0=cx+18*Math.cos(angle),y0=cy+18*0.32*Math.sin(angle);
      const mx=cx+(len*0.55+Math.sin(seed)*6)*Math.cos(angle),my=cy+(len*0.55+Math.sin(seed)*3)*0.32*Math.sin(angle);
      const ex=cx+len*Math.cos(angle)+Math.sin(seed*2.3)*5,ey=cy+len*0.32*Math.sin(angle)+Math.cos(seed*1.7)*2;
      ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,ex,ey);
      ctx.strokeStyle=`rgba(40,36,44,${alpha})`;ctx.lineWidth=0.8+Math.sin(seed)*0.4;ctx.lineCap="round";ctx.stroke();
      ctx.beginPath();ctx.arc(ex,ey,1.4+Math.abs(Math.sin(seed))*1.2,0,Math.PI*2);ctx.fillStyle=`rgba(40,36,44,${alpha*0.85})`;ctx.fill();
    };
    const FALL_END=1.20,SPLAT_END=1.45,RINGS_END=2.80;
    const rings=[{maxR:22,delay:0.00,lw:1.2,seed:1.1},{maxR:45,delay:0.10,lw:1.0,seed:2.4},{maxR:72,delay:0.22,lw:0.9,seed:0.7},{maxR:100,delay:0.36,lw:0.85,seed:3.2},{maxR:132,delay:0.52,lw:0.75,seed:1.8}];
    const dribbles=[0.15,0.9,1.7,2.5,3.4,4.3,5.1,5.8].map((a,i)=>({angle:a,len:28+i*6,seed:a*3.7}));
    let startTs=0,raf=0,nameTriggered=false;
    const frame=(ts:number)=>{
      if(!startTs)startTs=ts; const elapsed=(ts-startTs)/1000;
      ctx.clearRect(0,0,W,H); const cx=W/2,cy=H/2;
      const fallPrg=easeOutCubic(clamp(elapsed/FALL_END,0,1)); const dropY=lerp(-H*0.44,0,fallPrg);
      const splatPrg=easeInOutCubic(clamp((elapsed-FALL_END)/(SPLAT_END-FALL_END),0,1));
      const dropRx=lerp(16,34,splatPrg),dropRy=lerp(16,0,splatPrg);
      if(elapsed<SPLAT_END+0.05){const da=elapsed<SPLAT_END?1:Math.max(0,1-(elapsed-SPLAT_END)*8); if(da>0){const grad=ctx.createRadialGradient(cx-dropRx*0.28,cy+dropY-dropRy*0.28,dropRy*0.1,cx,cy+dropY,dropRx); grad.addColorStop(0,`rgba(228,244,255,${da*0.97})`);grad.addColorStop(0.35,`rgba(158,208,240,${da*0.88})`);grad.addColorStop(0.72,`rgba(86,152,210,${da*0.76})`);grad.addColorStop(1,`rgba(44,110,178,${da*0.62})`); ctx.beginPath();ctx.ellipse(cx,cy+dropY,Math.max(0.1,dropRx),Math.max(0.1,dropRy),0,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill(); if(dropRy>3){ctx.beginPath();ctx.ellipse(cx-dropRx*0.26,cy+dropY-dropRy*0.25,dropRx*0.22,dropRy*0.32,-0.4,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${da*0.72})`;ctx.fill();}}}
      if(elapsed>FALL_END){const re=elapsed-FALL_END,rd=RINGS_END-FALL_END; rings.forEach((ring,i)=>{const rt=clamp((re-ring.delay)/((rd-ring.delay)*0.62),0,1); if(rt<=0)return; const fadeIn=clamp(rt*6,0,1),fadeOut=clamp(1-(re-ring.delay-(rd-ring.delay)*0.62*0.5)/(rd*0.55),0,1); const ringAlpha=fadeIn*fadeOut*(0.55-i*0.07); if(ringAlpha>0.005&&ring.maxR*easeOutQuart(rt)>0.5)drawPencilRing(cx,cy,ring.maxR*easeOutQuart(rt),clamp(rt*1.35,0,1),ringAlpha,ring.seed,ring.lw);}); if(re>0.18){const dAlpha=easeOutCubic(clamp((re-0.18)/0.6,0,1))*0.38*Math.max(0,1-(re-0.9)/1.4); if(dAlpha>0.005)dribbles.forEach(d=>drawDribble(cx,cy,d.angle,d.len,dAlpha,d.seed));}}
      if(!nameTriggered&&elapsed>FALL_END+0.25){nameTriggered=true;setNameVisible(true);setTimeout(()=>{setHintVisible(true);setReady(true);},1400);}
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);

  return (
    <div onClick={()=>{if(!ready)return;setExiting(true);setTimeout(onEnter,700);}} style={{position:"fixed",inset:0,zIndex:999,background:"#ffffff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:ready?"pointer":"default",opacity:exiting?0:1,transition:exiting?"opacity 0.7s ease":"none",overflow:"hidden",width:"100vw",height:"100vh"}}>
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
    const dpr=window.devicePixelRatio||1,W=38,H=34; canvas.width=W*dpr;canvas.height=H*dpr;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    ctx.scale(dpr,dpr);
    const segments=[{p0:[4,29],p1:[4,5],perp:[1,0],amp:9,loops:2,steps:60},{p0:[4,5],p1:[19,18],perp:[-0.68,0.73],amp:6,loops:1.5,steps:45},{p0:[19,18],p1:[34,5],perp:[0.68,0.73],amp:6,loops:1.5,steps:45},{p0:[34,5],p1:[34,29],perp:[-1,0],amp:9,loops:2,steps:60}];
    const lN=(a:number,b:number,t:number)=>a+(b-a)*t;
    const buildPath=()=>{const pts:[number,number][]=[]; segments.forEach(s=>{for(let i=0;i<=s.steps;i++){const t=i/s.steps,mx=lN(s.p0[0],s.p1[0],t),my=lN(s.p0[1],s.p1[1],t),loop=s.amp*Math.sin(t*Math.PI*2*s.loops); pts.push([mx+loop*s.perp[0]+(Math.random()-0.5)*0.7,my+loop*s.perp[1]+(Math.random()-0.5)*0.7]);}}); return pts;};
    let path=buildPath(),drawn=0,pausing=false,raf=0;
    const frame=()=>{
      if(!pausing){drawn+=4;if(drawn>=path.length){drawn=path.length;pausing=true;setTimeout(()=>{path=buildPath();drawn=0;pausing=false;},420);}}
      ctx.clearRect(0,0,W,H);if(drawn<2){raf=requestAnimationFrame(frame);return;}
      const end=Math.min(drawn,path.length); ctx.lineCap="round";ctx.lineJoin="round";
      for(let start=0;start<end-1;start+=8){const chunk=Math.min(8,end-start),progress=start/path.length; ctx.beginPath();ctx.moveTo(path[start][0],path[start][1]);for(let j=1;j<chunk;j++)ctx.lineTo(path[start+j][0],path[start+j][1]); ctx.strokeStyle=`rgba(28,26,36,${0.72+0.18*Math.sin(progress*Math.PI*5)})`;ctx.lineWidth=1.1+0.55*Math.sin(progress*Math.PI*8);ctx.stroke();}
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
    cursor:project.link?"none":"default",
    opacity:0, transform:"translateY(24px)",
    animation:"fadeUp 0.6s ease forwards",
    animationDelay:`${index*0.1}s`,
  };

  const mediaWrapperStyle: CSSProperties = {
    width:"100%", borderRadius:"14px", overflow:"hidden",
    background: project.id===4
      ? "linear-gradient(180deg,#e8521a 0%,#c23a10 25%,#2a4a6b 60%,#8aafd4 82%,#d8eaf8 100%)"
      : project.id===2  ? "#f0eff8"
      : project.id===6  ? "#0d2357"
      : "#f0eeeb",
    marginBottom:"20px", aspectRatio:"3/2", position:"relative",
  };

  const overlayStyle: CSSProperties = {
    position:"absolute", inset:0,
    background:hovered?"rgba(0,0,0,0.04)":"rgba(0,0,0,0)",
    transition:"background 0.3s ease",
    zIndex:5,
  };

  const imgStyle: CSSProperties = {
    width:"100%", height:"100%", objectFit:"cover", display:"block",
    transition:"transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
    transform:hovered?"scale(1.06)":"scale(1)",
  };

  const arrowStyle: CSSProperties = {
    display:"inline-block",
    transform:hovered?"translate(2px,-2px)":"translate(0,0)",
    transition:"transform 0.2s ease",
    opacity:0.4, fontSize:"14px",
  };

  const inner = (
    <>
      <div style={mediaWrapperStyle}>
        {project.id === 2 ? (
          <>
            <video ref={videoRef} src={project.video!} muted loop playsInline autoPlay
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            {project.link && <div style={{...overlayStyle, zIndex:4}} />}
          </>
        ) : project.id === 4 ? (
          <>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#e8521a 0%,#c23a10 25%,#2a4a6b 60%,#8aafd4 82%,#d8eaf8 100%)",zIndex:0}} />
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 85% 90%,rgba(210,235,255,0.5) 0%,transparent 50%)",zIndex:1,animation:"clipGlow 5s ease-in-out infinite"}} />
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 10% 10%,rgba(255,120,50,0.35) 0%,transparent 50%)",zIndex:1,animation:"clipGlow 6s ease-in-out infinite reverse"}} />
            {project.video ? (
              <video ref={videoRef} src={project.video} muted loop playsInline style={{position:"absolute",inset:0,width:"70%",height:"80%",objectFit:"cover",display:"block",zIndex:3,margin:"auto",top:0,bottom:0,left:0,right:0,borderRadius:"10px",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",pointerEvents:"none"}} />
            ) : (
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:4,gap:10,pointerEvents:"none"}}>
                <div style={{width:48,height:48,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.08)",backdropFilter:"blur(4px)"}}>
                  <div style={{width:0,height:0,borderTop:"9px solid transparent",borderBottom:"9px solid transparent",borderLeft:"15px solid rgba(255,255,255,0.55)",marginLeft:3}} />
                </div>
                <span style={{fontSize:"10px",color:"rgba(255,255,255,0.35)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",textTransform:"uppercase"}}>video coming soon</span>
              </div>
            )}
            <div style={{position:"absolute",inset:0,zIndex:9,background:"transparent"}}
              onMouseEnter={(e)=>{setHovered(true);onCursorEnter(project.id,e.clientX,e.clientY);}}
              onMouseMove={(e)=>onCursorMove(e.clientX,e.clientY)}
              onMouseLeave={()=>{setHovered(false);onCursorLeave();}}
            />
          </>
        ) : project.video ? (
          <video ref={videoRef} src={project.video} muted loop playsInline autoPlay
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
        ) : project.image ? (
          <img src={project.image} alt={project.title??project.company??""} style={imgStyle} />
        ) : null}

        {project.id !== 2 && project.link && <div style={overlayStyle} />}

        <div style={{ position:"absolute", bottom:"12px", left:"12px", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", borderRadius:"999px", padding:"5px 10px", display:"flex", alignItems:"center", gap:"5px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", pointerEvents:"none", zIndex:10 }}>
          <span style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:500,color:"#222",letterSpacing:"-0.01em"}}>{project.tag}</span>
          {project.tags.map((t) => (
            <React.Fragment key={t}>
              <span style={{width:"3px",height:"3px",borderRadius:"50%",background:"#bbb",display:"inline-block",flexShrink:0}} />
              <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.6)", border:"1px solid rgba(180,180,200,0.45)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", borderRadius:"999px", height:"26px", padding:"0 11px", fontSize:"11px", fontWeight:500, color:"#555", fontFamily:"'DM Mono',monospace", letterSpacing:"0.02em", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.9),0 1px 4px rgba(0,0,0,0.06)", whiteSpace:"nowrap" }}>{t}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{textAlign:"left"}}>
        <p style={{margin:"0 0 6px 0",fontSize:"11px",color:"#999",letterSpacing:"0.01em",fontFamily:"'DM Mono','Courier New',monospace",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px"}}>
          <span>{project.tag}</span>
          <span style={{color:"#bbb",fontFamily:"'DM Mono',monospace",fontSize:"10px"}}>{project.date}</span>
        </p>
        <h3 style={{margin:"0 0 8px 0",fontSize:"20px",fontWeight:600,fontFamily:"'Inter',sans-serif",color:"#111",letterSpacing:"-0.03em",lineHeight:1.15,display:"flex",alignItems:"baseline",gap:"6px"}}>
          {project.title??project.company}
          {project.link&&<span style={arrowStyle}>↗</span>}
        </h3>
        <p style={{margin:0,fontSize:"16px",color:"#666",lineHeight:1.55,fontFamily:"'DM Sans','Helvetica Neue',sans-serif",textAlign:"left"}}>{project.description}</p>
      </div>
    </>
  );

  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card" style={cardStyle}
      onMouseEnter={(e)=>{setHovered(true);onCursorEnter(project.id,e.clientX,e.clientY);}}
      onMouseMove={(e)=>onCursorMove(e.clientX,e.clientY)}
      onMouseLeave={()=>{setHovered(false);onCursorLeave();}}
    >{inner}</a>
  ) : (
    <div className="project-card" style={cardStyle}
      onMouseEnter={(e)=>{setHovered(true);onCursorEnter(project.id,e.clientX,e.clientY);}}
      onMouseMove={(e)=>onCursorMove(e.clientX,e.clientY)}
      onMouseLeave={()=>{setHovered(false);onCursorLeave();}}
    >{inner}</div>
  );
};

// ─── Play Section ─────────────────────────────────────────────────────────────

interface PlayVec2 { x: number; y: number; }

function usePlayDrag(init: PlayVec2): [PlayVec2, (e: React.MouseEvent<HTMLDivElement>) => void] {
  const [pos, setPos] = useState<PlayVec2>(init);
  const dragging = useRef(false);
  const startMouse = useRef<PlayVec2>({ x:0, y:0 });
  const startPos = useRef<PlayVec2>(init);
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button,a,input,textarea")) return;
    dragging.current=true; startMouse.current={x:e.clientX,y:e.clientY}; startPos.current={...pos}; e.preventDefault();
  };
  useEffect(() => {
    const move=(e:MouseEvent)=>{if(!dragging.current)return; setPos({x:startPos.current.x+(e.clientX-startMouse.current.x),y:startPos.current.y+(e.clientY-startMouse.current.y)});};
    const up=()=>{dragging.current=false;};
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    return()=>{window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up);};
  },[]);
  return [pos, onMouseDown];
}

const PlayNode: FC<PlayNodeProps> = ({ pos, drag, width=300, label:_label, icon:_icon, accent=false, delay=0, children, onMouseEnter, onMouseLeave }) => (
  <div onMouseDown={drag} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
    style={{ position:"absolute", left:pos.x, top:pos.y, width,
      border:`1.5px solid ${accent?"#f97316":"rgba(255,255,255,0.14)"}`,
      borderRadius:0,
      overflow:"hidden",
      animation:`playNodeIn 0.5s ${delay}s cubic-bezier(.16,1,.3,1) both`,
      cursor:"grab", userSelect:"none", zIndex:10,
      boxShadow: accent ? "5px 5px 0 rgba(249,115,22,0.18)" : "4px 4px 0 rgba(0,0,0,0.7)",
    }}>
    {children}
  </div>
);

const PlayWire: FC<{ x1:number; y1:number; x2:number; y2:number }> = ({ x1, y1, x2, y2 }) => {
  const cx = (x1+x2)/2;
  return <path d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`} stroke="rgba(249,115,22,0.28)" strokeWidth={1} fill="none" strokeDasharray="5 4" />;
};

// ─── Inline Book Cover SVGs ───────────────────────────────────────────────────

const BookCover: FC<{ coverKey: string }> = ({ coverKey }) => {
  if (coverKey === "doet") return (
    <svg viewBox="0 0 64 92" width="64" height="92" style={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.28)", display: "block" }}>
      <rect width="64" height="92" fill="#B8281A" rx="2" />
      <rect x="3" y="3" width="58" height="86" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" rx="1.5" />
      <rect x="0" y="0" width="5" height="92" fill="rgba(0,0,0,0.18)" rx="2" />
      <ellipse cx="33" cy="58" rx="17" ry="13" fill="rgba(255,255,255,0.11)" />
      <ellipse cx="33" cy="56" rx="13" ry="9" fill="rgba(255,255,255,0.08)" />
      <path d="M16 56 Q8 49 12 43 Q16 38 20 45" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M50 51 Q58 51 58 58 Q58 65 50 65" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="28" y="41" width="10" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
      <circle cx="33" cy="40" r="2" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="33" cy="72" rx="15" ry="2.5" fill="rgba(0,0,0,0.2)" />
      <text x="32" y="17" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="4.6" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="0.4">THE DESIGN OF</text>
      <text x="32" y="23" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="4.6" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="0.4">EVERYDAY THINGS</text>
      <text x="32" y="85" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="3.8" fontFamily="Georgia,serif">DON NORMAN</text>
    </svg>
  );

  if (coverKey === "tfs") return (
    <svg viewBox="0 0 64 92" width="64" height="92" style={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.28)", display: "block" }}>
      <rect width="64" height="92" fill="#192F55" rx="2" />
      <rect x="3" y="3" width="58" height="86" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7" rx="1.5" />
      <rect x="0" y="0" width="5" height="92" fill="rgba(0,0,0,0.2)" rx="2" />
      <path d="M10 66 Q32 30 54 66" stroke="rgba(80,150,240,0.16)" strokeWidth="26" fill="none" strokeLinecap="round" />
      <line x1="32" y1="32" x2="32" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7" strokeDasharray="2.5 2" />
      <path d="M10 62 Q21 38 32 48" stroke="rgba(100,170,255,0.28)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M54 62 Q43 38 32 48" stroke="rgba(255,180,80,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="51" r="10" fill="rgba(80,140,230,0.1)" stroke="rgba(120,170,255,0.18)" strokeWidth="0.7" />
      <text x="32" y="17" textAnchor="middle" fill="rgba(255,255,255,0.88)" fontSize="5.8" fontFamily="Georgia,serif" fontWeight="bold">THINKING,</text>
      <text x="32" y="25" textAnchor="middle" fill="rgba(255,255,255,0.88)" fontSize="5.8" fontFamily="Georgia,serif" fontWeight="bold">FAST AND SLOW</text>
      <text x="32" y="85" textAnchor="middle" fill="rgba(255,255,255,0.48)" fontSize="3.6" fontFamily="Georgia,serif">DANIEL KAHNEMAN</text>
    </svg>
  );

  if (coverKey === "wos") return (
    <svg viewBox="0 0 64 92" width="64" height="92" style={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.28)", display: "block" }}>
      <rect width="64" height="92" fill="#0D0D0D" rx="2" />
      <rect x="3" y="3" width="58" height="86" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" rx="1.5" />
      <rect x="0" y="0" width="5" height="92" fill="rgba(255,255,255,0.04)" rx="2" />
      <path d="M8 50 Q32 28 56 50 Q32 72 8 50Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9" />
      <circle cx="32" cy="50" r="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <circle cx="32" cy="50" r="5" fill="rgba(255,255,255,0.14)" />
      <circle cx="35" cy="47" r="1.8" fill="rgba(255,255,255,0.8)" />
      <circle cx="30" cy="53" r="0.9" fill="rgba(255,255,255,0.4)" />
      {([-14, -7, 0, 7, 14] as number[]).map((dx, i) => (
        <line key={i} x1={32 + dx} y1={32} x2={32 + dx * 0.7} y2={36} stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeLinecap="round" />
      ))}
      <text x="32" y="20" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="8" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="1.2">WAYS OF</text>
      <text x="32" y="29" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="8" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="1.2">SEEING</text>
      <text x="32" y="85" textAnchor="middle" fill="rgba(255,255,255,0.42)" fontSize="3.8" fontFamily="Georgia,serif">JOHN BERGER</text>
    </svg>
  );

  if (coverKey === "tpk") return (
    <svg viewBox="0 0 64 92" width="64" height="92" style={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.28)", display: "block" }}>
      <rect width="64" height="92" fill="#C68B20" rx="2" />
      <rect width="64" height="92" fill="rgba(255,220,100,0.2)" rx="2" />
      <rect x="3" y="3" width="58" height="86" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.7" rx="1.5" />
      <rect x="0" y="0" width="5" height="92" fill="rgba(0,0,0,0.15)" rx="2" />
      <line x1="8" y1="32" x2="56" y2="32" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      {([14, 21, 28, 36, 43, 51] as number[]).map((x, i) => {
        const lean = (i % 2 === 0 ? 1 : -1) * 2;
        return (
          <g key={i}>
            <line x1={x} y1="78" x2={x + lean} y2="50" stroke="rgba(0,0,0,0.28)" strokeWidth="0.85" />
            <ellipse cx={x + lean} cy={47} rx={2.8} ry={5.5} fill="rgba(0,0,0,0.2)" transform={`rotate(${lean * 4} ${x + lean} 50)`} />
            <line x1={x + lean - 2} y1="54" x2={x + lean - 5} y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="0.7" />
            <line x1={x + lean + 2} y1="54" x2={x + lean + 5} y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="0.7" />
          </g>
        );
      })}
      <line x1="6" y1="79" x2="58" y2="79" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
      <text x="32" y="20" textAnchor="middle" fill="rgba(0,0,0,0.72)" fontSize="5.8" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="0.3">THE PALE KING</text>
      <text x="32" y="85" textAnchor="middle" fill="rgba(0,0,0,0.45)" fontSize="3.5" fontFamily="Georgia,serif">DAVID FOSTER WALLACE</text>
    </svg>
  );

  return null;
};

// ─── Prototyping Tool Icons ───────────────────────────────────────────────────

const FigmaToolIcon: FC = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" style={{ display: "block", borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.15)", flexShrink: 0 }}>
    <rect width="44" height="44" fill="#1e1e1e" rx="10" />
    <rect x="12" y="8"  width="9" height="9" rx="4.5" fill="#f24e1e" />
    <rect x="23" y="8"  width="9" height="9" rx="4.5" fill="#ff7262" />
    <rect x="12" y="18" width="9" height="9" rx="4.5" fill="#a259ff" />
    <rect x="23" y="18" width="9" height="9" rx="4.5" fill="#1abcfe" />
    <rect x="12" y="28" width="9" height="9" rx="4.5" fill="#0acf83" />
  </svg>
);

const ProtoPieToolIcon: FC = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" style={{ display: "block", borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.15)", flexShrink: 0 }}>
    <rect width="44" height="44" fill="#f0f0ee" rx="10" />
    <circle cx="22" cy="22" r="13" fill="none" stroke="#e85c3a" strokeWidth="1.5" />
    <path d="M22 22 L22 9 A13 13 0 0 1 33.26 28.5 Z" fill="#e85c3a" />
    <circle cx="22" cy="22" r="3" fill="#e85c3a" />
    <circle cx="22" cy="22" r="1.2" fill="#f0f0ee" />
  </svg>
);

const FramerToolIcon: FC = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" style={{ display: "block", borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.15)", flexShrink: 0 }}>
    <rect width="44" height="44" fill="#0055ff" rx="10" />
    <polygon points="12,10 32,10 32,22 22,22 32,34 22,34 12,22 22,22" fill="white" />
  </svg>
);

const PrincipleToolIcon: FC = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" style={{ display: "block", borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.15)", flexShrink: 0 }}>
    <rect width="44" height="44" fill="#6c3fe0" rx="10" />
    <line x1="8"  y1="22" x2="36" y2="22" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    <circle cx="12" cy="22" r="3" fill="white" />
    <circle cx="22" cy="14" r="3" fill="white" />
    <circle cx="32" cy="22" r="3" fill="white" />
    <circle cx="22" cy="30" r="3" fill="rgba(255,255,255,0.45)" />
    <line x1="12" y1="22" x2="22" y2="14" stroke="rgba(255,255,255,0.4)"  strokeWidth="0.8" />
    <line x1="22" y1="14" x2="32" y2="22" stroke="rgba(255,255,255,0.4)"  strokeWidth="0.8" />
    <line x1="12" y1="22" x2="22" y2="30" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.8" strokeDasharray="2 1.5" />
    <line x1="22" y1="30" x2="32" y2="22" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.8" strokeDasharray="2 1.5" />
  </svg>
);

// ─── PlayPage art: Album covers, Type posters, Movie posters ─────────────────

const AlbumArt: FC<{ albumKey: string }> = ({ albumKey }) => {
  const S = { borderRadius:5, boxShadow:"0 6px 20px rgba(0,0,0,0.45)", display:"block" as const, flexShrink:0 };
  if (albumKey==="nevermind") return (
    <svg viewBox="0 0 90 90" width="90" height="90" style={S}>
      <defs>
        <radialGradient id="nv1" cx="50%" cy="38%"><stop offset="0%" stopColor="#4cb8e0"/><stop offset="55%" stopColor="#1a7ab0"/><stop offset="100%" stopColor="#0a3d6b"/></radialGradient>
        <linearGradient id="nv2" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#0a3060"/><stop offset="100%" stopColor="#3098c8"/></linearGradient>
      </defs>
      <rect width="90" height="90" fill="url(#nv2)"/>
      <ellipse cx="45" cy="52" rx="38" ry="6" fill="rgba(255,255,255,0.07)"/>
      <ellipse cx="45" cy="60" rx="30" ry="4" fill="rgba(255,255,255,0.05)"/>
      {/* Baby swimming */}
      <circle cx="42" cy="52" r="6" fill="#f5d8a8"/>
      <path d="M36,54 Q30,56 24,52" stroke="#f5d8a8" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M48,54 Q54,56 58,50" stroke="#f5d8a8" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M40,58 L36,66 M44,58 L46,66" stroke="#f5d8a8" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Hook + dollar bill */}
      <line x1="56" y1="16" x2="56" y2="42" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8"/>
      <path d="M56,42 Q62,46 60,52" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" fill="none"/>
      <rect x="46" y="14" width="18" height="10" rx="1" fill="#85a83a"/>
      <text x="55" y="22" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="5" fontFamily="serif" fontWeight="bold">$</text>
      {/* Water ripples */}
      {[44,50,56].map((y,i)=><path key={i} d={`M10,${y} Q22,${y-3} 35,${y} Q48,${y+3} 60,${y} Q72,${y-3} 80,${y}`} stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" fill="none"/>)}
      <text x="45" y="82" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="7" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="0.5">NEVERMIND</text>
      <text x="45" y="74" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="5" fontFamily="Arial,sans-serif" letterSpacing="1.5">NIRVANA</text>
    </svg>
  );
  if (albumKey==="am") return (
    <svg viewBox="0 0 90 90" width="90" height="90" style={S}>
      <rect width="90" height="90" fill="#0a0a0a"/>
      {/* Oscilloscope interference lines */}
      {Array.from({length:20},(_,i)=>{
        const x=4+i*4.3; const h=18+Math.sin(i*1.7)*12+Math.cos(i*0.9)*8;
        return <rect key={i} x={x} y={(90-h*0.7)/2} width={i%3===0?2.5:1.8} height={h*0.7} rx="0.5"
          fill={i%2===0?"rgba(255,255,255,0.75)":"rgba(220,60,30,0.55)"}/>;
      })}
      <rect x="0" y="30" width="90" height="30" fill="rgba(0,0,0,0.65)"/>
      <text x="45" y="52" textAnchor="middle" fill="white" fontSize="26" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-1">AM</text>
      <text x="45" y="80" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="4.5" fontFamily="Arial,sans-serif" letterSpacing="1.2">ARCTIC MONKEYS</text>
    </svg>
  );
  if (albumKey==="isthisit") return (
    <svg viewBox="0 0 90 90" width="90" height="90" style={S}>
      <defs><linearGradient id="str" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c4956a"/><stop offset="100%" stopColor="#9a6640"/></linearGradient></defs>
      <rect width="90" height="90" fill="url(#str)"/>
      {/* Black leather glove shape */}
      <path d="M22,75 L22,42 Q22,30 32,28 Q40,26 44,32 L44,38 Q50,30 56,30 Q62,28 62,36 L62,40 Q67,33 72,35 Q78,38 76,46 L70,64 Q66,74 58,78 L28,78 Z" fill="#111" stroke="#0a0a0a" strokeWidth="1"/>
      {/* Glove highlights/texture */}
      <path d="M26,72 Q28,50 30,40" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M34,72 Q36,50 37,36" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <text x="45" y="14" textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="6" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-0.2">THE STROKES</text>
      <text x="45" y="22" textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="4.5" fontFamily="Arial,sans-serif" letterSpacing="0.3">IS THIS IT</text>
    </svg>
  );
  if (albumKey==="bucktick") return (
    <svg viewBox="0 0 90 90" width="90" height="90" style={S}>
      <rect width="90" height="90" fill="#0a0808"/>
      {/* Ornate frame */}
      <rect x="4" y="4" width="82" height="82" fill="none" stroke="rgba(180,150,80,0.5)" strokeWidth="0.8"/>
      <rect x="7" y="7" width="76" height="76" fill="none" stroke="rgba(180,150,80,0.3)" strokeWidth="0.5"/>
      {/* Chrysanthemum / art nouveau flower */}
      {Array.from({length:12},(_,i)=>{
        const a=(i/12)*Math.PI*2;
        return <path key={i} d={`M45,45 Q${45+18*Math.cos(a-0.2)},${45+18*Math.sin(a-0.2)} ${45+24*Math.cos(a)},${45+24*Math.sin(a)} Q${45+18*Math.cos(a+0.2)},${45+18*Math.sin(a+0.2)} 45,45`} fill="rgba(180,140,60,0.35)" stroke="rgba(200,160,70,0.5)" strokeWidth="0.5"/>;
      })}
      <circle cx="45" cy="45" r="12" fill="none" stroke="rgba(180,150,80,0.5)" strokeWidth="0.8"/>
      <circle cx="45" cy="45" r="6" fill="rgba(180,150,80,0.2)" stroke="rgba(200,170,80,0.6)" strokeWidth="0.7"/>
      <text x="45" y="78" textAnchor="middle" fill="rgba(180,150,70,0.9)" fontSize="6.5" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="1">BUCK-TICK</text>
      <text x="45" y="86" textAnchor="middle" fill="rgba(180,150,70,0.55)" fontSize="5" fontFamily="Georgia,serif" letterSpacing="0.5">悪の華</text>
    </svg>
  );
  if (albumKey==="akfg") return (
    <svg viewBox="0 0 90 90" width="90" height="90" style={S}>
      <rect width="90" height="90" fill="#1a1a2a"/>
      {/* Circuit board / electronic aesthetic */}
      {[[10,20,60,20],[60,20,60,55],[10,55,60,55],[10,20,10,55]].map(([x1,y1,x2,y2],i)=>
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(232,82,26,0.4)" strokeWidth="1"/>
      )}
      {/* Speaker/amp circles */}
      <circle cx="35" cy="38" r="18" fill="none" stroke="rgba(232,82,26,0.6)" strokeWidth="1.5"/>
      <circle cx="35" cy="38" r="12" fill="none" stroke="rgba(232,82,26,0.4)" strokeWidth="1"/>
      <circle cx="35" cy="38" r="6" fill="rgba(232,82,26,0.3)" stroke="rgba(232,82,26,0.7)" strokeWidth="1"/>
      <circle cx="35" cy="38" r="2" fill="#e8521a"/>
      {/* PCB nodes */}
      {[[10,20],[60,20],[60,55],[10,55],[35,20],[35,55],[10,38],[60,38]].map(([cx,cy],i)=>
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#e8521a" opacity="0.7"/>
      )}
      <text x="45" y="73" textAnchor="middle" fill="rgba(232,82,26,0.9)" fontSize="5" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="0.2">ASIAN KUNG-FU GEN.</text>
      <text x="45" y="82" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontFamily="Arial,sans-serif">崩壊アンプリファー</text>
    </svg>
  );
  if (albumKey==="spitz") return (
    <svg viewBox="0 0 90 90" width="90" height="90" style={S}>
      <defs>
        <linearGradient id="spz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a7fc4"/><stop offset="60%" stopColor="#6ab0e4"/><stop offset="100%" stopColor="#a8d4f0"/>
        </linearGradient>
      </defs>
      <rect width="90" height="90" fill="url(#spz)"/>
      {/* Clouds */}
      <ellipse cx="25" cy="28" rx="18" ry="11" fill="rgba(255,255,255,0.82)"/>
      <ellipse cx="38" cy="24" rx="13" ry="9" fill="rgba(255,255,255,0.88)"/>
      <ellipse cx="14" cy="32" rx="10" ry="7" fill="rgba(255,255,255,0.75)"/>
      <ellipse cx="68" cy="35" rx="16" ry="10" fill="rgba(255,255,255,0.78)"/>
      <ellipse cx="80" cy="30" rx="11" ry="8" fill="rgba(255,255,255,0.72)"/>
      <ellipse cx="57" cy="38" rx="10" ry="7" fill="rgba(255,255,255,0.7)"/>
      {/* Ground hint */}
      <rect x="0" y="70" width="90" height="20" fill="rgba(100,160,80,0.3)"/>
      <text x="45" y="60" textAnchor="middle" fill="rgba(20,60,120,0.75)" fontSize="9" fontFamily="Georgia,serif" fontStyle="italic" fontWeight="bold">スピッツ</text>
      <text x="45" y="68" textAnchor="middle" fill="rgba(20,60,120,0.6)" fontSize="7" fontFamily="Georgia,serif" fontStyle="italic">Robinson</text>
    </svg>
  );
  return null;
};

const TypePoster: FC<{ posterKey: string }> = ({ posterKey }) => {
  const S = { borderRadius:3, boxShadow:"0 4px 14px rgba(0,0,0,0.3)", display:"block" as const, flexShrink:0 };
  if (posterKey==="A") return (
    <svg viewBox="0 0 56 80" width="56" height="80" style={S}>
      <rect width="56" height="80" fill="#0d3535"/>
      <text x="28" y="64" textAnchor="middle" fill="#e8521a" fontSize="72" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="-2" dy="0" style={{paintOrder:"stroke"} as React.CSSProperties}>A</text>
      <line x1="8" y1="72" x2="48" y2="72" stroke="rgba(232,82,26,0.3)" strokeWidth="0.5"/>
      <text x="28" y="77" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="3.5" fontFamily="'DM Mono',monospace" letterSpacing="1">TYPEFACE POSTER</text>
    </svg>
  );
  if (posterKey==="B") return (
    <svg viewBox="0 0 56 80" width="56" height="80" style={S}>
      <rect width="56" height="80" fill="#1a3020"/>
      <text x="4" y="68" fill="#e8e010" fontSize="78" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-4">B</text>
      <rect x="0" y="58" width="56" height="22" fill="#e8e010"/>
      <text x="28" y="72" textAnchor="middle" fill="#1a3020" fontSize="6" fontFamily="'DM Mono',monospace" fontWeight="bold" letterSpacing="1">GROTESK</text>
    </svg>
  );
  if (posterKey==="K") return (
    <svg viewBox="0 0 56 80" width="56" height="80" style={S}>
      <rect width="56" height="80" fill="#7c4da0"/>
      <rect x="0" y="44" width="56" height="36" fill="#b0b0b8"/>
      <text x="3" y="58" fill="rgba(255,255,255,0.15)" fontSize="72" fontFamily="Georgia,serif" fontWeight="bold">K</text>
      <text x="3" y="58" fill="#c0b8d0" fontSize="72" fontFamily="Georgia,serif" fontWeight="bold" clipPath="url(#kb)">K</text>
      <clipPath id="kb"><rect x="0" y="44" width="56" height="36"/></clipPath>
      <line x1="0" y1="44" x2="56" y2="44" stroke="white" strokeWidth="0.8"/>
    </svg>
  );
  if (posterKey==="M") return (
    <svg viewBox="0 0 56 80" width="56" height="80" style={S}>
      <rect width="56" height="80" fill="#e8521a"/>
      <text x="28" y="62" textAnchor="middle" fill="#0d1f3a" fontSize="68" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-3">M</text>
      <rect x="0" y="66" width="56" height="14" fill="#0d1f3a"/>
      <text x="28" y="76" textAnchor="middle" fill="rgba(232,82,26,0.8)" fontSize="5.5" fontFamily="'DM Mono',monospace" letterSpacing="2">MODULAR</text>
    </svg>
  );
  if (posterKey==="S") return (
    <svg viewBox="0 0 56 80" width="56" height="80" style={S}>
      <rect width="56" height="80" fill="#e8521a"/>
      <text x="28" y="62" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="82" fontFamily="Georgia,serif" fontStyle="italic" fontWeight="bold" letterSpacing="-2">S</text>
      <text x="27" y="60" textAnchor="middle" fill="white" fontSize="82" fontFamily="Georgia,serif" fontStyle="italic" fontWeight="bold" letterSpacing="-2" opacity="0.9">S</text>
      <text x="28" y="76" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="4" fontFamily="'DM Mono',monospace" letterSpacing="1.5">ITALIC SERIF</text>
    </svg>
  );
  if (posterKey==="H") return (
    <svg viewBox="0 0 56 80" width="56" height="80" style={S}>
      <rect width="56" height="80" fill="#c0392b"/>
      <text x="28" y="62" textAnchor="middle" fill="#c0392b" fontSize="72" fontFamily="'Arial Black',sans-serif" fontWeight="900" stroke="#8b1a0e" strokeWidth="2">H</text>
      <text x="28" y="62" textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="72" fontFamily="'Arial Black',sans-serif" fontWeight="900">H</text>
      <line x1="4" y1="36" x2="52" y2="36" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
      <text x="28" y="76" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="4" fontFamily="'DM Mono',monospace" letterSpacing="1.5">EXTENDED</text>
    </svg>
  );
  return null;
};

const MoviePoster: FC<{ filmKey: string }> = ({ filmKey }) => {
  const S = { borderRadius:4, boxShadow:"0 5px 18px rgba(0,0,0,0.45)", display:"block" as const, flexShrink:0 };
  if (filmKey==="pulpfiction") return (
    <svg viewBox="0 0 58 84" width="58" height="84" style={S}>
      <rect width="58" height="84" fill="#f5e642"/>
      <rect x="0" y="0" width="58" height="52" fill="#111"/>
      <line x1="10" y1="18" x2="48" y2="18" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
      <ellipse cx="29" cy="34" rx="10" ry="13" fill="#2a2a2a"/>
      <ellipse cx="25" cy="26" rx="3" ry="4" fill="#1a1a1a"/>
      <line x1="20" y1="30" x2="12" y2="44" stroke="#888" strokeWidth="1.2"/>
      <text x="29" y="62" textAnchor="middle" fill="#111" fontSize="7.5" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-0.3">PULP</text>
      <text x="29" y="71" textAnchor="middle" fill="#111" fontSize="7.5" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-0.3">FICTION</text>
      <line x1="6" y1="74" x2="52" y2="74" stroke="#111" strokeWidth="0.6"/>
      <text x="29" y="80" textAnchor="middle" fill="rgba(0,0,0,0.5)" fontSize="3.5" fontFamily="Arial,sans-serif" letterSpacing="0.8">TARANTINO  1994</text>
    </svg>
  );
  if (filmKey==="bigfish") return (
    <svg viewBox="0 0 58 84" width="58" height="84" style={S}>
      <defs>
        <linearGradient id="bfsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a4a8a"/><stop offset="55%" stopColor="#2e7bc4"/><stop offset="100%" stopColor="#5bb3e8"/>
        </linearGradient>
      </defs>
      <rect width="58" height="84" fill="url(#bfsky)"/>
      <ellipse cx="29" cy="72" rx="26" ry="5" fill="rgba(100,180,255,0.35)"/>
      <ellipse cx="29" cy="68" rx="22" ry="8" fill="rgba(80,160,240,0.25)"/>
      <path d="M8 62 Q18 44 29 48 Q40 44 50 62 Q40 58 29 60 Q18 58 8 62Z" fill="rgba(255,200,100,0.9)"/>
      <circle cx="22" cy="53" r="1.5" fill="rgba(0,0,0,0.7)"/>
      <path d="M4 56 Q6 46 8 56" fill="rgba(255,180,80,0.7)"/>
      <path d="M52 56 Q54 46 54 56" fill="rgba(255,180,80,0.7)"/>
      <text x="29" y="18" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="7" fontFamily="Georgia,serif" fontStyle="italic" fontWeight="bold" letterSpacing="0.3">Big Fish</text>
      <text x="29" y="27" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="3.5" fontFamily="Georgia,serif" fontStyle="italic">Tim Burton  2003</text>
      <text x="29" y="80" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="3.5" fontFamily="Arial,sans-serif" letterSpacing="0.5">A Story of Mythic Proportions</text>
    </svg>
  );
  if (filmKey==="clockwork") return (
    <svg viewBox="0 0 58 84" width="58" height="84" style={S}>
      <rect width="58" height="84" fill="#f5f0e8"/>
      <rect x="0" y="0" width="58" height="10" fill="#1a1a1a"/>
      <text x="29" y="8" textAnchor="middle" fill="white" fontSize="4.5" fontFamily="'Arial',sans-serif" fontWeight="bold" letterSpacing="0.5">STANLEY KUBRICK</text>
      <ellipse cx="29" cy="32" rx="15" ry="16" fill="#1a1a1a"/>
      <ellipse cx="22" cy="28" rx="5.5" ry="6" fill="white"/>
      <ellipse cx="36" cy="28" rx="5.5" ry="6" fill="white"/>
      <circle cx="22" cy="28" r="3.5" fill="#1a1a1a"/>
      <circle cx="36" cy="28" r="3.5" fill="#1a1a1a"/>
      <circle cx="23" cy="27" r="1.2" fill="white"/>
      <circle cx="37" cy="27" r="1.2" fill="white"/>
      <line x1="14" y1="24" x2="8" y2="18" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="29" cy="46" rx="7" ry="3" fill="#1a1a1a"/>
      <rect x="22" y="46" width="14" height="6" fill="#1a1a1a" rx="1"/>
      <rect x="10" y="56" width="38" height="2" fill="#e8521a"/>
      <text x="29" y="67" textAnchor="middle" fill="#1a1a1a" fontSize="5.5" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-0.2">A CLOCKWORK</text>
      <text x="29" y="74" textAnchor="middle" fill="#1a1a1a" fontSize="5.5" fontFamily="'Arial Black',sans-serif" fontWeight="900" letterSpacing="-0.2">ORANGE</text>
      <text x="29" y="81" textAnchor="middle" fill="rgba(0,0,0,0.4)" fontSize="3.5" fontFamily="Arial,sans-serif" letterSpacing="0.5">KUBRICK  1971</text>
    </svg>
  );
  return null;
};

// ─── Robot3DSvg — isometric faithful recreation of the reference robot ────────

const Robot3DSvg: FC = () => (
  <svg viewBox="0 0 268 228" width="240" height="204" style={{display:"block",overflow:"visible"}}>
    {/* Ground shadow */}
    <ellipse cx="132" cy="220" rx="95" ry="9" fill="rgba(0,0,0,0.13)"/>

    {/* ── WHEELS ── */}
    {/* Left wheel — rubber tread, 3/4 view */}
    <ellipse cx="72" cy="185" rx="26" ry="17" fill="#090909" stroke="#1c1c1c" strokeWidth="1.2"/>
    <ellipse cx="72" cy="185" rx="11" ry="8" fill="#111"/>
    {[0,40,80,120,160,200,240,280,320].map((a,i)=>{
      const r=Math.PI*a/180; return <line key={i} x1={72+11*Math.cos(r)} y1={185+11*Math.sin(r)*0.65} x2={72+25*Math.cos(r)} y2={185+25*Math.sin(r)*0.65} stroke="#171717" strokeWidth="1.8" strokeLinecap="round"/>;
    })}
    {/* Right wheel */}
    <ellipse cx="192" cy="181" rx="21" ry="14" fill="#090909" stroke="#1c1c1c" strokeWidth="1"/>
    <ellipse cx="192" cy="181" rx="9" ry="6" fill="#111"/>
    {[0,60,120,180,240,300].map((a,i)=>{
      const r=Math.PI*a/180; return <line key={i} x1={192+9*Math.cos(r)} y1={181+9*Math.sin(r)*0.67} x2={192+20*Math.cos(r)} y2={181+20*Math.sin(r)*0.67} stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>;
    })}

    {/* ── MAIN BODY — isometric 3/4 perspective ── */}
    {/* Top face (slightly lighter) */}
    <path d="M48,106 L202,106 L220,95 L66,95 Z" fill="#131313" stroke="#1a1a1a" strokeWidth="0.8"/>
    {/* Front face */}
    <path d="M48,106 L202,106 L202,178 L48,178 Z" fill="#0d0d0d" stroke="#1c1c1c" strokeWidth="1"/>
    {/* Right side face */}
    <path d="M202,106 L220,95 L220,167 L202,178 Z" fill="#0a0a0a" stroke="#141414" strokeWidth="0.8"/>
    {/* Body front panels */}
    <rect x="55" y="113" width="52" height="26" rx="2" fill="#080808" stroke="#1d1d1d" strokeWidth="0.7"/>
    {[0,1,2,3].map(i=><line key={i} x1="58" y1={118+i*5.5} x2="105" y2={118+i*5.5} stroke="#141414" strokeWidth="0.7" strokeLinecap="round"/>)}
    <rect x="114" y="113" width="44" height="26" rx="2" fill="#080808" stroke="#1d1d1d" strokeWidth="0.7"/>
    <rect x="164" y="113" width="32" height="26" rx="2" fill="#080808" stroke="#1d1d1d" strokeWidth="0.7"/>
    {[0,1,2].map(i=><rect key={i} x="167" y={116+i*7} width="26" height="4" rx="1" fill="#0d0d0d"/>)}
    {/* Bottom accent stripe */}
    <rect x="48" y="170" width="154" height="8" fill="#090909" stroke="#111" strokeWidth="0.7"/>
    <rect x="48" y="170" width="154" height="2.5" fill="#1a3a6b" opacity="0.45"/>
    {/* Left body extension panel */}
    <rect x="30" y="120" width="20" height="16" rx="2" fill="#0c0c0c" stroke="#1a1a1a" strokeWidth="0.8"/>

    {/* ── LIDAR CYLINDER on body top ── */}
    <ellipse cx="130" cy="93" rx="30" ry="10" fill="#0f0f0f" stroke="#1c1c1c" strokeWidth="1"/>
    <path d="M100,93 L100,111 L160,111 L160,93" fill="#0c0c0c"/>
    <ellipse cx="130" cy="111" rx="30" ry="10" fill="#0d0d0d" stroke="#141414" strokeWidth="0.7"/>
    <ellipse cx="130" cy="100" rx="14" ry="5" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="0.8"/>
    {/* Cylinder ribs */}
    {[-20,-10,0,10,20].map(dx=><line key={dx} x1={130+dx} y1={92} x2={130+dx} y2={112} stroke="#111" strokeWidth="0.6" opacity="0.5"/>)}

    {/* ── HEAD GIMBAL MOUNT — two parallel rods ── */}
    <rect x="118" y="56" width="5.5" height="38" rx="2" fill="#111" stroke="#1a1a1a" strokeWidth="0.6"/>
    <rect x="138" y="56" width="5.5" height="38" rx="2" fill="#111" stroke="#1a1a1a" strokeWidth="0.6"/>
    <rect x="116" y="66" width="30" height="4" rx="1.5" fill="#0f0f0f" stroke="#1a1a1a" strokeWidth="0.5"/>
    {/* Cable/wire from mount to head */}
    <path d="M129,58 C126,54 123,50 120,46" stroke="#0e0e0e" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M134,58 C137,53 140,49 143,46" stroke="#0e0e0e" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

    {/* ── DISPLAY HEAD UNIT ── */}
    {/* Main housing — trapezoidal, slightly angled */}
    <path d="M102,38 L165,38 L167,58 L100,58 Z" fill="#0e0e0e" stroke="#1c1c1c" strokeWidth="1.2"/>
    {/* Side face (right) giving depth */}
    <path d="M165,38 L172,33 L174,53 L167,58 Z" fill="#0b0b0b" stroke="#141414" strokeWidth="0.8"/>
    {/* Top edge */}
    <path d="M102,38 L165,38 L172,33 L109,33 Z" fill="#111" stroke="#1a1a1a" strokeWidth="0.6"/>
    {/* WHITE DISPLAY SCREEN — the most prominent feature */}
    <path d="M110,40 L157,40 L159,56 L108,56 Z" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5"/>
    {/* Screen reflection highlight */}
    <path d="M112,41 L142,41 L144,50 L114,50 Z" fill="rgba(255,255,255,0.38)"/>
    <path d="M114,41 L125,41 L126,56 L113,56 Z" fill="rgba(255,255,255,0.14)"/>
    {/* Small side cameras on head */}
    <circle cx="104" cy="48" r="4" fill="#080808" stroke="#1c1c1c" strokeWidth="0.8"/>
    <circle cx="104" cy="48" r="2" fill="#060606"/>
    <circle cx="168" cy="46" r="3.5" fill="#080808" stroke="#1c1c1c" strokeWidth="0.7"/>
    {/* Head bottom edge detail */}
    <rect x="100" y="56" width="68" height="3" rx="0.8" fill="#0a0a0a"/>

    {/* ── ROBOTIC ARM — right side articulated mechanism ── */}
    {/* Upper arm mount bracket on body right */}
    <path d="M200,116 L224,106 L226,115 L202,125 Z" fill="#111" stroke="#1c1c1c" strokeWidth="0.8"/>
    {/* Upper pivot joint */}
    <circle cx="225" cy="110" r="7" fill="#0d0d0d" stroke="#1c1c1c" strokeWidth="1.2"/>
    <circle cx="225" cy="110" r="3.5" fill="#080808" stroke="#1a1a1a" strokeWidth="0.7"/>
    {/* Diagonal arm link going down */}
    <path d="M222,116 L214,148 L209,146 L217,114 Z" fill="#111" stroke="#1c1c1c" strokeWidth="0.7"/>
    {/* Elbow joint */}
    <circle cx="211" cy="150" r="8.5" fill="#0d0d0d" stroke="#1c1c1c" strokeWidth="1.2"/>
    <circle cx="211" cy="150" r="4" fill="#080808" stroke="#1a1a1a" strokeWidth="0.7"/>
    <circle cx="211" cy="150" r="1.5" fill="#060606"/>
    {/* Return arm link going back to body */}
    <path d="M207,145 L198,118 L203,116 L212,143 Z" fill="#111" stroke="#1c1c1c" strokeWidth="0.7"/>
    {/* End effector / camera mount at top of arm */}
    <rect x="196" y="112" width="14" height="10" rx="2.5" fill="#0d0d0d" stroke="#1c1c1c" strokeWidth="0.9"/>
    <circle cx="203" cy="117" r="3.5" fill="#080808" stroke="#1a1a1a" strokeWidth="0.7"/>
    <circle cx="203" cy="117" r="1.5" fill="#1a3a6b" opacity="0.8"/>
  </svg>
);

// ─── AnimatedRobot ────────────────────────────────────────────────────────────

const AnimatedRobot: FC = () => {
  const [view, setView] = useState<"animated"|"3d">("animated");

  return (
    <div style={{width:"100%",height:"100%",position:"relative",background:"#fff",overflow:"hidden"}}>
      {/* Toggle hint */}
      <div
        onClick={() => setView(v => v==="animated" ? "3d" : "animated")}
        style={{position:"absolute",top:10,right:12,zIndex:20,display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,0.06)",border:"1px solid rgba(0,0,0,0.1)",borderRadius:20,padding:"4px 10px",cursor:"pointer",userSelect:"none",transition:"background 0.2s"}}
      >
        <span style={{fontSize:9,color:"#888",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>{view==="animated" ? "3D view →" : "← animate"}</span>
      </div>

      {view==="animated" ? (
        /* ── ANIMATED DANCING ROBOT ── */
        <div style={{width:"100%",height:"100%",minHeight:220,display:"flex",overflow:"hidden"}}>
          <style>{`
            @keyframes rBounce{0%,100%{transform:translateY(0) rotate(0deg)}30%{transform:translateY(-9px) rotate(-2deg)}70%{transform:translateY(-4px) rotate(1.5deg)}}
            @keyframes rHead{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(12deg)}}
            @keyframes rArm{0%,100%{transform:rotate(0deg)}40%{transform:rotate(-50deg)}70%{transform:rotate(20deg)}}
            @keyframes rWheel{to{transform:rotate(360deg)}}
            @keyframes rAntenna{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:0.5}}
            @keyframes rLed{0%,42%,58%,100%{opacity:1}50%{opacity:0.12}}
            @keyframes rScan{0%,100%{opacity:0.65}50%{opacity:1}}
            @keyframes rPulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.4)}70%{box-shadow:0 0 0 8px rgba(37,99,235,0)}}
            @keyframes rThought{0%,100%{opacity:0.9;transform:scale(1)}50%{opacity:1;transform:scale(1.02)}}
          `}</style>
          {/* Left: Robot SVG */}
          <div style={{flex:"0 0 52%",display:"flex",alignItems:"center",justifyContent:"center",paddingLeft:12}}>
            <div style={{animation:"rBounce 1.85s ease-in-out infinite",position:"relative"}}>
              {/* Thought bubble */}
              <div style={{position:"absolute",top:-38,left:60,background:"#fff",border:"1px solid #e0e0e0",borderRadius:8,padding:"4px 9px",whiteSpace:"nowrap" as const,boxShadow:"0 2px 8px rgba(0,0,0,0.07)",animation:"rThought 3s ease-in-out infinite",zIndex:5}}>
                <div style={{fontSize:8.5,color:"#555",fontFamily:"'DM Mono',monospace"}}>need more</div>
                <div style={{fontSize:8.5,color:"#2563eb",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>actuators 🔧</div>
                <div style={{position:"absolute",bottom:-5,left:16,width:7,height:7,background:"#fff",border:"1px solid #e0e0e0",transform:"rotate(45deg)",borderTop:"none",borderRight:"none"}}/>
              </div>
              <svg viewBox="0 0 170 176" width="148" height="154" style={{overflow:"visible"}}>
                <ellipse cx="90" cy="170" rx="52" ry="6" fill="rgba(0,0,0,0.07)"/>
                <g style={{transformOrigin:"56px 150px",animation:"rWheel 0.85s linear infinite"}}>
                  <circle cx="56" cy="150" r="16" fill="#0a0a0a" stroke="#1d1d1d" strokeWidth="1.5"/>
                  <circle cx="56" cy="150" r="5.5" fill="#141414"/>
                  <line x1="56" y1="134" x2="56" y2="166" stroke="#222" strokeWidth="1.8"/>
                  <line x1="40" y1="150" x2="72" y2="150" stroke="#222" strokeWidth="1.8"/>
                  <line x1="44" y1="138" x2="68" y2="162" stroke="#1a1a1a" strokeWidth="1.2"/>
                  <line x1="68" y1="138" x2="44" y2="162" stroke="#1a1a1a" strokeWidth="1.2"/>
                </g>
                <g style={{transformOrigin:"124px 150px",animation:"rWheel 0.85s linear infinite"}}>
                  <circle cx="124" cy="150" r="16" fill="#0a0a0a" stroke="#1d1d1d" strokeWidth="1.5"/>
                  <circle cx="124" cy="150" r="5.5" fill="#141414"/>
                  <line x1="124" y1="134" x2="124" y2="166" stroke="#222" strokeWidth="1.8"/>
                  <line x1="108" y1="150" x2="140" y2="150" stroke="#222" strokeWidth="1.8"/>
                  <line x1="112" y1="138" x2="136" y2="162" stroke="#1a1a1a" strokeWidth="1.2"/>
                  <line x1="136" y1="138" x2="112" y2="162" stroke="#1a1a1a" strokeWidth="1.2"/>
                </g>
                <rect x="34" y="90" width="112" height="56" rx="8" fill="#0d0d0d" stroke="#1a1a1a" strokeWidth="1.5"/>
                <rect x="40" y="97" width="46" height="26" rx="3" fill="#060606" stroke="#1c1c1c" strokeWidth="1"/>
                <circle cx="48" cy="107" r="2.8" fill="#2563eb" style={{animation:"rLed 2.4s 0s infinite"}}/>
                <circle cx="58" cy="107" r="2.8" fill="#dc2626" style={{animation:"rLed 2.4s 0.4s infinite"}}/>
                <circle cx="68" cy="107" r="2.8" fill="#2563eb" style={{animation:"rLed 2.4s 0.8s infinite"}}/>
                <rect x="92" y="97" width="48" height="26" rx="3" fill="#060606" stroke="#1c1c1c" strokeWidth="1"/>
                {[0,1,2,3,4].map(i=><line key={i} x1="96" y1={102+i*4.5} x2="136" y2={102+i*4.5} stroke="#1c1c1c" strokeWidth="0.9" strokeLinecap="round"/>)}
                <rect x="34" y="138" width="112" height="7" rx="0" fill="#090909"/>
                <rect x="34" y="138" width="112" height="3" fill="#2563eb" opacity="0.28"/>
                <rect x="66" y="80" width="46" height="14" rx="4" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
                <g style={{transformBox:"fill-box",transformOrigin:"50% 50%",animation:"rHead 2.5s ease-in-out infinite 0.15s"}}>
                  <rect x="44" y="36" width="90" height="48" rx="7" fill="#0d0d0d" stroke="#1a1a1a" strokeWidth="1.5"/>
                  <rect x="50" y="40" width="78" height="15" rx="3" fill="#040404" stroke="#1c1c1c" strokeWidth="1"/>
                  <text x="89" y="51" textAnchor="middle" fill="rgba(37,99,235,0.75)" fontSize="6.5" fontFamily="'DM Mono',monospace" letterSpacing="1.2" style={{animation:"rScan 1.5s ease-in-out infinite"}}>SCANNING</text>
                  <circle cx="89" cy="66" r="15" fill="#020202" stroke="#2563eb" strokeWidth="2.2"/>
                  <circle cx="89" cy="66" r="10" fill="#040404"/>
                  <circle cx="89" cy="66" r="6" fill="#080808" stroke="#1a3a70" strokeWidth="0.8"/>
                  <circle cx="84" cy="61" r="2.8" fill="rgba(96,145,255,0.75)"/>
                  <rect x="130" y="52" width="12" height="18" rx="3" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
                  <circle cx="136" cy="61" r="3.5" fill="#060606" stroke="#2a2a2a" strokeWidth="0.8"/>
                </g>
                <g style={{transformBox:"fill-box",transformOrigin:"50% 100%",animation:"rArm 3.2s ease-in-out infinite 0.6s"}}>
                  <line x1="78" y1="36" x2="70" y2="16" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"/>
                  <circle cx="70" cy="11" r="5.5" fill="#dc2626" style={{animation:"rAntenna 1.4s ease-in-out infinite"}}/>
                  <circle cx="70" cy="11" r="9" fill="rgba(220,38,38,0.14)" style={{animation:"rAntenna 1.4s ease-in-out infinite"}}/>
                </g>
                <g style={{transformBox:"fill-box",transformOrigin:"100% 50%",animation:"rArm 2.1s ease-in-out infinite 0.3s"}}>
                  <rect x="8" y="94" width="28" height="12" rx="4" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
                  <rect x="2" y="90" width="10" height="9" rx="2.5" fill="#1a1a1a" stroke="#222" strokeWidth="0.8"/>
                  <circle cx="11" cy="94" r="3" fill="#060606" stroke="#2a2a2a" strokeWidth="0.8"/>
                </g>
              </svg>
            </div>
          </div>
          {/* Right: specs */}
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:7,paddingRight:16,paddingLeft:4}}>
            <div style={{fontSize:11,fontWeight:700,color:"#111",letterSpacing:"-0.02em",fontFamily:"'Inter',sans-serif",marginBottom:2}}>Ground Robot</div>
            {[["Platform","Differential drive"],["Sensors","LiDAR · RGB-D"],["Vision","YOLOv8 · SLAM"],["Stack","ROS2 Humble"],["Build","Custom chassis"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:8,alignItems:"baseline"}}>
                <span style={{fontSize:9.5,color:"#bbb",width:42,flexShrink:0,fontFamily:"'DM Mono',monospace"}}>{k}</span>
                <span style={{fontSize:10.5,color:"#333",fontFamily:"'DM Mono',monospace"}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:7,marginTop:2}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#2563eb",animation:"rPulse 1.8s ease-out infinite",flexShrink:0}}/>
              <span style={{fontSize:10.5,color:"#2563eb",fontWeight:600,fontFamily:"'DM Mono',monospace"}}>ONLINE</span>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap" as const,marginTop:4}}>
              {["autonomous","ROS2","servo","SLAM","YOLOv8","PIDs"].map(t=>(
                <span key={t} style={{fontSize:8.5,color:"#2563eb",background:"rgba(37,99,235,0.06)",border:"1px solid rgba(37,99,235,0.15)",borderRadius:4,padding:"2px 6px",fontFamily:"'DM Mono',monospace"}}>#{t}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── 3D ROBOT VIEW ── */
        <div style={{width:"100%",height:"100%",minHeight:220,display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",gap:20,padding:"10px 16px"}}>
          <Robot3DSvg />
          <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:"#111",letterSpacing:"-0.02em",fontFamily:"'Inter',sans-serif"}}>Ground Robot</div>
            <div style={{fontSize:10,color:"#888",lineHeight:1.6,fontFamily:"'DM Mono',monospace"}}>
              Autonomous mobile<br/>platform with:<br/>
              — Pan-tilt camera head<br/>
              — 360° LiDAR sensor<br/>
              — 6-DoF robotic arm<br/>
              — Differential drive
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap" as const,marginTop:4}}>
              {["ROS2","YOLOv8","SLAM","PIDs"].map(t=>(
                <span key={t} style={{fontSize:8.5,color:"#2563eb",background:"rgba(37,99,235,0.06)",border:"1px solid rgba(37,99,235,0.15)",borderRadius:4,padding:"2px 6px",fontFamily:"'DM Mono',monospace"}}>#{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// ─── PlayPage ─────────────────────────────────────────────────────────────────

const PlayPage: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardHover, setCardHover] = useState<"robot"|"typo"|null>(null);
  const [curXY,     setCurXY]     = useState({ x:-200, y:-200 });

  const [robotPos,   robotDrag]   = usePlayDrag({ x: 16,  y: 292 });
  const [typoPos,    typoDrag]    = usePlayDrag({ x: 534, y: 292 });
  const [musicPos,   musicDrag]   = usePlayDrag({ x: 16,  y: 18  });
  const [pastaPos,   pastaDrag]   = usePlayDrag({ x: 402, y: 18  });
  const [readPos,    readDrag]    = usePlayDrag({ x: 638, y: 18  });
  const [protoPos,   protoDrag]   = usePlayDrag({ x: 902, y: 18  });
  const [writingPos, writingDrag] = usePlayDrag({ x: 16,  y: 694 });
  const [moviePos,   movieDrag]   = usePlayDrag({ x: 352, y: 694 });

  const [musicIdx,  setMusicIdx]  = useState(0);
  const [typoIdx,   setTypoIdx]   = useState(0);
  const [pastaIdx,  setPastaIdx]  = useState(0);
  const [readIdx,   setReadIdx]   = useState(0);
  const [movieIdx,  setMovieIdx]  = useState(0);
  const [protoIdx,  setProtoIdx]  = useState(0);

  const BANDS = [
    { name:"Nevermind",       artist:"Nirvana",                  albumKey:"nevermind", genre:"Grunge",       color:"#1d4ed8", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
    { name:"AM",              artist:"Arctic Monkeys",           albumKey:"am",        genre:"Indie Rock",   color:"#111",    bg:"linear-gradient(135deg,#f8f9ff,#eff6ff)" },
    { name:"Is This It",      artist:"The Strokes",              albumKey:"isthisit",  genre:"Garage Rock",  color:"#dc2626", bg:"linear-gradient(135deg,#fff5f5,#fee2e2)" },
    { name:"\u60aa\u306e\u83ef",           artist:"BUCK-TICK",                albumKey:"bucktick",  genre:"J-Gothic",     color:"#1d4ed8", bg:"linear-gradient(135deg,#f0f4ff,#dbeafe)" },
    { name:"\u5d29\u58ca\u30a2\u30f3\u30d7\u30ea\u30d5\u30a1\u30fc", artist:"Asian Kung-Fu Generation",albumKey:"akfg",     genre:"J-Alternative",color:"#dc2626", bg:"linear-gradient(135deg,#fef2f2,#fee2e2)" },
    { name:"\u30ed\u30d3\u30f3\u30bd\u30f3",        artist:"Spitz",                   albumKey:"spitz",     genre:"J-Pop Rock",   color:"#1d4ed8", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
  ];
  const TYPE_POSTERS = [
    { letter:"A", style:"Constructivist Serif",  color:"#e8521a", bg:"#0d3535" },
    { letter:"B", style:"Bold Grotesk",          color:"#e8e010", bg:"#1a3020" },
    { letter:"H", style:"Extended Sans",         color:"#c0392b", bg:"#c0392b" },
    { letter:"K", style:"Geometric Slab",        color:"#7c4da0", bg:"#b0b0b8" },
    { letter:"M", style:"Modular Display",       color:"#e8521a", bg:"#0d1f3a" },
    { letter:"S", style:"Italic Serif",          color:"#ffffff", bg:"#e8521a" },
  ];
  const READS = [
    { name:"The Design of Everyday Things", coverKey:"doet", sub:"Don Norman",      color:"#dc2626", bg:"linear-gradient(135deg,#fff5f5,#fee2e2)" },
    { name:"Thinking Fast & Slow",          coverKey:"tfs",  sub:"Daniel Kahneman", color:"#1d4ed8", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
    { name:"Ways of Seeing",                coverKey:"wos",  sub:"John Berger",     color:"#111",    bg:"#fafafa" },
    { name:"The Pale King",                 coverKey:"tpk",  sub:"D.F. Wallace",    color:"#1d4ed8", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
  ];
  const PASTAS = [
    { name:"Cacio e Pepe",  emoji:"\uD83C\uDF5D", color:"#dc2626", bg:"linear-gradient(135deg,#fff,#fef2f2)" },
    { name:"Lasagna",       emoji:"\uD83E\uDED5", color:"#dc2626", bg:"linear-gradient(135deg,#fef2f2,#fee2e2)" },
    { name:"Pesto Fusilli", emoji:"\uD83C\uDF3F", color:"#1d4ed8", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
    { name:"Penne Arrabb.", emoji:"\uD83C\uDF36\uFE0F", color:"#dc2626", bg:"linear-gradient(135deg,#fef2f2,#fee2e2)" },
  ];
  const MOVIES = [
    { title:"Pulp Fiction",       dir:"Tarantino", year:"1994", filmKey:"pulpfiction", color:"#dc2626", bg:"linear-gradient(135deg,#fef2f2,#fee2e2)" },
    { title:"Big Fish",           dir:"Tim Burton",year:"2003", filmKey:"bigfish",     color:"#1d4ed8", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)" },
    { title:"A Clockwork Orange", dir:"Kubrick",   year:"1971", filmKey:"clockwork",   color:"#dc2626", bg:"linear-gradient(135deg,#fff5f5,#fee2e2)" },
  ];
  const PROTO_TOOLS = [
    { name:"Figma",    sub:"Smart animate · overlays · variables",    color:"#2563eb", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)", Icon:FigmaToolIcon    },
    { name:"ProtoPie", sub:"Trigger/response · sensors · conditions", color:"#dc2626", bg:"linear-gradient(135deg,#fef2f2,#fee2e2)", Icon:ProtoPieToolIcon },
    { name:"Framer",   sub:"Code components · CMS · state vars",      color:"#2563eb", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)", Icon:FramerToolIcon   },
    { name:"Principle",sub:"Timeline · driver-based interactions",    color:"#2563eb", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)", Icon:PrincipleToolIcon},
  ];

  const curBand  = BANDS[musicIdx];
  const curPost  = TYPE_POSTERS[typoIdx];
  const curRead  = READS[readIdx];
  const curPasta = PASTAS[pastaIdx];
  const curMovie = MOVIES[movieIdx];
  const curProto = PROTO_TOOLS[protoIdx];

  const Dots = ({ len, idx, color, set }: { len:number; idx:number; color:string; set:(i:number)=>void }) => (
    <div style={{ display:"flex", justifyContent:"center", gap:4, padding:"8px 14px", borderTop:"1px solid rgba(255,255,255,0.06)", background:"#0a0a0a" }}>
      {Array.from({length:len},(_,i)=>(
        <div key={i} onClick={()=>set(i)} style={{ width:i===idx?20:6, height:3, borderRadius:0, background:i===idx?color:"rgba(255,255,255,0.18)", transition:"width 0.3s,background 0.3s", cursor:"pointer" }}/>
      ))}
    </div>
  );

  const UX_PILLARS = [
    { label:"Information", desc:"Structure over style. Every word earns its place.", icon:"⌘" },
    { label:"Logic",       desc:"If/then thinking in UI copy. States, not just labels.", icon:"◈" },
    { label:"Empathy",     desc:"Write for the moment of use, not the moment of reading.", icon:"◉" },
  ];

  const R1B = 196; const FR = 292;

  return (
    <div ref={containerRef}
      onMouseMove={(e)=>{ const r=containerRef.current?.getBoundingClientRect(); if(r) setCurXY({x:e.clientX-r.left,y:e.clientY-r.top}); }}
      style={{ position:"relative", width:"100%", height:940, overflow:"hidden",
        background:"#080808",
        borderRadius:12, border:"1px solid rgba(255,255,255,0.08)" }}>

      <style>{"@keyframes playNodeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}"}</style>

      {/* Editorial grid */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,0.022) 0,rgba(255,255,255,0.022) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(255,255,255,0.022) 0,rgba(255,255,255,0.022) 1px,transparent 1px,transparent 48px)" }}/>

      {/* Corner marks */}
      {[[14,14],[14,"auto"],[("auto" as any),14],[("auto" as any),("auto" as any)]].map((_corner,i)=>(
        <div key={i} style={{position:"absolute",top:i<2?14:undefined,bottom:i>=2?14:undefined,left:i%2===0?14:undefined,right:i%2===1?14:undefined,width:16,height:16,borderTop:i<2?"1.5px solid rgba(255,255,255,0.2)":undefined,borderBottom:i>=2?"1.5px solid rgba(255,255,255,0.2)":undefined,borderLeft:i%2===0?"1.5px solid rgba(255,255,255,0.2)":undefined,borderRight:i%2===1?"1.5px solid rgba(255,255,255,0.2)":undefined,pointerEvents:"none"}}/>
      ))}

      {/* Custom cursor for robot / typo hover */}
      {cardHover && (
        <div style={{ position:"absolute", left:curXY.x-30, top:curXY.y-30,
          width:60, height:60, pointerEvents:"none", zIndex:500,
          border:`2px solid ${cardHover==="robot"?"#f97316":"#2563eb"}`,
          background:cardHover==="robot"?"rgba(249,115,22,0.1)":"rgba(37,99,235,0.1)",
          transform:"rotate(6deg)",
          boxShadow:cardHover==="robot"?"0 0 24px rgba(249,115,22,0.35)":"0 0 24px rgba(37,99,235,0.35)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <span style={{fontSize:cardHover==="robot"?22:15,fontWeight:900,color:cardHover==="robot"?"#f97316":"#2563eb",fontFamily:"'Inter',sans-serif",transform:"rotate(-6deg)",userSelect:"none",letterSpacing:"-0.04em"}}>
            {cardHover==="robot"?"🤖":"Aa"}
          </span>
        </div>
      )}

      {/* Wires */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:5 }}>
        <PlayWire x1={musicPos.x+180}  y1={musicPos.y+R1B}  x2={robotPos.x+252} y2={FR} />
        <PlayWire x1={pastaPos.x+109}  y1={pastaPos.y+R1B}  x2={robotPos.x+400} y2={FR} />
        <PlayWire x1={readPos.x+124}   y1={readPos.y+R1B}   x2={typoPos.x+150}  y2={FR} />
        <PlayWire x1={protoPos.x+123}  y1={protoPos.y+R1B}  x2={typoPos.x+380}  y2={FR} />
        <PlayWire x1={robotPos.x+504}  y1={FR+135}          x2={typoPos.x}      y2={FR+135} />
        <PlayWire x1={robotPos.x+252}  y1={FR+270}          x2={writingPos.x+156} y2={694} />
        <PlayWire x1={typoPos.x+252}   y1={FR+270}          x2={moviePos.x+146}   y2={694} />
      </svg>

      {/* ── MUSIC ── large dark editorial card */}
      <PlayNode pos={musicPos} drag={musicDrag} width={368} label="Music" icon="♪" delay={0}>
        <div style={{background:"#0d0d0d",cursor:"pointer"}} onClick={()=>setMusicIdx(i=>(i+1)%BANDS.length)}>
          {/* Category tag bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
            <span style={{fontSize:7.5,color:"#f97316",fontFamily:"'DM Mono',monospace",letterSpacing:"0.2em",fontWeight:700}}>── {curBand.genre.toUpperCase()}</span>
            <span style={{fontSize:7.5,color:"rgba(255,255,255,0.25)",fontFamily:"'DM Mono',monospace"}}>N° {String(musicIdx+1).padStart(2,"0")} / 06</span>
          </div>
          {/* Main feature */}
          <div style={{display:"flex",gap:16,alignItems:"flex-start",padding:"16px 16px 12px"}}>
            <div style={{flexShrink:0}}><AlbumArt albumKey={curBand.albumKey}/></div>
            <div style={{flex:1,minWidth:0,paddingTop:2}}>
              <div style={{fontSize:21,fontWeight:900,color:"#fff",letterSpacing:"-0.04em",lineHeight:1.1,fontFamily:"'Inter',sans-serif",marginBottom:5}}>{curBand.name}</div>
              <div style={{fontSize:10.5,color:"rgba(255,255,255,0.35)",fontFamily:"'DM Mono',monospace",marginBottom:10}}>{curBand.artist}</div>
              <div style={{fontSize:8.5,color:"rgba(255,255,255,0.15)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>tap cover to switch →</div>
            </div>
          </div>
          {/* All 6 album strip */}
          <div style={{display:"flex",gap:4,padding:"0 14px 14px",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:10}}>
            {BANDS.map((b,i)=>(
              <div key={b.albumKey} onClick={(e)=>{e.stopPropagation();setMusicIdx(i);}}
                style={{flex:1,aspectRatio:"1",border:i===musicIdx?"2px solid #f97316":"1.5px solid rgba(255,255,255,0.1)",overflow:"hidden",opacity:i===musicIdx?1:0.45,transition:"all 0.2s",cursor:"pointer",transform:i===musicIdx?"scale(1.06)":"scale(1)",boxShadow:i===musicIdx?"0 3px 12px rgba(249,115,22,0.3)":"none"}}>
                <AlbumArt albumKey={b.albumKey}/>
              </div>
            ))}
          </div>
        </div>
      </PlayNode>

      {/* ── PASTA ── orange editorial */}
      <PlayNode pos={pastaPos} drag={pastaDrag} width={218} label="Pasta" icon="🍝" delay={0.04}>
        <div style={{background:"#f97316",cursor:"pointer",padding:"16px 16px 14px",textAlign:"center" as const}} onClick={()=>setPastaIdx(i=>(i+1)%PASTAS.length)}>
          <div style={{fontSize:7.5,color:"rgba(0,0,0,0.45)",letterSpacing:"0.2em",fontFamily:"'DM Mono',monospace",marginBottom:10,fontWeight:700}}>── PASTA LOVER</div>
          <div style={{fontSize:52,lineHeight:1,marginBottom:10}}>{curPasta.emoji}</div>
          <div style={{fontSize:16,fontWeight:900,color:"#000",letterSpacing:"-0.03em",fontFamily:"'Inter',sans-serif",marginBottom:3}}>{curPasta.name}</div>
          <div style={{fontSize:7.5,color:"rgba(0,0,0,0.35)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>tap to change →</div>
        </div>
        <Dots len={PASTAS.length} idx={pastaIdx} color="#000" set={setPastaIdx}/>
      </PlayNode>

      {/* ── READING ── dark editorial */}
      <PlayNode pos={readPos} drag={readDrag} width={248} label="Reading" icon="◎" delay={0.08}>
        <div style={{background:"#0d0d0d",cursor:"pointer",padding:"14px 15px"}} onClick={()=>setReadIdx(i=>(i+1)%READS.length)}>
          <div style={{fontSize:7.5,color:"rgba(255,255,255,0.3)",letterSpacing:"0.2em",fontFamily:"'DM Mono',monospace",fontWeight:700,marginBottom:12}}>── READING STACK</div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <BookCover coverKey={curRead.coverKey}/>
            <div style={{flex:1,minWidth:0,paddingTop:2}}>
              <div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:5,fontFamily:"'Inter',sans-serif"}}>{curRead.name}</div>
              <div style={{fontSize:9.5,color:"rgba(255,255,255,0.4)",fontFamily:"'DM Mono',monospace"}}>{curRead.sub}</div>
            </div>
          </div>
          <div style={{fontSize:7.5,color:"rgba(255,255,255,0.15)",fontFamily:"'DM Mono',monospace",marginTop:12,letterSpacing:"0.06em"}}>tap to change →</div>
        </div>
        <Dots len={READS.length} idx={readIdx} color="rgba(255,255,255,0.8)" set={setReadIdx}/>
      </PlayNode>

      {/* ── PROTOTYPING ── dark technical */}
      <PlayNode pos={protoPos} drag={protoDrag} width={246} label="Prototyping" icon="⬡" delay={0.12}>
        <div style={{background:"#0d0d0d",cursor:"pointer",padding:"14px"}} onClick={()=>setProtoIdx(i=>(i+1)%PROTO_TOOLS.length)}>
          <div style={{fontSize:7.5,color:"rgba(255,255,255,0.3)",letterSpacing:"0.2em",fontFamily:"'DM Mono',monospace",fontWeight:700,marginBottom:12}}>── TOOLS</div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <curProto.Icon/>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Inter',sans-serif"}}>{curProto.name}</div>
              <div style={{fontSize:8.5,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Mono',monospace",marginTop:1,lineHeight:1.4}}>{curProto.sub}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
            {PROTO_TOOLS.map((t,i)=>(
              <div key={t.name} style={{padding:"5px 8px",border:`1.5px solid ${i===protoIdx?"rgba(249,115,22,0.6)":"rgba(255,255,255,0.1)"}`,fontSize:8,color:i===protoIdx?"#f97316":"rgba(255,255,255,0.35)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em",transition:"all 0.25s"}}>{t.name}</div>
            ))}
          </div>
        </div>
        <Dots len={PROTO_TOOLS.length} idx={protoIdx} color="#f97316" set={setProtoIdx}/>
      </PlayNode>

      {/* ── ROBOT OBSESSION ── orange-header poster */}
      <PlayNode pos={robotPos} drag={robotDrag} width={504} label="Robot Obsession" icon="◈" accent delay={0.08}
        onMouseEnter={()=>setCardHover("robot")} onMouseLeave={()=>setCardHover(null)}>
        <div>
          {/* Big orange poster header */}
          <div style={{background:"#f97316",padding:"18px 22px 14px",borderBottom:"1.5px solid rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:60,fontWeight:900,color:"#000",lineHeight:0.88,letterSpacing:"-0.05em",fontFamily:"'Inter',sans-serif"}}>ROBOT</div>
            <div style={{display:"flex",alignItems:"baseline",gap:12,marginTop:4}}>
              <div style={{fontSize:14,fontWeight:700,color:"rgba(0,0,0,0.4)",letterSpacing:"0.22em",fontFamily:"'DM Mono',monospace"}}>OBSESSION</div>
              <div style={{fontSize:9,color:"rgba(0,0,0,0.35)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.12em"}}>NO. 001 · AUTONOMOUS</div>
            </div>
          </div>
          {/* Robot content on white for contrast with orange header */}
          <AnimatedRobot />
        </div>
      </PlayNode>

      {/* ── TYPOGRAPHY ── blue editorial poster */}
      <PlayNode pos={typoPos} drag={typoDrag} width={504} label="Typography" icon="Aa" delay={0.14}
        onMouseEnter={()=>setCardHover("typo")} onMouseLeave={()=>setCardHover(null)}>
        <div style={{background:"#1d4ed8",cursor:"pointer"}} onClick={()=>setTypoIdx(i=>(i+1)%TYPE_POSTERS.length)}>
          {/* Blue header strip */}
          <div style={{padding:"10px 18px",borderBottom:"1px solid rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:7.5,color:"rgba(255,255,255,0.6)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.2em",fontWeight:700}}>── DISPLAY POSTER SERIES</span>
            <span style={{fontSize:7.5,color:"rgba(255,255,255,0.35)",fontFamily:"'DM Mono',monospace"}}>{curPost.style.toUpperCase()}</span>
          </div>
          {/* Main content */}
          <div style={{padding:"20px 22px 16px",display:"flex",gap:20,alignItems:"stretch"}}>
            {/* Giant letter */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid rgba(255,255,255,0.18)",paddingRight:22,minWidth:130}}>
              <div style={{fontSize:110,fontWeight:900,color:"#fff",lineHeight:0.88,letterSpacing:"-0.06em",fontFamily:"'Inter',sans-serif",userSelect:"none",textShadow:"6px 6px 0 rgba(0,0,0,0.2)"}}>{curPost.letter}</div>
            </div>
            {/* Right info + thumbnails */}
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:6}}>CURRENT SELECTION</div>
                <div style={{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:"-0.02em",fontFamily:"'Inter',sans-serif",lineHeight:1.2}}>{curPost.letter} — {curPost.style}</div>
              </div>
              {/* Two big poster thumbnails */}
              <div style={{display:"flex",gap:8,flex:1}}>
                <TypePoster posterKey={curPost.letter}/>
                <TypePoster posterKey={TYPE_POSTERS[(typoIdx+1)%TYPE_POSTERS.length].letter}/>
                <TypePoster posterKey={TYPE_POSTERS[(typoIdx+2)%TYPE_POSTERS.length].letter}/>
              </div>
              <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>tap to cycle →</div>
            </div>
          </div>
          {/* Full poster strip */}
          <div style={{display:"flex",gap:4,padding:"0 20px 16px"}}>
            {TYPE_POSTERS.map((p,i)=>(
              <div key={p.letter} style={{flex:1,height:28,background:p.bg,display:"flex",alignItems:"center",justifyContent:"center",border:i===typoIdx?"2px solid #fff":"1.5px solid rgba(255,255,255,0.15)",transition:"all 0.25s",boxShadow:i===typoIdx?"0 2px 12px rgba(0,0,0,0.4)":"none"}}>
                <span style={{fontSize:13,fontWeight:900,color:p.color,fontFamily:"Georgia,serif"}}>{p.letter}</span>
              </div>
            ))}
          </div>
        </div>
      </PlayNode>

      {/* ── UX WRITING ── white editorial */}
      <PlayNode pos={writingPos} drag={writingDrag} width={312} label="Writing" icon="✎" delay={0.22}>
        <div style={{background:"#fff",padding:"16px 18px"}}>
          <div style={{fontSize:7.5,color:"rgba(0,0,0,0.3)",letterSpacing:"0.2em",fontFamily:"'DM Mono',monospace",fontWeight:700,marginBottom:14}}>── UX CONTENT WRITER</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            {UX_PILLARS.map(p=>(
              <div key={p.label} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:26,height:26,background:"#f97316",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:11,color:"#fff"}}>{p.icon}</span>
                </div>
                <div>
                  <div style={{fontSize:11.5,fontWeight:700,color:"#0d0d0d",marginBottom:1,fontFamily:"'Inter',sans-serif"}}>{p.label}</div>
                  <div style={{fontSize:9.5,color:"#666",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,fontStyle:"italic",color:"#888",lineHeight:1.7,paddingLeft:12,borderLeft:"3px solid #f97316",fontFamily:"'DM Serif Display',Georgia,serif"}}>
            "Good UX copy disappears. You only notice it when it's wrong."
          </div>
        </div>
      </PlayNode>

      {/* ── MOVIES ── black film poster */}
      <PlayNode pos={moviePos} drag={movieDrag} width={292} label="Films" icon="▶" delay={0.28}>
        <div style={{background:"#0d0d0d",cursor:"pointer"}} onClick={()=>setMovieIdx(i=>(i+1)%MOVIES.length)}>
          <div style={{padding:"9px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:7.5,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.2em",fontWeight:700}}>── FAVOURITE FILMS</span>
            <span style={{fontSize:7.5,color:"rgba(255,255,255,0.2)",fontFamily:"'DM Mono',monospace"}}>N° {movieIdx+1} / {MOVIES.length}</span>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px 10px"}}>
            <MoviePoster filmKey={curMovie.filmKey}/>
            <div style={{flex:1}}>
              <div style={{fontSize:7.5,color:"#f97316",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:6,fontWeight:700}}>{curMovie.dir.toUpperCase()} · {curMovie.year}</div>
              <div style={{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:"-0.03em",lineHeight:1.1,fontFamily:"'Inter',sans-serif"}}>{curMovie.title}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:3,padding:"0 14px 12px"}}>
            {MOVIES.map((m,i)=><div key={m.filmKey} style={{flex:1,height:3,background:i===movieIdx?"#f97316":"rgba(255,255,255,0.12)",transition:"background 0.3s"}}/>)}
          </div>
        </div>
      </PlayNode>

      {/* Footer labels */}
      <div style={{position:"absolute",bottom:14,left:18,fontFamily:"'DM Mono',monospace",fontSize:8.5,color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",userSelect:"none",pointerEvents:"none"}}>DRAG TO EXPLORE</div>
      <div style={{position:"absolute",bottom:14,right:18,fontFamily:"'DM Mono',monospace",fontSize:8.5,color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em",userSelect:"none",pointerEvents:"none"}}>8 NODES · 7 CONNECTIONS</div>
    </div>
  );
};


// ─── Root ─────────────────────────────────────────────────────────────────────

type SectionId = "work" | "about" | "play" | "gallery";

const PRONUN_COLORS = [
  { bg:"rgba(255,255,255,0.55)", border:"rgba(180,180,200,0.35)", flower:"#c8b8f0", text:"#aaa" },
  { bg:"rgba(255,235,245,0.65)", border:"rgba(220,130,170,0.3)",  flower:"#e87ab0", text:"#c06090" },
  { bg:"rgba(230,245,255,0.65)", border:"rgba(100,160,230,0.3)",  flower:"#70aaee", text:"#5580cc" },
  { bg:"rgba(230,255,240,0.65)", border:"rgba(80,190,130,0.3)",   flower:"#50c888", text:"#2a9a60" },
  { bg:"rgba(255,248,225,0.65)", border:"rgba(220,180,60,0.3)",   flower:"#e8c040", text:"#b08010" },
  { bg:"rgba(255,235,228,0.65)", border:"rgba(230,120,80,0.3)",   flower:"#f07050", text:"#c04830" },
];

const MiaoLanPortfolio: FC = () => {
  const [activeSection,   setActiveSection]   = useState<SectionId>("work");
  const [showSplash,      setShowSplash]      = useState<boolean>(true);
  const [cursorProjectId, setCursorProjectId] = useState<number | null>(null);
  const [cursorPos,       setCursorPos]       = useState<{ x:number; y:number }>({ x:0, y:0 });
  const [pronunColorIdx,  setPronunColorIdx]  = useState<number>(0);
  const [titleHovered,    setTitleHovered]    = useState<boolean>(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: SectionId): void => {
    e.preventDefault(); setActiveSection(section);
  };

  return (
    <>
      {showSplash && <SplashScreen onEnter={()=>setShowSplash(false)} />}
      <CustomCursor projectId={cursorProjectId} x={cursorPos.x} y={cursorPos.y} titleHovered={titleHovered} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400&family=Inter:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{margin:0 !important;padding:0 !important;width:100% !important;min-height:100vh;overflow-x:hidden;cursor:none !important;}
        body{display:block !important;background:#ffffff;color:#111;}
        #root{display:block !important;width:100% !important;margin:0 !important;padding:0 !important;max-width:none !important;overflow-x:hidden;}
        *{cursor:none !important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes clipGlow{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
        .nav-link{font-family:'DM Mono',monospace;font-size:12px;color:#999;text-decoration:none;transition:color 0.2s;letter-spacing:0.02em;}
        .nav-link:hover{color:#111;}.nav-link.active{color:#111;}
        .project-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px 40px;width:100%;}
        @media(max-width:680px){.project-grid{grid-template-columns:1fr;}}
        .footer-link{font-family:'DM Mono',monospace;font-size:11px;color:#999;text-decoration:none;letter-spacing:0.08em;transition:color 0.2s;text-transform:uppercase;}
        .footer-link:hover{color:#111;}
        .ascii-art{font-family:'DM Mono',monospace;font-size:10px;color:#c8c4bc;line-height:1.6;white-space:pre-wrap;word-break:break-all;max-width:100%;overflow:hidden;animation:fadeIn 1.2s ease 0.8s forwards;opacity:0;}
      `}</style>

      <div style={{width:"100%",minHeight:"100vh",background:"#ffffff",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",overflowX:"hidden"}}
        onMouseMove={(e)=>setCursorPos({x:e.clientX,y:e.clientY})}>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0 30px",boxSizing:"border-box"}}>

        {/* NAV */}
        <nav style={{position:"sticky",top:0,zIndex:100,background:"#ffffff",padding:"0",height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeIn 0.5s ease forwards",width:"100%"}}>
          <a href="#" onClick={(e)=>{e.preventDefault();setActiveSection("work");}} style={{display:"flex",alignItems:"center",textDecoration:"none"}}><ScribbleM /></a>
          <div style={{display:"flex",gap:"28px",alignItems:"center"}}>
            {(["work","gallery","play","about"] as SectionId[]).map(item=>(
              <a key={item} href="#" className={`nav-link${activeSection===item?" active":""}`} onClick={e=>handleNavClick(e,item)}>{item}</a>
            ))}
          </div>
        </nav>

        {/* MAIN */}
        <main style={{width:"100%",margin:"0",padding:"60px 0 100px",overflowX:"hidden"}}>
          <div style={{marginBottom:"48px",opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards",textAlign:"left"}}>
            <h1
              style={{fontFamily:"'Inter',sans-serif",fontSize:"36px",fontWeight:600,color:"#111",letterSpacing:"-0.03em",marginBottom:"6px",lineHeight:1.15,textAlign:"left",display:"flex",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
              miao lan
              <span
                onClick={()=>setPronunColorIdx(i=>(i+1)%PRONUN_COLORS.length)}
                onMouseEnter={() => setTitleHovered(true)}
                onMouseLeave={() => setTitleHovered(false)}
                style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:PRONUN_COLORS[pronunColorIdx].bg, border:`1px solid ${PRONUN_COLORS[pronunColorIdx].border}`, backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", borderRadius:"999px", padding:"4px 14px 4px 10px", boxShadow:"0 2px 12px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.8)", cursor:"pointer", transition:"background 0.4s ease,border-color 0.4s ease", userSelect:"none" }}>
                <span style={{fontSize:"18px",lineHeight:1,transition:"color 0.4s ease",color:PRONUN_COLORS[pronunColorIdx].flower}}>✿</span>
                <span style={{fontSize:"18px",fontWeight:400,fontFamily:"'Inter',sans-serif",letterSpacing:"0em",transition:"color 0.4s ease",color:PRONUN_COLORS[pronunColorIdx].text}}>/mee-ow lɑːn/</span>
              </span>
              zhang
            </h1>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"16px",color:"#777",fontWeight:300,letterSpacing:"0.01em",textAlign:"left"}}>I design simple experiences for complex systems.</p>
          </div>

          {activeSection==="gallery" ? (
            <GalleryPage />
          ) : activeSection==="play" ? (
            <div style={{opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards"}}>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"20px",textAlign:"left"}}>generative play</p>
              <PlayPage />
            </div>
          ) : activeSection==="about" ? (
            <div style={{opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards",maxWidth:"640px",textAlign:"left"}}>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"28px"}}>more about me</p>

              <div style={{marginBottom:"32px"}}>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300,marginBottom:"16px"}}>Hello! 👋🏻 I'm Miao Lan, a product designer, builder, and design strategist with over three years of experience, working on a variety of software projects.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300,marginBottom:"16px"}}>I don't have a clear label for what kind of designer I am. I enjoy building. I enjoy experimenting. I enjoy thinking. What I have is a set of questions I keep returning to. A deep suspicion. A stubborn belief that the emotional layer of a product carries weight.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300}}>I've always been more interested in the <em>why</em> behind things than the <em>what</em>. Why does someone hesitate before trusting an AI suggestion? Why does one interaction feel collaborative while another feels like a form to fill?</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"56px"}}>
                {[photoCafe, photoAward, photoHackathon].map((src, i) => (
                  <div key={i} style={{borderRadius:"10px",overflow:"hidden",aspectRatio:"4/3"}}>
                    <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                  </div>
                ))}
              </div>

              <div style={{marginBottom:"32px"}}>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:"20px",fontWeight:600,color:"#111",letterSpacing:"-0.025em",marginBottom:"16px",lineHeight:1.2}}>The Problem With Knowing What You're Designing</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300,marginBottom:"16px"}}>There's a version of design work that feels very clean. Someone hands you a brief. You understand the user, you know the goal, you make the thing. It's satisfying in the way that solving a math problem is satisfying.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300}}>The best design problems I've worked on are the ones that, at the start, I couldn't fully articulate.</p>
              </div>

              <div style={{marginBottom:"32px"}}>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:"20px",fontWeight:600,color:"#111",letterSpacing:"-0.025em",marginBottom:"16px",lineHeight:1.2}}>AI in Design</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300,marginBottom:"16px"}}>Designing for agentic systems means thinking about how autonomy is shared. Philosophers call this <em>epistemic dependence</em>: most of what we know, we know because we trust a chain of other knowers. AI introduces a new link in that chain.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300,marginBottom:"16px"}}>My workflow is AI-native. I design systems as executable hypotheses, using live prototypes to close the gap between concept and behavior. I use Origami and Principle to simulate interaction logic such as timing, latency states, and probabilistic transitions.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.7,fontWeight:300}}>With Replit, Cursor, and Claude Code, I move into functional systems early, wiring real APIs and data flows to observe true behavior. Apple's creative stack — Keynote, Pages, Pixelmator, Final Cut Pro, Motion, and Logic Pro — complements this with narrative and multimodal definition.</p>
              </div>

              <div style={{marginBottom:"40px"}}>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:"20px",fontWeight:600,color:"#111",letterSpacing:"-0.025em",marginBottom:"24px",lineHeight:1.2}}>How I Work</p>
                <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                  {[
                    { label:"Obsession with building", body:"Founding and sole-design experience in early-stage environments; comfortable with extreme ambiguity, resource constraints, and rapid iteration." },
                    { label:"Analyzing the Infrastructure layer", body:"Deep familiarity designing for cloud hyperscalers and AI infrastructure providers." },
                    { label:"Vibe Coding", body:"Hands-on experimentation with AI coding environments like Replit, Cursor, and Claude Code." },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{fontSize:"15px",fontWeight:500,color:"#222",marginBottom:"6px",letterSpacing:"-0.01em"}}>{item.label}</p>
                      <p style={{fontSize:"15px",color:"#666",lineHeight:1.65,fontWeight:300}}>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{marginBottom:"32px",opacity:0,animation:"fadeIn 0.5s ease 0.2s forwards",textAlign:"left"}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase"}}>selected work</span>
              </div>
              <div className="project-grid">
                {projects.map((project,i)=>(
                  <ProjectCard key={project.id} project={project} index={i}
                    onCursorEnter={(id,x,y)=>{setCursorProjectId(id);setCursorPos({x,y});}}
                    onCursorMove={(x,y)=>setCursorPos({x,y})}
                    onCursorLeave={()=>setCursorProjectId(null)}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* FOOTER */}
        <footer style={{borderTop:"1px solid rgba(0,0,0,0.07)",background:"transparent"}}>
          <div style={{padding:"32px 7px 24px",overflow:"hidden"}}><p className="ascii-art">{ASCII_TREES}</p></div>
          <div style={{padding:"24px 7px 40px",display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-end",gap:"32px",animation:"fadeIn 0.8s ease 1s forwards",opacity:0}}>
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
      </div>
    </>
  );
};

export default MiaoLanPortfolio;