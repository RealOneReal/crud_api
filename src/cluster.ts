import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import http from 'node:http';
import { URL } from 'node:url';
import { routes } from './controller/routes';
import 'dotenv/config';

const numCPUS = availableParallelism();
const START_PORT = Number(process.env.PORT) || 4000;

let reqIteration = 0;

if (cluster.isPrimary) {

  for (let cpuIndex = 0; cpuIndex < numCPUS; cpuIndex += 1) {
    cluster.fork();
  }

  cluster.on('exit', () => {
      console.log('Worker died');
      cluster.fork();
  });

  const proxyServer = http.createServer((req, res) => {
      const nextRoundRobinPort = getPort(START_PORT);
      console.log(`Sending request to port ${nextRoundRobinPort}`);
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;
      const options = {
          ...url,
          pathname,
          port: nextRoundRobinPort,
          headers: req.headers,
          method: req.method,
      };

      req.pipe(
          http.request(options, (response) => {
            console.log(`Received response from port ${nextRoundRobinPort}`);
              res.writeHead(response.statusCode, response.headers);
              response.pipe(res);
          }),
      );
  });
  
  proxyServer.listen(START_PORT, () => {
    console.log(`Balancer created on PORT ${START_PORT}`)
  });

} else {
  const workerPort = START_PORT + cluster.worker.id;
  const server = http.createServer(routes);
  server.listen(workerPort, () => {
    console.log(`Balancer listen on port ${workerPort}`)
  });
}

const getPort = (startPort: number): number => {
    reqIteration = reqIteration === numCPUS ? 1 : reqIteration + 1;
    return reqIteration + startPort;
};
