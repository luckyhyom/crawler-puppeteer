import express from 'express';
import * as config from './config.js';
import * as channelsService from './service/channelService.js';
import * as collectorService from './service/collectorService.js';

const app = express();
const port = config.port;

app.get('/channels', async (req, res) => {
    const result = await channelsService.getManyByTitle(req.query.title);
    res.send(result);
});

app.get('/history/nox', async (req, res) => {
    const key = req.query.key;
    const channelId = req.query.channelId;
    const result = await collectorService.collectFromNox(key, channelId);
    res.send(result);
});

app.post('/channel-history/all', async (req, res) => {
    res.send('Hello World!');
});

app.get('/channel-history/:id', async (req, res) => {
    console.log(req.params)
    res.send('Hello World!');
});

app.get('/test', (req, res, next) => {
    res.writeHead(301, {
        Location: `https://makevalue.net/v5/companise`
    }).end();
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
