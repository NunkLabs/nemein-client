import dynamic from "next/dynamic";

const MyStage = dynamic(() => import("./(game)/Game"), { ssr: false });

export default function HomePage() {
  return (
    <div className="bg-gray-800 h-screen min-w-fit relative">
      <MyStage />
    </div>
  );
}
