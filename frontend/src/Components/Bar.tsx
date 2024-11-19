import React from "react";
import { UnemploymentData } from "../@types/types";
import "./styles.css";

interface BarProps {
    width: number;
    height: number;
    data: UnemploymentData;
    x: number;
    y?: number;
    svgHeight: number;
    fontSize: number;
}


const Bar: React.FC<BarProps> = ({ width, height, data, x = 0, y = 0, svgHeight, fontSize }) => {

    const noData = data.value == null;
    const noDataOffset = noData ? 1 : 0;

    const isFemale = data.sex === "F";

    const femaleColor = "#c5ad7a";
    const maleColor = "#1e8d1e";
    const noDataColor = "#696969"; // If bar with no data is visible

    const barAnimation = (offset: number = 0): JSX.Element => {
        const animationDuration = "0.5s";
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
                width={width}
                y={svgHeight - noDataOffset}
                x={x}
                fill={noData ? noDataColor : isFemale ? femaleColor : maleColor}
                stroke="black"
                strokeWidth={1}
            >
                {/* Tooltip */}
                <title>{`${data.value}%`}</title>

                {/* Animation for bar */}
                {!noData && barAnimation()}
            </rect>

            {/* Label for genders*/}
            <text
                x={!noData ? (x + width / 2) : isFemale ? (x + width) : (undefined)}
                y={svgHeight - height - noDataOffset - 5}
                textAnchor="middle"
                fontSize={fontSize}
                fill="black"
            >
                {/* Animations for text above bar */}
                {!noData && barAnimation(5)}

                {/* Text above bar */}
                {!noData ? data.sex.charAt(0) : isFemale ? "N/A" : null}
            </text>
        </React.Fragment>
    );
};

export default Bar;
