import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)

    // Set global defaults
    gsap.defaults({
        ease: 'power2.out',
        duration: 0.8
    })
}

export { gsap, ScrollTrigger }
