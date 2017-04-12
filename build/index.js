"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const match_all_iterator_1 = require("./match-all-iterator");
const match_query_iterator_1 = require("./match-query-iterator");
class HireHighlighter extends React.Component {
    componentDidMount() {
        const { endNodeSelector, hlClassName, hlElementName, onChange, query, startNodeSelector, } = this.props;
        console.log('Q', query);
        const highlightElements = [];
        const className = (hlClassName == null) ? 'hi' : hlClassName;
        const elementName = (hlElementName == null) ? 'span' : hlElementName;
        const startNode = (startNodeSelector != null) ?
            this.node.querySelector(startNodeSelector) :
            null;
        const endNode = (endNodeSelector != null) ?
            this.node.querySelector(endNodeSelector) :
            null;
        const iterator = (query == null || query === '*') ?
            match_all_iterator_1.default(startNode, endNode, this.node) :
            match_query_iterator_1.default(query, this.node);
        const highlightAll = query === undefined;
        let currentNode;
        while (currentNode = iterator.nextNode()) {
            const textRange = document.createRange();
            if (highlightAll) {
                textRange.selectNode(currentNode);
            }
            else if (query != null) {
                const start = currentNode.textContent.toLowerCase().indexOf(query);
                const end = start + query.length;
                textRange.setStart(currentNode, start);
                textRange.setEnd(currentNode, end);
            }
            if (!textRange.collapsed) {
                const el = document.createElement(elementName);
                el.className = className;
                textRange.surroundContents(el);
                if (!highlightAll)
                    iterator.nextNode();
                highlightElements.push(el);
            }
        }
        if (onChange != null)
            onChange(highlightElements);
    }
    render() {
        const className = (this.props.className != null) ?
            this.props.className :
            'hire-highlighter';
        return (React.createElement("div", { className: className, ref: (node) => { this.node = node; } }, this.props.children));
    }
}
exports.default = HireHighlighter;
