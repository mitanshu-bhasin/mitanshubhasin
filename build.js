const { execSync } = require('child_process');
const fs = require('fs');

const files = ['index', '404', 'exp', 'privacy', 'toc'];

try {
    console.log('Starting build process...');

    // 1. Compile JSX to JS
    files.forEach(file => {
        if (fs.existsSync(`${file}.jsx`)) {
            console.log(`Compiling ${file}.jsx -> ${file}.js...`);
            execSync(`npx babel ${file}.jsx --out-file ${file}.js --presets=@babel/preset-env,@babel/preset-react`, { stdio: 'inherit' });
        }
    });

    // 2. Minify JS
    files.forEach(file => {
        if (fs.existsSync(`${file}.js`)) {
            console.log(`Minifying ${file}.js -> ${file}.min.js...`);
            execSync(`npx terser ${file}.js -o ${file}.min.js`, { stdio: 'inherit' });
        }
    });

    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
