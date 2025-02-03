const path = require('path')
require('dotenv').config()

module.exports = {
    reactScriptsVersion: "react-scripts",
    style: {
        sass: {
            loaderOptions: {
                sassOptions: {
                    includePaths: ['node_modules', 'src/assets']
                }
            }
        },
        postcss: {
            plugins: [require('postcss-rtl')()]
        }
    },
    webpack: {
        alias: {
          '@src': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}`),
          '@assets': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/@core/assets`),
          '@components': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/@core/components`),
          '@layouts': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/@core/layouts`),
          '@styles': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/@core/scss`),
          '@modules': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/modules`),
          '@store': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/redux`),
          '@configs': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/configs`),
          '@utils': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/utility/Utils`),
          '@hooks': path.resolve(__dirname, `${process.env.REACT_APP_BASICS_SRC}/utility/hooks`),
          '@node_modules': path.resolve(__dirname, 'node_modules'),
          '@csrc': path.resolve(__dirname, 'src'),
          '@cmodules': path.resolve(__dirname, 'src/modules'),
          'bootstrap/dist/css/bootstrap.min.css': path.resolve(__dirname, 'src/assets/scss/empty.css'),
          jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery'),
          '@devModules': path.resolve(__dirname, `src/modules`),
          '@fwsrc': path.resolve(__dirname, 'src'),
          '@authModule': path.resolve(__dirname, `src/modules/user`)
        },
        configure: (webpackConfig) => {
            // Find Babel Loader
            const babelLoader = webpackConfig.module.rules.find(rule => rule.oneOf)?.oneOf.find(rule => rule.loader?.includes('babel-loader')
            )

            if (babelLoader) {
                // Include additional directory for Babel processing
                babelLoader.include = Array.isArray(babelLoader.include)
                    ? [...babelLoader.include, path.resolve(__dirname, "node_modules/@wattsan/core")]
                    : [babelLoader.include, path.resolve(__dirname, "node_modules/@wattsan/core")]
            }

            return webpackConfig
        }
    }
}
