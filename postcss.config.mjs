const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      features: {
        'is-pseudo-class': false,
        'custom-selectors': false,
        'nesting-rules': false,
      },
    },
  },
};

export default config;
