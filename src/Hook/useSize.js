import { useState , useEffect} from 'react';

import useWindowSize from "./useWindowSize";
import sizes from "../styles/Utils/DashboardTheme";

export default function useSize() {
    // eslint-disable-next-line
    const [width, height] = useWindowSize();
    const [size, setSize] = useState([""]);
    
    const getSize = () => {
        if(width >= sizes.xl){
            setSize(["xxl"]);
            return
        };

        if(width >= sizes.lg){
            setSize(["xl"]);
            return
        };

        if(width >= sizes.md){
            setSize(["lg"]);
            return
        };

        if(width >= sizes.sm){
            setSize(["md"]);
            return
        };

        if(width >= sizes.xs){
            setSize(["sm"]);
            return
        };

        if(width < sizes.xs){
            setSize(["xs"]);
            return
        };
    };

    useEffect(() => {
        getSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);

    useEffect(() => {
        getSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return size;
}