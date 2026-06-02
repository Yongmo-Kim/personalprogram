const Label = ({ x, y, children }) => (
  <text x={x} y={y} fill="#dbeafe" fontSize="12" fontWeight="700" textAnchor="middle">
    {children}
  </text>
);

const Arrow = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
);

const VisualFrame = ({ children }) => (
  <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="technology diagram">
    <defs>
      <linearGradient id="waferGradient" x1="0" x2="1">
        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="hotGradient" x1="0" x2="1">
        <stop offset="0%" stopColor="#f97316" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#e11d48" stopOpacity="0.95" />
      </linearGradient>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
      </marker>
    </defs>
    <rect x="0" y="0" width="640" height="320" rx="20" fill="#0f172a" />
    <rect x="18" y="18" width="604" height="284" rx="18" fill="#111827" stroke="#334155" />
    {children}
  </svg>
);

const DramCell = () => (
  <VisualFrame>
    <rect x="88" y="68" width="130" height="42" rx="10" fill="#172554" stroke="#60a5fa" />
    <Label x="153" y="95">Word Line</Label>
    <rect x="112" y="145" width="70" height="48" rx="10" fill="#1e293b" stroke="#93c5fd" />
    <Label x="147" y="174">Access TR</Label>
    <line x1="300" y1="55" x2="300" y2="250" stroke="#38bdf8" strokeWidth="5" />
    <Label x="300" y="38">Bit Line</Label>
    <line x1="182" y1="168" x2="300" y2="168" stroke="#93c5fd" strokeWidth="3" />
    <rect x="375" y="120" width="86" height="96" rx="12" fill="#064e3b" stroke="#34d399" />
    <line x1="397" y1="145" x2="439" y2="145" stroke="#bbf7d0" strokeWidth="5" />
    <line x1="397" y1="168" x2="439" y2="168" stroke="#bbf7d0" strokeWidth="5" />
    <Label x="418" y="238">Capacitor</Label>
    <Arrow x1="462" y1="165" x2="530" y2="165" />
    <rect x="526" y="130" width="72" height="70" rx="12" fill="#312e81" stroke="#a5b4fc" />
    <Label x="562" y="160">Sense</Label>
    <Label x="562" y="178">Amp</Label>
    <text x="320" y="282" fill="#94a3b8" fontSize="13" textAnchor="middle">
      전하가 있으면 1, 없으면 0. 읽고 나면 다시 써주고 주기적으로 refresh한다.
    </text>
  </VisualFrame>
);

const HbmStack = () => (
  <VisualFrame>
    {[0, 1, 2, 3, 4].map((level) => (
      <rect key={level} x={145 + level * 8} y={68 + level * 28} width="210" height="36" rx="8" fill="#1e3a8a" stroke="#60a5fa" />
    ))}
    <Label x="280" y="64">Stacked DRAM Die</Label>
    {[0, 1, 2, 3].map((x) => (
      <line key={x} x1={198 + x * 42} y1="78" x2={230 + x * 42} y2="224" stroke="#fbbf24" strokeWidth="4" />
    ))}
    <Label x="350" y="226">TSV</Label>
    <rect x="105" y="235" width="310" height="38" rx="10" fill="#064e3b" stroke="#34d399" />
    <Label x="260" y="260">Logic Base Die</Label>
    <rect x="470" y="102" width="98" height="116" rx="18" fill="#581c87" stroke="#d8b4fe" />
    <Label x="519" y="154">GPU</Label>
    <Arrow x1="415" y1="254" x2="490" y2="205" />
    <text x="320" y="294" fill="#94a3b8" fontSize="13" textAnchor="middle">
      DRAM을 위로 쌓고 TSV로 뚫어 GPU 옆에서 넓은 대역폭을 제공한다.
    </text>
  </VisualFrame>
);

const NandStack = () => (
  <VisualFrame>
    {[0, 1, 2, 3, 4, 5].map((level) => (
      <rect key={level} x="150" y={62 + level * 28} width="255" height="16" rx="5" fill={level % 2 ? '#1d4ed8' : '#065f46'} />
    ))}
    {[0, 1, 2, 3].map((col) => (
      <rect key={col} x={185 + col * 54} y="52" width="22" height="184" rx="10" fill="#111827" stroke="#f8fafc" strokeWidth="2" />
    ))}
    <Label x="277" y="38">3D NAND Cell String</Label>
    <Label x="462" y="92">Word Lines</Label>
    <Arrow x1="424" y1="92" x2="382" y2="92" />
    <Label x="485" y="178">Vertical Channel</Label>
    <Arrow x1="430" y1="178" x2="347" y2="180" />
    <text x="320" y="282" fill="#94a3b8" fontSize="13" textAnchor="middle">
      셀을 위로 쌓아 면적을 늘리지 않고 저장 용량을 높인다.
    </text>
  </VisualFrame>
);

const Lithography = () => (
  <VisualFrame>
    <circle cx="112" cy="88" r="38" fill="url(#hotGradient)" />
    <Label x="112" y="150">Light Source</Label>
    <rect x="230" y="62" width="126" height="52" rx="10" fill="#312e81" stroke="#a5b4fc" />
    <Label x="293" y="93">Mask</Label>
    <rect x="450" y="184" width="140" height="32" rx="8" fill="url(#waferGradient)" />
    <Label x="520" y="238">Wafer + Photoresist</Label>
    <Arrow x1="150" y1="90" x2="230" y2="90" />
    <Arrow x1="356" y1="92" x2="505" y2="184" />
    <path d="M470 184 L490 150 L510 184 L530 150 L550 184" stroke="#facc15" strokeWidth="4" fill="none" />
    <text x="320" y="282" fill="#94a3b8" fontSize="13" textAnchor="middle">
      빛으로 마스크 패턴을 감광액에 전사한 뒤 식각으로 회로를 만든다.
    </text>
  </VisualFrame>
);

const Transistor = () => (
  <VisualFrame>
    <rect x="128" y="214" width="380" height="32" rx="8" fill="#475569" />
    <rect x="176" y="152" width="92" height="62" rx="8" fill="#0369a1" stroke="#7dd3fc" />
    <rect x="372" y="152" width="92" height="62" rx="8" fill="#0369a1" stroke="#7dd3fc" />
    <Label x="222" y="188">Source</Label>
    <Label x="418" y="188">Drain</Label>
    <rect x="286" y="118" width="68" height="112" rx="12" fill="#166534" stroke="#86efac" />
    <Label x="320" y="105">Gate</Label>
    <path d="M268 184 C295 142 346 142 372 184" stroke="#facc15" strokeWidth="5" fill="none" />
    <Label x="320" y="178">Channel</Label>
    <text x="320" y="282" fill="#94a3b8" fontSize="13" textAnchor="middle">
      게이트가 채널의 전류 흐름을 제어한다. 미세화될수록 누설전류 제어가 핵심이다.
    </text>
  </VisualFrame>
);

const Packaging = () => (
  <VisualFrame>
    <rect x="80" y="218" width="480" height="34" rx="10" fill="#334155" stroke="#94a3b8" />
    <Label x="320" y="244">Package Substrate</Label>
    <rect x="130" y="122" width="152" height="70" rx="12" fill="#581c87" stroke="#d8b4fe" />
    <Label x="206" y="162">Logic Die</Label>
    <rect x="340" y="92" width="78" height="30" rx="8" fill="#064e3b" stroke="#34d399" />
    <rect x="350" y="126" width="78" height="30" rx="8" fill="#064e3b" stroke="#34d399" />
    <rect x="360" y="160" width="78" height="30" rx="8" fill="#064e3b" stroke="#34d399" />
    <Label x="468" y="144">HBM</Label>
    {[0, 1, 2, 3].map((dot) => (
      <circle key={dot} cx={165 + dot * 30} cy="204" r="7" fill="#fbbf24" />
    ))}
    {[0, 1, 2, 3].map((dot) => (
      <circle key={dot} cx={378 + dot * 18} cy="204" r="6" fill="#fbbf24" />
    ))}
    <text x="320" y="282" fill="#94a3b8" fontSize="13" textAnchor="middle">
      여러 die를 기판 위에서 고속으로 연결하고 열, 전원, 신호를 함께 관리한다.
    </text>
  </VisualFrame>
);

const DesignFlow = () => (
  <VisualFrame>
    {[
      ['Spec', 86],
      ['RTL', 190],
      ['Verify', 306],
      ['Layout', 430],
      ['Tapeout', 548],
    ].map(([label, x], index) => (
      <g key={label}>
        <rect x={x - 42} y="130" width="84" height="58" rx="12" fill="#1e293b" stroke="#60a5fa" />
        <Label x={x} y="164">{label}</Label>
        {index < 4 && <Arrow x1={x + 46} y1="160" x2={x + 78} y2="160" />}
      </g>
    ))}
    <text x="320" y="252" fill="#94a3b8" fontSize="13" textAnchor="middle">
      요구사항을 회로 설계, 검증, 배치배선으로 바꾸고 제조 데이터로 넘긴다.
    </text>
  </VisualFrame>
);

const AiAccelerator = () => (
  <VisualFrame>
    <rect x="92" y="104" width="116" height="116" rx="18" fill="#581c87" stroke="#d8b4fe" />
    <Label x="150" y="166">Compute</Label>
    <rect x="432" y="88" width="110" height="144" rx="18" fill="#064e3b" stroke="#34d399" />
    <Label x="487" y="164">HBM</Label>
    {[0, 1, 2].map((row) =>
      [0, 1, 2].map((col) => (
        <rect key={`${row}-${col}`} x={122 + col * 24} y={128 + row * 24} width="14" height="14" rx="3" fill="#f5d0fe" />
      ))
    )}
    <Arrow x1="212" y1="160" x2="428" y2="160" />
    <Arrow x1="428" y1="182" x2="212" y2="182" />
    <Label x="320" y="145">High bandwidth</Label>
    <text x="320" y="270" fill="#94a3b8" fontSize="13" textAnchor="middle">
      대량의 행렬 연산 유닛과 고대역폭 메모리가 함께 움직여 AI 계산을 처리한다.
    </text>
  </VisualFrame>
);

const GenericVisual = () => (
  <VisualFrame>
    <circle cx="160" cy="160" r="58" fill="#172554" stroke="#60a5fa" />
    <circle cx="320" cy="160" r="58" fill="#064e3b" stroke="#34d399" />
    <circle cx="480" cy="160" r="58" fill="#581c87" stroke="#d8b4fe" />
    <Arrow x1="218" y1="160" x2="262" y2="160" />
    <Arrow x1="378" y1="160" x2="422" y2="160" />
    <Label x="160" y="164">Design</Label>
    <Label x="320" y="164">Process</Label>
    <Label x="480" y="164">Product</Label>
    <text x="320" y="260" fill="#94a3b8" fontSize="13" textAnchor="middle">
      반도체 기술은 설계, 공정, 소재, 패키징, 제품 생태계 안에서 연결된다.
    </text>
  </VisualFrame>
);

const VISUALS = {
  'dram-cell': DramCell,
  'memory-cell': DramCell,
  'hbm-stack': HbmStack,
  'nand-stack': NandStack,
  lithography: Lithography,
  transistor: Transistor,
  packaging: Packaging,
  'wafer-process': Lithography,
  'design-flow': DesignFlow,
  'ip-block': DesignFlow,
  'ai-accelerator': AiAccelerator,
  materials: GenericVisual,
  'system-map': GenericVisual,
};

export const TechnologyVisual = ({ type }) => {
  const Visual = VISUALS[type] || GenericVisual;
  return (
    <div className="aspect-[2/1] overflow-hidden rounded-xl border border-border bg-background shadow-inner">
      <Visual />
    </div>
  );
};
