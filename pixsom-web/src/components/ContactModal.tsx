"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRight, Send, CheckCircle2, AlertCircle } from "lucide-react"

// --- Validation MVC ---
const formSchema = z.object({
    email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
    message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères." }),
    honey: z.string().optional() // Honeypot for simple bot protection
})

type FormData = z.infer<typeof formSchema>

export default function ContactModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange" // Enable real-time validation for isValid check
    })

    // --- Fake Server Action ---
    const onSubmit = async (data: FormData) => {
        if (data.honey) return // Bot trap

        setIsSubmitting(true)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Success Simulation
        setIsSuccess(true)
        setIsSubmitting(false)
        reset()
    }

    // Reset state when dialod closes/opens
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            // Add small delay to reset so user doesn't see it flicker
            setTimeout(() => {
                setIsSuccess(false)
                setIsSubmitting(false)
                reset()
            }, 300)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button id="cta-trigger-btn" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent rounded-full border border-white/20 overflow-hidden cursor-pointer transition-colors duration-300 hover:border-transparent z-10 w-auto">
                    {/* Expandable Fill Background */}
                    <div className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-[cubic-bezier(0.19,1,0.22,1)]" />

                    {/* Text Layer */}
                    <span className="relative z-10 font-semibold text-lg tracking-wide text-white group-hover:text-black transition-colors duration-500 delay-75">
                        Démarrer une collaboration
                    </span>

                    {/* Icon Layer */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-white group-hover:bg-black rounded-full text-black group-hover:text-white transition-colors duration-500 delay-75">
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
                    </div>
                </button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] max-w-[500px] md:max-w-[600px] bg-neutral-900 border border-neutral-800 text-white shadow-2xl p-6 md:p-10 rounded-2xl md:rounded-3xl">
                {isSuccess ? (
                    // --- SUCCESS STATE ---
                    <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold">Message envoyé !</h3>
                            <p className="text-neutral-400 max-w-xs mx-auto">
                                Merci de votre confiance. Nous vous répondrons sous 24h ouvrées.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                ) : (
                    // --- FORM STATE ---
                    <>
                        <DialogHeader className="space-y-4 md:space-y-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <DialogTitle className="text-[clamp(1.5rem,4vw,2.25rem)] font-light tracking-tight leading-tight">
                                Parlons de <span className="font-bold text-white">votre futur</span>
                            </DialogTitle>
                            <DialogDescription className="text-neutral-400 text-[clamp(0.875rem,2vw,1rem)] leading-relaxed max-w-[90%]">
                                Remplissez ce formulaire court. Nous revenons vers vous avec une vision.
                            </DialogDescription>
                        </DialogHeader>

                        <form className="grid gap-6 md:gap-8 py-4 md:py-6 relative" onSubmit={handleSubmit(onSubmit)}>
                            {/* Honeypot field (hidden) */}
                            <input type="text" className="hidden" {...register("honey")} />

                            <div className="space-y-2 group">
                                <Label htmlFor="email" className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold group-focus-within:text-white transition-colors">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={errors.email ? "" : "hello@votre-entreprise.com"}
                                    // Error styling
                                    className={`bg-transparent border-0 border-b rounded-none px-2 py-3 transition-all text-[16px] md:text-[clamp(0.9rem,1vw,1rem)] placeholder:text-neutral-600 
                                    ${errors.email
                                            ? "border-red-500 focus-visible:border-red-500"
                                            : "border-neutral-700 focus-visible:border-white focus-visible:pl-4"
                                        }
                                `}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="message" className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold group-focus-within:text-white transition-colors">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder={errors.message ? "" : "Dites-nous tout..."}
                                    className={`min-h-[100px] md:min-h-[140px] bg-transparent border-0 border-b rounded-none px-2 py-3 transition-all text-[16px] md:text-[clamp(0.9rem,1vw,1rem)] placeholder:text-neutral-600 resize-none leading-relaxed
                                    ${errors.message
                                            ? "border-red-500 focus-visible:border-red-500"
                                            : "border-neutral-700 focus-visible:border-white focus-visible:pl-4"
                                        }
                                `}
                                    {...register("message")}
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.message.message}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 md:pt-6">
                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className={`group relative w-full h-14 overflow-hidden rounded-lg font-bold text-[clamp(0.9rem,2vw,1.1rem)] tracking-wide transition-all duration-300
                                    ${!isValid
                                            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                                            : "bg-white text-black active:scale-[0.98] cursor-pointer"
                                        }
                                `}
                                >
                                    {/* Loading / Hover Overlay (Only if Valid) */}
                                    {isValid && (
                                        <div className={`absolute inset-0 w-full h-full bg-black transition-transform duration-500 origin-bottom ease-out ${isSubmitting ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                                    )}

                                    <div className="relative z-10 flex items-center justify-center w-full h-full overflow-hidden">

                                        {/* STATE: INVALID */}
                                        {!isValid && (
                                            <span>Remplissez les champs</span>
                                        )}

                                        {/* STATE: VALID (IDLE) */}
                                        {isValid && !isSubmitting && (
                                            <>
                                                {/* Text: C'est terminé ? (Before Hover) */}
                                                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-[150%]">
                                                    <span>C'est terminé ?</span>
                                                </div>

                                                {/* Text: Alors on y va ! (After Hover) */}
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0">
                                                    <span className="text-white">Alors on y va !</span>
                                                    <Send className="w-4 h-4 text-white -rotate-45" />
                                                </div>
                                            </>
                                        )}

                                        {/* STATE: SUBMITTING */}
                                        {isValid && isSubmitting && (
                                            <div className="flex items-center gap-2 text-white animate-pulse">
                                                <span>Envoi en cours...</span>
                                                <Send className="w-4 h-4 -rotate-45" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
