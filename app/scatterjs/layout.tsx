import ScatterNavbar from "@/components/ScatterNavbar";

export const metadata = {
  title: "Scatter.js | Decentralized Edge AI",
  description: "Web-native federated learning infrastructure for the open web.",
};

export default function ScatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScatterNavbar />
      {children}
    </>
  );
}
