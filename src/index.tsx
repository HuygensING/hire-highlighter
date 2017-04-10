import * as React from 'react';
import matchAllIterator from './match-all-iterator';
import matchQueryIterator from './match-query-iterator';

// ToDo add props and state interfaces
class HireHighlightBetween extends React.Component<any, any> {
	private node;

	public state = {
		highlightElements: [],
	};

	public componentDidMount() {
		let { commonNode } = this.props;
		const {
			endNode,
			hlClassName,
			hlElementName,
			query,
			startNode,
		} = this.props;

		if (query == null) return;

		const highlightElements = [];
		const className = (hlClassName == null) ? 'hi' : hlClassName;
		const elementName = (hlElementName == null) ? 'span' : hlElementName;

		if (startNode == null && endNode == null && commonNode == null) {
			commonNode = this.node;
		}

		const iterator = (query === '*') ?
			matchAllIterator(startNode, endNode, commonNode) :
			matchQueryIterator(commonNode, query);

		let currentNode;
		while (currentNode = iterator.nextNode()) {
			const textRange = document.createRange();

			if (query === '*') {
				// console.log(currentNode.textContent);
				textRange.selectNode(currentNode);
			} else {
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

	// ToDo remove highlight nodes on unmount? Or unnecessary? Maybe just a public method to remove them
	public componentWillUnmount() {
		console.log(this.state.highlightElements);
	}

	public render() {
		return (
			<div
				className={this.props.className}
			  ref={(node) => { this.node = node }}
			>
				{this.props.children}
			</div>
		);
	}
}

export default HireHighlightBetween;

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
