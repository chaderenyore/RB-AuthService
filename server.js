const mongoose = require("mongoose");
const app = require("./src");
const KEYS = require("./src/_config/keys");
const logger  = require('./logger.conf');
// const { createQConnection } = require("./src/config/queue/_init_queue");


mongoose.set('strictQuery', true);
mongoose
  .connect(KEYS.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    const PORT = process.env.PORT || 2100;
    const server = app.listen(PORT, () => {
      
      logger.info(`Server has started!... and running on port ${PORT}`);
      
    });
  }).catch(error => console.log(error));