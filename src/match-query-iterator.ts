export default (query, commonNode) => {
	const filter = (node) =>
		node.textContent.toLowerCase().indexOf(query) > -1 ?
			NodeFilter.FILTER_ACCEPT :
			NodeFilter.FILTER_REJECT;

	filter['acceptNode'] = filter;

	return document.createNodeIterator(
		commonNode,
		NodeFilter.SHOW_TEXT,
		<any> filter,
	);
};
