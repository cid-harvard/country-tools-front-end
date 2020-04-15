import * as d3 from 'd3';

export interface Datum {
  x: string;
  y: number;
  fill?: string;
  stroke?: string;
  tooltipContent?: string;
  tooltipContentOnly?: boolean;
  onClick?: () => void;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Input {
  svg: d3.Selection<any, unknown, null, undefined>;
  tooltip: d3.Selection<any, unknown, null, undefined>;
  data: Datum[][];
  size: Dimensions;
  axisLabels?: {left?: string, bottom?: string};
}

const ranges = [
  { divider: 1e18 , suffix: 'E' },
  { divider: 1e15 , suffix: 'P' },
  { divider: 1e12 , suffix: 'T' },
  { divider: 1e9 , suffix: 'G' },
  { divider: 1e6 , suffix: 'M' },
  { divider: 1e3 , suffix: 'k' },
];

const formatNumber = (n: number) => {
  for (const range of ranges) {
    if (n >= range.divider) {
      return (n / range.divider).toString() + range.suffix;
    }
  }
  return n.toString();
};

export default (input: Input) => {
  const { svg, data, size, axisLabels, tooltip } = input;

  const margin = {
    top: 30, right: 30,
    bottom: axisLabels && axisLabels.bottom ? 60 : 30,
    left: 30};
  const width = size.width - margin.left - margin.right;
  const height = size.height - margin.bottom - margin.top;

    // set the ranges
  const xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  const yScale = d3.scaleLinear()
            .range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

  const container = svg
    .append('g')
      .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');
  const allYValues: number[] = [];
  data.forEach(datum => datum.forEach(({y}) => allYValues.push(y)));

  const rawMinY = d3.min(allYValues);
  const rawMaxY = d3.max(allYValues);

  const minScaleBuffer = 0.9;
  const maxScaleBuffer = 1.1;

  const minY = rawMinY ? Math.floor(rawMinY * minScaleBuffer) : 0;
  const maxY = rawMaxY ? Math.floor(rawMaxY * maxScaleBuffer) : 0;
  // Scale the range of the data in the domains
  xScale.domain(data && data.length ? data[0].map(function(d) { return d.x; }) : [])
        .rangeRound([0, width])
        .paddingInner(0.2);
  yScale.domain([minY, maxY]);

  // append the rectangles for the bar chart
  data.forEach((dataset, i) => {
    container.selectAll('.bar-' + i)
        .data(dataset)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          const xVal = xScale(d.x);
          return xVal ? xVal : 0;
        })
        .attr('width', xScale.bandwidth())
        .attr('y', function(d) { return yScale(d.y); })
        .style('fill', ({fill}) => fill ? fill : '#69b3a2')
        .style('stroke', ({stroke}) => stroke ? stroke : 'none')
        .style('stroke-width', 3)
        .attr('height', function(d) { return height - yScale(d.y); })
        .on('mousemove', ({x, tooltipContent, tooltipContentOnly}) => {
          if (tooltipContentOnly && tooltipContent && tooltipContent.length) {
            tooltip.html(tooltipContent);
          } else {
            const content = tooltipContent === undefined || tooltipContent.length === 0
              ? '' : `:<br />${tooltipContent}`;
            tooltip.html(`<strong>${x}</strong>${content}`);
          }
          tooltip
            .style('display', 'block')
            .style('left', (d3.event.pageX + 4) + 'px')
            .style('top', (d3.event.pageY - 4) + 'px');
          })
        .on('mouseout', () => {
          tooltip
              .style('display', 'none');
        });
  });

  // add the x Axis
  container.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale));

  // add the y Axis
  container.append('g')
      .call(d3.axisLeft(yScale).tickFormat(formatNumber));

  // append X axis label
  svg
    .append('text')
    .attr('transform', `translate(${width / 2 + margin.left}, ${height + margin.bottom + (margin.top / 2)})`)
      .style('font-family', "'Source Sans Pro',sans-serif")
      .style('text-anchor', 'middle')
      .text(axisLabels && axisLabels.bottom ? axisLabels.bottom : '');

  // append Y axis label
  svg
    .append('text')
      .attr('y', margin.top / 2)
      .attr('x', margin.right)
      .attr('dy', '0.75em')
      .style('font-size', '0.8rem')
      .style('font-family', "'Source Sans Pro',sans-serif")
      .text(axisLabels && axisLabels.left ? axisLabels.left : '');

};
