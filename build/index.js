"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const match_all_iterator_1 = require("./match-all-iterator");
const match_query_iterator_1 = require("./match-query-iterator");
const concatTextContent = (iterator) => {
    let allText = '';
    let currentNode;
    while (currentNode = iterator.nextNode()) {
        allText = `${allText}${currentNode.textContent}`;
    }
    return allText;
};
const findStartNodeIndices = (text, query) => {
    text = text.toLowerCase();
    const indices = [];
    let i = -1;
    while ((i = text.indexOf(query, i + 1)) != -1) {
        indices.push(i);
    }
    return indices;
};
class HireHighlighter extends React.Component {
    constructor(props) {
        super(props);
        this.highlightElements = [];
        this.hlClassName = 'hi';
        this.hlNodeName = 'span';
        this.idAttribute = 'data-id';
        if (props.hlClassName != null)
            this.hlClassName = props.hlClassName;
        if (props.hlNodeName != null)
            this.hlNodeName = props.hlNodeName;
        if (props.idAttribute != null)
            this.idAttribute = props.idAttribute;
    }
    componentDidMount() {
        let { milestones, query } = this.props;
        const { endNodeSelector, onChange, startNodeSelector, } = this.props;
        const highlightElements = [];
        const highlightAll = query === undefined;
        const highlightBetween = startNodeSelector !== null && endNodeSelector != null;
        if (query != null) {
            query = query.toLowerCase();
            if (query.length === 1)
                milestones = false;
        }
        const t0 = performance.now();
        if (milestones) {
            const iterator = match_all_iterator_1.default(this.node);
            const text = concatTextContent(iterator);
            const startNodeIndices = findStartNodeIndices(text, query);
            const endNodeIndices = startNodeIndices.map((i) => i + query.length);
            const iterator2 = match_all_iterator_1.default(this.node);
            this.addMilestones(iterator2, startNodeIndices, endNodeIndices);
            this.highlightBetweenSelectors(`.hi-start`, `.hi-end`);
        }
        else if (highlightAll && highlightBetween) {
            this.highlightBetweenSelectors(startNodeSelector, endNodeSelector);
        }
        else if (highlightAll) {
            const iterator = match_all_iterator_1.default(this.node);
            this.wrapTextNodes(iterator);
        }
        else {
            const iterator = match_query_iterator_1.default(query, this.node);
            this.wrapQuery(iterator, query);
        }
        const t1 = performance.now();
        console.log(`Perf: ${t1 - t0}`);
        if (onChange != null)
            onChange(highlightElements);
    }
    highlightBetweenSelectors(startNodeSelector, endNodeSelector) {
        const startNodes = this.node.querySelectorAll(startNodeSelector);
        Array.from(startNodes).forEach((startNode) => {
            const id = startNode.getAttribute(this.idAttribute);
            const endNode = this.node.querySelector(`${endNodeSelector}[${this.idAttribute}="${id}"]`);
            const iterator = match_all_iterator_1.default(startNode, endNode);
            this.wrapTextNodes(iterator);
        });
    }
    wrapTextNodes(iterator) {
        let currentNode;
        while (currentNode = iterator.nextNode()) {
            const textRange = document.createRange();
            textRange.selectNode(currentNode);
            const el = this.createHighlightElement();
            textRange.surroundContents(el);
            this.highlightElements.push(el);
        }
    }
    wrapQuery(iterator, query) {
        let currentNode;
        while (currentNode = iterator.nextNode()) {
            const textRange = document.createRange();
            if (query != null) {
                const start = currentNode.textContent.toLowerCase().indexOf(query);
                const end = start + query.length;
                textRange.setStart(currentNode, start);
                textRange.setEnd(currentNode, end);
            }
            if (!textRange.collapsed) {
                const el = this.createHighlightElement();
                textRange.surroundContents(el);
                iterator.nextNode();
                this.highlightElements.push(el);
            }
        }
    }
    addMilestones(iterator, startIndices, endIndices) {
        let textLength = 0;
        let currentNode;
        let startIndexIndex = 0;
        let endIndexIndex = 0;
        let startIndex = startIndices[startIndexIndex];
        let endIndex = endIndices[endIndexIndex];
        while (currentNode = iterator.nextNode()) {
            if (startIndex >= textLength &&
                startIndex <= textLength + currentNode.textContent.length) {
                const textRange = document.createRange();
                textRange.setStart(currentNode, startIndex - textLength);
                const node = this.createMilestone(`ms-${startIndexIndex}`, true);
                textRange.insertNode(node);
                startIndex = startIndices[++startIndexIndex];
            }
            if (endIndex >= textLength &&
                endIndex <= textLength + currentNode.textContent.length) {
                const textRange = document.createRange();
                textRange.setStart(currentNode, endIndex - textLength);
                const node = this.createMilestone(`ms-${endIndexIndex}`);
                textRange.insertNode(node);
                endIndex = endIndices[++endIndexIndex];
            }
            textLength += currentNode.textContent.length;
        }
    }
    createHighlightElement() {
        const el = document.createElement(this.hlNodeName);
        el.className = this.hlClassName;
        return el;
    }
    createMilestone(id, start = false) {
        const el = document.createElement('a');
        const suffix = start ? 'start' : 'end';
        el.className = `${this.hlClassName}-${suffix}`;
        el.setAttribute(this.idAttribute, id);
        return el;
    }
    render() {
        const className = (this.props.className != null) ?
            this.props.className :
            'hire-highlighter';
        return (React.createElement("div", { className: className, ref: (node) => { this.node = node; } }, this.props.children));
    }
}
exports.default = HireHighlighter;
