import Chart from "react-apexcharts";
import React from "react";

export default function Cart({ chart }) {
  return (
    <Chart
      options={chart.options}
      series={chart.series}
      type={chart.type}
      width={chart.width}
      height={chart.height}
      style={{ background: "#eee" }}
    />
  );
}
