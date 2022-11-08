import * as config from './config.js';
import express from 'express';
import * as channelsService from './service/channelService.js';

const app = express();
const port = config.port;

app.get('/channels', async (req, res) => {
    const result = await channelsService.getManyByTitle(req.query.title);
    console.log(result);
    res.send(result);
});

app.post('/channels', async (req, res) => {
    res.send('Hello World!');
});

app.post('/channel-history/all', async (req, res) => {
    res.send('Hello World!');
});

app.get('/channel-history/:id', async (req, res) => {
    console.log(req.params)
    res.send('Hello World!');
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
