"use client";
import dynamic from "next/dynamic";
import {
  analyzePriceTrends,
  getLowestPrice,
  interpolateTimestamps,
} from "./ChartFunction";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useData } from "@/lib/Context";
import { GraphIcon } from "../Animations/Icons";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <p className="w-full py-6 text-center text-primary">
      Wait a Second... Preparing your chart
    </p>
  ),
});
type PricePayload = [number, number];
type Props = { pricePayload: any; ratingPayload: any; reg_price: number };
const ApexChart: React.FC<Props> = ({
  pricePayload,
  ratingPayload,
  reg_price,
}) => {
  const { setSuggestion, setThreeLowestPrice } = useData();
  function getPredictedLowestPrices(payload: PricePayload[]){
        const prices = payload.map(item => item[1]);
  
    const sortedPrices = [...prices].sort((a, b) => a - b);
  
    const predictedPrices = sortedPrices.slice(0, 3).map(price => Math.max(Math.floor(price * 0.9), 1));
  
     setThreeLowestPrice(predictedPrices);
  }  
  useEffect(() => {
    const decision = analyzePriceTrends(pricePayload);
    setSuggestion(decision);
    getPredictedLowestPrices(pricePayload)
  }, [pricePayload]);
  const { resolvedTheme } = useTheme();
  // if (pricePayload.lenght > 0) {
  // }
  var [[firstTimestamp, firstPrice]] = pricePayload;
  // var [[firstRatingTimestamp, firstRating]] = ratingPayload;
  function getAdjustedTimestamp() {
    let threeMonthAgo = new Date();
    threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3); // Subtract 3 months
    let threeMonthAgoTimestamp = threeMonthAgo.getTime(); // Get the timestamp
  
    if (firstTimestamp > threeMonthAgoTimestamp) {
      return firstTimestamp;
    } else {
      return threeMonthAgoTimestamp;
    }
  }
  // APEX CHART CONFIGURATIONS
  const series = [
    {
      name: "Price",
      data: pricePayload,
    },
    // {
    //   name:'Rating',
    //   data:interpolateTimestamps(ratingPayload)
    // }
  ];

  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 300,
      colors: ["#7C3AED", "#00E396"],
      zoom: {
        autoScaleYaxis: true,
      },
    },

    annotations: {
      yaxis: [
        {
          y: getLowestPrice(pricePayload),
          borderColor: "#00E396",
          borderWidth: 2,
          label: {
            show: true,
            text: `Lowest Price : ₹ ${getLowestPrice(pricePayload)}`,
            style: {
              color: "#fff",
              background: "#00E396",
            },
          },
        },
        ...(reg_price !== 0
          ? [
              {
                y: reg_price,
                borderColor: "#FE9900",
                borderWidth: 2,
                label: {
                  show: true,
                  text: `Regular Price : ₹ ${reg_price}`,
                  style: {
                    color: "#fff",
                    background: "#FE9900",
                  },
                },
              },
            ]
          : []),
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    theme: {
      mode: resolvedTheme == "dark" ? "dark" : "light",
      palette: "palette1",
      monochrome: {
        enabled: false,
        color: "#fff",
        background: "#fff",
        shadeTo: resolvedTheme == "dark" ? "dark" : "light",
        shadeIntensity: 0.65,
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },

    xaxis: {
      type: "datetime",
      min: getAdjustedTimestamp(),
      tickAmount: 6,
    },
    yaxis: {
      labels: {
        formatter: function (value: any) {
          return "₹" + Math.round(value);
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    colors: ["#7C3AED"],

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.9,
        stops: [0, 95],
      },
    },
  };
  // FUNCTION TO HANDLE ON-SELECT
  const handleSelect = (timeline: string) => {
    // console.log(timeline);

    let startDate, endDate;
    switch (timeline) {
      case "one_month":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date();
        break;
      case "all":
        startDate = new Date(firstTimestamp);
        endDate = new Date();
        break;

      case "six_months":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        endDate = new Date();
        break;
      case "one_year":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        endDate = new Date();
        break;
      case "ytd":
        startDate = new Date(new Date().getFullYear(), 0, 1);
        endDate = new Date();
        break;
      case "three_months":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        endDate = new Date();
        break;
      default:
    }

    ApexCharts.exec(
      "area-datetime",
      "zoomX",
      startDate?.getTime(),
      endDate?.getTime()
    );
  };
  return (
    <>
      <div className="w-full flex justify-between md:gap-4 mb-4">
        <h1 className=" p-2 px-4 text-lg md:text-xl flex font-bold  h-full text-center">
          {" "}
          {/* <AreaChart className="h-6 w-6 mr-2" /> */}
          <GraphIcon />
          Price History Graph
        </h1>
        <select
          onChange={(e) => handleSelect(e.target.value)}
          className=" py-1 w-fit px-1 md:py-2.5  md:px-4 pe-9 block  bg-gray-100 border-primary rounded-lg text-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-transparent dark:text-gray-400 dark:focus:ring-gray-600"
        >
          <option value={"all"}>All Time</option>
          {pricePayload.length > 2 && (
            <>
              <option selected defaultValue={"three_months"}>3 Month</option>
              <option value={"one_month"}>1 Month</option>
              <option value={"six_months"}>6 month</option>
              <option value={"one_year"}>1 Year</option>
            </>
          )}
        </select>
      </div>
      <div className="overflow-hidden">
        <Chart
          options={options as ApexCharts.ApexOptions}
          series={series as ApexAxisChartSeries}
          type="area"
          height="300"
        />
      </div>
    </>
  );
};
export default ApexChart;
