const app = require('./src/app.js');

const PORT = process.env.PORT || 3000;

const connectDb = require('./src/db/db.js');

connectDb();

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});