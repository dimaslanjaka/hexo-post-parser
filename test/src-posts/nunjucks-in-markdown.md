---
title: nunjucks in markdown
date: 2023-10-04T09:26:26+07:00
---

## below is pretext

inline codeblock `build-${{ hashFiles('package-lock.json') }}`

```js
const varx = `build-${{ hashFiles('package-lock.json') }}`
```

```ts
const xvar = `build-${{ hashFiles('package-lock.json') }}`
```

```
const var = `build-${{ hashFiles('package-lock.json') }}`
```

## below is meta info

published: {{ date }}

## hexo shortcodes

{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}

{% blockquote @DevDocs https://twitter.com/devdocs/status/356095192085962752 %}
NEW: DevDocs now comes with syntax highlighting. http://devdocs.io
{% endblockquote %}

{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}

{% codeblock lang:objc %}
[rectangle setX: 10 y: 10 width: 20 height: 20];
{% endcodeblock %}

{% codeblock %}
alert('Hello World!');
{% endcodeblock %}
