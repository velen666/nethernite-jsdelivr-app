const algoliasearch = require('algoliasearch');
const algolia = algoliasearch('OFCNCOG2CU', 'f54e21fa3a2a0160595bb058179bfb1e', { protocol: 'https:' });
const index = algolia.initIndex('npm-search');

module.exports = (queryString, page = 0, hitsPerPage = 10) => {
	return Promise.resolve().then(() => {
		let parsed = parseQuery(queryString);
		let options = {
			page,
			hitsPerPage,
			attributesToHighlight: [],
			attributesToRetrieve: [ 'deprecated', 'description', 'githubRepo', 'homepage', 'keywords', 'license', 'name', 'owner', 'version' ],
			analyticsTags: [ 'jsdelivr' ],
		};

		if (parsed.facetFilters) {
			options.facetFilters = parsed.facetFilters;
		}

		return index.search(parsed.query, options).then((response) => {
			// An exact match should always come first.
			response.hits.sort((a, b) => {
				return a.name === parsed.query ? -1 : b.name === parsed.query;
			});

			return {
        //response: $.extend(true, {}, response),
        response: Object.assign({}, {}, response),
				query: queryString,
			};
		});
	});
};

module.exports.getByName = (name) => {
	return index.getObject(name).then((pkg) => {
    //return $.extend(true, {}, pkg);
    return Object.assign({}, {}, pkg);
	});
};

const ATTR_REGEXP = /\s*(?:[a-z]+)\s*:\s*(?:.(?![a-z]*\s*:))*/gi;
const QUERY_REGEXP = /^((?:(?:[^\s:]+(?![a-z]*\s*:))\s*)*)/i;
const filterMapping = {
	author: 'owner.name',
	type: 'moduleTypes',
};

function parseQuery (queryString) {
	let query = queryString.match(QUERY_REGEXP)[0].trim();
	let substr = queryString.substr(query.length);
	let filters = [];
	let match;

	while ((match = ATTR_REGEXP.exec(substr)) !== null) {
		let temp = match[0].split(':');

		if (filterMapping[temp[0].trim()]) {
			filters.push(filterMapping[temp[0].trim()] + ':' + temp[1].trim());
		}
	}

	return {
		query,
		facetFilters: filters.join(','),
	};
}
