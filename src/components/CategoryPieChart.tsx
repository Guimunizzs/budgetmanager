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
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(value: number) =>
            `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
