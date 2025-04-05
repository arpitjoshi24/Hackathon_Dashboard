"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    
    if (pathname === "/Participants" || pathname === "/clock") {
      const timer = setInterval(() => {
        
        router.push(pathname === "/Participants" ? "/clock" : "/Participants");
      }, 10000); // 10 seconds

      return () => clearInterval(timer); 
    }
  }, [pathname, router]); 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-5">
      
      
      <h1 className="text-6xl font-extrabold mb-10 text-yellow-300">
        Hackathon Dashboard
      </h1>
      
     
      <div className="flex flex-col space-y-4">
        
        <Link href="/admin" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all">
          Go to Admin Page
        </Link>

        <Link href="/Participants" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all">
          Go to Participant Page
        </Link>

        <Link href="/clock" className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all">
          Clock
        </Link>

      </div>
    </div>
  );
}
