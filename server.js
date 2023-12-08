const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully!');
}).catch(() => {
    console.log('Database connection failed!');
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
});