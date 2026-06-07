export default function Readout({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[14.5px] text-[#A1A1A1] leading-[1.62] border-l-[3px] border-[#FF3B30] pl-[18px] py-1 my-6 -mt-4 mb-8">
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#FF3B30] block mb-[7px] font-semibold">
        How to read it
      </span>
      {children}
    </div>
  );
}
