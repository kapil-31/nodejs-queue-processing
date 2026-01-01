# NodeQueue (Prototype)

**NodeQueue** is a Postgres-backed job queue prototype designed to explore **correctness, failure recovery, retries, leasing, and idempotent side effects** in distributed systems.

This project intentionally focuses on **core queue mechanics**, not UI, dashboards, or hosted infrastructure.

> ⚠️ **Status**: Educational / portfolio prototype. Not production-ready.

---

## Why NodeQueue Exists

Most job queues are used as black boxes. NodeQueue was built to understand:

- Why “exactly-once” execution is impossible
- How retries actually break systems
- How to recover safely from worker crashes
- How to design idempotent side effects
- How databases can act as concurrency control systems

NodeQueue prioritizes **correctness and clarity over scale**.

---

## What NodeQueue Is

- A **Postgres-based job queue engine**
- Pull-based worker model
- Transactional job claiming using row-level locks
- Lease-based execution with heartbeats
- Retry with exponential backoff
- Crash-safe recovery
- Explicit idempotency primitives

---

## What NodeQueue Is NOT

- ❌ A hosted queue service  
- ❌ A BullMQ / Sidekiq replacement  
- ❌ A high-throughput streaming system  
- ❌ Exactly-once execution  
- ❌ A UI-first product  

---

## Core Guarantees

NodeQueue provides the following guarantees:

| Guarantee | Description |
|---------|-------------|
| Durability | Jobs are stored in Postgres and survive crashes |
| At-least-once execution | Jobs may execute more than once |
| Effectively-once side effects | External effects occur once via idempotency |
| No lost jobs | Jobs are never dropped |
| Crash recovery | Stuck jobs are reclaimed automatically |
| Backoff | Failed jobs are retried with exponential delay |

---

## High-Level Architecture
Producer → Postgres → Worker(s)
↑
Reaper / Recovery

- **Postgres** is the single source of truth
- Workers **pull** jobs (no push delivery)
- Concurrency is controlled using database locks
- Time-bounded leases prevent deadlocks





> 🚧 **Work in Progress** — Actively being developed to explore distributed job execution, retries, leasing, and idempotent side effects.
