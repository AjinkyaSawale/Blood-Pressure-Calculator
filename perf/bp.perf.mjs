import autocannon from 'autocannon';

const TARGET_URL = process.env.BP_PERF_URL || 'http://127.0.0.1:8080/index.html';

async function run() {
  console.log(' Starting performance test against:', TARGET_URL);

  const result = await autocannon({
    url: TARGET_URL,
    connections: 20,   // concurrent users
    duration: 10,      // seconds
    pipelining: 1
  });

  console.log('Performance test completed');
  console.log(`Requests/sec (avg): ${result.requests.average}`);
  console.log(`Latency (avg ms):   ${result.latency.average}`);
  console.log(`Throughput (kb/s):  ${result.throughput.average}`);

  if (result.latency.average > 300) {
    console.warn('Average latency above 300ms – performance may need tuning.');
  }
}

run().catch((err) => {
  console.error('Performance test failed', err);
  process.exit(1);
});
