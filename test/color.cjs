const colors = require('ansi-colors');

colors.theme({
  danger: colors.red,
  dark: colors.dim.gray,
  disabled: colors.gray,
  em: colors.italic,
  heading: colors.bold.underline,
  info: colors.cyan,
  muted: colors.dim,
  primary: colors.blue,
  strong: colors.bold,
  success: colors.green,
  underline: colors.underline,
  warning: colors.yellow
});

// Now, we can use our custom styles alongside the built-in styles!
console.log(colors.danger.strong.em('Error!'));
console.log(colors.warning('Heads up!'));
console.log(colors.info('Did you know...'));
console.log(colors.success.bold('It worked!'));
