import { themeColor } from "@/constants/colors";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface GradientChartProps {
  xAxisData: number[];
  data: number[];
  colors: string[];
}

const GradientChart: React.FC<GradientChartProps> = ({ xAxisData, data, colors }) => {
  // Transform data into format recharts expects
  const chartData = xAxisData.map((x, index) => ({
    time: x,
    value: data[index] || 0
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart 
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors[1]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            stroke={"#FFFFFF"}
            axisLine={{ stroke: "white" }}
            tick={{ fill: "white" }}
          />
          <YAxis 
            stroke={"#FFFFFF"}
            axisLine={{ stroke: "white" }}

            tick={{ fill: "white" }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={"#1B6C67"}
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradientChart;