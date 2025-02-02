import { deals_db, user_db } from "@/lib/db/db_connect";
import ApexChart from "./ApexChart";
import { sql } from "drizzle-orm";

type Props = {
  id: string;
  data: any;
  store?: string;
  type: string;
};

const ProductPriceChart: React.FC<Props> = async ({
  id,
  store,
  data,
  type,
}) => {
  let chartPriceData: any[] = [];
  let chartRatingData: any[] = [];
  let RegularPrice: number = 0;
  function setChartPriceData(filteredData: any[], defaultValue: any[]) {
    chartPriceData = [...filteredData, ...defaultValue];
  }
  function setChartRatingData(filteredData: any[], defaultValue: any[]) {
    chartRatingData = [...filteredData, ...defaultValue];
  }
  // FUNCTION TO CREATE CHART ---PRICE--- DATA FOR PRODUCT
  const createChartPriceData = async (
    currentProductTime: any,
    currentProductPrice: number,
    data: Array<any>
  ) => {
    try {
      const newData = data?.map((itm: any) => {
        const timestamp = new Date(itm.last_updated!).getTime();
        const price = itm.price;
        return [timestamp, price];
      });

      // Filter out null or undefined values from newData (optional)
      const filteredData: any = newData?.slice().sort((a, b) => a[0] - b[0]);
      const timeStamp = new Date(currentProductTime).getTime();

      const values = [[timeStamp, currentProductPrice]];
      const defaultValue = [[new Date().getTime(), currentProductPrice]];
      const theLastValue = filteredData[filteredData.length - 1];
      const theNewValue = [
        theLastValue,
        [new Date().getTime(), currentProductPrice],
      ];

      if (filteredData.length) {
        setChartPriceData(filteredData, theNewValue);
      } else {
        setChartPriceData(values, defaultValue);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // FUNCTION TO CREATE CHART ---Rating--- DATA FOR PRODUCT
  const createChartRatingData = async (
    currentProductTime: any,
    currentProductRating: number,
    data: Array<any>
  ) => {
    try {
      const newData = data?.map((itm: any) => {
        const timestamp = new Date(itm.last_updated!).getTime();
        const rating = itm.rating_count;
        return [timestamp, rating];
      });

      // Filter out null or undefined values from newData (optional)
      const filteredData: any = newData?.slice().sort((a, b) => a[0] - b[0]);
      const timeStamp = new Date(currentProductTime).getTime();

      const values = [[timeStamp, currentProductRating]];
      const defaultValue = [[new Date().getTime(), currentProductRating]];
      const theLastValue = filteredData[filteredData.length - 1];
      const theNewValue = [
        theLastValue,
        [new Date().getTime(), currentProductRating],
      ];

      if (filteredData.length) {
        setChartRatingData(filteredData, theNewValue);
      } else {
        setChartRatingData(values, defaultValue);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const TheStore = data?.store || store;
  const [getStore]: any = await user_db.execute(
    sql`SELECT db_name FROM stores WHERE name  = ${TheStore} `
  );

  const priceQuerry = sql.raw(
    `SELECT * FROM ${getStore[0].db_name}.prices WHERE id='${id}'`
  );
  const [prices]: any = await deals_db.execute(sql`${priceQuerry}`);
  let myPrice = data?.deal_price || data?.mrp;
  let myTime = data?.last_updated;
  if (type === "store" && data?.mrp === null) {
    const price = prices.reduce((latest: any, current: any) => {
      const latestDate = new Date(latest.last_updated);
      const currentDate = new Date(current.last_updated);
      return currentDate > latestDate ? current : latest;
    });
    myPrice = price?.price;
    myTime = price?.last_updated;
  }
  createChartPriceData(myTime, myPrice, prices);
  // createChartRatingData(data?.last_updated, data?.rating_count, prices);

  if (type === "store") {
    const reg_price_querry = sql.raw(
      `SELECT * FROM ${getStore[0].db_name}.regular_prices WHERE id='${id}'`
    );
    const [get_req_price]: any = await deals_db.execute(
      sql`${reg_price_querry}`
    );
    RegularPrice = get_req_price[0]?.regular_price;
  } else {
    RegularPrice = data?.reg_price;
  }

  return (
    <>
      {chartPriceData ? (
        <ApexChart
          pricePayload={chartPriceData}
          ratingPayload={chartRatingData}
          reg_price={RegularPrice}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default ProductPriceChart;
