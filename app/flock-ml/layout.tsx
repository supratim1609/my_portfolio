import FlockNavbar from "@/components/FlockNavbar";

export const metadata = {
  title: "Flock.js | Decentralized Edge AI",
  description: "A web-native framework for crowdsourced machine learning using 8-bit quantization and differential privacy.",
};

export default function FlockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#050505] min-h-screen text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white">
      <FlockNavbar />
      {children}
    </div>
  );
}
