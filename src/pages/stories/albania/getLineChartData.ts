import {LineChartDatum, AnimationDirection, LabelAnchor, LabelPosition, Coords} from 'react-fast-charts';
import raw from 'raw.macro';

interface Axis {
  axisValues: {
    minY:number,
    maxY:number,
    minX:number,
    maxX:number,
  };
}

interface GDPData extends Axis {
  albaniaData2010_2013: Coords[];
  albaniaData2014_2018: Coords[];
  euData2010_2018: Coords[];
  albaniaColor: string;
  euColor: string;
  labelColor: string;
}

const gdpData: GDPData = {
  axisValues: {
    minY: -1,
    maxY: 5,
    minX: 2010,
    maxX: 2019,
  },
  albaniaData2010_2013: [],
  albaniaData2014_2018: [],
  euData2010_2018: [],
  euColor: '#346bbf',
  albaniaColor: '#c73000',
  labelColor: '#bc2f8b',
};

enum Country {
  Albania = 'Albania',
  EuropeanUnion = 'European Union',
  Bulgaria = 'Bulgaria',
  Croatia = 'Croatia',
  Greece = 'Greece',
  NorthMacedonia = 'North Macedonia',
  Slovenia = 'Slovenia',
  SlovakRepublic = 'Slovak Republic',
  Montenegro = 'Montenegro',
  Kosovo = 'Kosovo',
  BosniaAndHerzegovina = 'Bosnia & Herzegovina',
  OECDmembers = 'OECD members',
  BalkanAverage = 'Balkan Average',
  AlbShareOfoECD = 'Alb Share of oECD',
}

interface RawGDP_PC_Data {
  GDPpc_change: number;
  country_name: Country;
  series_name: string;
  value: number;
  year: number;
}
const gdpRawData: RawGDP_PC_Data[] = JSON.parse(raw('./data/gdp_pc_2010_2018.json'));
gdpRawData.forEach(({country_name, GDPpc_change, year}) => {
  if (country_name === Country.Albania) {
    if (year >= 2010 && year <= 2013) {
      gdpData.albaniaData2010_2013.push({x: year, y: GDPpc_change});
    } else if (year >= 2014 && year <= 2018) {
      gdpData.albaniaData2014_2018.push({x: year, y: GDPpc_change});
    }
  } else if (country_name === Country.EuropeanUnion) {
    if (year >= 2010 && year <= 2018) {
      gdpData.euData2010_2018.push({x: year, y: GDPpc_change});
    }
  }
});

interface LaborForceData extends Axis {
  lfpRateData: Coords[];
  employRateData: Coords[];
  unemployRateData: Coords[];
  lfpColor: string;
  employColor: string;
  unEmployColor: string;
}

const laborForceData: LaborForceData = {
  axisValues: {
    minY: 5,
    maxY: 70,
    minX: 2014,
    maxX: 2020,
  },
  lfpRateData: [],
  employRateData: [],
  unemployRateData: [],
  lfpColor: '#c77700',
  employColor: '#346bbf',
  unEmployColor: '#c73000',
};

interface UnemploymentData extends Axis {
  unemploymentMale15_24Data: Coords[];
  unemploymentMale25_54Data: Coords[];
  unemploymentMale55_64Data: Coords[];
  unemploymentFemale15_24Data: Coords[];
  unemploymentFemale25_54Data: Coords[];
  unemploymentFemale55_64Data: Coords[];
  unemploymentMale15_24Color: string;
  unemploymentMale25_54Color: string;
  unemploymentMale55_64Color: string;
  unemploymentFemale15_24Color: string;
  unemploymentFemale25_54Color: string;
  unemploymentFemale55_64Color: string;
}

const unemploymentData: UnemploymentData = {
  axisValues: {
    minY: 0,
    maxY: 50,
    minX: 2014,
    maxX: 2020,
  },
  unemploymentMale15_24Data: [],
  unemploymentMale25_54Data: [],
  unemploymentMale55_64Data: [],
  unemploymentFemale15_24Data: [],
  unemploymentFemale25_54Data: [],
  unemploymentFemale55_64Data: [],
  unemploymentMale15_24Color: '#985db3',
  unemploymentMale25_54Color: '#cf6d78',
  unemploymentMale55_64Color: '#c17c1f',
  unemploymentFemale15_24Color: '#1f8fbf',
  unemploymentFemale25_54Color: '#009c65',
  unemploymentFemale55_64Color: '#e3ba00',
};

enum MeasureType {
  EmploymentRate = 'Employment rate',
  LFPRate = 'LFP rate',
  UnemploymentRate = 'Unemployment rate',
  UnemploymentMale15_24 = 'Unemployment (male, 15-24)',
  UnemploymentMale25_54 = 'Unemployment (male, 25-54)',
  UnemploymentMale55_64 = 'Unemployment (male, 55-64)',
  UnemploymentFemale15_24 = 'Unemployment (female, 15-24)',
  UnemploymentFemale25_54 = 'Unemployment (female, 25-54)',
  UnemploymentFemale55_64 = 'Unemployment (female, 55-64)',
}

interface RawEmploymentData {
  year: number;
  measure_type: MeasureType;
  rate: number;
}
const employmentRawData: RawEmploymentData[] = JSON.parse(raw('./data/employment_data_2014_2019.json'));
employmentRawData.forEach(({year, measure_type, rate}) => {
  if (measure_type === MeasureType.EmploymentRate) {
    laborForceData.employRateData.push({x: year, y: rate});
  } else if (measure_type === MeasureType.LFPRate) {
    laborForceData.lfpRateData.push({x: year, y: rate});
  } else if (measure_type === MeasureType.UnemploymentRate) {
    laborForceData.unemployRateData.push({x: year, y: rate});
  } else if (measure_type === MeasureType.UnemploymentMale15_24) {
    unemploymentData.unemploymentMale15_24Data.push({x: year, y: rate});
  } else if (measure_type === MeasureType.UnemploymentMale25_54) {
    unemploymentData.unemploymentMale25_54Data.push({x: year, y: rate});
  } else if (measure_type === MeasureType.UnemploymentMale55_64) {
    unemploymentData.unemploymentMale55_64Data.push({x: year, y: rate});
  } else if (measure_type === MeasureType.UnemploymentFemale15_24) {
    unemploymentData.unemploymentFemale15_24Data.push({x: year, y: rate});
  } else if (measure_type === MeasureType.UnemploymentFemale25_54) {
    unemploymentData.unemploymentFemale25_54Data.push({x: year, y: rate});
  } else if (measure_type === MeasureType.UnemploymentFemale55_64) {
    unemploymentData.unemploymentFemale55_64Data.push({x: year, y: rate});
  }
});


interface MinMaxAxis {
  minY: number;
  maxY: number;
  minX: number;
  maxX: number;
}

interface AnimateAxis {
  animationDuration: number;
  startMinX: number;
  startMaxX: number;
  startMinY: number;
  startMaxY: number;
}

interface Input {
  section: number | null;
  prevSection: number | null;
}

export default ({section, prevSection}: Input) => {
  let lineChartData: LineChartDatum[] = [];
  let minMaxAxis: MinMaxAxis = gdpData.axisValues;
  let animateAxis: AnimateAxis | undefined;
  let leftAxis: string = 'Year on Year Percent Change in GDP per capita';
  let direction: AnimationDirection;
  let lineChartTitle: string = 'Albania’s Change in GDP per capita, 2010-2018';
  let vizSource: string = 'World Development Indicators';
  if (section === null && prevSection !== null) {
    direction = AnimationDirection.Backward;
  } else if (section !== null && prevSection === null) {
    direction = AnimationDirection.Forward;
  } else if (section === null && prevSection === null) {
    direction = AnimationDirection.Forward;
  } else if (section !== null && prevSection !== null &&
             section - prevSection < 0) {
    direction = AnimationDirection.Backward;
  } else {
    direction = AnimationDirection.Forward;
  }
  if (section === null && prevSection !== null) {
    lineChartData = [
      {
        coords: [...gdpData.albaniaData2010_2013],
        animationDuration: 300,
        color: gdpData.albaniaColor,
        animationDirection: AnimationDirection.Backward,
      },
    ];
  } else if (section === 0) {
    if (direction === AnimationDirection.Forward) {
      lineChartData = [
        {
          coords: [...gdpData.albaniaData2010_2013],
          animationDuration: 300,
          label: 'Albania, 2013',
          color: gdpData.albaniaColor,
          showLabelLine: true,
          width: 3,
        },
      ];
    } else {
      lineChartData = [
        {
          coords: [...gdpData.albaniaData2010_2013, ...gdpData.albaniaData2014_2018],
          animationDuration: 400,
          label: 'Albania, 2013',
          color: gdpData.albaniaColor,
          showLabelLine: true,
          width: 3,
          animationDirection: direction,
          animationStartIndex: 3,
          labelDataIndex: 3,
        },
      ];
    }
  } else if (section === 1) {
    if (direction === AnimationDirection.Forward) {
      lineChartData = [
        {
          coords: [...gdpData.albaniaData2010_2013, ...gdpData.albaniaData2014_2018],
          animationDuration: 400,
          label: 'Albania, 2018',
          color: gdpData.albaniaColor,
          showLabelLine: true,
          animationStartIndex: 3,
          width: 3,
        },
      ];
    } else {
      lineChartData = [
        {
          coords: [...gdpData.albaniaData2010_2013, ...gdpData.albaniaData2014_2018],
          label: 'Albania, 2018',
          color: gdpData.albaniaColor,
          width: 3,
        }, {
          coords: [...gdpData.euData2010_2018],
          animationDuration: 600,
          color: gdpData.euColor,
          width: 3,
          animationDirection: direction,
        },
      ];
    }
  } else if (section === 2) {
    if (direction === AnimationDirection.Forward) {
      lineChartData = [
        {
          coords: [...gdpData.albaniaData2010_2013, ...gdpData.albaniaData2014_2018],
          label: 'Albania, 2018',
          color: gdpData.albaniaColor,
          width: 3,
        }, {
          coords: [...gdpData.euData2010_2018],
          animationDuration: 600,
          label: 'European Union',
          color: gdpData.euColor,
          width: 3,
          labelAnchor: LabelAnchor.Middle,
          labelPosition: LabelPosition.Bottom,
        },
      ];
    } else {
      lineChartData = [
        {
          coords: [...gdpData.albaniaData2010_2013, ...gdpData.albaniaData2014_2018],
          label: 'Albania, 2018',
          color: gdpData.albaniaColor,
          animationDuration: 600,
          width: 3,
        }, {
          coords: [...gdpData.euData2010_2018],
          animationDuration: 600,
          label: 'European Union',
          color: gdpData.euColor,
          width: 3,
          labelAnchor: LabelAnchor.Middle,
          labelPosition: LabelPosition.Bottom,
        },
      ];
      animateAxis = {
        startMinX: laborForceData.axisValues.minX,
        startMaxX: laborForceData.axisValues.maxX,
        startMinY: laborForceData.axisValues.minY,
        startMaxY: laborForceData.axisValues.maxY,
        animationDuration: 600,
      };
    }
  } else if (section === 3) {
    lineChartTitle = 'Labor Force Indicators, 2014-2019';
    minMaxAxis = {...laborForceData.axisValues};
    leftAxis = 'Percent';
    vizSource = 'INSTAT';
    lineChartData = [
      {
        coords: [...laborForceData.lfpRateData],
        animationDuration: 600,
        label: 'LFP Rate',
        color: laborForceData.lfpColor,
        width: 3,
      }, {
        coords: [...laborForceData.employRateData],
        animationDuration: 600,
        label: 'Employment Rate',
        color: laborForceData.employColor,
        width: 3,
      }, {
        coords: [...laborForceData.unemployRateData],
        animationDuration: 600,
        label: 'Unemployment Rate',
        color: laborForceData.unEmployColor,
        width: 3,
      },
    ];
    if (direction === AnimationDirection.Forward) {
      animateAxis = {
        startMinX: gdpData.axisValues.minX,
        startMaxX: gdpData.axisValues.maxX,
        startMinY: gdpData.axisValues.minY,
        startMaxY: gdpData.axisValues.maxY,
        animationDuration: 600,
      };
    } else {
      animateAxis = {
        startMinX: unemploymentData.axisValues.minX,
        startMaxX: unemploymentData.axisValues.maxX,
        startMinY: unemploymentData.axisValues.minY,
        startMaxY: unemploymentData.axisValues.maxY,
        animationDuration: 600,
      };
    }
  } else if (section && section > 3) {
    lineChartTitle = 'Unemployment Rates by Group, 2014-2019';
    leftAxis = 'Percent';
    const animate = section === 4 && direction === AnimationDirection.Forward ? true : false;
    minMaxAxis = {...unemploymentData.axisValues};
    vizSource = 'INSTAT';
    lineChartData = [
      {
        coords: [...unemploymentData.unemploymentMale15_24Data],
        animationDuration: 600,
        label: 'Male, 15-24',
        color: unemploymentData.unemploymentMale15_24Color,
        labelColor: unemploymentData.unemploymentMale15_24Color,
        width: 3,
        labelPosition: LabelPosition.Bottom,
      },{
        coords: [...unemploymentData.unemploymentMale25_54Data],
        animationDuration: 600,
        label: 'Male, 25-54',
        color: unemploymentData.unemploymentMale25_54Color,
        labelColor: unemploymentData.unemploymentMale25_54Color,
        width: 3,
        labelPosition: LabelPosition.Top,
      },{
        coords: [...unemploymentData.unemploymentMale55_64Data],
        animationDuration: 600,
        label: 'Male, 55-64',
        color: unemploymentData.unemploymentMale55_64Color,
        labelColor: unemploymentData.unemploymentMale55_64Color,
        width: 3,
        labelPosition: LabelPosition.Bottom,
      },{
        coords: [...unemploymentData.unemploymentFemale15_24Data],
        animationDuration: 600,
        label: 'Female, 15-24',
        color: unemploymentData.unemploymentFemale15_24Color,
        labelColor: unemploymentData.unemploymentFemale15_24Color,
        width: 3,
      },{
        coords: [...unemploymentData.unemploymentFemale25_54Data],
        animationDuration: 600,
        label: 'Female, 25-54',
        color: unemploymentData.unemploymentFemale25_54Color,
        labelColor: unemploymentData.unemploymentFemale25_54Color,
        width: 3,
      },{
        coords: [...unemploymentData.unemploymentFemale55_64Data],
        animationDuration: 600,
        label: 'Female, 55-64',
        color: unemploymentData.unemploymentFemale55_64Color,
        labelColor: unemploymentData.unemploymentFemale55_64Color,
        width: 3,
      },
    ];
    animateAxis = animate ? {
      startMinX: laborForceData.axisValues.minX,
      startMaxX: laborForceData.axisValues.maxX,
      startMinY: laborForceData.axisValues.minY,
      startMaxY: laborForceData.axisValues.maxY,
      animationDuration: 600,
    } : undefined;
  }
  return {lineChartData, ...minMaxAxis, leftAxis, animateAxis, lineChartTitle, vizSource};
};