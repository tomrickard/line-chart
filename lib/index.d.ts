export interface Chart {
    ratio?: Function;
    width?: Function;
    height?: Function;
    margins?: Function;
    scaleX?: Function;
    scaleY?: Function;
    axisPadding?: Function;
    addSeries?: Function;
    data?: Function;
    selection?: Function;
    title?: Function;
    xLabel?: Function;
    yLabel?: Function;
    render?: Function;
    update?: Function;
    grid?: Function;
}
export interface Label {
    text?: string;
    position?: Function;
}
declare function chart(selection: any, id?: string): Chart;
export { chart };
