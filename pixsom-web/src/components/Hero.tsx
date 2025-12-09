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
        <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 text-white">

            <div className="max-w-4xl space-y-8">
                <h1
                    ref={titleRef}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
                >
                    Pixsom est un studio <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        créatif & technologique
                    </span>
                </h1>

                <p
                    ref={descRef}
                    className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
                >
                    Nous concevons des expériences digitales, des contenus vidéos et des solutions sur mesure pour les marques ambitieuses.
                    <br className="mt-4 block" />
                    <span className="text-white font-medium block mt-4">
                        L’agilité d’un studio. La vision stratégique d’une agence.
                    </span>
                </p>

                <div ref={btnRef} className="pt-8">
                    <ContactModal />
                </div>
            </div>

        </div>
    )
}
