export default (startNode: Node, endNode: Node, commonNode?: Node) => {
	const range = document.createRange();

	if (commonNode == null) commonNode = range.commonAncestorContainer;

	if (startNode != null) {
		range.setStartAfter(startNode);
	} else {
		range.setStartBefore(commonNode);
	}

	if (endNode != null) {
		range.setEndBefore(endNode);
	} else {
		range.setEndAfter(commonNode);
	}

	if (startNode == null && endNode == null) range.selectNode(commonNode);

	const filter = (node: Node) => {
		const r = document.createRange();
		r.selectNode(node);

		const start = r.compareBoundaryPoints(Range.START_TO_START, range);
		const end = r.compareBoundaryPoints(Range.END_TO_START, range);

		return (start === -1 || end === 1) ?
			NodeFilter.FILTER_SKIP:
			NodeFilter.FILTER_ACCEPT;
	};

	filter['acceptNode'] = filter;

	return document.createTreeWalker(commonNode, NodeFilter.SHOW_TEXT, <any> filter, false);
}
