import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import http from 'node:http';
import { routes } from './controller/routes';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} started`);

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT: 4000 + i});
    console.log(`Worker ${worker.process.pid} started, listening on port ${4000 + i}`);
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const server = http.createServer(routes);
  server.listen(process.env.PORT, () => {
    console.log(`Worker ${process.pid} started, listening on port ${process.env.PORT}`);
});
}