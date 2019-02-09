
const getActiveTags = function() {
  const tagsValue = location.hash.match(/(.*?)(tags=)(.*?)((&.*)?)$/);
  if(tagsValue) {
    return _.map(tagsValue[3].split(','), tag => tag.trim());
  }
  return [];
};

const persistTags = function(tags) {
  if(tags) {
    tags = _.filter(tags);
  }

  if(!tags.length) {
    location.hash = '';
    return;
  }

  const hash = location.hash;
  if(hash.length) {
    location.hash = hash.replace(/(.*?)(tags=)(.*?)((&.*)?)$/, '$1$2' + tags.join(',') + '$4');
    return;
  }
  location.hash = 'tags=' + tags.join(',');
};

const addActiveTag = function(tag) {
  const tags = _.union(getActiveTags().concat(tag)).sort();
  persistTags(tags);
  updateUi();
};

const removeActiveTag = function(tag) {
  const tags = _.without(getActiveTags(), tag).sort();
  persistTags(tags);
  updateUi();
};

const setActiveTags = function(tags) {
  tags = _.union(tags);
  persistTags(tags);
  updateUi();
};

const updateTagButtons = function() {
  const tags = getActiveTags();
  const tagDivs = document.querySelectorAll('.tag-container .control-container .control');
  _.each(tagDivs, div => {
    const tagValue = div.getAttribute('data-tag');
    const buttonContainer = div.querySelector('.tags');
    const classList = div.className.split(/\s+/);
    if(_.contains(tags, tagValue)) {
      div.className = _.union(classList, [ 'active' ]).join(' ');
      return;
    }
    div.className = _.without(classList, 'active').join(' ');
  });
};

const updateArticleList = function() {
  const activeTags = getActiveTags();
  const articleItems = document.querySelectorAll('li.article-item');
  articleItems.forEach(li => {
    const attr = li.getAttribute('data-tags');
    if(attr) {
      const articleTags = attr.split(/,/).map(tag => tag.trim());

      if(!activeTags.length || _.intersection(articleTags, activeTags).length) {
        li.className = li.className.replace(/\s*hidden\s*/g, ' ');
        return;
      }
      li.className = li.className + ' hidden';
    }
  });
};

const updateUi = function() {
  updateTagButtons();
  updateArticleList();

  const div = document.querySelector('.clear-tags-container');
  const classList = div.className.split(/\s+/);
  if(getActiveTags().length) {
    div.className = _.without(classList, 'hidden').join(' ');
    return;
  }
  div.className = _.union(classList, [ 'hidden' ]).join(' ');
};

updateUi();
