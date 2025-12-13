'use client';

import React from 'react';
import { CONTENT } from '@/lib/dictionary';
import { motion } from 'framer-motion';

export const CVDownloadButton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed top-6 right-6 z-50"
        >
            <a
                href="/resume/johnpino_resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-white/80 backdrop-blur-md border border-white/20 rounded-full text-slate-800 hover:bg-white hover:border-white/40 shadow-sm transition-all text-sm font-medium"
                download
            >
                <span>{CONTENT.global.downloadCV}</span>
                <div className="p-1.5 rounded-full bg-accent-pink text-white group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
            </a>
        </motion.div>
    );
};
