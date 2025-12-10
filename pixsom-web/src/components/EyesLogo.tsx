"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"

export default function EyesLogo() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Group Refs (For Tremble)
    const leftEyeGroupRef = useRef<SVGGElement>(null)
    const rightEyeGroupRef = useRef<SVGGElement>(null)

    // Pupil Refs (For Tracking)
    const leftPupilGroupRef = useRef<SVGGElement>(null)
    const rightPupilGroupRef = useRef<SVGGElement>(null)

    // Lid Refs
    const leftUpperLidRef = useRef<SVGPathElement>(null)
    const rightUpperLidRef = useRef<SVGPathElement>(null)
    const leftLowerLidRef = useRef<SVGPathElement>(null)
    const rightLowerLidRef = useRef<SVGPathElement>(null)

    // Pupil Circle Refs (For Scaling)
    const leftPupilCircleRef = useRef<SVGCircleElement>(null)
    const rightPupilCircleRef = useRef<SVGCircleElement>(null)

    // Track current state
    const stateRef = useRef("sad")
    const trembleTweenRef = useRef<gsap.core.Tween | null>(null)

    useEffect(() => {
        // --- INIT ---
        // Set initial pupil positions to center (30, 45)
        gsap.set([leftPupilGroupRef.current, rightPupilGroupRef.current], { x: 30, y: 45 })

        // Initial Upper Lid (Bored)
        const initUpperPath = "M -10,35 L -10,-50 L 70,-50 L 70,35 Q 30,55 -10,35"
        gsap.set([leftUpperLidRef.current, rightUpperLidRef.current], { attr: { d: initUpperPath } })

        // Initial Lower Lid (Hidden/Down)
        // Coords: Eye bottom is ~90. We start below.
        // M -10,100 L 70,100 L 70,120 L -10,120 Z (Rectangle below)
        const initLowerPath = "M -10,100 L 70,100 L 70,130 L -10,130 Z"
        gsap.set([leftLowerLidRef.current, rightLowerLidRef.current], { attr: { d: initLowerPath } })

        const handleMouseMove = (e: MouseEvent) => {
            const ctaBtn = document.getElementById("cta-trigger-btn")
            if (!containerRef.current || !leftPupilGroupRef.current || !rightPupilGroupRef.current) return

            // --- 1. INDEPENDENT PUPIL TRACKING ---
            const leftEyeRect = leftEyeGroupRef.current?.getBoundingClientRect()
            const rightEyeRect = rightEyeGroupRef.current?.getBoundingClientRect()

            if (leftEyeRect && rightEyeRect) {
                // Centers
                const leftCx = leftEyeRect.left + leftEyeRect.width / 2
                const rightCx = rightEyeRect.left + rightEyeRect.width / 2
                const leftCy = leftEyeRect.top + leftEyeRect.height / 2
                const rightCy = rightEyeRect.top + rightEyeRect.height / 2

                // Left
                const dxL = e.clientX - leftCx
                const dyL = e.clientY - leftCy
                const angleL = Math.atan2(dyL, dxL)
                const distL = Math.sqrt(dxL * dxL + dyL * dyL)
                const moveL = Math.min(distL * 0.15, 12)
                const pXL = 30 + Math.cos(angleL) * moveL
                const pYL = 45 + Math.sin(angleL) * (moveL * 1.5)

                // Right
                const dxR = e.clientX - rightCx
                const dyR = e.clientY - rightCy
                const angleR = Math.atan2(dyR, dxR)
                const distR = Math.sqrt(dxR * dxR + dyR * dyR)
                const moveR = Math.min(distR * 0.15, 12)
                const pXR = 30 + Math.cos(angleR) * moveR
                const pYR = 45 + Math.sin(angleR) * (moveR * 1.5)

                gsap.to(leftPupilGroupRef.current, { x: pXL, y: pYL, duration: 0.1, overwrite: "auto" })
                gsap.to(rightPupilGroupRef.current, { x: pXR, y: pYR, duration: 0.1, overwrite: "auto" })
            }

            // --- 2. EMOTION LOGIC ---
            const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
            let isHovering = false
            if (hoveredElement) {
                if (hoveredElement.closest("#cta-trigger-btn")) isHovering = true
                else if (hoveredElement.closest("button")?.id === "cta-trigger-btn") isHovering = true
            }

            if (ctaBtn) {
                const ctaRect = ctaBtn.getBoundingClientRect()
                const ctaCenter = { x: ctaRect.left + ctaRect.width / 2, y: ctaRect.top + ctaRect.height / 2 }
                const distToCta = Math.sqrt(Math.pow(e.clientX - ctaCenter.x, 2) + Math.pow(e.clientY - ctaCenter.y, 2))

                let nuance = "bored"
                if (isHovering) nuance = "happy" // Was star
                else if (distToCta < 300) nuance = "excited"
                else if (distToCta < 600) nuance = "normal"
                else nuance = "bored"

                if (stateRef.current !== nuance) {
                    stateRef.current = nuance
                    animateState(nuance)
                }
            }
        }

        const animateState = (mood: string) => {
            // PROPS
            let upperLidPath = ""
            let lowerLidPath = ""
            let pupilScale = 1
            let shouldTremble = false

            // Lower Lid Paths:
            // Down/Hidden: "M -10,100 L 70,100 L 70,130 L -10,130 Z"
            // Up/Squint: "M -10,65 L 70,65 L 70,130 L -10,130 Q 30,55 -10,65" ? No, just a curve up
            // Curve: "M -10,70 Q 30,50 70,70 L 70,130 L -10,130 Z" -> Rising curve FROM bottom

            const lowerLidHidden = "M -10,100 L 70,100 L 70,130 L -10,130 Z"
            const lowerLidSquint = "M -10,60 Q 30,80 70,60 L 70,130 L -10,130 Z" // Inverted curve logic for bottom lid?
            // Actually, for a happy eye, the lower lid curves UPWARDS (convex).
            // Correct path: Start Left, Curve UP to Middle, End Right.
            // M -10,80 Q 30,50 70,80 ...
            const lowerLidHappy = "M -10,80 Q 30,50 70,80 L 70,130 L -10,130 Z"

            if (mood === "bored") {
                // Upper Droopy, Lower Hidden, No Shake
                upperLidPath = "M -10,35 L -10,-50 L 70,-50 L 70,35 Q 30,55 -10,35"
                lowerLidPath = lowerLidHidden
                pupilScale = 1
                shouldTremble = false
            } else if (mood === "normal") {
                // Upper Normal, Lower Hidden, No Shake
                upperLidPath = "M -10,5 L -10,-50 L 70,-50 L 70,5 Q 30,-10 -10,5"
                lowerLidPath = lowerLidHidden
                pupilScale = 1
                shouldTremble = false
            } else if (mood === "excited") {
                // Upper OPEN, Lower Hidden, TREMBLE
                upperLidPath = "M -10,-5 L -10,-50 L 70,-50 L 70,-5 Q 30,-25 -10,-5"
                lowerLidPath = lowerLidHidden
                pupilScale = 1.3
                shouldTremble = true
            } else if (mood === "happy") {
                // Upper Normal/Open, LOWER UP (Squint), TREMBLE
                upperLidPath = "M -10,15 L -10,-50 L 70,-50 L 70,15 Q 30,0 -10,15" // Slightly relaxed upper
                lowerLidPath = lowerLidHappy // SQUINT!
                pupilScale = 1.3
                shouldTremble = true
            }

            // 1. Animate Lids
            gsap.to([leftUpperLidRef.current, rightUpperLidRef.current], {
                attr: { d: upperLidPath },
                duration: 0.4,
                ease: "power3.out"
            })
            gsap.to([leftLowerLidRef.current, rightLowerLidRef.current], {
                attr: { d: lowerLidPath },
                duration: 0.4,
                ease: "back.out(1.4)"
            })

            // 2. Animate Pupil
            gsap.to([leftPupilCircleRef.current, rightPupilCircleRef.current], {
                scale: pupilScale,
                duration: 0.3,
                transformOrigin: "center center"
            })

            // 3. Tremble Logic
            if (shouldTremble) {
                // Start shaking if not already
                if (!trembleTweenRef.current?.isActive()) {
                    trembleTweenRef.current = gsap.to([leftEyeGroupRef.current, rightEyeGroupRef.current], {
                        x: "+=1.5",
                        y: "+=1.5",
                        yoyo: true,
                        repeat: -1,
                        duration: 0.05,
                        ease: "sine.inOut"
                    })
                }
            } else {
                // Stop shakking
                if (trembleTweenRef.current) {
                    trembleTweenRef.current.kill()
                    trembleTweenRef.current = null
                    // Reset to neutral translation (but we need to keep the group translation!)
                    // The group transforms are: translate(60, 30) and translate(130, 30).
                    // GSAP overwrites transforms. We must return to base.
                    gsap.to(leftEyeGroupRef.current, { x: 0, y: 0, duration: 0.2, clearProps: "x,y" }) // This clears the shake offset
                    gsap.to(rightEyeGroupRef.current, { x: 0, y: 0, duration: 0.2, clearProps: "x,y" })
                }
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 250 150" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
                <defs>
                    <clipPath id="eyeContentClip">
                        <ellipse cx="30" cy="45" rx="30" ry="45" />
                    </clipPath>
                </defs>

                {/* --- LEFT EYE GROUP --- */}
                {/* Note: We use a wrapper group for positioning, and the inner ref group for trembling */}
                <g transform="translate(60, 30)">
                    <g ref={leftEyeGroupRef}>
                        {/* Sclera */}
                        <ellipse cx="30" cy="45" rx="30" ry="45" fill="white" />

                        {/* Content (Pupil + Lids) -> CLIPPED */}
                        <g clipPath="url(#eyeContentClip)">
                            {/* Pupil */}
                            <g ref={leftPupilGroupRef}>
                                <circle ref={leftPupilCircleRef} r="13" fill="#1F2937" />
                                <circle className="pupil-shine" cx="-5" cy="-5" r="3.5" fill="white" />
                            </g>

                            {/* Upper Eyelid */}
                            <path ref={leftUpperLidRef} fill="white" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />

                            {/* Lower Eyelid (New) */}
                            <path ref={leftLowerLidRef} fill="white" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        </g>

                        {/* Border Stroke */}
                        <ellipse cx="30" cy="45" rx="30" ry="45" fill="none" stroke="#9CA3AF" strokeWidth="6" />
                    </g>
                </g>

                {/* --- RIGHT EYE GROUP --- */}
                <g transform="translate(130, 30)">
                    <g ref={rightEyeGroupRef}>
                        {/* Sclera */}
                        <ellipse cx="30" cy="45" rx="30" ry="45" fill="white" />

                        {/* Content */}
                        <g clipPath="url(#eyeContentClip)">
                            <g ref={rightPupilGroupRef}>
                                <circle ref={rightPupilCircleRef} r="13" fill="#1F2937" />
                                <circle className="pupil-shine" cx="-5" cy="-5" r="3.5" fill="white" />
                            </g>

                            <path ref={rightUpperLidRef} fill="white" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                            <path ref={rightLowerLidRef} fill="white" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        </g>

                        {/* Border */}
                        <ellipse cx="30" cy="45" rx="30" ry="45" fill="none" stroke="#9CA3AF" strokeWidth="6" />
                    </g>
                </g>
            </svg>
        </div>
    )
}
