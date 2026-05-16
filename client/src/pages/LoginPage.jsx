import LoginForm from '../components/auth/LoginForm'
import {TacticalSidebar} from "../components/auth/TacticalSidebar.jsx";

export default function LoginPage() {
    return (
        <div className="min-h-svh bg-background blueprint-grid flex items-center justify-center p-4 md:p-10">
            <main className="w-full max-w-[1280px] bg-surface-container border border-outline-variant grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <TacticalSidebar />
                <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-12">
                    <LoginForm />
                </div>
            </main>
        </div>
    )
}