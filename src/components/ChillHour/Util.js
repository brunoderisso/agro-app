import useResize from "../../Hook/useResize";


export function GetHeightChart() {
    const window = useResize();

    if (window.height === null || window.height === undefined) {
        return 0
    }
    if (window.width < 600) {
        return window.height - 370
    }
    return window.height - 200
}
