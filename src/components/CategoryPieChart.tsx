import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

interface CategoryPieChartProps {
  data: ChartData[];
}

const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  return (
    // ResponsiveContainer permite que o gráfico se ajuste ao tamanho do contêiner pai
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* Tooltip mostra os detalhes ao passar o mouse sobre uma fatia */}
        <Tooltip
          formatter={(value: number) =>
            `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
