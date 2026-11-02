# Firestore Security Specification: bKash ISP Billing System

## 1. Data Invariants

1.  **Identity Integrity**: A user can only access their own billing document. Merchants (Admins) can access all documents.
2.  **Immutability**: Once a transaction is created, its `amount`, `trxId`, and `invoiceNumber` cannot be changed.
3.  **Terminal State Locking**: Transactions marked as `Completed` or `Refunded` cannot have their status changed again (except for Admin correction if absolutely necessary).
4.  **Identity Spoofing**: Users cannot create documents in the `users` collection with a `billId` that doesn't match their intent, nor can they spoof `merchantNumber` in transactions.
5.  **Denial of Wallet**: All strings and arrays are size-constrained to prevent storage exhaustion attacks.
6.  **Admin Verification**: Admin status is checked via Auth UID (In this version, any signed-in user is an admin for the merchant portal, but rules should ideally support a specific /admins collection).

## 2. The "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)

1.  **D1: ID Poisoning** - Attempt to create a user with a 2KB Bill ID.
2.  **D2: Identity Spoofing** - Authenticated User A attempts to `get` User B's billing info.
3.  **D3: Shadow Field Injection** - Attempt to create a user with an undocumented `isAdmin: true` field.
4.  **D4: State Shortcutting** - Attempt to update a transaction status from `Initiated` directly to `Refunded` without being an admin.
5.  **D5: Immutable Field Violation** - Attempt to change the `amount` of a `Completed` transaction.
6.  **D6: Orphaned Transaction** - Attempt to create a transaction without a valid `invoiceNumber`.
7.  **D7: Denial of Wallet (String)** - Attempt to update a customer's name with a 1MB string.
8.  **D8: Denial of Wallet (Array)** - Attempt to inject a massive array into a metadata field (if any).
9.  **D9: Privilege Escalation** - Non-admin user attempts to `list` the entire `users` collection.
10. **D10: Unverified Identity** - User with `email_verified: false` attempts to write to a protected collection.
11. **D11: Path Traversal** - Attempt to write to `users/../admins/root`.
12. **D12: Multi-Tenant Leak** - Merchant A attempts to read transactions belonging to Merchant B (if multi-tenancy is implemented).

## 3. Test Runner Plan

We will use the `firestore.rules` file to implement these constraints using the "Eight Pillars" pattern. We will verify them through logical analysis and (if possible) the Firestore emulator or local linting.
