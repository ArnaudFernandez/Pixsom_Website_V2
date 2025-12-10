"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import EyesLogo from "./EyesLogo"

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
        <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#050510] to-black">

            {/* 3D Scene Container */}
            <div
                ref={containerRef}
                className="relative w-[80vw] h-[70vh] md:w-[60vw] md:h-[60vh] perspective-1000 flex items-center justify-center"
                style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >

                {/* Layer 1: Background (Far, Blurred) */}
                <div
                    ref={bgRef}
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl opacity-60"
                    style={{
                        transform: "translateZ(-50px)", // Push back
                    }}
                >
                    <div
                        className="w-full h-full bg-cover bg-center scale-110 blur-[2px]"
                        style={{ backgroundImage: "url('/background.png')" }}
                    />
                    {/* Dark overlay for text contrast */}
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                import EyesLogo from "./EyesLogo"

                // ... (in the JSX)

                <div
                    ref={logoRef}
                    className="absolute w-64 h-32 md:w-96 md:h-48 pointer-events-none" // Adjusted proportions for 2:1 eyes
                    style={{
                        transform: "translateZ(50px)", // Pull forward
                    }}
                >
                    <EyesLogo />
                </div>

            </div>
        </div>
    )
}
