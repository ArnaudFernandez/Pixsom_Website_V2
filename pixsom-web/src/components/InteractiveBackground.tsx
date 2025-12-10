"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"

export default function InteractiveBackground() {
    const containerRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current || !bgRef.current || !logoRef.current) return

        const bg = bgRef.current
        const logo = logoRef.current

        // GSAP Setup
        // Background moves slower (far away)
        const bgX = gsap.quickTo(bg, "x", { duration: 1, ease: "power3" })
        const bgY = gsap.quickTo(bg, "y", { duration: 1, ease: "power3" })

        // Logo moves faster (closer) -> Parallax effect
        const logoX = gsap.quickTo(logo, "x", { duration: 0.6, ease: "power3" })
        const logoY = gsap.quickTo(logo, "y", { duration: 0.6, ease: "power3" })

        // Tilt/Rotation for the container to add 3D feel
        const rotX = gsap.quickTo(containerRef.current, "rotationY", { duration: 1, ease: "power3" })
        const rotY = gsap.quickTo(containerRef.current, "rotationX", { duration: 1, ease: "power3" })

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window

            // Normalized coordinates (-1 to 1)
            const xNorm = (e.clientX / innerWidth - 0.5) * 2
            const yNorm = (e.clientY / innerHeight - 0.5) * 2

            // Move amounts (pixels)
            bgX(-xNorm * 30)   // Background moves slightly opposite
            bgY(-yNorm * 30)

            logoX(xNorm * 80)  // Logo moves more (appears closer)
            logoY(yNorm * 80)

            // 3D Rotation
            rotX(xNorm * 10)
            rotY(-yNorm * 10)
        }

        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (!e.gamma || !e.beta) return

            const gamma = Math.min(Math.max(e.gamma, -45), 45)
            const beta = Math.min(Math.max(e.beta, -45), 45)

            // Normalize
            const xNorm = gamma / 45
            const yNorm = (beta - 45) / 45

            bgX(-xNorm * 40)
            bgY(-yNorm * 40)

            logoX(xNorm * 90)
            logoY(yNorm * 90)

            rotX(xNorm * 15)
            rotY(-yNorm * 15)
        }

        if (window.matchMedia("(pointer: coarse)").matches && typeof DeviceOrientationEvent !== 'undefined') {
            window.addEventListener("deviceorientation", handleOrientation)
        } else {
            window.addEventListener("mousemove", handleMouseMove)
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("deviceorientation", handleOrientation)
        }
    }, [])

    return (
        <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden bg-black">
            {/* 
               Background Gradients
               Deep, dark atmosphere
            */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#050510] to-black opacity-80" />

            {/* 3D Scene Container */}
            <div
                ref={containerRef}
                className="relative w-full h-full perspective-1000 flex items-center justify-center"
                style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >

                {/* Layer 1: Electric Logo Background */}
                <div
                    ref={logoRef}
                    className="absolute w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] max-w-[600px] max-h-[600px] flex items-center justify-center pointer-events-none"
                    style={{
                        transform: "translateZ(-20px)", // Slightly behind content
                    }}
                >
                    {/* Electric Glow (Rotating Conic Gradient) */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-[-20%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_100deg,#60A5FA_180deg,transparent_260deg,transparent_360deg)] opacity-20 blur-3xl animate-[spin_8s_linear_infinite]" />
                        <div className="absolute inset-[-20%] bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,transparent_100deg,#A855F7_180deg,transparent_260deg,transparent_360deg)] opacity-20 blur-3xl animate-[spin_8s_linear_infinite_reverse]" />
                    </div>

                    {/* Logo Image (Contained) */}
                    <img
                        src="/Pxm_Logo_FILLED_Gradient.svg"
                        alt="Pixsom Logo Background"
                        className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(96,165,250,0.15)] opacity-80"
                    />
                </div>

                {/* 
                   Note: EyesLogo is removed from here. 
                   It will be placed inside Hero.tsx to be part of the flow.
                */}

            </div>
        </div>
    )
}
