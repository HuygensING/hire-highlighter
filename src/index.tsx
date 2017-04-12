import * as React from 'react';
import matchAllIterator from './match-all-iterator';
import matchQueryIterator from './match-query-iterator';

// ToDo add props and state interfaces
class HireHighlighter extends React.Component<any, any> {
	private node;

	public componentDidMount() {
		const {
			endNodeSelector,
			hlClassName,
			hlElementName,
			onChange,
			query,
			startNodeSelector,
		} = this.props;
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
			matchAllIterator(startNode, endNode, this.node) :
			matchQueryIterator(query, this.node);

		const highlightAll = query === undefined;

		let currentNode;
		while (currentNode = iterator.nextNode()) {
			const textRange = document.createRange();

			if (highlightAll) {
				textRange.selectNode(currentNode);
			} else if (query != null) {
				const start = currentNode.textContent.toLowerCase().indexOf(query);
				const end = start + query.length;
				textRange.setStart(currentNode, start);
				textRange.setEnd(currentNode, end);
			}

			if (!textRange.collapsed) {
				const el = document.createElement(elementName);
				el.className = className;
				textRange.surroundContents(el);
				if (!highlightAll) iterator.nextNode();
				highlightElements.push(el);
			}
		}

		if (onChange != null) onChange(highlightElements);
	}

	public render() {
		const className = (this.props.className != null) ?
			this.props.className :
			'hire-highlighter';

		return (
			<div
				className={className}
			  ref={(node) => { this.node = node }}
			>
				{this.props.children}
			</div>
		);
	}
}

export default HireHighlighter;

// let text = '';
// const highlightSpans = [];
// const treeWalkerContainer = new TreeWalkerContainer(startAnchor, endAnchor, commonAncestor);
// const treeWalker = treeWalkerContainer.treeWalker;
// while (treeWalker.nextNode()) {
// 	const node = treeWalker.currentNode;
// 	const textRange = document.createRange();
// 	textRange.selectNode(node);
// 	const span = document.createElement('span');
// 	span.className = 'highlight';
// 	textRange.surroundContents(span);
// 	text = `${text}${node.textContent}`;
// 	highlightSpans.push(span);
// }
