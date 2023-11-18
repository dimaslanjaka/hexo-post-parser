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

- published: {{ page.date }}
- modified: {{ page.updated }}
