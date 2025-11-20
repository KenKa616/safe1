import React from 'react';

interface BarcodeProps {
  code: string;
  className?: string;
}

const Barcode: React.FC<BarcodeProps> = ({ code, className = "" }) => {
  // Deterministically generate line widths based on the code characters
  const lines = code.split('').map((char, i) => {
    const val = char.charCodeAt(0);
    return {
      width: val % 3 === 0 ? 3 : val % 2 === 0 ? 2 : 1,
      color: 'black'
    };
  });

  return (
    <div className={`flex flex-col items-center bg-white p-2 rounded-sm ${className}`}>
      <div className="flex items-end h-8 gap-[1px] w-full justify-center overflow-hidden">
        {lines.map((line, idx) => (
          <div
            key={idx}
            style={{
              width: `${line.width * 1.5}px`,
              height: `${100 - (idx % 5) * 5}%`
            }}
            className="bg-black"
          />
        ))}
        {/* Add simplified guards */}
        <div className="w-[2px] h-full bg-black mx-[1px]"></div>
        <div className="w-[2px] h-full bg-black mx-[1px]"></div>
      </div>
      <span className="font-mono text-[10px] tracking-widest text-black mt-1 font-bold">
        {code}
      </span>
    </div>
  );
};

export default Barcode;