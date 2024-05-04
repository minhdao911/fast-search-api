import { HiOutlineLightningBolt } from "react-icons/hi";
import Search from "./components/search";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24">
      <div className="flex flex-col items-center">
        <div className="flex gap-2 items-center text-[50px]">
          <h1>SpeedSearch</h1>
          <HiOutlineLightningBolt />
        </div>
        <p className="text-xl text-gray-700">
          High-performance API that returns the results in milliseconds
        </p>
      </div>
      <Search />
    </main>
  );
}
