export interface AgentUsage {
    id: string;
    name: string;
    usage: number;
}

export const getUsageData = (): AgentUsage[] => {
    return [
        { id: 'financial-advisor', name: 'Financial Advisor', usage: 120 },
        { id: 'career-coach', name: 'Career Coach', usage: 95 },
        { id: 'health-navigator', name: 'Health Navigator', usage: 80 },
        { id: 'legal-aide', name: 'Legal Aide', usage: 60 },
        { id: 'family-counselor', name: 'Family Counselor', usage: 45 },
    ];
};
