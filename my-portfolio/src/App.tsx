import React, { useState, useEffect, useRef } from "react";
import type { FC, CSSProperties } from "react";
import aatcImg from "./assets/aatc.png";
import javaai from "./assets/javaai.png";
import dashboard6 from "./assets/dashboard6.mp4";
import tiktoknew from "./assets/tiktoknew.mp4";
import tencent1 from "./assets/tencent1.mov";
import fashion from "./assets/fashion.mp4";

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
    link: null,
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
    link: "https://miaolanzhang.notion.site/Tencent-3252080795728008a60bf9b2518c89b1",
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
    glow: "rgba(220,70,110,0.25)", label: "Tencent",
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
      {/* glass dot — shrinks when any hover is active */}
      <div style={{ position:"fixed", left:pos.x-8, top:pos.y-8, width:16, height:16, borderRadius:"50%", background:"rgba(255,255,255,0.55)", border:"1px solid rgba(180,180,200,0.5)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", boxShadow:"0 2px 10px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.9)", pointerEvents:"none", zIndex:9999, transition:"transform 0.15s ease,opacity 0.2s ease", transform:active?"scale(0.5)":"scale(1)", opacity:active?0.4:1, mixBlendMode:"normal" as const }} />

      {/* flower cursor on title hover */}
      {titleHovered && !cfg && (
        <div style={{ position:"fixed", left:pos.x-24, top:pos.y-24, width:48, height:48, borderRadius:"50%", background:"rgba(255,255,255,0.22)", border:"1px solid rgba(200,180,255,0.5)", backdropFilter:"blur(14px) saturate(1.8)", WebkitBackdropFilter:"blur(14px) saturate(1.8)", boxShadow:"0 0 14px 3px rgba(200,180,255,0.25), inset 0 1px 0 rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:9998 }}>
          <span style={{ fontSize:"18px", lineHeight:1, display:"block", animation:"flowerSpin 4s linear infinite", transformOrigin:"center" }}>✿</span>
        </div>
      )}

      {/* project label bubble */}
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
    const ctx = canvas.getContext("2d")!;
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
    const canvas=canvasRef.current;if(!canvas)return; const ctx=canvas.getContext("2d")!;
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
    const canvas=canvasRef.current;if(!canvas)return; const ctx=canvas.getContext("2d")!;
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
    const canvas=canvasRef.current;if(!canvas)return; const ctx=canvas.getContext("2d")!;
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
        {/* large stage number */}
        <span style={{fontSize:"11px",color:"#3333ee",letterSpacing:"0.08em",fontFamily:"'DM Mono',monospace"}}>{String(active+1).padStart(2,"0")} / {STAGES.length}</span>
        {/* stage name */}
        <div style={{fontSize:"28px",fontWeight:700,color:"#111",letterSpacing:"-0.03em",lineHeight:1,fontFamily:"'Inter',sans-serif",transition:"all 0.35s"}}>{STAGES[active]}</div>
        {/* purple rule */}
        <div style={{width:"28px",height:"2px",background:"#3333ee",borderRadius:"1px"}} />
        {/* description */}
        <div style={{fontSize:"10px",color:"#999",lineHeight:1.65,letterSpacing:"0.01em"}}>{DESC[active]}</div>
      </div>
      {/* step dots */}
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
      {/* 2×2 metric grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
        {METHODS.map((m,i) => (
          <div key={m.label} style={{background:i===idx?"rgba(51,51,238,0.04)":"#fafafa",border:`1px solid ${i===idx?"rgba(51,51,238,0.25)":"#ebebeb"}`,borderRadius:"6px",padding:"8px 10px",transition:"all 0.35s"}}>
            <div style={{fontSize:"18px",fontWeight:700,color:i===idx?"#3333ee":"#111",fontFamily:"'Inter',sans-serif",lineHeight:1,marginBottom:"3px",transition:"color 0.35s"}}>{m.n}</div>
            <div style={{fontSize:"7.5px",color:i===idx?"#555":"#bbb",lineHeight:1.4,transition:"color 0.35s"}}>{m.label}</div>
          </div>
        ))}
      </div>
      {/* insight quote */}
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
      {/* layers */}
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
      {/* properties */}
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
      {/* token row */}
      <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
        {["#111","#3333ee","#7a6fff","#ebebeb","#fff"].map((c,i) => (
          <div key={c} style={{width:"20px",height:"20px",borderRadius:"50%",background:c,border:c==="#fff"?"1px solid #e8e8e8":"none",flexShrink:0}} />
        ))}
        <span style={{fontSize:"7px",color:"#ccc",fontFamily:"'DM Mono',monospace",marginLeft:"4px"}}>tokens</span>
      </div>
      {/* component chips */}
      <div style={{display:"flex",flexWrap:"wrap" as const,gap:"5px",flex:1,alignContent:"flex-start" as const}}>
        {COMPONENTS.map((c,i) => (
          <div key={c} style={{background:i===active?"#3333ee":"transparent",border:`1px solid ${i===active?"#3333ee":"#e8e8e8"}`,borderRadius:"4px",padding:"5px 10px",fontSize:"9px",color:i===active?"#fff":"#bbb",transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",fontFamily:"'DM Mono',monospace"}}>{c}</div>
        ))}
      </div>
      {/* atomic chain */}
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
      {/* live preview */}
      <div style={{background:cur.bg,border:"1px solid #e8e8e8",borderRadius:"6px",padding:"16px",display:"flex",flexDirection:"column",gap:"4px",flex:1,justifyContent:"center",transition:"background 0.5s"}}>
        <span style={{color:cur.fg,fontSize:"14px",fontWeight:700,letterSpacing:"-0.02em",transition:"color 0.5s"}}>{cur.label}</span>
        <span style={{color:cur.fg,fontSize:"9px",opacity:0.65,fontFamily:"'DM Mono',monospace",transition:"color 0.5s"}}>The quick brown fox jumps</span>
      </div>
      {/* ratio + badge */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:"4px"}}>
          <span style={{fontSize:"24px",fontWeight:700,color:"#111",fontFamily:"'DM Mono',monospace"}}>{cur.ratio}</span>
          <span style={{fontSize:"9px",color:"#bbb",fontFamily:"'DM Mono',monospace"}}> : 1</span>
        </div>
        <div style={{background:isAAA?"#3333ee":"transparent",border:`1px solid ${isAAA?"#3333ee":"#e8e8e8"}`,borderRadius:"4px",padding:"3px 10px",fontSize:"8px",color:isAAA?"#fff":"#bbb",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>{cur.level}</div>
      </div>
      {/* bar */}
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
      {/* tree */}
      <div style={{display:"flex",flexDirection:"column",gap:"2px",flex:1}}>
        {NODES.map((n,i) => (
          <div key={n.label} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 8px",paddingLeft:`${8+n.depth*14}px`,borderRadius:"4px",background:i===focused?"rgba(51,51,238,0.04)":"transparent",border:`1px solid ${i===focused?"rgba(51,51,238,0.2)":"transparent"}`,transition:"all 0.3s"}}>
            {n.depth>0 && <div style={{width:"8px",height:"1px",background:"#e8e8e8",flexShrink:0}} />}
            <span style={{fontSize:"9px",color:i===focused?"#3333ee":"#bbb",transition:"color 0.3s",fontWeight:i===focused?600:400}}>{n.label}</span>
            {i===focused && <span style={{fontSize:"7px",color:"#ccc",marginLeft:"auto"}}>{n.aria}</span>}
          </div>
        ))}
      </div>
      {/* sr output */}
      <div style={{background:"rgba(51,51,238,0.04)",border:"1px solid rgba(51,51,238,0.15)",borderRadius:"6px",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"3px"}}>
        <span style={{fontSize:"7px",color:"#3333ee",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"2px"}}>Reading aloud</span>
        <span style={{fontSize:"10px",color:"#111",fontWeight:600}}>{cur.label}</span>
        <span style={{fontSize:"7.5px",color:"#bbb"}}>{cur.aria}</span>
      </div>
    </div>
  );
};

// ─── GalleryPage ──────────────────────────────────────────────────────────────

interface SketchCardProps { title:string; subtitle:string; height:number; children:React.ReactNode; index:number; }
const SketchCard: FC<SketchCardProps> = ({ title, subtitle, height, children, index }) => (
  <div style={{opacity:0,animation:"fadeUp 0.6s ease forwards",animationDelay:`${index*0.12}s`}}>
    <div style={{width:"100%",height,borderRadius:"10px",overflow:"hidden",background:"#f5f3f0",marginBottom:"12px",position:"relative",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>{children}</div>
    <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#999",letterSpacing:"0.01em",marginBottom:"3px"}}>{title}</p>
    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"12px",color:"#bbb",fontWeight:300}}>{subtitle}</p>
  </div>
);

const SectionLabel: FC<{label:string; index:number}> = ({ label, index }) => (
  <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"32px",opacity:0,animation:"fadeIn 0.5s ease forwards",animationDelay:`${index*0.08}s`}}>{label}</p>
);

const GalleryPage: FC = () => (
  <div style={{opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards"}}>

    {/* ── 1. Generative Motion Graphic ── */}
    <SectionLabel label="01 · Generative Motion Graphic" index={0} />
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"24px",marginBottom:"24px",alignItems:"start"}}>
      <SketchCard title="flow field" subtitle="particles following a noise vector field" height={300} index={0}><FlowField /></SketchCard>
      <SketchCard title="orbit rings" subtitle="concentric motion, alternating directions" height={300} index={1}><OrbitRings /></SketchCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="lissajous web" subtitle="layered parametric curves in slow drift" height={280} index={2}><LissajousWeb /></SketchCard>
      <SketchCard title="dot grid" subtitle="noise-driven breathing grid" height={280} index={3}><DotGrid /></SketchCard>
    </div>

    {/* ── 2. Design Process ── */}
    <SectionLabel label="02 · Design Process" index={1} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="design thinking" subtitle="5-stage human-centered design framework" height={280} index={4}><DesignThinkingSketch /></SketchCard>
      <SketchCard title="user research" subtitle="interviews · surveys · key insights" height={280} index={5}><UserResearchSketch /></SketchCard>
      <SketchCard title="agile · scrum · kanban" subtitle="sprint planning & iterative delivery" height={280} index={6}><KanbanSketch /></SketchCard>
    </div>

    {/* ── 3. Design Tools ── */}
    <SectionLabel label="03 · Design Tools" index={2} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",marginBottom:"64px",alignItems:"start"}}>
      <SketchCard title="figma" subtitle="layers · inspect · component tokens" height={280} index={7}><FigmaSketch /></SketchCard>
      <SketchCard title="design system" subtitle="atomic design · tokens · component library" height={280} index={8}><DesignSystemSketch /></SketchCard>
      <SketchCard title="prototyping" subtitle="user flows · interaction design · handoff" height={280} index={9}><PrototypingSketch /></SketchCard>
    </div>

    {/* ── 4. Accessibility ── */}
    <SectionLabel label="04 · Accessibility" index={3} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",marginBottom:"32px",alignItems:"start"}}>
      <SketchCard title="wcag compliance" subtitle="AA / AAA audit · focus · keyboard nav" height={280} index={10}><WCAGSketch /></SketchCard>
      <SketchCard title="colour contrast" subtitle="WCAG contrast ratio · black · white · purple" height={280} index={11}><ColorContrastSketch /></SketchCard>
      <SketchCard title="screen reader" subtitle="ARIA roles · semantic HTML · a11y tree" height={280} index={12}><ScreenReaderSketch /></SketchCard>
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
    const ctx = canvas.getContext("2d")!;
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
    const ctx=canvas.getContext("2d")!;ctx.scale(dpr,dpr);
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

        {/* ── eBay: Apple-style white → rose-pink → periwinkle gradient with grain ── */}
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
          // ── all other videos: fill the box edge-to-edge ──
          <video ref={videoRef} src={project.video} muted loop playsInline autoPlay
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />

        ) : project.image ? (
          <img src={project.image} alt={project.title??project.company??""} style={imgStyle} />
        ) : null}

        {project.id !== 2 && project.link && <div style={overlayStyle} />}

        {/* pill tag */}
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
    <div className="project-card" style={cardStyle} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>{inner}</div>
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

const PlayNode: FC<PlayNodeProps> = ({ pos, drag, width=300, label, icon, accent=false, delay=0, children }) => (
  <div onMouseDown={drag} style={{ position:"absolute", left:pos.x, top:pos.y, width, background:"rgba(255,255,255,0.72)", border:"1px solid rgba(255,255,255,0.9)", borderRadius:18, boxShadow:accent?"0 0 0 1px rgba(61,127,255,0.2),0 8px 40px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.95)":"0 8px 40px rgba(0,0,0,0.10),inset 0 1px 0 rgba(255,255,255,0.95)", backdropFilter:"blur(24px) saturate(1.8)", WebkitBackdropFilter:"blur(24px) saturate(1.8)", cursor:"grab", userSelect:"none", zIndex:10, overflow:"hidden", animation:`playNodeIn 0.5s ${delay}s cubic-bezier(.16,1,.3,1) both` }}>
  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
    <span style={{ fontSize:11, color:accent?"#3d7fff":"#aaa" }}>{icon}</span>
    <span style={{ fontSize:10, fontWeight:600, color:accent?"#3d7fff":"#999", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}>{label}</span>
    <div style={{ marginLeft:"auto", display:"flex", gap:5 }}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(0,0,0,0.08)" }} />
      <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(192,57,43,0.25)" }} />
    </div>
  </div>
  {children}
</div>
);

const PlayWire: FC<{ x1:number; y1:number; x2:number; y2:number }> = ({ x1, y1, x2, y2 }) => {
  const cx = (x1+x2)/2;
  return <path d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`} stroke="rgba(100,140,255,0.3)" strokeWidth={1.2} fill="none" strokeDasharray="4 4" />;
};

const PlayPage: FC = () => {
  const [palettePos, paletteDrag] = usePlayDrag({ x:30,  y:20  });
  const [moodPos,    moodDrag]    = usePlayDrag({ x:340, y:20  });
  const [readPos,    readDrag]    = usePlayDrag({ x:640, y:20  });
  const [quotePos,   quoteDrag]   = usePlayDrag({ x:30,  y:300 });
  const [pastaPos,   pastaDrag]   = usePlayDrag({ x:380, y:280 });

  const [paletteIdx, setPaletteIdx] = useState(0);
  const [moodIdx,    setMoodIdx]    = useState(0);
  const [readIdx,    setReadIdx]    = useState(0);
  const [pastaIdx,   setPastaIdx]   = useState(0);

  const PALETTES = [
    { name:"Sunset Drift",  emoji:"🌅", colors:["#f97316","#fb923c","#fde68a","#fef3c7"], bg:"linear-gradient(135deg,#fff7ed,#fef3c7)" },
    { name:"Ocean Depth",   emoji:"🌊", colors:["#0ea5e9","#38bdf8","#7dd3fc","#e0f2fe"], bg:"linear-gradient(135deg,#f0f9ff,#e0f2fe)" },
    { name:"Forest Calm",   emoji:"🌿", colors:["#16a34a","#4ade80","#86efac","#dcfce7"], bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)" },
    { name:"Midnight",      emoji:"🌙", colors:["#6366f1","#818cf8","#a5b4fc","#e0e7ff"], bg:"linear-gradient(135deg,#eef2ff,#e0e7ff)" },
    { name:"Rose Blush",    emoji:"🌸", colors:["#f43f5e","#fb7185","#fda4af","#ffe4e6"], bg:"linear-gradient(135deg,#fff1f2,#ffe4e6)" },
  ];
  const MOODS = [
    { name:"Deep Focus",    emoji:"🎧", sub:"Aphex Twin · Brian Eno",     color:"#6366f1", bg:"linear-gradient(135deg,#eef2ff,#e0e7ff)" },
    { name:"Late Night",    emoji:"🌃", sub:"Chet Baker · Miles Davis",    color:"#0ea5e9", bg:"linear-gradient(135deg,#f0f9ff,#dbeafe)" },
    { name:"Morning Flow",  emoji:"☀️", sub:"Nils Frahm · Ólafur Arnalds", color:"#f59e0b", bg:"linear-gradient(135deg,#fffbeb,#fef3c7)" },
    { name:"Creative High", emoji:"⚡", sub:"Jungle · Tame Impala",        color:"#ec4899", bg:"linear-gradient(135deg,#fdf2f8,#fce7f3)" },
  ];
  const READS = [
    { name:"The Design of Everyday Things", emoji:"📐", sub:"Don Norman",   color:"#0ea5e9", bg:"linear-gradient(135deg,#f0f9ff,#dbeafe)" },
    { name:"Thinking Fast & Slow",          emoji:"🧠", sub:"Kahneman",     color:"#8b5cf6", bg:"linear-gradient(135deg,#f5f3ff,#ede9fe)" },
    { name:"Ways of Seeing",                emoji:"👁",  sub:"John Berger", color:"#10b981", bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)" },
    { name:"The Pale King",                 emoji:"📖", sub:"D.F. Wallace", color:"#f59e0b", bg:"linear-gradient(135deg,#fffbeb,#fef3c7)" },
  ];
  const PASTAS = [
    { name:"Cacio e Pepe",  emoji:"🍝", color:"#c8943a", bg:"linear-gradient(135deg,#fffbeb,#fef3c7)" },
    { name:"Lasagna",       emoji:"🫕", color:"#b8402a", bg:"linear-gradient(135deg,#fff1f2,#ffe4e6)" },
    { name:"Pesto Fusilli", emoji:"🌿", color:"#3a8840", bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)" },
    { name:"Penne Arrabb.", emoji:"🌶️", color:"#c03020", bg:"linear-gradient(135deg,#fff7ed,#fee2e2)" },
  ];

  const curPalette=PALETTES[paletteIdx], curMood=MOODS[moodIdx], curRead=READS[readIdx], curPasta=PASTAS[pastaIdx];

  const Dots=({len,idx,color,set}:{len:number;idx:number;color:string;set:(i:number)=>void})=>(
    <div style={{display:"flex",justifyContent:"center",gap:5,padding:"8px 14px",borderTop:"1px solid rgba(0,0,0,0.06)"}}>
      {Array.from({length:len},(_,i)=>(
        <div key={i} onClick={()=>set(i)} style={{width:i===idx?16:6,height:6,borderRadius:3,background:i===idx?color:"rgba(0,0,0,0.12)",transition:"width 0.3s,background 0.3s"}} />
      ))}
    </div>
  );

  return (
    <div style={{position:"relative",width:"100%",height:"calc(100vh - 160px)",overflow:"hidden",background:"linear-gradient(160deg,#f8f9ff 0%,#f0f4ff 50%,#f8f0ff 100%)",borderRadius:16,border:"1px solid rgba(200,210,255,0.4)"}}>
      <style>{`@keyframes playNodeIn{from{opacity:0;transform:translateY(12px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(100,120,255,0.08) 1px,transparent 1px)",backgroundSize:"24px 24px",pointerEvents:"none"}} />
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:5}}>
        <PlayWire x1={palettePos.x+280} y1={palettePos.y+110} x2={moodPos.x}      y2={moodPos.y+110} />
        <PlayWire x1={moodPos.x+290}    y1={moodPos.y+110}    x2={readPos.x}      y2={readPos.y+110} />
        <PlayWire x1={palettePos.x+140} y1={palettePos.y+220} x2={quotePos.x+160} y2={quotePos.y} />
        <PlayWire x1={moodPos.x+145}    y1={moodPos.y+220}    x2={pastaPos.x+140} y2={pastaPos.y} />
      </svg>

      <PlayNode pos={palettePos} drag={paletteDrag} width={280} label="Colour Palette" icon="◐" accent delay={0}>
        <div style={{padding:"18px 16px",background:curPalette.bg,transition:"background 0.5s",cursor:"pointer"}} onClick={()=>setPaletteIdx(i=>(i+1)%PALETTES.length)}>
          <div style={{fontSize:36,marginBottom:10}}>{curPalette.emoji}</div>
          <div style={{fontSize:14,fontWeight:600,color:"#111",letterSpacing:"-0.01em",marginBottom:10}}>{curPalette.name}</div>
          <div style={{display:"flex",gap:6}}>{curPalette.colors.map((c,i)=><div key={i} style={{flex:1,height:28,borderRadius:6,background:c,transition:"background 0.4s",boxShadow:"0 1px 4px rgba(0,0,0,0.1)"}} />)}</div>
          <div style={{fontSize:9,color:"rgba(0,0,0,0.3)",marginTop:8,fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>tap to change →</div>
        </div>
        <Dots len={PALETTES.length} idx={paletteIdx} color={curPalette.colors[0]} set={setPaletteIdx} />
      </PlayNode>

      <PlayNode pos={moodPos} drag={moodDrag} width={290} label="Music Mood" icon="♪" delay={0.08}>
        <div style={{padding:"18px 16px",background:curMood.bg,transition:"background 0.5s",cursor:"pointer",minHeight:120}} onClick={()=>setMoodIdx(i=>(i+1)%MOODS.length)}>
          <div style={{fontSize:36,marginBottom:8}}>{curMood.emoji}</div>
          <div style={{fontSize:14,fontWeight:600,color:curMood.color,letterSpacing:"-0.01em",marginBottom:4,transition:"color 0.3s"}}>{curMood.name}</div>
          <div style={{fontSize:10,color:"rgba(0,0,0,0.4)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.03em"}}>{curMood.sub}</div>
          <div style={{fontSize:9,color:"rgba(0,0,0,0.25)",marginTop:10,fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>tap to change →</div>
        </div>
        <Dots len={MOODS.length} idx={moodIdx} color={curMood.color} set={setMoodIdx} />
      </PlayNode>

      <PlayNode pos={readPos} drag={readDrag} width={270} label="Reading Stack" icon="◎" delay={0.16}>
        <div style={{padding:"18px 16px",background:curRead.bg,transition:"background 0.5s",cursor:"pointer",minHeight:120}} onClick={()=>setReadIdx(i=>(i+1)%READS.length)}>
          <div style={{fontSize:36,marginBottom:8}}>{curRead.emoji}</div>
          <div style={{fontSize:13,fontWeight:600,color:curRead.color,letterSpacing:"-0.01em",lineHeight:1.3,marginBottom:4,transition:"color 0.3s"}}>{curRead.name}</div>
          <div style={{fontSize:10,color:"rgba(0,0,0,0.4)",fontFamily:"'DM Mono',monospace"}}>{curRead.sub}</div>
          <div style={{fontSize:9,color:"rgba(0,0,0,0.25)",marginTop:10,fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>tap to change →</div>
        </div>
        <Dots len={READS.length} idx={readIdx} color={curRead.color} set={setReadIdx} />
      </PlayNode>

      <PlayNode pos={quotePos} drag={quoteDrag} width={320} label="Writing" icon="✎" delay={0.24}>
        <div style={{padding:"18px 20px"}}>
          <div style={{fontSize:13,fontStyle:"italic",color:"#555",lineHeight:1.85,paddingLeft:14,borderLeft:"2px solid rgba(100,140,255,0.3)",fontFamily:"'DM Serif Display',Georgia,serif",marginBottom:14}}>
            "I write literary fiction — stories about how people make sense of uncertainty, how trust forms in the dark."
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap" as const}}>
            {["Literary Fiction","Narrative","Trust"].map(t=>(
              <span key={t} style={{background:"rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.08)",borderRadius:4,padding:"2px 8px",fontSize:10,color:"#888",fontFamily:"'DM Mono',monospace"}}>{t}</span>
            ))}
          </div>
        </div>
      </PlayNode>

      <PlayNode pos={pastaPos} drag={pastaDrag} width={260} label="Pasta Lover" icon="🍝" delay={0.32}>
        <div style={{padding:"18px 16px",background:curPasta.bg,minHeight:120,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,transition:"background 0.5s",cursor:"pointer"}} onClick={()=>setPastaIdx(i=>(i+1)%PASTAS.length)}>
          <span style={{fontSize:48,lineHeight:1}}>{curPasta.emoji}</span>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:600,color:curPasta.color,letterSpacing:"-0.01em",transition:"color 0.3s"}}>{curPasta.name}</div>
            <div style={{fontSize:9,color:curPasta.color+"88",marginTop:3,fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}>tap to change →</div>
          </div>
        </div>
        <Dots len={PASTAS.length} idx={pastaIdx} color={curPasta.color} set={setPastaIdx} />
      </PlayNode>

      <div style={{position:"absolute",bottom:14,left:16,fontFamily:"'DM Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.2)",letterSpacing:"0.12em",textTransform:"uppercase",userSelect:"none",pointerEvents:"none"}}>drag to explore</div>
      <div style={{position:"absolute",bottom:14,right:16,fontFamily:"'DM Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.2)",letterSpacing:"0.08em",userSelect:"none",pointerEvents:"none"}}>5 nodes · 5 connections</div>
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
            <div style={{opacity:0,animation:"fadeIn 0.5s ease 0.1s forwards",maxWidth:"560px",textAlign:"left"}}>
              <div style={{marginBottom:"48px"}}>
                <p style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"20px",textAlign:"left"}}>more about me</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.65,fontWeight:300,marginBottom:"16px",textAlign:"left"}}>Hello! 👋🏻 I'm Miao Lan, a product designer, builder, and design strategist with over three years of experience, working on a variety of software projects.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.65,fontWeight:300,marginBottom:"16px",textAlign:"left"}}>I don't have a clear label for what kind of designer I am. I enjoy building. I enjoy experimenting. I enjoy thinking. What I have is a set of questions I keep returning to. A deep suspicion. A stubborn belief that the emotional layer of a product carries weight.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.65,fontWeight:300,textAlign:"left"}}>I've always been more interested in the <em>why</em> behind things than the <em>what</em>. Why does someone hesitate before trusting an AI suggestion? Why does one interaction feel collaborative while another feels like a form to fill?</p>
              </div>
              <div style={{marginBottom:"48px"}}>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:"20px",fontWeight:600,color:"#111",letterSpacing:"-0.02em",marginBottom:"14px",textAlign:"left"}}>The Problem With Knowing What You're Designing</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.65,fontWeight:300,marginBottom:"16px",textAlign:"left"}}>There's a version of design work that feels very clean. Someone hands you a brief. You understand the user, you know the goal, you make the thing. It's satisfying in the way that solving a math problem is satisfying.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.65,fontWeight:300,textAlign:"left"}}>The best design problems I've worked on are the ones that, at the start, I couldn't fully articulate. Where the "user problem" on the surface is really just a symptom of something else happening underneath.</p>
              </div>
              <div style={{marginBottom:"48px"}}>
                <p style={{fontFamily:"'Inter',sans-serif",fontSize:"20px",fontWeight:600,color:"#111",letterSpacing:"-0.02em",marginBottom:"14px",textAlign:"left"}}>AI in Design</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.65,fontWeight:300,marginBottom:"16px",textAlign:"left"}}>Designing for agentic systems means thinking about how autonomy is shared. Philosophers call this <em>epistemic dependence</em>: most of what we know, we know because we trust a chain of other knowers. AI introduces a new link in that chain.</p>
                <p style={{fontSize:"16px",color:"#444",lineHeight:1.65,fontWeight:300,textAlign:"left"}}>This is the design problem that excites me most. What people believe knowledge is. How people think, act, and reason with AI at scale.</p>
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