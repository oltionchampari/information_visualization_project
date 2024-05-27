---
theme: dashboard
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}


@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h1>Music dashboard </h1>
</div>
<div class="content">
  <h1>Music dashboard </h1>
</div>

```js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@sgratzl/lineup-advanced-example";

```

```js
const runtime = new Runtime();
const main = runtime.module(define, Inspector.into(document.body.querySelector('.content')));


```


```js

const aapl = FileAttachment("aapl.csv").csv({ typed: true });

```