import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { signinLink } from "../utils/links";

const Signin = () => {

    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        setLoading(true);

        try {
            const res = await axios.post(signinLink, {
                email, 
                password
            }, { withCredentials: true });
            
            toast.success(res.data.message);
            setUser(res.data.user);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally{
            setLoading(false);
        }
    } 

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
            <Toaster position="top-center" />
            <section className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-800 bg-[linear-gradient(135deg,#020617_15%,#0f172a_55%,#111827_100%)] p-6 shadow-2xl shadow-slate-950/60 sm:p-10">
                <h1 className="text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">Sign In to Your Account</h1>

                <form onSubmit={handleSignin} className="flex flex-col gap-5">
                    <section className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-200">Email Address</label>
                        <input type="email" name="email" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20" placeholder="Enter your email address" required />
                    </section>
                    <section className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-200">Password</label>
                        <input type="password" name="password" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20" placeholder="Enter your password" required />
                    </section>
                    <button type="submit" className={`mt-2 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`} disabled={loading}>Sign In</button>
                </form>

                <p className="text-center text-sm text-slate-300">
                    Don&apos;t have an account? <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">Sign Up</Link>
                </p>
            </section>
        </main>
    )
}

export default Signin;