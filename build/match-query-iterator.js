"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (commonNode, query) => {
    const filter = (node) => node.textContent.toLowerCase().indexOf(query) > -1 ?
        NodeFilter.FILTER_ACCEPT :
        NodeFilter.FILTER_REJECT;
    filter['acceptNode'] = filter;
    return document.createNodeIterator(commonNode, NodeFilter.SHOW_TEXT, filter);
};
