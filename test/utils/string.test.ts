import { removeDoubleSlashes } from '../../src/utils/string';

console.log(
  removeDoubleSlashes(
    '//post-assets-folder///post-assets-folder/asset-folder/spinner-200px.svg'
  )
);
