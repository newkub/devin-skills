# Performance Testing

## Overview

Performance testing คือการทดสอบความเร็ว, scalability, และ stability ของ application ภายใต้ load ต่างๆ

## Types of Performance Testing

### Load Testing

ทดสอบ system ภายใต้ load ปกติ

```javascript
// Using k6
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500
  });
}
```

### Stress Testing

ทดสอบ system ภายใต้ load ที่เกินความสามารถ

```javascript
// Gradual ramp-up
export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 0 },     // Ramp down to 0
  ]
};
```

### Spike Testing

ทดสอบ system ภายใต้ load ที่เพิ่มขึ้น突然

```javascript
// Sudden spike
export let options = {
  stages: [
    { duration: '10s', target: 1000 },  // Spike to 1000 users
    { duration: '1m', target: 1000 },   // Stay at 1000 users
    { duration: '10s', target: 0 },     // Drop to 0
  ]
};
```

## Tools

### k6 (JavaScript)

```bash
# Install
brew install k6  # macOS
choco install k6  # Windows

# Run test
k6 run test.js

# Run with options
k6 run --vus 100 --duration 30s test.js
```

### JMeter (Java)

```xml
<!-- JMeter Test Plan -->
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan>
  <hashTree>
    <ThreadGroup>
      <stringProp name="ThreadGroup.num_threads">100</stringProp>
      <stringProp name="ThreadGroup.ramp_time">10</stringProp>
    </ThreadGroup>
  </hashTree>
</jmeterTestPlan>
```

### Locust (Python)

```python
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)
    
    @task
    def index(self):
        self.client.get("/")
    
    @task(3)
    def about(self):
        self.client.get("/about")
```

## Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Response Time** | Time to process request | < 200ms (p95) |
| **Throughput** | Requests per second | > 1000 req/s |
| **Error Rate** | Failed requests | < 1% |
| **CPU Usage** | Server CPU utilization | < 70% |
| **Memory Usage** | Server memory utilization | < 80% |

## Best Practices

### 1. Test in Production-like Environment

```javascript
// Use staging environment that mirrors production
const BASE_URL = process.env.TEST_URL || 'https://staging.example.com';
```

### 2. Monitor During Tests

```javascript
// Add custom metrics
import { Trend } from 'k6/metrics';

const responseTime = new Trend('response_time');

export default function () {
  const res = http.get(BASE_URL);
  responseTime.add(res.timings.duration);
}
```

### 3. Test Realistic Scenarios

```javascript
// Simulate real user behavior
export default function () {
  // Login
  const loginRes = http.post(`${BASE_URL}/login`, {
    username: 'test',
    password: 'test'
  });
  
  // Browse
  http.get(`${BASE_URL}/products`);
  
  // Add to cart
  http.post(`${BASE_URL}/cart`, { productId: 1 });
  
  // Checkout
  http.post(`${BASE_URL}/checkout`);
}
```

### 4. Gradual Ramp-up

```javascript
// Don't start with max load
export let options = {
  stages: [
    { duration: '5m', target: 10 },   // Warm up
    { duration: '10m', target: 50 },  // Ramp up
    { duration: '20m', target: 100 }, // Peak load
    { duration: '10m', target: 50 },  // Ramp down
    { duration: '5m', target: 0 },    // Cool down
  ]
};
```

## CI Integration

```yaml
# GitHub Actions
name: Performance Test
on: [push, pull_request]
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run k6
        uses: grafana/k6-action@v0.3.0
        with:
          filename: test.js
```
