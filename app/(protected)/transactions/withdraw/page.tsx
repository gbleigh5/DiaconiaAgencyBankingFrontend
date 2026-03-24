import { TransactionForm } from "@/components/forms/transaction-form";

export default function Page() {
  return (
    <section>
      <h1>Withdraw</h1>
      <TransactionForm mode="withdraw" />
    </section>
  );
}
