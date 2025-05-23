'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Cell
} from 'recharts';
import { Skill, skillLevelToValue } from '../utils/skill_chips';

interface SkillsSectionProps {
  skills: Skill[];
}


export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;

  const radarData = skills
    .sort((a, b) => skillLevelToValue(b.skillLevel) - skillLevelToValue(a.skillLevel))
    .slice(0, 8)
    .map(skill => ({
      name: skill.skill.name,
      value: skillLevelToValue(skill.skillLevel),
      level: skill.skillLevel
    }));

  const barData = skills
    .sort((a, b) => skillLevelToValue(b.skillLevel) - skillLevelToValue(a.skillLevel))
    .map(skill => ({
      name: skill.skill.name,
      value: skillLevelToValue(skill.skillLevel),
      level: skill.skillLevel
    }));

  const getSkillColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return "#6366f1";
      case 'intermediate':
        return "#3b82f6";
      case 'beginner':
        return "#a855f7";
      default:
        return "#9ca3af";
    }
  };

  return (
    <section id="skills" className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        Skills
      </h2>

      <div className=" rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#818cf8"
                  fillOpacity={0.5}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white px-2 py-1 border border-gray-200 shadow-sm rounded-md text-sm">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-gray-600 capitalize">
                            {payload[0].payload.level}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 5, left: 5, bottom: 25 }}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white px-2 py-1 border border-gray-200 shadow-sm rounded-md text-sm">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-gray-600 capitalize">
                            {payload[0].payload.level}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" barSize={15} radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getSkillColor(entry.level)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}