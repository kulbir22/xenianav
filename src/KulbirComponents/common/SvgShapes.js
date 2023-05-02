import React, {Component} from "react";
import {Svg, G, Defs, Stop, LinearGradient, Path, Styles, Polygon} from "react-native-svg";

// 1

const RedBoomerRang = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 12.73 17.52" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="242.03" y1="250.18" x2="254.77" y2="250.18" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#ea2d7c"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#de2b78"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#c0266f"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#9e2064"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M242,242.92s6.33-3.37,11.39,0-5.69,16-5.69,16S249.62,248.4,242,242.92Z" transform="translate(-242.03 -241.42)"/>
        </Svg>
    )
}

const BlueBoomerRang = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 12.73 17.52" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="242.03" y1="250.18" x2="254.77" y2="250.18" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#2aaae2"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#279ed9"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#1e80c2"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#1b76ba"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M242,242.92s6.33-3.37,11.39,0-5.69,16-5.69,16S249.62,248.4,242,242.92Z" transform="translate(-242.03 -241.42)"/>
        </Svg>
    )
}

const YellowBoomerRang = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 12.73 17.52" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="242.03" y1="250.18" x2="254.77" y2="250.18" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#fedc13"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#fdd11f"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#f9b33d"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#f8ae42"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M242,242.92s6.33-3.37,11.39,0-5.69,16-5.69,16S249.62,248.4,242,242.92Z" transform="translate(-242.03 -241.42)"/>
        </Svg>
    )
}

//2

const RedFlatShape = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 34.14 11.19" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="233.25" y1="249.2" x2="267.39" y2="249.2" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#ea2d7c"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.38" stopColor={"#de2b78"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.7" stopColor={"#c0266f"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#9e2064"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M248,243.61s-6.33,10.35-14.76,6.55l11.38,4.64s16.86-.05,22.76-11.19C267.39,243.61,253.49,251,248,243.61Z" transform="translate(-233.25 -243.61)"/>
        </Svg>
    )
}

const BlueFlatShape = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 34.14 11.19" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="233.25" y1="249.2" x2="267.39" y2="249.2" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#2aaae2"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.38" stopColor={"#279ed9"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.7" stopColor={"#1e80c2"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#1b76ba"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M248,243.61s-6.33,10.35-14.76,6.55l11.38,4.64s16.86-.05,22.76-11.19C267.39,243.61,253.49,251,248,243.61Z" transform="translate(-233.25 -243.61)"/>
        </Svg>
    )
}

const YellowFlatShape = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 34.14 11.19" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="233.25" y1="249.2" x2="267.39" y2="249.2" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#fedc13"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.38" stopColor={"#fdd11f"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.7" stopColor={"#f9b33d"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#f8ae42"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M248,243.61s-6.33,10.35-14.76,6.55l11.38,4.64s16.86-.05,22.76-11.19C267.39,243.61,253.49,251,248,243.61Z" transform="translate(-233.25 -243.61)"/>
        </Svg>
    )
}

//3

const RedSquare = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 15.05 14.64" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="482.44" y1="444.59" x2="499.65" y2="444.59" gradientTransform="matrix(-0.68, 0.74, -0.74, -0.68, 666.8, -55.9)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#ea2d7c"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.39" stopColor={"#de2b78"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.74" stopColor={"#c0266f"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#9e2064"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="15.05 10.97 3.6 14.64 0 1.2 13.09 0 15.05 10.97"/>
        </Svg>
    )
}

const BlueSquare = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 15.05 14.64" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="482.44" y1="444.59" x2="499.65" y2="444.59" gradientTransform="matrix(-0.68, 0.74, -0.74, -0.68, 666.8, -55.9)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#2aaae2"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.39" stopColor={"#279ed9"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.74" stopColor={"#1e80c2"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#1b76ba"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="15.05 10.97 3.6 14.64 0 1.2 13.09 0 15.05 10.97"/>
        </Svg>
    )
}

const YellowSquare = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 15.05 14.64" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="482.44" y1="444.59" x2="499.65" y2="444.59" gradientTransform="matrix(-0.68, 0.74, -0.74, -0.68, 666.8, -55.9)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#fedc13"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.39" stopColor={"#fdd11f"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.74" stopColor={"#f9b33d"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#f8ae42"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="15.05 10.97 3.6 14.64 0 1.2 13.09 0 15.05 10.97"/>
        </Svg>
    )
}

//4

const RedFall = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 11.24 8.4" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="482.44" y1="444.59" x2="499.65" y2="444.59" x1="240.5" y1="441.12" x2="251.73" y2="441.12" 
                    gradientTransform="translate(496.84 690.59) rotate(180)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#ea2d7c"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#de2b78"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#c0266f"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#9e2064"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M256.34,253.67s-3.47-2.89-4.63,0c0,0-3.07-4.92-6.6-5.79,0,0,.23-2.31,1.68-2.6C246.79,245.28,255.18,247.59,256.34,253.67Z" 
                transform="translate(-245.11 -245.28)"/>
        </Svg>
    )
}

const BlueFall = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 11.24 8.4" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="482.44" y1="444.59" x2="499.65" y2="444.59" x1="240.5" y1="441.12" x2="251.73" y2="441.12" 
                    gradientTransform="translate(496.84 690.59) rotate(180)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#2aaae2"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#279ed9"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#1e80c2"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#1b76ba"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M256.34,253.67s-3.47-2.89-4.63,0c0,0-3.07-4.92-6.6-5.79,0,0,.23-2.31,1.68-2.6C246.79,245.28,255.18,247.59,256.34,253.67Z" 
                transform="translate(-245.11 -245.28)"/>
        </Svg>
    )
}

const YellowFall = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 11.24 8.4" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="482.44" y1="444.59" x2="499.65" y2="444.59" x1="240.5" y1="441.12" x2="251.73" y2="441.12" 
                    gradientTransform="translate(496.84 690.59) rotate(180)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#fedc13"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#fdd11f"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#f9b33d"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#f8ae42"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Path fill="url(#linear-gradient)" d="M256.34,253.67s-3.47-2.89-4.63,0c0,0-3.07-4.92-6.6-5.79,0,0,.23-2.31,1.68-2.6C246.79,245.28,255.18,247.59,256.34,253.67Z" 
                transform="translate(-245.11 -245.28)"/>
        </Svg>
    )
}

//5

const RedTriangle = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 9.82 7.8" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="-310.72" y1="472.25" x2="-302.88" y2="472.25" 
                    gradientTransform="matrix(-0.76, 0.65, -0.65, -0.76, 73.63, 562.8)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#ea2d7c"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#de2b78"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#c0266f"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#9e2064"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="9.82 5.56 1.46 7.8 0 0 9.82 5.56"/>
        </Svg>
    )
}

const BlueTriangle = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 9.82 7.8" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="-310.72" y1="472.25" x2="-302.88" y2="472.25" 
                    gradientTransform="matrix(-0.76, 0.65, -0.65, -0.76, 73.63, 562.8)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#2aaae2"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#279ed9"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#1e80c2"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#1b76ba"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="9.82 5.56 1.46 7.8 0 0 9.82 5.56"/>
        </Svg>
    )
}

const YellowTriangle = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 9.82 7.8" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="-310.72" y1="472.25" x2="-302.88" y2="472.25" 
                    gradientTransform="matrix(-0.76, 0.65, -0.65, -0.76, 73.63, 562.8)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#fedc13"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#fdd11f"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#f9b33d"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#f8ae42"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="9.82 5.56 1.46 7.8 0 0 9.82 5.56"/>
        </Svg>
    )
}

//6

const Red = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 5.07 5.11" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="490.56" y1="443.67" x2="494.94" y2="443.67" 
                gradientTransform="matrix(-0.68, 0.74, -0.74, -0.68, 661.81, -60.32)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#ea2d7c"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#de2b78"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#c0266f"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#9e2064"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="5.07 5.06 0 5.11 0.91 0 5.07 5.06"/>
        </Svg>
    )
}

const Blue = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 5.07 5.11" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="490.56" y1="443.67" x2="494.94" y2="443.67" 
                    gradientTransform="matrix(-0.68, 0.74, -0.74, -0.68, 661.81, -60.32)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#2aaae2"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#279ed9"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#1e80c2"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#1b76ba"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="5.07 5.06 0 5.11 0.91 0 5.07 5.06"/>
        </Svg>
    )
}

const Yellow = ({
    width, height, styles, stopOpacity1, stopOpacity2, stopOpacity3, stopOpacity4
}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 5.07 5.11" style={[{borderWidth: 0, borderColor: 'red'}, styles]}>
            <Defs>
                <LinearGradient id="linear-gradient" x1="490.56" y1="443.67" x2="494.94" y2="443.67" 
                    gradientTransform="matrix(-0.68, 0.74, -0.74, -0.68, 661.81, -60.32)" gradientUnits="userSpaceOnUse">
                    <Stop offset="0.19" stopColor={"#fedc13"} stopOpacity={stopOpacity1}/>
                    <Stop offset="0.33" stopColor={"#fdd11f"} stopOpacity={stopOpacity2}/>
                    <Stop offset="0.57" stopColor={"#f9b33d"} stopOpacity={stopOpacity3}/>
                    <Stop offset="0.79" stopColor={"#f8ae42"} stopOpacity={stopOpacity4}/>
                </LinearGradient>
            </Defs>
            <Polygon fill="url(#linear-gradient)" points="5.07 5.06 0 5.11 0.91 0 5.07 5.06"/>
        </Svg>
    )
}

export {
    RedBoomerRang, BlueBoomerRang, YellowBoomerRang, 
    RedFlatShape, BlueFlatShape, YellowFlatShape, 
    RedSquare, BlueSquare, YellowSquare,
    RedFall, BlueFall, YellowFall,
    RedTriangle, BlueTriangle, YellowTriangle,
    Red, Blue, Yellow
};