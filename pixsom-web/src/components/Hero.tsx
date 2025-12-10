"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import ContactModal from "./ContactModal"

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)
    const btnRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                delay: 0.2
            })
                .from(descRef.current, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                }, "-=0.8")
                .from(btnRef.current, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8
                }, "-=0.6")

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-10 text-white font-sans">

            <div className="max-w-[90rem] space-y-12 relative">
                {/* 
                   Huge Typography 
                   Using CSS variable for font-family if tailwind config isn't set up yet: style={{ fontFamily: 'var(--font-outfit)' }} 
                   But usually we add it to tailwind. I will use the class 'font-[family-name:var(--font-outfit)]' for now to be safe.
                */}
                <h1
                    ref={titleRef}
                    className="font-[family-name:var(--font-outfit)] font-black tracking-tighter leading-none select-none"
                    style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)" }} // Massive responsive size
                >
                    <span className="block text-white mb-2">Pixsom</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-white animate-gradient-x opacity-90">
                        Studio Créatif.
                    </span>
                </h1>

                <p
                    ref={descRef}
                    className="text-xl md:text-3xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
                >
                    Expériences digitales & solutions sur mesure.
                </p>

                <div ref={btnRef} className="pt-8">
                    <ContactModal />
                </div>
            </div>

        </div>
    )
}
