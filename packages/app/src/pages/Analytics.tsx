import React from 'react';
import { Link } from 'react-router-dom';
import { getUsageData, AgentUsage } from '@repo/core/mockAnalytics';
import { MainLayout } from '@repo/ui/layouts/MainLayout';

export default function Analytics() {
    const data = getUsageData();

    return (
        <MainLayout logoText="Analytics">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Agent Usage Analytics</h1>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Agent Name</th>
                            <th className="py-2">Usage Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((agent: AgentUsage) => (
                            <tr key={agent.id}>
                                <td className="border px-4 py-2">{agent.name}</td>
                                <td className="border px-4 py-2">{agent.usage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
                    Back to Chat
                </Link>
            </div>
        </MainLayout>
    );
}
