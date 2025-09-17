type Props = { size: number; scale?: number };

export function Cat({ size, scale = 1.75 }: Props) {
  const S = size * scale;
  const headR = S * 0.36;
  // const ear   = S * 0.22;
  const eyeR  = S * 0.06;
  const eyeX  = S * 0.14;
  const eyeY  = -S * 0.02;
  const nose  = S * 0.06;
  const whisk = S * 0.22;

  return (
    <g style={{ pointerEvents: 'none' }}> {}
      {/* Tai trái / phải */}
      <polygon
        points={`${-headR*1.4},${-headR} ${-headR*0},${-headR*0.6} ${-headR},${-headR*0}`}
        fill="var(--cat)" stroke="var(--line)" strokeWidth={1}
      />
      <polygon
        points={`${ headR*1.4},${-headR} ${ headR*0},${-headR*0.6} ${ headR},${-headR*0}`}
        fill="var(--cat)" stroke="var(--line)" strokeWidth={1}
      />

      {/* Đầu */}
      <circle r={headR} fill="var(--cat)" stroke="var(--line)" strokeWidth={1.2} />

      {/* Mắt */}
      <circle cx={-eyeX} cy={eyeY} r={eyeR} fill="#0b0b0b" />
      <circle cx={ eyeX} cy={eyeY} r={eyeR} fill="#0b0b0b" />

      {/* Mũi */}
      <polygon points={`0,${nose*0.3} ${-nose},${nose*1.2} ${nose},${nose*1.2}`} fill="#2f2f2f" />

      {/* Râu hai bên */}
      <line x1={-nose*1.4} y1={nose*1.2} x2={-nose*1.4 - whisk}    y2={nose*1.2 - nose*0.4} stroke="#2f2f2f" strokeWidth={1}/>
      <line x1={-nose*1.4} y1={nose*1.5} x2={-nose*1.4 - whisk*0.9} y2={nose*1.5}             stroke="#2f2f2f" strokeWidth={1}/>
      <line x1={-nose*1.4} y1={nose*1.8} x2={-nose*1.4 - whisk}    y2={nose*1.8 + nose*0.4}  stroke="#2f2f2f" strokeWidth={1}/>

      <line x1={ nose*1.4} y1={nose*1.2} x2={ nose*1.4 + whisk}    y2={nose*1.2 - nose*0.4} stroke="#2f2f2f" strokeWidth={1}/>
      <line x1={ nose*1.4} y1={nose*1.5} x2={ nose*1.4 + whisk*0.9} y2={nose*1.5}            stroke="#2f2f2f" strokeWidth={1}/>
      <line x1={ nose*1.4} y1={nose*1.8} x2={ nose*1.4 + whisk}    y2={nose*1.8 + nose*0.4}  stroke="#2f2f2f" strokeWidth={1}/>
    </g>
  );
}
