export type JobStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RETRYABLE"
  | "COMPLETED"
  | "DEAD_LETTER";