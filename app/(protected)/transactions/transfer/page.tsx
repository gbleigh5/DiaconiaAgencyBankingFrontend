import { TransactionForm } from "@/components/forms/transaction-form";

export default function Page() {
  return (
    <section>
      <h1>Transfer</h1>
      <TransactionForm mode="transfer" />
    </section>
  );
}
