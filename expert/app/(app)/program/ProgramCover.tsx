export function ProgramCover({ id }: { id: string }) {
  const covers: Record<string, React.ReactNode> = {

    // ─── ORIGINAL PROGRAMS ────────────────────────────────────────────────────

    "prog-001": ( // Literasi Digital
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p001" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d1b4b"/><stop offset="100%" stopColor="#1565c0"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p001)"/>
        {/* grid */}
        {[0,1,2,3,4,5,6,7,8,9].map(c=>[0,1,2,3].map(r=><circle key={`${c}-${r}`} cx={c*44+10} cy={r*36+6} r="1.2" fill="#fff" opacity="0.08"/>))}
        {/* circuit traces */}
        <polyline points="20,95 20,55 90,55 90,35 180,35" stroke="#4dd0e1" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <polyline points="140,110 140,75 220,75 220,55 340,55" stroke="#80deea" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <circle cx="90" cy="55" r="3.5" fill="#4dd0e1" opacity="0.9"/>
        <circle cx="220" cy="75" r="3.5" fill="#80deea" opacity="0.8"/>
        <circle cx="180" cy="35" r="2.5" fill="#e1f5fe" opacity="0.9"/>
        {/* laptop */}
        <rect x="258" y="28" width="96" height="62" rx="6" fill="none" stroke="#90caf9" strokeWidth="2" opacity="0.6"/>
        <rect x="263" y="33" width="86" height="48" rx="3" fill="#0d2a5e" opacity="0.85"/>
        <rect x="268" y="38" width="28" height="2.5" rx="1" fill="#4dd0e1" opacity="0.8"/>
        <rect x="268" y="44" width="40" height="2.5" rx="1" fill="#4dd0e1" opacity="0.6"/>
        <rect x="268" y="50" width="20" height="2.5" rx="1" fill="#4dd0e1" opacity="0.5"/>
        <rect x="268" y="56" width="34" height="2.5" rx="1" fill="#81d4fa" opacity="0.4"/>
        <rect x="268" y="62" width="24" height="2.5" rx="1" fill="#81d4fa" opacity="0.35"/>
        <rect x="316" y="38" width="28" height="34" rx="2" fill="#1565c0" opacity="0.6"/>
        <rect x="320" y="42" width="20" height="2" rx="1" fill="#b3e5fc" opacity="0.5"/>
        <rect x="320" y="47" width="14" height="2" rx="1" fill="#b3e5fc" opacity="0.4"/>
        <rect x="248" y="90" width="116" height="6" rx="3" fill="none" stroke="#90caf9" strokeWidth="1.5" opacity="0.45"/>
        {/* wifi */}
        <path d="M52,72 a25,25 0 0,1 36,0" stroke="#e1f5fe" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round"/>
        <path d="M58,80 a15,15 0 0,1 24,0" stroke="#e1f5fe" strokeWidth="2" fill="none" opacity="0.45" strokeLinecap="round"/>
        <circle cx="70" cy="90" r="3" fill="#e1f5fe" opacity="0.6"/>
      </svg>
    ),

    "prog-002": ( // Kepemimpinan Remaja
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p002" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#b71c1c"/><stop offset="100%" stopColor="#f57f17"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p002)"/>
        {/* sun rays */}
        {Array.from({length:16},(_,i)=>{const a=(i*22.5*Math.PI)/180;const r1=52,r2=35;return<line key={i} x1={80+Math.cos(a)*r2} y1={60+Math.sin(a)*r2} x2={80+Math.cos(a)*r1} y2={60+Math.sin(a)*r1} stroke="#fff3e0" strokeWidth={i%2===0?1.5:1} opacity={i%2===0?0.35:0.2}/>;})}
        <circle cx="80" cy="60" r="22" fill="#ff8f00" opacity="0.3"/>
        <circle cx="80" cy="60" r="14" fill="#ffca28" opacity="0.4"/>
        {/* mountain peaks */}
        <polyline points="170,115 230,40 290,115" fill="none" stroke="#fff" strokeWidth="2" opacity="0.25"/>
        <polyline points="200,115 260,55 320,115" fill="none" stroke="#fff" strokeWidth="2" opacity="0.18"/>
        <polyline points="230,115 290,65 370,115" fill="none" stroke="#fff" strokeWidth="2" opacity="0.12"/>
        {/* rising arrow */}
        <line x1="290" y1="95" x2="350" y2="28" stroke="#fff3e0" strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
        <polyline points="335,22 350,28 344,43" fill="none" stroke="#fff3e0" strokeWidth="3" opacity="0.7" strokeLinecap="round" strokeLinejoin="round"/>
        {/* star */}
        <polygon points="80,44 84,55 96,55 87,62 90,73 80,66 70,73 73,62 64,55 76,55" fill="#fff" opacity="0.6"/>
      </svg>
    ),

    "prog-003": ( // Public Speaking
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p003" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0035"/><stop offset="100%" stopColor="#6a1b9a"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p003)"/>
        {/* audience rows */}
        {[0,1,2].map(r=>[0,1,2,3,4,5].map(c=><circle key={`${r}-${c}`} cx={c*28+40} cy={r*18+80} r="5" fill="#ce93d8" opacity={0.12+r*0.06}/>))}
        {/* stage light cone */}
        <path d="M200,0 L140,120 L260,120 Z" fill="#f3e5f5" opacity="0.07"/>
        {/* microphone */}
        <rect x="290" y="20" width="28" height="44" rx="14" fill="none" stroke="#e1bee7" strokeWidth="2.5" opacity="0.8"/>
        <rect x="295" y="25" width="18" height="34" rx="9" fill="#9c27b0" opacity="0.35"/>
        <line x1="304" y1="64" x2="304" y2="82" stroke="#e1bee7" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
        <path d="M293,82 q11,8 22,0" fill="none" stroke="#e1bee7" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
        <line x1="304" y1="90" x2="304" y2="96" stroke="#e1bee7" strokeWidth="2" opacity="0.6"/>
        {/* sound waves */}
        <path d="M327,30 q18,12 0,24" fill="none" stroke="#ce93d8" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
        <path d="M335,23 q30,19 0,38" fill="none" stroke="#ce93d8" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        <path d="M344,17 q42,25 0,50" fill="none" stroke="#ce93d8" strokeWidth="1" opacity="0.2" strokeLinecap="round"/>
        {/* spotlight circle */}
        <ellipse cx="200" cy="112" rx="55" ry="10" fill="#f3e5f5" opacity="0.1"/>
        {/* text lines (speech) */}
        <rect x="50" y="28" width="60" height="3" rx="1.5" fill="#f3e5f5" opacity="0.3"/>
        <rect x="50" y="36" width="44" height="3" rx="1.5" fill="#f3e5f5" opacity="0.2"/>
        <rect x="50" y="44" width="52" height="3" rx="1.5" fill="#f3e5f5" opacity="0.25"/>
      </svg>
    ),

    "prog-004": ( // Matematika Lanjut — Kalkulus
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p004" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00251a"/><stop offset="100%" stopColor="#00695c"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p004)"/>
        {/* grid */}
        {[0,1,2,3,4,5,6,7,8].map(i=><line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="120" stroke="#fff" strokeWidth="0.5" opacity="0.06"/>)}
        {[0,1,2,3].map(i=><line key={`h${i}`} x1="0" y1={i*40} x2="400" y2={i*40} stroke="#fff" strokeWidth="0.5" opacity="0.06"/>)}
        {/* axes */}
        <line x1="30" y1="95" x2="220" y2="95" stroke="#80cbc4" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
        <line x1="80" y1="15" x2="80" y2="105" stroke="#80cbc4" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
        {/* sine curve */}
        <path d="M30,95 Q55,40 80,95 Q105,150 130,95 Q155,40 180,95 Q205,150 220,95" fill="none" stroke="#4db6ac" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
        {/* area fill */}
        <path d="M80,95 Q105,150 130,95 Q155,40 180,95 L180,95 L80,95 Z" fill="#4db6ac" opacity="0.1"/>
        {/* integral symbol */}
        <text x="255" y="85" fontSize="72" fontFamily="serif" fill="#b2dfdb" opacity="0.35" fontWeight="300">∫</text>
        {/* formula */}
        <text x="305" y="55" fontSize="13" fontFamily="serif" fill="#e0f2f1" opacity="0.55" fontStyle="italic">f(x)dx</text>
        <text x="298" y="40" fontSize="10" fontFamily="serif" fill="#80cbc4" opacity="0.5">b</text>
        <text x="298" y="75" fontSize="10" fontFamily="serif" fill="#80cbc4" opacity="0.5">a</text>
        {/* derivative tangent */}
        <line x1="105" y1="65" x2="155" y2="120" stroke="#a5d6a7" strokeWidth="1.5" opacity="0.45" strokeLinecap="round"/>
        <circle cx="130" cy="95" r="3" fill="#a5d6a7" opacity="0.7"/>
      </svg>
    ),

    "prog-005": ( // Menulis Kreatif
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p005" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4a0020"/><stop offset="100%" stopColor="#c62828"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p005)"/>
        {/* open book */}
        <path d="M140,25 Q155,20 170,25 L170,100 Q155,95 140,100 Z" fill="#ffcdd2" opacity="0.15"/>
        <path d="M170,25 Q185,20 200,25 L200,100 Q185,95 170,100 Z" fill="#ffcdd2" opacity="0.12"/>
        <line x1="170" y1="25" x2="170" y2="100" stroke="#ef9a9a" strokeWidth="1" opacity="0.5"/>
        {/* page lines */}
        {[35,44,53,62,71,80,89].map(y=><line key={y} x1="145" y1={y} x2="166" y2={y} stroke="#fff" strokeWidth="1" opacity="0.18"/>)}
        {[35,44,53,62,71,80,89].map(y=><line key={y+1000} x1="174" y1={y} x2="195" y2={y} stroke="#fff" strokeWidth="1" opacity="0.18"/>)}
        {/* quill */}
        <path d="M260,10 Q310,30 290,85 Q280,90 275,88 Q285,50 270,30 Q255,50 260,10 Z" fill="#fff9c4" opacity="0.35"/>
        <path d="M275,88 L270,105" stroke="#ef9a9a" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
        {/* sparkles */}
        {[[60,30],[80,75],[100,45],[50,90],[320,35],[350,70]].map(([x,y],i)=>(
          <g key={i} opacity="0.4">
            <line x1={x} y1={y-7} x2={x} y2={y+7} stroke="#fff" strokeWidth="1.2"/>
            <line x1={x-7} y1={y} x2={x+7} y2={y} stroke="#fff" strokeWidth="1.2"/>
          </g>
        ))}
        {/* ink */}
        <ellipse cx="280" cy="100" rx="12" ry="5" fill="#ef9a9a" opacity="0.2"/>
      </svg>
    ),

    "prog-006": ( // Desain Grafis
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p006" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1a237e"/><stop offset="50%" stopColor="#6a1b9a"/><stop offset="100%" stopColor="#880e4f"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p006)"/>
        {/* overlapping circles (color theory) */}
        <circle cx="100" cy="50" r="40" fill="#f44336" opacity="0.25"/>
        <circle cx="130" cy="80" r="40" fill="#2196f3" opacity="0.25"/>
        <circle cx="70" cy="80" r="40" fill="#ffeb3b" opacity="0.25"/>
        {/* bezier path */}
        <path d="M220,100 C240,20 320,20 360,80" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
        <circle cx="220" cy="100" r="4" fill="#fff" opacity="0.6"/>
        <circle cx="360" cy="80" r="4" fill="#fff" opacity="0.6"/>
        <line x1="220" y1="100" x2="240" y2="20" stroke="#fff" strokeWidth="1" opacity="0.25" strokeDasharray="3,3"/>
        <line x1="360" y1="80" x2="320" y2="20" stroke="#fff" strokeWidth="1" opacity="0.25" strokeDasharray="3,3"/>
        <circle cx="240" cy="20" r="3" fill="#e040fb" opacity="0.7"/>
        <circle cx="320" cy="20" r="3" fill="#e040fb" opacity="0.7"/>
        {/* color swatches */}
        {["#f44336","#ff9800","#ffeb3b","#4caf50","#2196f3","#9c27b0"].map((c,i)=>(
          <circle key={i} cx={240+i*18} cy={108} r="6" fill={c} opacity="0.55"/>
        ))}
      </svg>
    ),

    "prog-007": ( // IELTS Prep
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p007" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d1b35"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p007)"/>
        {/* book */}
        <rect x="40" y="25" width="100" height="76" rx="4" fill="none" stroke="#90caf9" strokeWidth="2" opacity="0.5"/>
        <rect x="44" y="29" width="92" height="68" rx="2" fill="#0d2a60" opacity="0.7"/>
        <line x1="90" y1="25" x2="90" y2="101" stroke="#90caf9" strokeWidth="1" opacity="0.4"/>
        {[38,47,56,65,74,83].map(y=><line key={y} x1="50" y1={y} x2="84" y2={y} stroke="#bbdefb" strokeWidth="1" opacity="0.2"/>)}
        {[38,47,56,65,74,83].map(y=><line key={y+500} x1="96" y1={y} x2="126" y2={y} stroke="#bbdefb" strokeWidth="1" opacity="0.2"/>)}
        {/* letter tiles */}
        {[["I","#2196f3"],["E","#03a9f4"],["L","#00bcd4"],["T","#1565c0"],["S","#283593"]].map(([l,c],i)=>(
          <g key={l}>
            <rect x={200+i*36} y="38" width="28" height="32" rx="4" fill={c as string} opacity="0.55"/>
            <text x={200+i*36+14} y="60" textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="sans-serif" fill="#fff" opacity="0.9">{l}</text>
          </g>
        ))}
        {/* graduation cap */}
        <polygon points="290,88 330,75 370,88 330,101" fill="#bbdefb" opacity="0.3"/>
        <rect x="328" y="75" width="4" height="18" fill="#90caf9" opacity="0.4"/>
        <line x1="370" y1="88" x2="370" y2="100" stroke="#90caf9" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
      </svg>
    ),

    "prog-008": ( // Kewirausahaan Sosial
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p008" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1b3a1b"/><stop offset="100%" stopColor="#388e3c"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p008)"/>
        {/* bar chart */}
        {[[60,80],[75,55],[90,35],[105,20],[120,10]].map(([x,h],i)=>(
          <rect key={i} x={x+150} y={100-h} width="12" height={h} rx="2" fill="#a5d6a7" opacity={0.3+i*0.1}/>
        ))}
        {/* trend line */}
        <polyline points="206,70 221,53 236,33 251,20 266,12" fill="none" stroke="#69f0ae" strokeWidth="2" opacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
        {/* lightbulb */}
        <path d="M80,22 a28,28 0 0,1 28,28 q0,12-8,18 l0,8 l-20,0 l0-8 q-8-6-8-18 a28,28 0 0,1 0,0" fill="none" stroke="#c8e6c9" strokeWidth="2" opacity="0.5"/>
        <circle cx="94" cy="50" r="22" fill="none" stroke="#c8e6c9" strokeWidth="2" opacity="0.4"/>
        <ellipse cx="94" cy="62" rx="10" ry="5" fill="#a5d6a7" opacity="0.3"/>
        <line x1="94" y1="67" x2="94" y2="78" stroke="#a5d6a7" strokeWidth="2" opacity="0.35"/>
        <line x1="87" y1="78" x2="101" y2="78" stroke="#a5d6a7" strokeWidth="2" opacity="0.35"/>
        <line x1="89" y1="83" x2="99" y2="83" stroke="#a5d6a7" strokeWidth="2" opacity="0.35"/>
        {/* glow */}
        <circle cx="94" cy="45" r="10" fill="#ffee58" opacity="0.15"/>
        {/* handshake hint */}
        <path d="M310,80 q10-15 20-10 q10-15 20-5" fill="none" stroke="#c8e6c9" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      </svg>
    ),

    "prog-009": ( // Python Programming
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p009" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c1c1e"/><stop offset="100%" stopColor="#263238"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p009)"/>
        {/* terminal window */}
        <rect x="30" y="18" width="220" height="88" rx="8" fill="#0d0d0f" opacity="0.85"/>
        <rect x="30" y="18" width="220" height="22" rx="8" fill="#1e1e20" opacity="0.9"/>
        <rect x="30" y="28" width="220" height="10" fill="#1e1e20" opacity="0.9"/>
        <circle cx="46" cy="29" r="4.5" fill="#ff5f57" opacity="0.8"/>
        <circle cx="62" cy="29" r="4.5" fill="#febc2e" opacity="0.8"/>
        <circle cx="78" cy="29" r="4.5" fill="#28c840" opacity="0.8"/>
        {/* code lines */}
        <text x="44" y="58" fontSize="10" fontFamily="monospace" fill="#f92672" opacity="0.85">def</text>
        <text x="65" y="58" fontSize="10" fontFamily="monospace" fill="#a6e22e" opacity="0.85"> main():</text>
        <text x="44" y="72" fontSize="10" fontFamily="monospace" fill="#66d9ef" opacity="0.75">  print</text>
        <text x="86" y="72" fontSize="10" fontFamily="monospace" fill="#e6db74" opacity="0.75">("Hello")</text>
        <text x="44" y="86" fontSize="10" fontFamily="monospace" fill="#66d9ef" opacity="0.55">  return</text>
        <text x="44" y="99" fontSize="10" fontFamily="monospace" fill="#f8f8f2" opacity="0.45">{'>>> '}</text>
        <rect x="60" y="93" width="6" height="10" rx="1" fill="#a6e22e" opacity="0.7"/>
        {/* python snake */}
        <path d="M310,30 q20,0 30,15 q10,15 0,30 q-10,15 -30,15 q-20,0 -20,15 q0,15 20,15" fill="none" stroke="#3670a0" strokeWidth="8" opacity="0.5" strokeLinecap="round"/>
        <path d="M310,30 q20,0 30,15 q10,15 0,30 q-10,15 -30,15 q-20,0 -20,15 q0,15 20,15" fill="none" stroke="#ffd43b" strokeWidth="4" opacity="0.4" strokeLinecap="round"/>
        <circle cx="310" cy="30" r="8" fill="#3670a0" opacity="0.6"/>
        <circle cx="308" cy="27" r="2" fill="#fff" opacity="0.8"/>
      </svg>
    ),

    "prog-010": ( // Mindfulness
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p010" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0050"/><stop offset="100%" stopColor="#4527a0"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p010)"/>
        {/* concentric circles / ripples */}
        {[60,45,30,15].map(r=><circle key={r} cx="90" cy="60" r={r} fill="none" stroke="#b39ddb" strokeWidth="1" opacity={0.08+r*0.003}/>)}
        {/* lotus petals */}
        {Array.from({length:8},(_,i)=>{const a=(i*45*Math.PI)/180;const px=90+Math.cos(a)*20,py=60+Math.sin(a)*20;return<ellipse key={i} cx={px} cy={py} rx="10" ry="6" fill="#e1bee7" opacity="0.2" transform={`rotate(${i*45},${px},${py})`}/>;})}
        <circle cx="90" cy="60" r="8" fill="#ce93d8" opacity="0.4"/>
        {/* breathing waves */}
        {[0,1,2,3].map(i=><path key={i} d={`M${200+i*45},20 q15,20 0,40 q-15,20 0,40 q15,20 0,20`} fill="none" stroke="#b39ddb" strokeWidth="1.2" opacity={0.12+i*0.06} strokeLinecap="round"/>)}
        {/* stars */}
        {[[160,18],[370,25],[340,95],[155,90]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2" fill="#e1bee7" opacity="0.4"/>)}
        <text x="270" y="75" fontSize="40" fontFamily="serif" fill="#e1bee7" opacity="0.12" textAnchor="middle">☯</text>
      </svg>
    ),

    "prog-011": ( // Persiapan SNBT
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p011" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0010"/><stop offset="100%" stopColor="#b71c1c"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p011)"/>
        {/* answer sheet */}
        <rect x="35" y="18" width="80" height="90" rx="4" fill="#c62828" opacity="0.2"/>
        {[0,1,2,3,4,5].map(i=>(
          <g key={i}>
            <circle cx="52" cy={32+i*13} r="4" fill={i<3?"#ef9a9a":"none"} stroke="#ef9a9a" strokeWidth="1.2" opacity="0.55"/>
            <circle cx="65" cy={32+i*13} r="4" fill={i===3?"#ef9a9a":"none"} stroke="#ef9a9a" strokeWidth="1.2" opacity="0.45"/>
            <circle cx="78" cy={32+i*13} r="4" fill="none" stroke="#ef9a9a" strokeWidth="1.2" opacity="0.35"/>
            <circle cx="91" cy={32+i*13} r="4" fill="none" stroke="#ef9a9a" strokeWidth="1.2" opacity="0.35"/>
          </g>
        ))}
        {/* graduation cap */}
        <polygon points="240,45 300,28 360,45 300,62" fill="#ef9a9a" opacity="0.35"/>
        <polygon points="240,45 300,62 300,80 240,63" fill="#c62828" opacity="0.2"/>
        <polygon points="360,45 300,62 300,80 360,63" fill="#e53935" opacity="0.2"/>
        <circle cx="300" cy="45" r="6" fill="#ef9a9a" opacity="0.5"/>
        <line x1="360" y1="45" x2="360" y2="72" stroke="#ef9a9a" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
        <path d="M350,72 q10,10 20,0" fill="none" stroke="#ef9a9a" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
        {/* target */}
        {[30,20,10].map(r=><circle key={r} cx="170" cy="60" r={r} fill="none" stroke="#ffcdd2" strokeWidth="1.5" opacity={0.1+r*0.006}/>)}
        <circle cx="170" cy="60" r="5" fill="#ef9a9a" opacity="0.6"/>
        <text x="300" y="108" fontSize="14" fontFamily="sans-serif" fontWeight="700" fill="#ef9a9a" opacity="0.4" textAnchor="middle">2026</text>
      </svg>
    ),

    "prog-012": ( // Fotografi
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p012" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d0d0d"/><stop offset="100%" stopColor="#37474f"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p012)"/>
        {/* camera body */}
        <rect x="240" y="25" width="130" height="82" rx="10" fill="none" stroke="#90a4ae" strokeWidth="2" opacity="0.6"/>
        <rect x="244" y="29" width="122" height="74" rx="8" fill="#1c2a30" opacity="0.7"/>
        {/* lens */}
        <circle cx="305" cy="66" r="26" fill="none" stroke="#90a4ae" strokeWidth="2" opacity="0.5"/>
        <circle cx="305" cy="66" r="18" fill="none" stroke="#78909c" strokeWidth="1.5" opacity="0.45"/>
        <circle cx="305" cy="66" r="11" fill="#263238" opacity="0.8"/>
        <circle cx="305" cy="66" r="5" fill="#1a2428" opacity="0.9"/>
        {/* aperture blades */}
        {Array.from({length:8},(_,i)=>{const a=(i*45*Math.PI)/180;return<line key={i} x1={305+Math.cos(a)*6} y1={66+Math.sin(a)*6} x2={305+Math.cos(a)*17} y2={66+Math.sin(a)*17} stroke="#90a4ae" strokeWidth="1.5" opacity="0.4"/>;})}
        {/* shutter button */}
        <circle cx="348" cy="36" r="7" fill="#546e7a" opacity="0.6"/>
        {/* film strip */}
        <rect x="30" y="35" width="180" height="50" rx="4" fill="none" stroke="#78909c" strokeWidth="1.5" opacity="0.35"/>
        {[0,1,2,3].map(i=><rect key={i} x={40+i*44} y="42" width="34" height="36" rx="2" fill="#263238" opacity="0.5"/>)}
        {/* bokeh */}
        {[[65,15],[150,105],[200,20],[220,90]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={6+i*2} fill="none" stroke="#90a4ae" strokeWidth="1" opacity={0.15-i*0.02}/>)}
      </svg>
    ),

    "prog-013": ( // Riset Ilmiah
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p013" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00252e"/><stop offset="100%" stopColor="#00838f"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p013)"/>
        {/* atom */}
        <circle cx="80" cy="60" r="8" fill="#80deea" opacity="0.6"/>
        <ellipse cx="80" cy="60" rx="38" ry="16" fill="none" stroke="#4dd0e1" strokeWidth="1.5" opacity="0.5"/>
        <ellipse cx="80" cy="60" rx="38" ry="16" fill="none" stroke="#4dd0e1" strokeWidth="1.5" opacity="0.4" transform="rotate(60,80,60)"/>
        <ellipse cx="80" cy="60" rx="38" ry="16" fill="none" stroke="#4dd0e1" strokeWidth="1.5" opacity="0.35" transform="rotate(120,80,60)"/>
        {/* flask */}
        <path d="M280,20 L280,55 L250,95 L320,95 L290,55 L290,20 Z" fill="none" stroke="#80deea" strokeWidth="2" opacity="0.55"/>
        <path d="M253,88 L317,88 L290,55 L280,55 Z" fill="#00bcd4" opacity="0.15"/>
        <line x1="275" y1="20" x2="295" y2="20" stroke="#80deea" strokeWidth="2.5" opacity="0.6" strokeLinecap="round"/>
        {/* bubbles in flask */}
        <circle cx="270" cy="75" r="3.5" fill="#80deea" opacity="0.4"/>
        <circle cx="285" cy="65" r="2.5" fill="#80deea" opacity="0.35"/>
        <circle cx="300" cy="78" r="4" fill="#80deea" opacity="0.3"/>
        {/* graph */}
        <line x1="150" y1="100" x2="230" y2="100" stroke="#80deea" strokeWidth="1.5" opacity="0.4"/>
        <line x1="150" y1="100" x2="150" y2="30" stroke="#80deea" strokeWidth="1.5" opacity="0.4"/>
        <polyline points="155,90 165,75 175,78 185,55 195,60 205,40 215,45 225,28" fill="none" stroke="#4dd0e1" strokeWidth="2" opacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
        {[155,165,175,185,195,205,215,225].map((x,i)=>{const ys=[90,75,78,55,60,40,45,28];return<circle key={i} cx={x} cy={ys[i]} r="2.5" fill="#4dd0e1" opacity="0.6"/>;})}
      </svg>
    ),

    "prog-014": ( // Olimpiade Biologi
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p014" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0a2010"/><stop offset="100%" stopColor="#2e7d32"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p014)"/>
        {/* DNA helix */}
        {Array.from({length:9},(_,i)=>{const y=10+i*11;const x1=50+Math.cos(i*0.8)*20,x2=90-Math.cos(i*0.8)*20;return(<g key={i}><line x1={x1} y1={y} x2={x2} y2={y} stroke="#a5d6a7" strokeWidth="1.2" opacity="0.35"/><circle cx={x1} cy={y} r="3.5" fill="#66bb6a" opacity="0.6"/><circle cx={x2} cy={y} r="3.5" fill="#66bb6a" opacity="0.6"/></g>);})}
        <path d="M30,10 q30,30 0,60 q30,30 0,50" fill="none" stroke="#81c784" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
        <path d="M110,10 q-30,30 0,60 q-30,30 0,50" fill="none" stroke="#81c784" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
        {/* leaf veins */}
        <path d="M180,110 Q250,40 340,20" fill="none" stroke="#a5d6a7" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
        <path d="M180,110 Q210,70 240,55" fill="none" stroke="#a5d6a7" strokeWidth="1.2" opacity="0.3" strokeLinecap="round"/>
        <path d="M180,110 Q230,80 270,60" fill="none" stroke="#a5d6a7" strokeWidth="1.2" opacity="0.3" strokeLinecap="round"/>
        <path d="M180,110 Q250,90 300,75" fill="none" stroke="#a5d6a7" strokeWidth="1.2" opacity="0.25" strokeLinecap="round"/>
        {/* cell */}
        <circle cx="300" cy="80" r="32" fill="none" stroke="#66bb6a" strokeWidth="1.5" opacity="0.35"/>
        <circle cx="300" cy="80" r="14" fill="#2e7d32" opacity="0.3"/>
        <circle cx="295" cy="75" r="5" fill="#a5d6a7" opacity="0.4"/>
        {[0,60,120,180,240,300].map(a=>{const rad=(a*Math.PI)/180;return<circle key={a} cx={300+Math.cos(rad)*22} cy={80+Math.sin(rad)*22} r="3" fill="#66bb6a" opacity="0.3"/>;})}
      </svg>
    ),

    "prog-015": ( // Drama & Teater
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-p015" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#10001a"/><stop offset="100%" stopColor="#4a148c"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-p015)"/>
        {/* stage light */}
        <path d="M200,0 L130,120 L270,120 Z" fill="#ffd54f" opacity="0.06"/>
        <ellipse cx="200" cy="115" rx="60" ry="8" fill="#ffd54f" opacity="0.08"/>
        {/* curtains */}
        <path d="M0,0 Q30,40 20,120 L0,120 Z" fill="#7b1fa2" opacity="0.55"/>
        <path d="M400,0 Q370,40 380,120 L400,120 Z" fill="#7b1fa2" opacity="0.55"/>
        <path d="M0,0 Q20,25 12,70" fill="none" stroke="#ce93d8" strokeWidth="1.5" opacity="0.3"/>
        <path d="M400,0 Q380,25 388,70" fill="none" stroke="#ce93d8" strokeWidth="1.5" opacity="0.3"/>
        {/* comedy mask */}
        <circle cx="135" cy="55" r="30" fill="#ffd740" opacity="0.2"/>
        <circle cx="124" cy="46" r="5" fill="#fff" opacity="0.45"/>
        <circle cx="146" cy="46" r="5" fill="#fff" opacity="0.45"/>
        <circle cx="125" cy="47" r="2.5" fill="#333" opacity="0.5"/>
        <circle cx="147" cy="47" r="2.5" fill="#333" opacity="0.5"/>
        <path d="M122,65 q13,12 26,0" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.6" strokeLinecap="round"/>
        {/* tragedy mask */}
        <circle cx="225" cy="60" r="30" fill="#9c27b0" opacity="0.3"/>
        <circle cx="214" cy="51" r="5" fill="#fff" opacity="0.4"/>
        <circle cx="236" cy="51" r="5" fill="#fff" opacity="0.4"/>
        <circle cx="215" cy="52" r="2.5" fill="#333" opacity="0.45"/>
        <circle cx="237" cy="52" r="2.5" fill="#333" opacity="0.45"/>
        <path d="M212,72 q13-10 26,0" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.55" strokeLinecap="round"/>
      </svg>
    ),

    // ─── MEGA'S PROGRAMS ──────────────────────────────────────────────────────

    "prog-mega-01": ( // Literasi Sains Kelas 10
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm01" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d1f3c"/><stop offset="100%" stopColor="#0277bd"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm01)"/>
        {/* atom */}
        <circle cx="90" cy="60" r="10" fill="#4fc3f7" opacity="0.7"/>
        {[0,60,120].map(deg=><ellipse key={deg} cx="90" cy="60" rx="45" ry="18" fill="none" stroke="#81d4fa" strokeWidth="1.5" opacity="0.45" transform={`rotate(${deg},90,60)`}/>)}
        {[0,60,120].map(deg=>{const rad=(deg*Math.PI)/180;return<circle key={deg+1} cx={90+Math.cos(rad)*45} cy={60+Math.sin(rad)*18} r="4" fill="#b3e5fc" opacity="0.6"/>;})}
        {/* microscope silhouette */}
        <line x1="280" y1="90" x2="360" y2="90" stroke="#81d4fa" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
        <line x1="320" y1="90" x2="320" y2="30" stroke="#81d4fa" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
        <circle cx="320" cy="30" r="14" fill="none" stroke="#4fc3f7" strokeWidth="2" opacity="0.5"/>
        <circle cx="320" cy="30" r="7" fill="#0d47a1" opacity="0.5"/>
        <line x1="300" y1="62" x2="340" y2="62" stroke="#81d4fa" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
        {/* dots texture */}
        {[0,1,2,3].map(r=>[0,1,2,3,4,5].map(c=><circle key={`${r}-${c}`} cx={170+c*30} cy={20+r*30} r="1.2" fill="#fff" opacity="0.06"/>))}
      </svg>
    ),

    "prog-mega-02": ( // Matematika Olimpiade
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm02" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a1000"/><stop offset="100%" stopColor="#e65100"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm02)"/>
        {/* trophy */}
        <path d="M270,20 L330,20 L325,60 Q320,80 300,85 Q280,80 275,60 Z" fill="none" stroke="#ffd54f" strokeWidth="2" opacity="0.6"/>
        <path d="M275,60 Q255,55 255,40 Q255,25 275,22" fill="none" stroke="#ffd54f" strokeWidth="1.5" opacity="0.5"/>
        <path d="M325,60 Q345,55 345,40 Q345,25 325,22" fill="none" stroke="#ffd54f" strokeWidth="1.5" opacity="0.5"/>
        <line x1="300" y1="85" x2="300" y2="98" stroke="#ffd54f" strokeWidth="2" opacity="0.5"/>
        <line x1="280" y1="98" x2="320" y2="98" stroke="#ffd54f" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
        <circle cx="300" cy="52" r="8" fill="#ffd54f" opacity="0.2"/>
        {/* geometric shapes */}
        <polygon points="80,20 50,80 110,80" fill="none" stroke="#ffcc80" strokeWidth="1.5" opacity="0.35"/>
        <rect x="130" y="35" width="44" height="44" rx="2" fill="none" stroke="#ffcc80" strokeWidth="1.5" opacity="0.3" transform="rotate(15,152,57)"/>
        {/* sigma formula */}
        <text x="180" y="65" fontSize="36" fontFamily="serif" fill="#ffd54f" opacity="0.25" textAnchor="middle">Σ</text>
        <text x="215" y="48" fontSize="10" fontFamily="serif" fill="#ffcc80" opacity="0.4">n=1</text>
        <text x="215" y="62" fontSize="10" fontFamily="serif" fill="#ffcc80" opacity="0.4">∞</text>
      </svg>
    ),

    "prog-mega-03": ( // Bahasa Indonesia Esai
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm03" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3e0000"/><stop offset="100%" stopColor="#d84315"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm03)"/>
        {/* paper/notebook */}
        <rect x="200" y="15" width="160" height="95" rx="5" fill="#bf360c" opacity="0.25"/>
        {/* ruled lines */}
        {[30,43,56,69,82,95].map(y=><line key={y} x1="210" y1={y} x2="350" y2={y} stroke="#ffccbc" strokeWidth="1" opacity="0.2"/>)}
        <line x1="230" y1="15" x2="230" y2="110" stroke="#ef9a9a" strokeWidth="1" opacity="0.2"/>
        {/* pen writing */}
        <path d="M240,95 L300,35 L310,45 L250,105 Z" fill="#ffccbc" opacity="0.25"/>
        <line x1="300" y1="35" x2="312" y2="25" stroke="#ffccbc" strokeWidth="2" opacity="0.6" strokeLinecap="round"/>
        {/* quotation marks */}
        <text x="50" y="55" fontSize="72" fontFamily="serif" fill="#ff8a65" opacity="0.2">"</text>
        <text x="100" y="105" fontSize="72" fontFamily="serif" fill="#ff8a65" opacity="0.15">"</text>
        {/* ink splash */}
        <circle cx="320" cy="40" r="6" fill="#ffccbc" opacity="0.25"/>
        {[0,45,90,135,180,225,270,315].map(a=>{const rad=(a*Math.PI)/180;return<line key={a} x1={320+Math.cos(rad)*7} y1={40+Math.sin(rad)*7} x2={320+Math.cos(rad)*14} y2={40+Math.sin(rad)*14} stroke="#ffccbc" strokeWidth="1" opacity="0.2"/>;})}
      </svg>
    ),

    "prog-mega-04": ( // Fisika Modern
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm04" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d0020"/><stop offset="100%" stopColor="#4527a0"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm04)"/>
        {/* space-time grid */}
        {[0,1,2,3,4,5,6,7].map(i=><line key={`d1-${i}`} x1={0} y1={i*20} x2={400} y2={i*20-80} stroke="#7c4dff" strokeWidth="0.6" opacity="0.12"/>)}
        {[0,1,2,3,4,5,6,7].map(i=><line key={`d2-${i}`} x1={i*56} y1={0} x2={i*56+80} y2={120} stroke="#7c4dff" strokeWidth="0.6" opacity="0.12"/>)}
        {/* wave-particle duality */}
        <path d="M30,60 q15-35 30,0 q15,35 30,0 q15-35 30,0 q15,35 30,0" fill="none" stroke="#b39ddb" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
        <circle cx="90" cy="60" r="7" fill="#7c4dff" opacity="0.5"/>
        {/* E=mc² */}
        <text x="240" y="62" fontSize="32" fontFamily="serif" fill="#b39ddb" opacity="0.45" fontStyle="italic" fontWeight="bold">E=mc²</text>
        {/* particles */}
        {[[170,25],[190,90],[210,45],[350,30],[380,85]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill="#ea80fc" opacity="0.4"/>)}
        {[[170,25],[190,90]].map(([x,y],i)=>[...[30,60,90,120,150,180].map(a=>{const rad=(a*Math.PI)/180;return<circle key={`${i}-${a}`} cx={x+Math.cos(rad)*12} cy={y+Math.sin(rad)*12} r="1.5" fill="#ea80fc" opacity="0.2"/>;})])}
      </svg>
    ),

    "prog-mega-05": ( // Critical Thinking & Debat
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm05" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0a1520"/><stop offset="100%" stopColor="#1565c0"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm05)"/>
        {/* scales of justice */}
        <line x1="200" y1="15" x2="200" y2="85" stroke="#90caf9" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
        <line x1="140" y1="38" x2="260" y2="38" stroke="#90caf9" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
        <circle cx="200" cy="15" r="4" fill="#42a5f5" opacity="0.7"/>
        {/* left pan */}
        <path d="M120,38 q20,30 40,30 q20,0 40-30" fill="none" stroke="#64b5f6" strokeWidth="1.5" opacity="0.5"/>
        <line x1="140" y1="38" x2="160" y2="68" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4"/>
        <line x1="200" y1="38" x2="180" y2="68" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4"/>
        {/* right pan (lower) */}
        <path d="M220,45 q20,25 40,25 q20,0 40-25" fill="none" stroke="#64b5f6" strokeWidth="1.5" opacity="0.5"/>
        <line x1="260" y1="38" x2="280" y2="70" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4"/>
        <line x1="200" y1="38" x2="300" y2="70" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4"/>
        {/* speech bubbles */}
        <rect x="35" y="20" width="60" height="30" rx="8" fill="none" stroke="#90caf9" strokeWidth="1.5" opacity="0.4"/>
        <path d="M50,50 L45,60 L60,50" fill="none" stroke="#90caf9" strokeWidth="1.5" opacity="0.4"/>
        <rect x="35" y="22" width="40" height="2.5" rx="1" fill="#90caf9" opacity="0.2"/>
        <rect x="35" y="28" width="55" height="2.5" rx="1" fill="#90caf9" opacity="0.15"/>
        <rect x="310" y="20" width="60" height="30" rx="8" fill="none" stroke="#90caf9" strokeWidth="1.5" opacity="0.35"/>
        <path d="M355,50 L360,60 L345,50" fill="none" stroke="#90caf9" strokeWidth="1.5" opacity="0.35"/>
        <line x1="200" y1="85" x2="180" y2="108" stroke="#90caf9" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        <line x1="180" y1="108" x2="220" y2="108" stroke="#90caf9" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
      </svg>
    ),

    "prog-mega-06": ( // Kimia Organik
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm06" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00201a"/><stop offset="100%" stopColor="#00695c"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm06)"/>
        {/* benzene hexagon */}
        {Array.from({length:6},(_,i)=>{const a=(i*60*Math.PI)/180,b=((i+1)*60*Math.PI)/180;const r=40;return<line key={i} x1={90+Math.cos(a)*r} y1={60+Math.sin(a)*r} x2={90+Math.cos(b)*r} y2={60+Math.sin(b)*r} stroke="#80cbc4" strokeWidth="2" opacity="0.55"/>;})}
        <circle cx="90" cy="60" r="22" fill="none" stroke="#80cbc4" strokeWidth="1.5" opacity="0.35"/>
        {/* alternate double bonds */}
        {[0,2,4].map(i=>{const a=((i*60+30)*Math.PI)/180,b=(((i+1)*60+30)*Math.PI)/180;return<line key={i} x1={90+Math.cos(a)*32} y1={60+Math.sin(a)*32} x2={90+Math.cos(b)*32} y2={60+Math.sin(b)*32} stroke="#4db6ac" strokeWidth="1.2" opacity="0.4"/>;})}
        {/* atom labels */}
        {Array.from({length:6},(_,i)=>{const a=(i*60*Math.PI)/180;return<circle key={i} cx={90+Math.cos(a)*40} cy={60+Math.sin(a)*40} r="4" fill="#b2dfdb" opacity="0.5"/>;})}
        {/* flask */}
        <path d="M290,18 L290,55 L258,98 L332,98 L300,55 L300,18 Z" fill="none" stroke="#4db6ac" strokeWidth="2" opacity="0.55"/>
        <path d="M261,91 L329,91 L300,55 L290,55 Z" fill="#26a69a" opacity="0.12"/>
        <line x1="284" y1="18" x2="306" y2="18" stroke="#80cbc4" strokeWidth="2.5" opacity="0.6" strokeLinecap="round"/>
        <circle cx="275" cy="78" r="4" fill="#80cbc4" opacity="0.4"/>
        <circle cx="295" cy="70" r="3" fill="#80cbc4" opacity="0.35"/>
        <circle cx="312" cy="80" r="4.5" fill="#80cbc4" opacity="0.3"/>
      </svg>
    ),

    "prog-mega-07": ( // English for Academic Purposes
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm07" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d1b35"/><stop offset="100%" stopColor="#1a237e"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm07)"/>
        {/* scroll/diploma */}
        <rect x="200" y="22" width="160" height="80" rx="5" fill="none" stroke="#9fa8da" strokeWidth="2" opacity="0.5"/>
        <path d="M200,22 q-10,40 0,80" fill="none" stroke="#9fa8da" strokeWidth="2" opacity="0.5"/>
        <path d="M360,22 q10,40 0,80" fill="none" stroke="#9fa8da" strokeWidth="2" opacity="0.5"/>
        <ellipse cx="200" cy="62" rx="12" ry="40" fill="#1565c0" opacity="0.25"/>
        <ellipse cx="360" cy="62" rx="12" ry="40" fill="#1565c0" opacity="0.25"/>
        {[38,50,62,74,86].map(y=><line key={y} x1="215" y1={y} x2="345" y2={y} stroke="#9fa8da" strokeWidth="1" opacity="0.2"/>)}
        {/* ribbon */}
        <path d="M255,102 L280,88 L305,102" fill="none" stroke="#ffd54f" strokeWidth="2" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="280" cy="88" r="8" fill="#ffd54f" opacity="0.25"/>
        {/* big A letter */}
        <text x="100" y="90" fontSize="90" fontFamily="serif" fontWeight="800" fill="#3949ab" opacity="0.3" textAnchor="middle">A</text>
        {/* small academic symbols */}
        <text x="50" y="35" fontSize="18" fontFamily="serif" fill="#7986cb" opacity="0.35">∀</text>
        <text x="155" y="35" fontSize="18" fontFamily="serif" fill="#7986cb" opacity="0.25">∈</text>
      </svg>
    ),

    "prog-mega-08": ( // Sejarah & Analisis Peristiwa Dunia
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm08" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1c0d00"/><stop offset="100%" stopColor="#bf360c"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm08)"/>
        {/* globe */}
        <circle cx="90" cy="60" r="45" fill="none" stroke="#ffccbc" strokeWidth="1.5" opacity="0.35"/>
        <circle cx="90" cy="60" r="45" fill="#8d2b0b" opacity="0.15"/>
        <ellipse cx="90" cy="60" rx="22" ry="45" fill="none" stroke="#ffccbc" strokeWidth="1" opacity="0.25"/>
        <ellipse cx="90" cy="60" rx="45" ry="18" fill="none" stroke="#ffccbc" strokeWidth="1" opacity="0.25"/>
        <line x1="45" y1="60" x2="135" y2="60" stroke="#ffccbc" strokeWidth="1" opacity="0.2"/>
        {/* timeline */}
        <line x1="185" y1="70" x2="390" y2="70" stroke="#ff8a65" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
        <polyline points="390,65 395,70 390,75" fill="none" stroke="#ff8a65" strokeWidth="2" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
        {[[200,50],[240,45],[280,55],[320,38],[360,48]].map(([x,y],i)=>(
          <g key={i}>
            <line x1={x} y1="70" x2={x} y2={y} stroke="#ff8a65" strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
            <circle cx={x} cy={y} r="4" fill="#ffccbc" opacity="0.5"/>
          </g>
        ))}
        {/* columns */}
        <rect x="165" y="30" width="8" height="50" rx="2" fill="#ffccbc" opacity="0.2"/>
        <rect x="178" y="25" width="8" height="55" rx="2" fill="#ffccbc" opacity="0.18"/>
        <rect x="157" y="80" width="38" height="6" rx="1" fill="#ffccbc" opacity="0.2"/>
      </svg>
    ),

    "prog-mega-09": ( // Biologi Sel & Genetika
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm09" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0a2210"/><stop offset="100%" stopColor="#1b5e20"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm09)"/>
        {/* cell */}
        <ellipse cx="100" cy="60" r="75" ry="50" fill="none" stroke="#a5d6a7" strokeWidth="1.5" opacity="0.3" rx="75"/>
        <circle cx="100" cy="60" r="50" fill="none" stroke="#66bb6a" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="100" cy="60" r="20" fill="#388e3c" opacity="0.25"/>
        <circle cx="100" cy="60" r="12" fill="#2e7d32" opacity="0.3"/>
        {/* organelles */}
        {[[70,42],[130,48],[80,78],[115,72]].map(([x,y],i)=>(
          <ellipse key={i} cx={x} cy={y} rx="12" ry="7" fill="#81c784" opacity="0.2" transform={`rotate(${i*25},${x},${y})`}/>
        ))}
        {/* DNA double helix */}
        {Array.from({length:10},(_,i)=>{const y=10+i*10;const x1=250+Math.sin(i*0.9)*15,x2=290-Math.sin(i*0.9)*15;return(<g key={i}><line x1={x1} y1={y} x2={x2} y2={y} stroke="#a5d6a7" strokeWidth="1" opacity="0.3"/><circle cx={x1} cy={y} r="3" fill="#69f0ae" opacity="0.5"/><circle cx={x2} cy={y} r="3" fill="#69f0ae" opacity="0.5"/></g>);})}
        <path d="M235,10 q25,30 0,60 q25,30 0,40" fill="none" stroke="#66bb6a" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        <path d="M305,10 q-25,30 0,60 q-25,30 0,40" fill="none" stroke="#66bb6a" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        {/* labels */}
        <text x="330" y="60" fontSize="12" fontFamily="monospace" fill="#a5d6a7" opacity="0.35">ACGT</text>
        <text x="330" y="75" fontSize="12" fontFamily="monospace" fill="#81c784" opacity="0.3">TGCA</text>
      </svg>
    ),

    "prog-mega-10": ( // Ekonomi Mikro
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm10" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a1000"/><stop offset="100%" stopColor="#f57f17"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm10)"/>
        {/* supply-demand axes */}
        <line x1="40" y1="100" x2="200" y2="100" stroke="#ffe082" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        <line x1="40" y1="100" x2="40" y2="15" stroke="#ffe082" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        {/* demand curve (downward) */}
        <path d="M55,20 Q120,55 185,95" fill="none" stroke="#ffb300" strokeWidth="2.5" opacity="0.6" strokeLinecap="round"/>
        {/* supply curve (upward) */}
        <path d="M55,95 Q120,55 185,20" fill="none" stroke="#ffd54f" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
        {/* intersection */}
        <circle cx="120" cy="57" r="6" fill="#fff3e0" opacity="0.7"/>
        <line x1="120" y1="57" x2="120" y2="100" stroke="#fff3e0" strokeWidth="1" opacity="0.3" strokeDasharray="3,3"/>
        <line x1="40" y1="57" x2="120" y2="57" stroke="#fff3e0" strokeWidth="1" opacity="0.3" strokeDasharray="3,3"/>
        {/* coin stack */}
        {[0,1,2,3].map(i=>(
          <ellipse key={i} cx="320" cy={90-i*14} rx="36" ry="10" fill="#ffd54f" opacity={0.15+i*0.05}/>
        ))}
        {[0,1,2].map(i=>(
          <rect key={i} x="284" y={66-i*14} width="72" height="14" fill="#f9a825" opacity="0.15+i*0.04}"/>
        ))}
        <text x="320" y="85" textAnchor="middle" fontSize="16" fontFamily="serif" fill="#ffe082" opacity="0.4">$</text>
      </svg>
    ),

    "prog-mega-11": ( // Statistika & Probabilitas
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm11" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d0d30"/><stop offset="100%" stopColor="#283593"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm11)"/>
        {/* axes */}
        <line x1="30" y1="100" x2="200" y2="100" stroke="#7986cb" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        <line x1="30" y1="100" x2="30" y2="15" stroke="#7986cb" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        {/* normal bell curve */}
        <path d="M35,98 Q60,95 80,88 Q100,78 115,55 Q120,40 130,18 Q140,40 145,55 Q160,78 180,88 Q200,95 200,98" fill="#3949ab" opacity="0.15"/>
        <path d="M35,98 Q60,95 80,88 Q100,78 115,55 Q120,40 130,18 Q140,40 145,55 Q160,78 180,88 Q200,95 200,98" fill="none" stroke="#5c6bc0" strokeWidth="2" opacity="0.6" strokeLinecap="round"/>
        {/* std dev markers */}
        <line x1="130" y1="100" x2="130" y2="20" stroke="#9fa8da" strokeWidth="1" opacity="0.3" strokeDasharray="3,3"/>
        <line x1="105" y1="100" x2="105" y2="72" stroke="#9fa8da" strokeWidth="1" opacity="0.25" strokeDasharray="3,3"/>
        <line x1="155" y1="100" x2="155" y2="72" stroke="#9fa8da" strokeWidth="1" opacity="0.25" strokeDasharray="3,3"/>
        {/* scatter plot */}
        {[[240,40],[260,55],[255,35],[280,70],[300,60],[290,45],[320,80],[310,30],[340,65],[355,50]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill="#7986cb" opacity="0.45"/>)}
        {/* trend line */}
        <line x1="238" y1="42" x2="358" y2="70" stroke="#9fa8da" strokeWidth="1.5" opacity="0.35" strokeDasharray="4,3"/>
      </svg>
    ),

    "prog-mega-12": ( // Pemrograman Web
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm12" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0d1b3e"/><stop offset="100%" stopColor="#4e342e"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm12)"/>
        {/* browser window */}
        <rect x="220" y="14" width="166" height="100" rx="8" fill="#1a1a2e" opacity="0.8"/>
        <rect x="220" y="14" width="166" height="24" rx="8" fill="#2d2d44" opacity="0.9"/>
        <rect x="220" y="26" width="166" height="12" fill="#2d2d44" opacity="0.9"/>
        <circle cx="234" cy="26" r="4" fill="#ff5f57" opacity="0.7"/>
        <circle cx="247" cy="26" r="4" fill="#febc2e" opacity="0.7"/>
        <circle cx="260" cy="26" r="4" fill="#28c840" opacity="0.7"/>
        <rect x="270" y="21" width="90" height="10" rx="3" fill="#3d3d5a" opacity="0.7"/>
        {/* HTML code */}
        <text x="228" y="54" fontSize="9" fontFamily="monospace" fill="#f07178" opacity="0.75">{"<div"}</text>
        <text x="252" y="54" fontSize="9" fontFamily="monospace" fill="#c3e88d" opacity="0.65">{" class"}</text>
        <text x="228" y="66" fontSize="9" fontFamily="monospace" fill="#82aaff" opacity="0.7">{"  <h1>"}</text>
        <text x="260" y="66" fontSize="9" fontFamily="monospace" fill="#ffffff" opacity="0.5">Hello</text>
        <text x="228" y="78" fontSize="9" fontFamily="monospace" fill="#82aaff" opacity="0.6">{"  </h1>"}</text>
        <text x="228" y="90" fontSize="9" fontFamily="monospace" fill="#f07178" opacity="0.6">{"</div>"}</text>
        {/* CSS tags */}
        <text x="40" y="45" fontSize="32" fontFamily="monospace" fontWeight="700" fill="#f07178" opacity="0.25">{"</"}</text>
        <text x="80" y="45" fontSize="32" fontFamily="monospace" fontWeight="700" fill="#82aaff" opacity="0.2">{">"}</text>
        {/* grid layout hint */}
        {[0,1,2].map(c=>[0,1].map(r=><rect key={`${c}-${r}`} x={50+c*50} y={65+r*25} width="42" height="20" rx="3" fill="#82aaff" opacity="0.07"/>))}
      </svg>
    ),

    "prog-mega-13": ( // Filsafat & Etika
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm13" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d0d0d"/><stop offset="100%" stopColor="#212121"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm13)"/>
        {/* subtle grid */}
        {[0,1,2,3,4,5,6,7,8,9].map(i=><line key={i} x1={i*44} y1="0" x2={i*44} y2="120" stroke="#fff" strokeWidth="0.4" opacity="0.04"/>)}
        {/* thinking figure */}
        <circle cx="85" cy="30" r="16" fill="none" stroke="#bdbdbd" strokeWidth="1.5" opacity="0.4"/>
        <path d="M75,46 Q80,90 82,100" fill="none" stroke="#bdbdbd" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        <path d="M82,100 Q75,110 65,115" fill="none" stroke="#bdbdbd" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
        <path d="M82,100 Q89,112 99,115" fill="none" stroke="#bdbdbd" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
        <path d="M80,55 Q60,55 50,40" fill="none" stroke="#bdbdbd" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
        <path d="M80,55 Q100,58 110,48" fill="none" stroke="#bdbdbd" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
        {/* hand on chin hint */}
        <path d="M75,35 Q65,38 68,44" fill="none" stroke="#bdbdbd" strokeWidth="1.2" opacity="0.35" strokeLinecap="round"/>
        {/* infinity ∞ */}
        <path d="M230,60 q20-35 40,0 q20,35 40,0 q20-35 40,0 q-20,35 -40,0 q-20,-35 -40,0" fill="none" stroke="#757575" strokeWidth="2.5" opacity="0.35" strokeLinecap="round"/>
        {/* connection lines */}
        {[[170,20],[185,80],[200,40],[210,95]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill="#9e9e9e" opacity="0.3"/>)}
        <line x1="170" y1="20" x2="185" y2="80" stroke="#9e9e9e" strokeWidth="1" opacity="0.15"/>
        <line x1="185" y1="80" x2="210" y2="95" stroke="#9e9e9e" strokeWidth="1" opacity="0.15"/>
        <line x1="200" y1="40" x2="170" y2="20" stroke="#9e9e9e" strokeWidth="1" opacity="0.15"/>
      </svg>
    ),

    "prog-mega-14": ( // Sosiologi — Perubahan Sosial
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm14" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2d0020"/><stop offset="100%" stopColor="#ad1457"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm14)"/>
        {/* social network nodes */}
        {[[80,60],[160,35],[160,85],[240,20],[240,60],[240,100],[320,40],[320,80],[370,60]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="8" fill="#f48fb1" opacity="0.4"/>
        ))}
        {/* connections */}
        {[
          [80,60,160,35],[80,60,160,85],[160,35,240,20],[160,35,240,60],
          [160,85,240,60],[160,85,240,100],[240,20,320,40],[240,60,320,40],
          [240,60,320,80],[240,100,320,80],[320,40,370,60],[320,80,370,60],
        ].map((seg,i)=>{
          const [ax,ay,bx,by]=seg;
          return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke="#f48fb1" strokeWidth="1" opacity="0.2"/>;
        })}
        {/* person icons */}
        {[[80,60],[160,35],[240,60],[320,80]].map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y-10} r="4" fill="#f48fb1" opacity="0.5"/>
            <path d={`M${x-5},${y-2} q5,8 10,0`} fill="none" stroke="#f48fb1" strokeWidth="1.2" opacity="0.4"/>
          </g>
        ))}
      </svg>
    ),

    "prog-mega-15": ( // Geografi — Iklim & Lingkungan
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pm15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d2137"/><stop offset="100%" stopColor="#01579b"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pm15)"/>
        {/* contour lines */}
        {[0,1,2,3].map(i=><ellipse key={i} cx="100" cy="75" rx={30+i*18} ry={15+i*12} fill="none" stroke="#4fc3f7" strokeWidth="1.2" opacity={0.3-i*0.05}/>)}
        {/* mountain */}
        <polyline points="40,110 100,30 160,110" fill="none" stroke="#4fc3f7" strokeWidth="2" opacity="0.3"/>
        <polyline points="70,110 100,50 130,110" fill="#29b6f6" opacity="0.08"/>
        <polyline points="80,110 100,55 120,110" fill="#29b6f6" opacity="0.06"/>
        <polyline points="88,68 100,55 112,68" fill="#fff" opacity="0.2"/>
        {/* sun */}
        <circle cx="320" cy="35" r="22" fill="#ffd54f" opacity="0.2"/>
        {Array.from({length:10},(_,i)=>{const a=(i*36*Math.PI)/180;return<line key={i} x1={320+Math.cos(a)*24} y1={35+Math.sin(a)*24} x2={320+Math.cos(a)*32} y2={35+Math.sin(a)*32} stroke="#ffd54f" strokeWidth="1.5" opacity="0.3"/>;})}
        {/* cloud */}
        <path d="M250,65 q5-15 20-12 q3-15 20-10 q15-2 14,12 q10,2 8,12 L250,67 Z" fill="#b3e5fc" opacity="0.2"/>
        {/* ocean waves */}
        <path d="M0,100 q25-12 50,0 q25,12 50,0 q25-12 50,0 q25,12 50,0 q25-12 50,0 q25,12 50,0 q25-12 50,0 q25,12 50,0" fill="none" stroke="#4fc3f7" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
        <path d="M0,110 q25-10 50,0 q25,10 50,0 q25-10 50,0 q25,10 50,0 q25-10 50,0 q25,10 50,0 q25-10 50,0 q25,10 50,0" fill="none" stroke="#81d4fa" strokeWidth="1" opacity="0.25" strokeLinecap="round"/>
      </svg>
    ),

    // ─── REZA'S PROGRAMS ──────────────────────────────────────────────────────

    "prog-reza-01": ( // Bahasa Jepang
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pr01" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0005"/><stop offset="100%" stopColor="#b71c1c"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pr01)"/>
        {/* torii gate */}
        <rect x="230" y="15" width="130" height="12" rx="4" fill="#ef5350" opacity="0.55"/>
        <rect x="240" y="25" width="110" height="8" rx="3" fill="#ef5350" opacity="0.45"/>
        <rect x="252" y="33" width="8" height="78" rx="3" fill="#ef5350" opacity="0.45"/>
        <rect x="332" y="33" width="8" height="78" rx="3" fill="#ef5350" opacity="0.45"/>
        {/* circle sun */}
        <circle cx="100" cy="60" r="36" fill="#ef5350" opacity="0.2"/>
        <circle cx="100" cy="60" r="24" fill="#f44336" opacity="0.25"/>
        {/* sakura petals */}
        {[[50,25],[150,20],[180,90],[45,95],[160,50]].map(([x,y],i)=>(
          <g key={i} opacity="0.35">
            {Array.from({length:5},(_,j)=>{const a=(j*72*Math.PI)/180;return<ellipse key={j} cx={x+Math.cos(a)*7} cy={y+Math.sin(a)*7} rx="5" ry="3" fill="#ffb3c1" transform={`rotate(${j*72},${x+Math.cos(a)*7},${y+Math.sin(a)*7})`}/>;})}
          </g>
        ))}
        {/* hiragana あ */}
        <text x="100" y="78" fontSize="44" fontFamily="serif" fill="#ffcdd2" opacity="0.3" textAnchor="middle">あ</text>
      </svg>
    ),

    "prog-reza-02": ( // Musik — Teori Dasar
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pr02" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0e00"/><stop offset="100%" stopColor="#e65100"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pr02)"/>
        {/* staff lines */}
        {[30,45,60,75,90].map(y=><line key={y} x1="30" y1={y} x2="370" y2={y} stroke="#ffcc80" strokeWidth="1.2" opacity="0.3"/>)}
        {/* treble clef */}
        <text x="35" y="98" fontSize="90" fontFamily="serif" fill="#ff9800" opacity="0.3">𝄞</text>
        {/* notes */}
        {[[100,22],[140,52],[180,37],[220,67],[260,45],[300,30],[340,60]].map(([x,y],i)=>(
          <g key={i}>
            <ellipse cx={x} cy={y} rx="9" ry="7" fill="#ffcc80" opacity="0.55" transform={`rotate(-20,${x},${y})`}/>
            <line x1={x+8} y1={y-4} x2={x+8} y2={y-36} stroke="#ffcc80" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
            {i%3===0&&<path d={`M${x+8},${y-36} q15,8 0,16`} fill="none" stroke="#ffcc80" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>}
          </g>
        ))}
        {/* sound waves */}
        <path d="M30,108 q50-6 100,0 q50,6 100,0 q50-6 100,0 q50,6 40,0" fill="none" stroke="#ff9800" strokeWidth="1.5" opacity="0.25" strokeLinecap="round"/>
      </svg>
    ),

    // ─── DIANA'S PROGRAMS ─────────────────────────────────────────────────────

    "prog-diana-01": ( // Asesmen Kompetensi Menulis
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pd01" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0030"/><stop offset="100%" stopColor="#6a1b9a"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pd01)"/>
        {/* paper sheet */}
        <rect x="200" y="15" width="160" height="95" rx="6" fill="#7b1fa2" opacity="0.2"/>
        <rect x="205" y="20" width="150" height="85" rx="4" fill="#4a148c" opacity="0.3"/>
        {/* text lines */}
        {[30,42,54,66,78,90].map(y=><line key={y} x1="215" y1={y} x2="340" y2={y} stroke="#e1bee7" strokeWidth="1.5" opacity="0.2"/>)}
        {/* checkmarks */}
        <polyline points="350,35 356,42 370,28" fill="none" stroke="#ce93d8" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="350,55 356,62 370,48" fill="none" stroke="#ce93d8" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* writing pen */}
        <path d="M80,20 L86,26 L54,108 L44,110 L46,100 Z" fill="#ce93d8" opacity="0.3"/>
        <path d="M80,20 L90,28 L86,26 Z" fill="#e1bee7" opacity="0.5"/>
        <path d="M44,110 L50,95 L46,100 Z" fill="#b39ddb" opacity="0.4"/>
        {/* ink trail */}
        <path d="M60,90 Q80,75 100,80 Q120,85 140,70 Q160,55 180,60" fill="none" stroke="#ce93d8" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
      </svg>
    ),

    "prog-diana-02": ( // Asesmen Matematika
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pd02" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d1530"/><stop offset="100%" stopColor="#1a237e"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pd02)"/>
        {/* protractor arc */}
        <path d="M60,100 A70,70 0 0,1 200,100" fill="none" stroke="#9fa8da" strokeWidth="2" opacity="0.4"/>
        <line x1="130" y1="100" x2="130" y2="30" stroke="#9fa8da" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        {/* angle lines */}
        <line x1="130" y1="100" x2="190" y2="50" stroke="#7986cb" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        <line x1="130" y1="100" x2="75" y2="55" stroke="#7986cb" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        <path d="M130,80 a20,20 0 0,1 18,-14" fill="none" stroke="#9fa8da" strokeWidth="1" opacity="0.4"/>
        {/* ruler */}
        <rect x="220" y="22" width="160" height="22" rx="3" fill="#3949ab" opacity="0.3"/>
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i=><line key={i} x1={224+i*10} y1="22" x2={224+i*10} y2={i%5===0?38:32} stroke="#9fa8da" strokeWidth="1" opacity="0.4"/>)}
        {/* equations */}
        <text x="240" y="65" fontSize="14" fontFamily="serif" fill="#9fa8da" opacity="0.35" fontStyle="italic">ax² + bx + c = 0</text>
        <text x="260" y="85" fontSize="11" fontFamily="serif" fill="#7986cb" opacity="0.3">∠ABC = 45°</text>
        {/* grid dots */}
        {[0,1,2,3].map(r=>[0,1,2,3,4].map(c=><circle key={`${r}-${c}`} cx={240+c*30} cy={98-r*16} r="1.5" fill="#5c6bc0" opacity="0.3"/>))}
      </svg>
    ),

    "prog-diana-03": ( // Portofolio Seni
      <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="c-pd03" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0a00"/><stop offset="60%" stopColor="#880e4f"/><stop offset="100%" stopColor="#1a237e"/></linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#c-pd03)"/>
        {/* paint palette shape */}
        <path d="M60,30 Q90,15 120,30 Q150,45 145,70 Q140,90 110,95 Q80,100 60,85 Q35,70 40,50 Q45,35 60,30 Z" fill="none" stroke="#f48fb1" strokeWidth="1.5" opacity="0.35"/>
        <circle cx="65" cy="45" r="8" fill="#f44336" opacity="0.4"/>
        <circle cx="90" cy="32" r="8" fill="#ff9800" opacity="0.4"/>
        <circle cx="118" cy="38" r="8" fill="#ffeb3b" opacity="0.4"/>
        <circle cx="132" cy="62" r="8" fill="#4caf50" opacity="0.4"/>
        <circle cx="115" cy="82" r="8" fill="#2196f3" opacity="0.4"/>
        <circle cx="75" cy="86" r="8" fill="#9c27b0" opacity="0.4"/>
        <circle cx="88" cy="62" r="14" fill="#ffffff" opacity="0.1"/>
        {/* brush strokes */}
        <path d="M190,100 Q230,20 280,50 Q300,62 310,40" fill="none" stroke="#f8bbd0" strokeWidth="8" opacity="0.2" strokeLinecap="round"/>
        <path d="M200,95 Q260,40 320,70" fill="none" stroke="#ce93d8" strokeWidth="5" opacity="0.2" strokeLinecap="round"/>
        <path d="M210,105 Q250,60 330,85 Q360,95 380,80" fill="none" stroke="#80deea" strokeWidth="4" opacity="0.2" strokeLinecap="round"/>
        {/* canvas frame */}
        <rect x="290" y="18" width="90" height="70" rx="3" fill="none" stroke="#f8bbd0" strokeWidth="1.5" opacity="0.4"/>
        <rect x="295" y="23" width="80" height="60" rx="2" fill="#1a0a15" opacity="0.4"/>
        <path d="M300,75 Q330,40 370,28" fill="none" stroke="#f8bbd0" strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
        <circle cx="340" cy="42" r="10" fill="#ffd54f" opacity="0.15"/>
      </svg>
    ),
  };

  const fallback = (
    <svg viewBox="0 0 400 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="c-fallback" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e"/>
          <stop offset="100%" stopColor="#16213e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="120" fill="url(#c-fallback)"/>
      {[0,1,2,3,4,5,6,7,8].map(i=>[0,1,2,3].map(r=><circle key={`${i}-${r}`} cx={i*50+25} cy={r*40+20} r="1.5" fill="#fff" opacity="0.07"/>))}
    </svg>
  );

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {covers[id] ?? fallback}
    </div>
  );
}
