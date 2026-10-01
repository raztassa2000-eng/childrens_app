/**
 * Shows your most recent Message Batches and how far along they are.
 *
 *   npm run batches
 */
import "../server/env";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
let shown = 0;
for await (const batch of client.messages.batches.list({ limit: 5 })) {
  const c = batch.request_counts;
  const failed = c.errored + c.expired + c.canceled;
  console.log(
    `${batch.id}  ${batch.processing_status.padEnd(11)}  ${c.succeeded} done, ${c.processing} working, ${failed} failed  (started ${new Date(batch.created_at).toLocaleString()})`,
  );
  if (++shown >= 5) break;
}
if (!shown) console.log("No batches yet.");
