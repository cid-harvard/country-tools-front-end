import raw from 'raw.macro';
import { Datum as ScatterPlotDatum } from '../../components/dataViz/scatterPlot';
import { Datum as RadarChartDatum } from '../../components/dataViz/radarChart';
import { Datum as BarChartDatum } from '../../components/dataViz/barChart';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  Datum as DynamicTableDatum,
  Column as DynamicTableColumn,
} from '../../components/text/DynamicTable';
import {
  JordanIndustry,
} from './graphql/graphQLTypes';
import {rgba} from 'polished';
import sortBy from 'lodash/sortBy';

export const colorScheme = {
  primary: '#46899F',
  secondary: '#E0B04E',
  teriary: '#9ac5d3',
  quaternary: '#ecf0f2',
  lightGray: '#E0E0E0',
};

const GET_JORDAN_INDUSTRY_DATA = gql`
  query GetJordanIndustryData($industryCode: Int!) {
    jordanIndustry(industryCode: $industryCode) {
      industryCode
      factors {
        edges {
          node {
            rcaJordan
            rcaPeers
            waterIntensity
            electricityIntensity
            availabilityInputs
            femaleEmployment
            highSkillEmployment
            fdiWorld
            fdiRegion
            exportPropensity
          }
        }
      }
      globalTopFdi {
        edges {
          node {
            rank
            company
            sourceCountry
            capitalInvestment
          }
        }
      }
      regionTopFdi {
        edges {
          node {
            rank
            company
            sourceCountry
            capitalInvestment
          }
        }
      }
    }
  }
`;

interface SuccessResponse {
  jordanIndustry: {
    industryCode: JordanIndustry['industryCode'];
    factors: JordanIndustry['factors'];
    globalTopFdi: JordanIndustry['globalTopFdi'];
    regionTopFdi: JordanIndustry['regionTopFdi'];
  };
}

interface Variables {
  industryCode: number;
}

interface FdiListDatum {
  rank: number;
  company: string;
  sourceCountry: string;
  capitalInvestment: number;
}

const generateScatterPlotData = (rawDatum: JordanIndustry[], id: string): ScatterPlotDatum[] => {
  const transformedData: ScatterPlotDatum[] = [];
  rawDatum.forEach((datum) => {
    const { industryCode, title, keywords, description, factors } = datum;
    if (industryCode && title && keywords && description &&
        factors && factors.edges && factors.edges[0] && factors.edges[0].node &&
        factors.edges[0].node.viability !== null && factors.edges[0].node.attractiveness !== null &&
        factors.edges[0].node.rca !== null
      ) {
      const color = factors.edges[0].node.rca < 1 ? '#46899F' : '#E0B04E';
      const x = factors.edges[0].node.viability;
      const y = factors.edges[0].node.attractiveness;
      transformedData.push({
        label: title,
        x,
        y,
        fill: rgba(color, 0.5),
        highlighted: (industryCode === id),
        tooltipContent:
          '<strong>Theme:</strong> ' + description +
          '<br /><strong>SubTheme:</strong> ' + keywords +
          '<br /><strong>Description:</strong> ' + title +
          '<br /><strong>Viability:</strong> ' + x +
          '<br /><strong>Attractiveness:</strong> ' + y,
        tooltipContentOnly: true,
      });
    }
  });
  return transformedData;
};

interface Input {
  rawIndustryList: JordanIndustry[];
  variables: {
    id: string,
  };
}

interface ReturnValue {
  error: undefined | any;
  loading: boolean;
  data: undefined | {
    scatterPlotData: ScatterPlotDatum[];
    viabilityData: RadarChartDatum[][];
    attractivenessData: RadarChartDatum[][];
    fdiBarChartData: BarChartDatum[][];
    globalTopFdiList: FdiListDatum[];
    regionTopFdiList: FdiListDatum[];
    barChartData2: BarChartDatum[][];
    jordanGeoJson: any;
    tableColumns: DynamicTableColumn[]
    tableData: DynamicTableDatum[];
  };
}

export default ({variables: {id}, rawIndustryList}: Input): ReturnValue => {
  const jordanMapData = JSON.parse(raw('./data/jordanmap.json'));
  const featuresWithValues = jordanMapData.features.map((feature: any, i: number) => {
    const percent = (i + 1) * 7;
    const properties = {...feature.properties, percent, tooltipContent: `${percent}%`};
    return {...feature, properties};
  });
  const jordanGeoJson = {...jordanMapData, features: featuresWithValues};

  const {loading, error, data: rawDatum} = useQuery<SuccessResponse, Variables>(GET_JORDAN_INDUSTRY_DATA, {
    variables: {industryCode: parseInt(id, 10)},
  });
  let data: undefined | ReturnValue['data'];
  if (rawDatum !== undefined) {
    const {
      jordanIndustry: {
        factors, globalTopFdi: {edges: globalTopFdiEdges}, regionTopFdi: {edges: regionTopFdiEdges},
      },
    } = rawDatum;
    const factorsNode = factors.edges !== null && factors.edges[0] ? factors.edges[0].node : null;

    const viabilityData: RadarChartDatum[] = [];
    const attractivenessData: RadarChartDatum[] = [];
    if (factorsNode !== null) {
      const {
        // Viability Factors:
        rcaJordan, rcaPeers, waterIntensity,
        electricityIntensity, availabilityInputs,

        // Attractiveness Factors:
        femaleEmployment, highSkillEmployment,
        fdiWorld, fdiRegion, exportPropensity,
      } = factorsNode;

      if (rcaJordan !== null) {
        viabilityData.push({label: 'RCA Jordan', value: rcaJordan});
      }
      if (rcaPeers !== null) {
        viabilityData.push({label: 'RCA Peers', value: rcaPeers});
      }
      if (waterIntensity !== null) {
        viabilityData.push({label: 'Water Intensity', value: waterIntensity});
      }
      if (electricityIntensity !== null) {
        viabilityData.push({label: 'Electricity Intensity', value: electricityIntensity});
      }
      if (availabilityInputs !== null) {
        viabilityData.push({label: 'Avail. of Inputs', value: availabilityInputs});
      }

      if (femaleEmployment !== null) {
        attractivenessData.push({label: 'RCA Jordan', value: femaleEmployment});
      }
      if (highSkillEmployment !== null) {
        attractivenessData.push({label: 'RCA Peers', value: highSkillEmployment});
      }
      if (fdiWorld !== null) {
        attractivenessData.push({label: 'Water Intensity', value: fdiWorld});
      }
      if (fdiRegion !== null) {
        attractivenessData.push({label: 'Electricity Intensity', value: fdiRegion});
      }
      if (exportPropensity !== null) {
        attractivenessData.push({label: 'Avail. of Inputs', value: exportPropensity});
      }
    }

    const globalTopFdiList: FdiListDatum[] = [];
    globalTopFdiEdges.forEach(edge => {
      if (edge && edge.node) {
        const { rank, company, sourceCountry, capitalInvestment } = edge.node;
        if (company !== null && sourceCountry !== null && capitalInvestment !== null) {
          globalTopFdiList.push({
            rank: parseInt(rank, 10),
            company, sourceCountry, capitalInvestment,
          });
        }
      }
    });
    const regionTopFdiList: FdiListDatum[] = [];
    regionTopFdiEdges.forEach(edge => {
      if (edge && edge.node) {
        const { rank, company, sourceCountry, capitalInvestment } = edge.node;
        if (company !== null && sourceCountry !== null && capitalInvestment !== null) {
          regionTopFdiList.push({
            rank: parseInt(rank, 10),
            company, sourceCountry, capitalInvestment,
          });
        }
      }
    });


    data = {
      scatterPlotData: generateScatterPlotData(rawIndustryList, id),
      viabilityData: [viabilityData],
      attractivenessData: [attractivenessData],
      fdiBarChartData: [],
      globalTopFdiList: sortBy(globalTopFdiList, ['rank']),
      regionTopFdiList: sortBy(regionTopFdiList, ['rank']),
      barChartData2: [],
      jordanGeoJson,
      tableColumns: [],
      tableData: [],
    };
  } else {
    data = undefined;
  }

  return {
    error,
    loading,
    data,
  };
};