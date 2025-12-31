import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
    return (
        <motion.a
            href="#home"
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <svg
                width="60"
                height="60"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
            >
                {/* Outer hexagon - AI/Tech frame */}
                <motion.path
                    d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Inner glow circle */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="28"
                    fill="url(#gradient2)"
                    opacity="0.1"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Letter L */}
                <motion.path
                    d="M 35 35 L 35 65 L 50 65"
                    stroke="#06b6d4"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />

                {/* Letter A */}
                <motion.path
                    d="M 55 65 L 62 35 L 69 65"
                    stroke="#a855f7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                />

                {/* A crossbar */}
                <motion.path
                    d="M 58 52 L 66 52"
                    stroke="#a855f7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                />

                {/* Neural network dots */}
                <motion.circle
                    cx="25"
                    cy="25"
                    r="2"
                    fill="#06b6d4"
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0,
                    }}
                />
                <motion.circle
                    cx="75"
                    cy="25"
                    r="2"
                    fill="#a855f7"
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5,
                    }}
                />
                <motion.circle
                    cx="25"
                    cy="75"
                    r="2"
                    fill="#a855f7"
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1,
                    }}
                />
                <motion.circle
                    cx="75"
                    cy="75"
                    r="2"
                    fill="#06b6d4"
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1.5,
                    }}
                />

                {/* Gradients */}
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                    <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
            </svg>

            {/* Hover glow effect */}
            <motion.div
                className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                style={{
                    background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(168,85,247,0.3) 100%)',
                }}
            />

            {/* Brand name on hover */}
            <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"

            >
                <span className="text-xs font-mono text-slate-400">Leandro Alvarez</span>
            </motion.div>
        </motion.a>
    );
};

export default Logo;
