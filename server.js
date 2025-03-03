const app = require('./src/app');
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test'){
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;