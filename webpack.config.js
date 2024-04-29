module.exports = {
    // Other webpack configuration options...
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Match TypeScript files
                use: 'ts-loader', // Use ts-loader to handle TypeScript files
                exclude: /node_modules/ // Exclude node_modules directory
            }
        ]
    }
};