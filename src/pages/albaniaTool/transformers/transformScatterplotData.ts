import {
  Factors,
  NACEIndustry,
  RCADirection,
} from '../../../graphql/graphQLTypes';
import { Datum as ScatterPlotDatum } from '../../../components/dataViz/scatterPlot';
import { TreeNode } from 'react-dropdown-tree-select';
import {rgba} from 'polished';
import { colorScheme } from '../Utils';

export interface CSVDatum {
  industryName: string;
  naceId: string;
  avgViability: number;
  avgAttractiveness: number;
  rcaDirection: string;
}

export default (rawFactors: Factors[], rawNaceData: NACEIndustry[]) => {
  const scatterPlotData: ScatterPlotDatum[] = [];
  const csvData: CSVDatum[] = [];
  rawFactors.forEach((rawDatum) => {
    if (rawDatum) {
      const {
        naceId, avgViability, avgAttractiveness, rca,
      } = rawDatum;
      if (naceId !== null && avgViability !== null && avgAttractiveness !== null && rca !== null) {
        const targetNaceIndustry = rawNaceData.find(node => node && node.naceId === naceId);
        if (targetNaceIndustry && targetNaceIndustry.name) {
          csvData.push({
            naceId,
            industryName: targetNaceIndustry.name,
            avgViability, avgAttractiveness,
            rcaDirection: rca,
          });
          scatterPlotData.push({
            label: targetNaceIndustry.name,
            x: avgViability,
            y: avgAttractiveness,
            tooltipContent: `
              <strong>Viability:</strong> ${avgViability}
              <br />
              <strong>Attractiveness:</strong> ${avgAttractiveness}
            `,
            fill: rca === RCADirection.LessThanOne ? colorScheme.dataSecondary : colorScheme.data,
          });
        }
      }
    }
  });
  return {scatterPlotData, csvData};
};

export const updateScatterPlotData = (scatterPlotData: ScatterPlotDatum[], selectedIndustry: TreeNode | undefined) => {
  return scatterPlotData.map(datum => {
    const existingFill = datum.fill ? datum.fill : colorScheme.data;
    const fill = selectedIndustry && selectedIndustry.label === datum.label
        ? rgba(existingFill, 0.4) : rgba(existingFill, 0.5);
    const highlighted = selectedIndustry && selectedIndustry.label === datum.label
        ? true : false;
    return { ...datum, fill, highlighted };
  });
};