// This dictionary centralizes all static text content.
// Structure is designed to mirror a potential future CMS content model (e.g., Contentful).

export const CONTENT = {
    global: {
        loading: "Generating layout...",
        error: "Failed to load content.",
        empty: "No layout configuration provided.",
    },
    hero: {
        title: "John Pino",
        subtitle: "Frontend Technical Lead & AI-Native Architect.\nBuilding scalable, composable web ecosystems and redefining engineering workflows with Artificial Intelligence.",
        cta: "",
        ctaLink: "",
        scrollHint: "Scroll down, AI is generating your personalized content...",
    },
    generative: {
        placeholderDefault: "Describe the portfolio you want to see...",
        placeholderGenerating: "Analyzing your profile and generating a unique layout...",
    },
    skills: {
        sectionTitle: "Technical Arsenal",
        labels: {
            since: "Since",
            viewProject: "View Project",
        },
        roles: {
            core: {
                label: "Core Skill",
                tooltip: "Central to my daily work and expertise.",
            },
            supporting: {
                label: "Supporting Skill",
                tooltip: "Used frequently to support core technologies.",
            },
            complementary: {
                label: "Complementary Skill",
                tooltip: "Adds value but not a primary focus.",
            },
            default: {
                label: "Skill",
                tooltip: "A skill I possess.",
            },
        },
        levels: {
            expert: {
                label: "Expert",
                tooltip: "Deep capability, able to solve complex architectural problems.",
            },
            advanced: {
                label: "Advanced",
                tooltip: "Solid day-to-day autonomy and complex implementation.",
            },
            comfortable: {
                label: "Comfortable",
                tooltip: "Comfortable working with occasional reference.",
            },
            default: {
                label: "Proficient",
                tooltip: "Capable of using this skill.",
            },
        },
    },
    caseStudies: {
        sectionTitle: "Featured Work",
        viewProjectWithArrow: "View Project →",
        viewSolution: "View Solution",
    },
    projectDetail: {
        backToPortfolio: "← Back to Portfolio",
        challengeTitle: "The Challenge",
        solutionTitle: "The Solution (Added Value)",
        impactTitle: "The Impact",
        techStackTitle: "Technologies Used",
    },
    arsenal: {
        quickResume: {
            summaryTitle: "Professional Summary",
            historyTitle: "Work History",
            educationTitle: "Education",
        },
        problemSolution: {
            problemLabel: "The Problem",
            solutionLabel: "The Solution",
        },
        codeInsight: {
            configLabel: "Config:",
        },
        careerTimeline: {
            at: "at",
        },
    },
};
