"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const match_all_iterator_1 = require("./match-all-iterator");
const match_query_iterator_1 = require("./match-query-iterator");
class HireHighlightBetween extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            highlightElements: [],
        };
    }
    componentDidMount() {
        let { commonNode } = this.props;
        const { endNode, hlClassName, hlElementName, query, startNode, } = this.props;
        if (query == null)
            return;
        const highlightElements = [];
        const className = (hlClassName == null) ? 'hi' : hlClassName;
        const elementName = (hlElementName == null) ? 'span' : hlElementName;
        if (startNode == null && endNode == null && commonNode == null) {
            commonNode = this.node;
        }
        const iterator = (query === '*') ?
            match_all_iterator_1.default(startNode, endNode, commonNode) :
            match_query_iterator_1.default(commonNode, query);
        let currentNode;
        while (currentNode = iterator.nextNode()) {
            const textRange = document.createRange();
            if (query === '*') {
                textRange.selectNode(currentNode);
            }
            else {
                const start = currentNode.textContent.toLowerCase().indexOf(query);
                textRange.setStart(currentNode, start);
                textRange.setEnd(currentNode, start + (query.length - 1));
            }
            if (!textRange.collapsed) {
                const el = document.createElement(elementName);
                el.className = className;
                textRange.surroundContents(el);
                highlightElements.push(el);
            }
        }
        this.setState({ highlightElements });
    }
    componentWillUnmount() {
        console.log(this.state.highlightElements);
    }
    render() {
        return (React.createElement("div", { className: this.props.className, ref: (node) => { this.node = node; } }, this.props.children));
    }
}
exports.default = HireHighlightBetween;
