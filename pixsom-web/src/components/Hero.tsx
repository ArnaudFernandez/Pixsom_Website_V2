"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import ContactModal from "./ContactModal"

import EyesLogo from "./EyesLogo"

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const eyesRef = useRef<HTMLDivElement>(null)
    const btnRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

            // Staggered Reveal
            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                delay: 0.2
            })
                .from(eyesRef.current, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 1
                }, "-=0.8")
                .from(btnRef.current, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8
                }, "-=0.6")

            // Parallax Setup (High Performance)
            // Using quickTo for smooth, non-laggy tracking
            const eyeX = gsap.quickTo(eyesRef.current, "x", { duration: 0.5, ease: "power3" })
            const eyeY = gsap.quickTo(eyesRef.current, "y", { duration: 0.5, ease: "power3" })
            const eyeRotX = gsap.quickTo(eyesRef.current, "rotationX", { duration: 0.5, ease: "power3" })
            const eyeRotY = gsap.quickTo(eyesRef.current, "rotationY", { duration: 0.5, ease: "power3" })

            const titleX = gsap.quickTo(titleRef.current, "x", { duration: 0.8, ease: "power3" })
            const titleY = gsap.quickTo(titleRef.current, "y", { duration: 0.8, ease: "power3" })

            const handleMouseMove = (e: MouseEvent) => {
                if (!eyesRef.current || !titleRef.current) return

                const { innerWidth, innerHeight } = window
                const xNorm = (e.clientX / innerWidth - 0.5) * 2
                const yNorm = (e.clientY / innerHeight - 0.5) * 2

                // Update tracked values
                eyeX(xNorm * 40)
                eyeY(yNorm * 40)
                eyeRotY(xNorm * 12)  // Rotate Y based on X movement
                eyeRotX(-yNorm * 12) // Rotate X based on Y movement

                titleX(xNorm * 15)
                titleY(yNorm * 15)
            }

            // Always add listener
            window.addEventListener("mousemove", handleMouseMove)

            return () => window.removeEventListener("mousemove", handleMouseMove)

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 font-sans selection:bg-purple-500 selection:text-white perspective-1000">

            {/* Main Content Stack */}
            <div className="w-full max-w-[90rem] flex flex-col items-center gap-8 md:gap-12 pt-10 perspective-1000">

                {/* 1. Title Block */}
                <h1
                    ref={titleRef}
                    className="font-[family-name:var(--font-outfit)] font-black tracking-tighter leading-[0.9] select-none uppercase flex flex-col items-center gap-2"
                >
                    {/* Primary Name - Metallic Gradient */}
                    <span
                        className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-2xl"
                        style={{ fontSize: "clamp(4rem, 11vw, 10rem)" }}
                    >
                        PIXSOM
                    </span>

                    {/* Sub-headline: Creative & Tech */}
                    <span
                        className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 font-bold tracking-widest mt-2"
                        style={{ fontSize: "clamp(1rem, 2.5vw, 2rem)" }}
                    >
                        STUDIO CRÉATIF & TECHNOLOGIQUE
                    </span>
                </h1>

                {/* 2. The Mascot (Eyes) - In Flow with 3D Parallax */}
                <div
                    ref={eyesRef}
                    className="w-[280px] h-[160px] md:w-[350px] md:h-[200px] relative z-20 hover:scale-105 will-change-transform"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <EyesLogo />
                </div>

                {/* 3. CTA */}
                <div ref={btnRef} className="pb-10">
                    <ContactModal />
                </div>
            </div>

        </div>
    )
}
