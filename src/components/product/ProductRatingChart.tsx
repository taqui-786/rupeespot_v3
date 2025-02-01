"use client";
import { AreaChart, Star } from "lucide-react";
import dynamic from "next/dynamic";
import React from 'react'
type Props = {
    id?:string;
    data?:any
    store?: string
  };
  const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => (
      <p className="w-full py-6 text-center text-primary">
        Wait a Second... Preparing your chart
      </p>
    ),
  });
async function ProductRatingChart({data,id,store}:Props) {
 
    const options =  {
        chart: {
          type: 'bar',
          height: 350,
          colors: ["#7C3AED"],
          zoom: {
            autoScaleYaxis: true,
          },
        },
        colors: ["#7C3AED"],
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderColor: "#00E396",
            borderRadiusApplication: 'end',
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
            categories: [5, 4, 3, 2, 1],
        
        }
      }
    
    
    const series = [{
        data: [12,45,85,78,100]
      }]
  return (
    <div> <Chart
    options={options as ApexCharts.ApexOptions}
    series={series as ApexAxisChartSeries}
    type="bar"  height="250"   class="ratingChart"
    
  /></div>
  )
}

export default ProductRatingChart