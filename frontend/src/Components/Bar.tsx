import React, { useEffect, useRef, useState } from "react";
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


const Bar: React.FC<BarProps> = ({ width, height, data, color = "green", x = 0, y = 0, svgHeight, fontSize = 10 }) => {
    const noData = data.value == null;
    const female = data.sex === "Females";
    const dynY = noData ? 1 : 0;

    const barAnimation = (offset: number = 0): JSX.Element => {
        const animationDuration = height === 0 ? "0.1s" : "0.5s";
        return (
            <>
                <animate
                    attributeName="height"
                    from="0"
                    to={height + dynY - offset}
                    dur={animationDuration}
                    fill="freeze"
                />
                <animate
                    attributeName="y"
                    from={svgHeight}
                    to={svgHeight - height - dynY - offset}
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
                height={0}
                y={svgHeight - dynY}
                x={x}
                fill={noData ? "grey" : female ? "#c5ad7a" : "#1e8d1e"}
                stroke="black"
                strokeWidth={1}
            >
                <title>{`${data.value}%`}</title>
                {/* Animation for bar */}
                {barAnimation()}
            </rect>

            {/* Label for gender*/}

            <text
                className="bar-text"
                x={!noData ? (x + width / 2) : female ? (x + width) : (undefined)}
                y={svgHeight - height - dynY - 5}
                textAnchor="middle"
                fontSize={fontSize}
                fill="black"
            >
                {barAnimation(5)}
                {!noData ? data.sex.charAt(0) : female ? "N/A" : null}

                {/* Animations for text above bar */}

            </text>
        </React.Fragment>
    );
};

export default Bar;
