const { override, useBabelRc } = require('customize-cra');

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
);

// module.exports = function override(config, env) {
//     console.log('React app rewired works!');
//     config.resolve.fallback = {
//         fs: false,
//     };
//     return config;
// };
