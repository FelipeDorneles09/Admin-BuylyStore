"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SalesChart = ({ data }: { data: any[] }) => {
  // Criar array com mais marcações para o eixo Y
  // Aqui estamos criando marcações a cada 200 unidades
  const yAxisTicks = Array.from({ length: 11 }, (_, i) => i * 200);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        className="w-full h-full"
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          strokeWidth={3}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis
          domain={[0, 2000]}
          ticks={yAxisTicks} // Especifica as marcações exatas que queremos mostrar
        />
        <Tooltip formatter={(value) => `R$ ${value}`} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
