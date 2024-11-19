import React from "react";
import { UnemployementData } from "../@types/types";
import "./styles.css";

interface BarProps {
    width: number;
    height: number;
    data: UnemployementData;
    color?: string;
    x?: number;
    y?: number;
    svgHeight: number;
    fontSize?: number;
}


const Bar: React.FC<BarProps> = ({ width, height, data, x = 0, y = 0, svgHeight, fontSize = 10 }) => {

    const noData = data.value == null;
    const noDataOffset = noData ? 1 : 0;

    const female = data.sex === "Females";

    const barAnimation = (offset: number = 0): JSX.Element => {
        const animationDuration = height === 0 ? "0.1s" : "0.5s";
        return (
            <>
                <animate
                    attributeName="height"
                    from={y}
                    to={height + noDataOffset - offset}
                    dur={animationDuration}
                    fill="freeze"
                />
                <animate
                    attributeName="y"
                    from={svgHeight}
                    to={svgHeight - height - noDataOffset - offset}
                    dur={animationDuration}
                    fill="freeze"
                />
            </>
        )
    }

    return (
        <React.Fragment>
            <rect
                className="bar-rect"
                width={width}
                y={svgHeight - noDataOffset}
                x={x}
                fill={noData ? "grey" : female ? "#c5ad7a" : "#1e8d1e"}
                stroke="black"
                strokeWidth={1}
            >
                {/* Tooltip */}
                <title>{`${data.value}%`}</title>

                {/* Animation for bar */}
                {barAnimation()}
            </rect>

            {/* Label for genders*/}
            <text
                className="bar-text"
                x={!noData ? (x + width / 2) : female ? (x + width) : (undefined)}
                y={svgHeight - height - noDataOffset - 5}
                textAnchor="middle"
                fontSize={fontSize}
                fill="black"
            >
                {/* Animations for text above bar */}
                {barAnimation(5)}

                {/* Text above bar */}
                {!noData ? data.sex.charAt(0) : female ? "N/A" : null}
            </text>
        </React.Fragment>
    );
};

export default Bar;
