import pkg from './package.json';
import babel from 'rollup-plugin-babel';

const formats = {
  "es": pkg.module,
  "cjs": pkg.main,
  "umd": pkg['umd:main'],
};

export default Object.keys(formats).map(format => ({
  input: pkg.source,
  output: {
    file: formats[format],
    format,
    name: 'react-virtual-list',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}));
