---
phase: 01
plan: 1
wave: 1
---

# Plan 01.1: Messaging & CRM Infrastructure Setup

## Objective
Establish the foundational infrastructure for v1.4. This involves setting up the environment variables required for Listmonk and Odoo integrations, and outlining the manual steps for the domain's SMTP and DNS configuration to ensure email deliverability.

## Context
- .gsd/milestones/v1.4-messaging-crm/TECHNICAL_STRATEGY.md
- src/lib/listmonk.ts
- src/lib/odoo.ts

## Tasks

<task type="auto">
  <name>Configure Environment Templates</name>
  <files>
    - .env.example
  </files>
  <action>
    Update the `.env.example` file to include necessary template keys for the upcoming Listmonk and Odoo integrations based on what `src/lib/listmonk.ts` and `src/lib/odoo.ts` expect.
    - Required variables: `LISTMONK_API_URL`, `LISTMONK_USERNAME`, `LISTMONK_PASSWORD`, `LISTMONK_LIST_ID`
    - Required variables: `ODOO_URL`, `ODOO_DB`, `ODOO_USERNAME`, `ODOO_PASSWORD`
  </action>
  <verify>grep "LISTMONK_API_URL" .env.example</verify>
  <done>The .env.example file contains placeholders for all necessary Listmonk and Odoo credentials.</done>
</task>

<task type="checkpoint:human-verify">
  <name>External Infrastructure Provisioning</name>
  <files></files>
  <action>
    The user must manually provision the external services:
    1. Set up a Forward Email (or SendGrid) account for SMTP.
    2. Add SPF, DKIM, and DMARC records to the domain's DNS configuration.
    3. Provision the Listmonk instance (e.g., via Docker) and configure it with the SMTP credentials.
    4. Provision the Odoo Community instance and ensure JSON-RPC is accessible.
    5. Populate the `.env.local` file with the actual credentials.
  </action>
  <verify>echo "Check .env.local for populated credentials"</verify>
  <done>User confirms that all external services are provisioned and `.env.local` is populated.</done>
</task>

## Success Criteria
- [ ] `.env.example` includes Listmonk and Odoo variables.
- [ ] User has verified DNS records (SPF, DKIM, DMARC) are active.
- [ ] Listmonk and Odoo credentials are added to `.env.local`.
