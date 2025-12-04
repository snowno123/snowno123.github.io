fetch('/search.json')
  .then(r => r.json())
  .then(data => {
    window.posts = data.posts;

    // Build Lunr index
    window.idx = lunr(function () {
      this.ref('url');
      this.field('title');
      this.field('content');

      window.posts.forEach(post => this.add(post));
    });
  });

document.addEventListener('DOMContentLoaded', () => {
  const box = document.getElementById('searchBox');
  const list = document.getElementById('results');

  function runSearch(query) {
    if (!window.idx) return;

    const results = window.idx.search(query);
    list.innerHTML = '';

    results.forEach(result => {
      const post = window.posts.find(p => p.url === result.ref);
      const li = document.createElement('li');
      li.innerHTML = `<a href="${post.url}">${post.title}</a>`;
      list.appendChild(li);
    });

    if (query.length > 0 && results.length === 0) {
      list.innerHTML = '<li>No results.</li>';
    }
  }

  box.addEventListener('input', () => runSearch(box.value));

  box.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch(box.value);
    }
  });
});
