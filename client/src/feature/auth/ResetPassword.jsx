import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";
import { Shield, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password) return;

        setLoading(true);
        const id = toast.loading("Resetting password...");
        try {
            const res = await api.post(`/users/reset-password/${token}`, { password });
            toast.success(res.data.message || "Password successfully changed!", { id });
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password", { id });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] via-[#f8f9fa] to-[#eef2ff] p-4">
            <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#ede9ff] opacity-60 blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#fce8f3] opacity-40 blur-3xl relative" />
            </div>

            <div className="max-w-md w-full pastel-card p-8 space-y-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-[#a78bfa] to-[#8b7cf6] p-2 rounded-xl shadow-md">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#3d3654]">New Password</h1>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-[#3d3654]">Reset Password</h3>
                    <p className="text-sm text-[#7c73a0] mt-1">Please enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-[#7c73a0] uppercase tracking-wider">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11 bg-[#f8f7ff] border-[#e5e1ff] text-[#3d3654] placeholder:text-[#bcb8d8] focus-visible:ring-[#c4b8ff] focus-visible:ring-2 focus-visible:border-[#a78bfa] rounded-xl pr-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a09ac0] hover:text-[#8b7cf6] transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-gradient-to-r from-[#a78bfa] to-[#8b7cf6] hover:from-[#9b72fb] hover:to-[#7c6de8] text-white font-semibold rounded-xl shadow-sm disabled:opacity-60 transition-all"
                    >
                        {loading ? "Saving…" : "Reset Password"}
                    </Button>

                    <div className="text-center text-sm mt-4">
                        <Link to="/login" className="text-[#8b7cf6] hover:text-[#6d5ce8] transition-colors font-medium">
                            &larr; Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
