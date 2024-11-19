import React, { useEffect, useState } from 'react';
import Bar from './Bar';
import "./styles.css";
import { UnemployementData } from '../@types/types';
import { fetchUnemployementData } from '../Network/Requests';

interface BarChartProps {
    width: number;
    height: number;
    iso_code: string | null;
}

const BarChart: React.FC<BarChartProps> = ({
    width,
    height,
    iso_code
}) => {
    const [data, setData] = useState<UnemployementData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [forceAnimations, setForceAnimations] = useState<number>(Date.now());


    useEffect(() => {
        const fetchData = async () => {
            if (!iso_code) {
                setData([])
                return;
            }
            try {
                setLoading(true);
                const unemployementData = await fetchUnemployementData(iso_code)
                setData(unemployementData);
                setForceAnimations(Date.now());
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [iso_code]);


    const calculateHorizontalLines = (barChartHeight: number, svgHeight: number) => {
        const noOfLines = barChartHeight / 10;
        const lineSpacing = svgHeight / noOfLines;

        return [...Array(noOfLines)].map((_, index) => ({
            y: svgHeight - index * lineSpacing,
            label: index * 10,
        }));
    };

    const calculateBarChartHeight = (dataLength: number): number => {
        const maxValue = dataLength > 0 ? Math.max(...data.map(item => item.value)) : 0;
        const lines = Math.ceil(maxValue / 10);
        let minLines = lines < 4 ? 4 : lines + 1;
        return minLines * 10;
    }


    const barChartHeight = calculateBarChartHeight(data.length);
    const horizontalLines = calculateHorizontalLines(barChartHeight, height);

    const fontSize = 12
    const xOffset = width / 30;
    const yOffset = 15;
    let lastTimePeriod: string | null = null;

    width = width + xOffset

    let barWidth = (width) / (data.length + 2)
    const barSpacing = barWidth / 2
    barWidth = barWidth - barSpacing / 2

    let spacing = barSpacing;

    return (
        <div>
            <svg key={forceAnimations} width={width} height={height}>
                {/* Lines and text for % values */}
                {horizontalLines.map((line, index) => (
                    <React.Fragment key={index}>
                        <line
                            x1={xOffset}
                            x2={width}
                            y1={line.y - yOffset}
                            y2={line.y - yOffset}
                            stroke="black"
                            opacity={index === 0 ? 1 : 0.1}
                        />
                        {index > 0 &&
                            <text
                                y={line.y - yOffset + 2.5}
                                x={0}
                                fill='black'
                                fontSize={fontSize}
                            >{index * 10 + '%'}</text>
                        }
                    </React.Fragment>
                ))}

                {/* Render Bars and timePeriod text */}
                <g>
                    {data.map((value, index) => {
                        const barHeight = loading ? 0 : (value.value / barChartHeight) * height;

                        /* No spacing between bars if time periods are the same */
                        if (lastTimePeriod === null) {
                            lastTimePeriod = value.time_period;
                        } else if (value.time_period !== lastTimePeriod) {
                            spacing += barSpacing;
                            lastTimePeriod = value.time_period;
                        }

                        return (
                            <React.Fragment key={`${iso_code}-${index}-${forceAnimations}`}>
                                <Bar
                                    width={barWidth}
                                    height={barHeight}
                                    data={value}
                                    x={index * barWidth + spacing + xOffset}
                                    svgHeight={height - yOffset}
                                    fontSize={fontSize}
                                />

                                {/* Render timeperiod text for every other data point */}
                                {value.sex === "Females" && (
                                    <text
                                        x={index * barWidth + spacing + barWidth + xOffset}
                                        y={height}
                                        fontSize={fontSize}
                                        textAnchor="middle"
                                        fill="black"
                                    >
                                        {value.time_period}
                                    </text>
                                )}
                            </React.Fragment>
                        );
                    })}
                </g>
                {/* Bottom graph line */}
                <line className="barchart-line" x1={xOffset} x2={xOffset} y1={height - yOffset}></line>
            </svg>

        </div>
    );
};

export default BarChart;
