import express from 'express';
import type { ErrorRequestHandler } from "express";
import * as config from './config.js';
import * as channelsService from './service/channelService.js';
import * as collectorService from './service/collectorService.js';

const app = express();
const port = config.port;

app.get('/channels', async (req, res) => {
    const result = await channelsService.getManyByTitle(req.query.title as string);
    res.send(result);
});

app.get('/channels/:channelId', async (req, res) => {
    const result = await channelsService.getOneByChannelId(req.params.channelId);
    return res.send(result);
});

app.get('/history/nox', async (req, res) => {
    const key = req.query.key as string;
    const result = await collectorService.collectFromNox(key);
    res.send(result);
});

app.post('/channel-history/all', async (req, res) => {
    res.send('Hello World!');
});

//GET /storage/v1/history/view-sub/:{channel-id} 2H
app.get('/history/view-sub/:channelId', async (req, res) => {
    const history = await channelsService.getHistory(req.params.channelId);
    return res.send(history);
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

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
};
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
