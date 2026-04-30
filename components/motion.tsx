'use client'

import { motion, type HTMLMotionProps, useMotionValue, useSpring } from 'framer-motion'
import { type ReactNode, useRef } from 'react'

// Fade in animation
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = '',
  ...props 
}: { 
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Fade in when in view with dramatic effect
export function FadeInView({ 
  children, 
  delay = 0, 
  duration = 0.8,
  className = '',
  direction = 'up',
  ...props 
}: { 
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
} & HTMLMotionProps<'div'>) {
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animations
export function StaggerContainer({ 
  children, 
  delay = 0,
  staggerDelay = 0.12,
  className = '',
  ...props 
}: { 
  children: ReactNode
  delay?: number
  staggerDelay?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger item with spring physics
export function StaggerItem({ 
  children, 
  className = '',
  ...props 
}: { 
  children: ReactNode
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Magnetic hover effect
export function MagneticHover({ 
  children, 
  className = '',
  strength = 0.3,
  ...props 
}: { 
  children: ReactNode
  className?: string
  strength?: number
} & HTMLMotionProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// 3D Tilt card effect
export function TiltCard({ 
  children, 
  className = '',
  tiltStrength = 10,
  ...props 
}: { 
  children: ReactNode
  className?: string
  tiltStrength?: number
} & HTMLMotionProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  void tiltStrength

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scale on hover with glow
export function HoverScale({ 
  children, 
  scale = 1.03,
  className = '',
  ...props 
}: { 
  children: ReactNode
  scale?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Float animation with rotation
export function Float({ 
  children, 
  duration = 4,
  y = 15,
  rotate = 3,
  className = '',
  ...props 
}: { 
  children: ReactNode
  duration?: number
  y?: number
  rotate?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      animate={{ 
        y: [-y/2, y/2, -y/2],
        rotate: [-rotate/2, rotate/2, -rotate/2]
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Slide in animation
export function SlideIn({ 
  children, 
  delay = 0, 
  duration = 0.8,
  direction = 'left',
  className = '',
  ...props 
}: { 
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  className?: string
} & HTMLMotionProps<'div'>) {
  const directions = {
    left: { x: -80, y: 0 },
    right: { x: 80, y: 0 },
    up: { x: 0, y: -80 },
    down: { x: 0, y: 80 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Blur reveal with scale
export function BlurReveal({ 
  children, 
  delay = 0,
  className = '',
  ...props 
}: { 
  children: ReactNode
  delay?: number
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.9 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Reveal text character by character
export function TextReveal({ 
  text, 
  delay = 0,
  className = '',
}: { 
  text: string
  delay?: number
  className?: string
}) {
  const words = text.split(' ')

  return (
    <motion.span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: delay + (wordIndex * 0.1) + (charIndex * 0.03),
                ease: [0.22, 1, 0.36, 1]
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.span>
  )
}

// Animated gradient border
export function GradientBorder({ 
  children, 
  className = '',
  borderWidth = 2,
  ...props 
}: { 
  children: ReactNode
  className?: string
  borderWidth?: number
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-75"
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--accent), var(--primary))',
          backgroundSize: '200% 200%',
          padding: borderWidth,
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <div className="relative rounded-2xl bg-card">
        {children}
      </div>
    </motion.div>
  )
}

// Pulse animation
export function Pulse({ 
  children, 
  className = '',
  ...props 
}: { 
  children: ReactNode
  className?: string
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Counter animation
export function AnimatedCounter({ 
  value, 
  duration = 2,
  className = '' 
}: { 
  value: number
  duration?: number
  className?: string
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      {value.toLocaleString()}
    </motion.span>
  )
}

// Morphing blob background
export function MorphingBlob({ 
  className = '',
  color = 'primary'
}: { 
  className?: string
  color?: 'primary' | 'accent'
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl ${
        color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
      } ${className}`}
    />
  )
}
