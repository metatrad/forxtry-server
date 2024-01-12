import React, { useEffect, useState } from 'react';
import {
  ChartCanvas,
  Chart,
  XAxis,
  YAxis,
  CandlestickSeries,
  MouseCoordinateX,
  CrossHairCursor,
} from 'react-stockcharts';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { scaleTime } from 'd3-scale';

const CandlestickChart = ({ data: initialData, width, ratio }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d) => new Date(d.date));
  const { data: chartData, xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

  return (
    <ChartCanvas
      height={400}
      ratio={ratio}
      width={width}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      seriesName="MSFT"
      data={chartData}
      type="hybrid"
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xScale={xScale}
    >
      <Chart id={0} yExtents={(d) => [d.high, d.low]}>
        <XAxis axisAt="bottom" orient="bottom" ticks={6} />
        <YAxis axisAt="left" orient="left" ticks={5} />
        <CandlestickSeries />
        <MouseCoordinateX at="bottom" orient="bottom" displayFormat={scaleTime().tickFormat()} />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default fitWidth(CandlestickChart);
