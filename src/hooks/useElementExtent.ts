import { useEffect, useState } from "react";
import { Extent2d } from "../model/coord";

/**
 * A hook that provides an Extent2d which is synchronized with the size of an element.
 * @param elementRef A reference containing the HTML element whose size we wish to track.
 * @param initial An initial value for the returned extent.
 * @returns An Extent2d matching the clientWidth/Height of the provided element.
 */
export function useElementExtent(elementRef: React.RefObject<Element>, initial: Extent2d): Extent2d {
    const [extent, setExtent] = useState(initial);

    useEffect(() => {
        if (!elementRef.current) {
            console.error('empty ref passed to ResizeObserver; nothing will be observed');
            return;
        }

        const resizeObserver = new ResizeObserver(entries => {
            setExtent(getExtent(entries[0]));
        });
        resizeObserver.observe(elementRef.current);

        return () => { resizeObserver.disconnect(); };
    }, [elementRef]);

    return extent;
}

function getExtent(e: ResizeObserverEntry): Extent2d {
    const rect = e.target;
    return {
        width: rect.clientWidth,
        height: rect.clientHeight,
    };
}
