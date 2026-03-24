import { TransactionForm } from "@/components/forms/transaction-form";

export default function Page() {
  return (
    <section>
      <h1>Deposit</h1>
      <TransactionForm mode="deposit" />
    </section>
  );
}
