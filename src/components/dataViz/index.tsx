import { select } from 'd3-selection';
import React, {useContext, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { AppContext } from '../../App';
import createScatterPlot, {Datum as ScatterPlotDatum} from './scatterPlot';

const Root = styled.div`
  height: 450px;
  width: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  text-align: left;
  display: none;
  padding: 8px 12px;
  background: #fff;
  border-radius: 4px;
  color: #333;
  pointer-events: none;
  box-shadow: 0px 0px 3px -1px #b5b5b5;
  border: solid 1px gray;
  max-width: 300px;
  transform: translateY(-100%);
`;

export enum VizType {
  ScatterPlot = 'ScatterPlot',
}

interface BaseProps {
  id: string;
  vizType: VizType;
}

type Props = BaseProps & (
  {
    vizType: VizType.ScatterPlot;
    data: ScatterPlotDatum[];
  }
);

const DataViz = (props: Props) => {
  const { id } = props;
  const sizingNodeRef = useRef<HTMLDivElement | null>(null);
  const svgNodeRef = useRef<any>(null);
  const tooltipNodeRef = useRef<any>(null);
  const { windowWidth } = useContext(AppContext);

  useEffect(() => {
    if (svgNodeRef && svgNodeRef.current && sizingNodeRef && sizingNodeRef.current &&
        tooltipNodeRef && tooltipNodeRef.current) {
      const sizingNode = sizingNodeRef.current;
      const svg = select(svgNodeRef.current);
      const tooltip = select(tooltipNodeRef.current);
      if (props.vizType === VizType.ScatterPlot) {
        createScatterPlot({
          svg, tooltip, data: props.data, size: {
            width: sizingNode.clientWidth, height: sizingNode.clientHeight,
          },
        });
      }
    }
  }, [svgNodeRef, sizingNodeRef, windowWidth, props.vizType, props.data]);

  return (
    <Root ref={sizingNodeRef}>
      <svg ref={svgNodeRef} key={id + windowWidth + 'svg'} />
      <Tooltip ref={tooltipNodeRef} key={id + windowWidth + 'tooltip'} />
    </Root>
  );

};

export default DataViz;
