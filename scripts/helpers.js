'use strict';

var pathFn = require('path');
var _ = require('lodash');
var url = require('url');
var cheerio = require('cheerio');
var lunr = require('lunr');

var localizedPath = ['docs'];

function startsWith(str, start){
	return str && str.substring(0, start.length) === start;
}

// Generate bottom navigation links (Prev, Next)
hexo.extend.helper.register('page_nav', function(){
	var p = this.page.canonical_path.split('/');
	var type = p[0];
	var ver = p[1];
	var sidebar = this.site.data[ver + '/sidebar'][type];
	var path = pathFn.basename(this.path);
	var list = {};
	var prefix = 'sidebar.' + type + '.';

	for (var i in sidebar){
		for (var j in sidebar[i]){
			list[sidebar[i][j]] = j;
		}
	}

	var keys = Object.keys(list);
	var index = keys.indexOf(path);
	var result = '';

	if (index > 0){
		result += '<a href="' + keys[index - 1] + '" class="article-footer-prev" title="' + this.__(prefix + list[keys[index - 1]]) + '">' +
			'<i class="fa fa-chevron-left"></i><span>' + this.__('page.prev') + '</span></a>';
	}

	if (index < keys.length - 1){
		result += '<a href="' + keys[index + 1] + '" class="article-footer-next" title="' + this.__(prefix + list[keys[index + 1]]) + '">' +
			'<span>' + this.__('page.next') + '</span><i class="fa fa-chevron-right"></i></a>';
	}

	return result;
});

hexo.extend.helper.register('get_version', function(){
	var p = this.page.canonical_path.split('/');
	if (p.length > 2)
		return p[1];
	
	return this.site.data.versions.latest;
});

// Generate left sidebar
hexo.extend.helper.register('doc_sidebar', function(className){
	var p = this.page.canonical_path.split('/');
	if (p.length < 2) return "";
	var type = p[0];
	var ver = p[1];
	var sidebar = this.site.data[ver + '/sidebar'][type];
	var path = pathFn.basename(this.path);
	var result = '';
	var self = this;
	var prefix = 'sidebar.' + type + '.';

	// Show version selector
	result += '<div class="version-selector"><select onchange="changeVersion(this)">';
	_.each(this.site.data.versions[type], function(title, version) {
		result += '<option value="' + type + '/' + version + '"' + (version == ver ? "selected": "")+ '>' + self.__(title) + '</option>';
	});
	result += '</select></div>';

	// Build sidebar
	_.each(sidebar, function(menu, title){
		// Create group caption
		result += '<strong class="' + className + '-title">' + self.__(prefix + title) + '</strong>';

		// Create menu items
		_.each(menu, function(link, text){
			var itemClass = className + '-link';

			var fullLink = link[0] == "/" ? link : ["", p[0], p[1], link].join("/");
			if (fullLink === "/" + self.path) itemClass += ' current';

			result += '<a href="' + fullLink + '" class="' + itemClass + '">' + self.__(prefix + text) + '</a>';
		})
	});

	return result;
});

// Generate header menu items
hexo.extend.helper.register('header_menu', function(className){
	var menu = this.site.data.menu;
	var result = '';
	var self = this;
	var lang = this.page.lang;
	var isEnglish = lang === 'en';

	_.each(menu, function(path, title){
		if (!isEnglish && ~localizedPath.indexOf(title)) path = lang + path;

		result += '<a href="' + self.url_for(path) + '" class="' + className + '-link">' + self.__('menu.' + title) + '</a>';
	});

	return result;
});

// ???
hexo.extend.helper.register('canonical_url', function(lang){
	var path = this.page.canonical_path;
	if (lang && lang !== 'en') path = lang + '/' + path;

	return this.config.url + '/' + path;
});

/// ???
hexo.extend.helper.register('url_for_lang', function(path){
	var lang = this.page.lang;
	var url = this.url_for(path);

	if (lang !== 'en' && url[0] === '/') url = '/' + lang + url;

	return url;
});

// Link for page edit
hexo.extend.helper.register('raw_link', function(path){
	return this.config.github_edit_link + path;
});

// Anchor for heading tags
hexo.extend.helper.register('page_anchor', function(str){
	var $ = cheerio.load(str, {decodeEntities: false});
	var headings = $('h1, h2, h3, h4, h5, h6');

	if (!headings.length) return str;

	headings.each(function(){
		var id = $(this).attr('id');

		$(this)
			.addClass('article-heading')
			.append('<a class="article-anchor" href="#' + id + '" aria-hidden="true"></a>');
	});

	return $.html();
});

// Not used
hexo.extend.helper.register('lunr_index', function(data){
	var index = lunr(function(){
		this.field('name', {boost: 10});
		this.field('tags', {boost: 50});
		this.field('description');
		this.ref('id');
	});

	_.sortBy(data, 'name').forEach(function(item, i){
		index.add(_.assign({id: i}, item));
	});

	return JSON.stringify(index.toJSON());
});

// ???
hexo.extend.helper.register('canonical_path_for_nav', function(){
	var p = this.page.canonical_path.split("/");

	if (startsWith(p[1], 'docs/') || startsWith(p[1], 'api/')){
		return p[0] + "/" + p[1];
	} else {
		return '';
	}
});

// Not used
hexo.extend.helper.register('lang_name', function(lang){
	var data = this.site.data.languages[lang];
	return data.name || data;
});

// Not used
hexo.extend.helper.register('disqus_lang', function(){
	var lang = this.page.lang;
	var data = this.site.data.languages[lang];

	return data.disqus_lang || lang;
});
