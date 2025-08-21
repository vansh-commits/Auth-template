import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "@/components/SignOutButton";
export default async function Dashboard() {
    const session = await auth(); // server-only; returns token/session
    if (!session?.user?.id) {
        redirect("/");
    }
    return (<div className='bg-gray-950 h-screen flex flex-col items-center justify-center text-white'>
        <div className='text-2xl mb-4 p-1.5'>
            Private dashboard for {session.user.name}
        </div>
        <SignOutButton />
        
    </div>)
}
