import React from 'react';
import DataViz, {VizType} from 'react-fast-charts';
import {
    FDIMarketOvertimeConnection,
} from '../graphql/graphQLTypes';
import transformStackedBarChartData from '../transformers/transformStackedBarChartData';

interface Props {
  selectedIndustry: {label: string, value: string};
  fdiMarketsOvertimeEdges: FDIMarketOvertimeConnection['edges'];
}

export default (props: Props) => {
  const {
    selectedIndustry, fdiMarketsOvertimeEdges,
  } = props;
  const {
    stackedBarChartData, stackedBarChartCSVData,
  } = transformStackedBarChartData(fdiMarketsOvertimeEdges, selectedIndustry.value);
  const stackedBarChart = stackedBarChartData.length ? (
    <DataViz
      id={'albania-company-bar-chart'}
      vizType={VizType.BarChart}
      data={stackedBarChartData}
      axisLabels={{left: 'Estimated Capital Expenditure (Millions USD)'}}
      chartCaption={'Source: fDi Markets Library, a service from The Financial Times Limited (2019). All Rights Reserved.'}
      enablePNGDownload={true}
      enableSVGDownload={true}
      chartTitle={'Identifying Companies - ' + selectedIndustry.label}
      jsonToDownload={stackedBarChartCSVData}
    />
  ) : (
    <DataViz
      id={'albania-company-bar-chart'}
      vizType={VizType.Error}
      message={'There are not enough data points for this chart'}
    />
  );
  return stackedBarChart;
};