import { formatDate, formatMoney, STATUS_LABEL } from "@/lib/format";

type Payment = {
  id: string;
  brand: string;
  amount: number | string;
  status: string;
  dueDate: string | Date | null;
  paidDate: string | Date | null;
  notes: string | null;
};

export default function LedgerEntry({
  payment,
  readOnly,
  onStatusChange,
  onDelete,
}: {
  payment: Payment;
  readOnly?: boolean;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}) {
  const stampClass =
    payment.status === "PAID" ? "paid" : payment.status === "OVERDUE" ? "overdue" : "pending";

  const dateLabel =
    payment.status === "PAID" ? `Paid ${formatDate(payment.paidDate)}` : `Due ${formatDate(payment.dueDate)}`;

  return (
    <div className="ledger-entry">
      <div>
        <div className="ledger-brand">{payment.brand}</div>
        {payment.notes && <div className="ledger-note">{payment.notes}</div>}
      </div>
      <div className="ledger-date">{dateLabel}</div>
      <div className="ledger-amount">{formatMoney(payment.amount)}</div>

      {readOnly ? (
        <span className={`stamp ${stampClass}`}>{STATUS_LABEL[payment.status]}</span>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <select
            value={payment.status}
            onChange={(e) => onStatusChange && onStatusChange(payment.id, e.target.value)}
            style={{
              background: "var(--surface-raised)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              padding: "6px 8px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
            }}
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          {onDelete && (
            <button className="btn-danger" onClick={() => onDelete(payment.id)}>
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}
