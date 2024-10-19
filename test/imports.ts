import * as lib from '../src';

const props = Object.keys(lib);
for (let i = 0; i < props.length; i++) {
  const prop = props[i];
  console.log(`lib.${prop} is ${typeof lib[prop]}`);
}
