"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (startNode, endNode, commonNode) => {
    const range = document.createRange();
    if (startNode != null && endNode != null) {
        range.setStartAfter(startNode);
        range.setEndBefore(endNode);
    }
    else {
        range.selectNode(commonNode);
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
    commonNode = (commonNode != null) ?
        commonNode :
        range.commonAncestorContainer;
    return document.createTreeWalker(commonNode, NodeFilter.SHOW_TEXT, filter, false);
};
