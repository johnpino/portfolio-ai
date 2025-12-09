// This dictionary centralizes all static text content.
// Structure is designed to mirror a potential future CMS content model (e.g., Contentful).

export const CONTENT = {
    global: {
        loading: "Generating layout...",
        error: "Failed to load content.",
        empty: "No layout configuration provided.",
    },
    hero: {
        ctaDefault: "Get in touch",
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
};
