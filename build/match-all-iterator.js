"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (startNode, endNode) => {
    const range = document.createRange();
    if (endNode == null) {
        range.selectNode(startNode);
    }
    else {
        range.setStartAfter(startNode);
        range.setEndBefore(endNode);
    }
    const filter = (node) => {
        const r = document.createRange();
        r.selectNode(node);
        const start = r.compareBoundaryPoints(Range.START_TO_START, range);
        const end = r.compareBoundaryPoints(Range.END_TO_START, range);
        return (start === -1 || end === 1) ?
            NodeFilter.FILTER_SKIP :
            NodeFilter.FILTER_ACCEPT;
    };
    filter['acceptNode'] = filter;
    return document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, filter, false);
};
