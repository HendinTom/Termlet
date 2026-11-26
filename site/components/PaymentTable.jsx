import { UI } from './UI';
export function PaymentTable({ bills, scope, dueDate, money }) {
  return (
    <UI.PaymentTable as="div">
      <UI.Table>
        <thead>
          <UI.TableRow>
            <UI.HeaderCell>Due date</UI.HeaderCell>
            <UI.HeaderCell>Amount</UI.HeaderCell>
            <UI.HeaderCell>Status</UI.HeaderCell>
            <UI.HeaderCell />
          </UI.TableRow>
        </thead>
        <tbody>
          {bills.map((bill) => {
            const settled = bill.confirmed && bill.paid >= bill.amount;
            const Status = settled ? UI.PaidStatus : UI.PaymentStatus;
            return (
              <UI.TableRow key={bill.key}>
                <UI.TableCell>
                  {dueDate(bill.key)}
                  <UI.Text as="small">{bill.kind || 'Monthly rent'}</UI.Text>
                </UI.TableCell>
                <UI.TableCell>
                  {money(bill.amount)}
                  {!!bill.credit && <UI.Text as="small">{money(bill.credit)} credit</UI.Text>}
                </UI.TableCell>
                <UI.TableCell>
                  <Status>{settled ? 'Paid / settled' : bill.confirmed ? 'Upcoming' : 'Projected'}</Status>
                  {!!bill.paid && <UI.Text as="small">Demo receipt · {bill.key.replace('-', '')}</UI.Text>}
                </UI.TableCell>
                <UI.TableCell>
                  {bill.confirmed && !settled && (
                    <UI.PaymentButton type="button" data-pay={bill.key} data-scope={scope}>
                      Simulate payment
                    </UI.PaymentButton>
                  )}
                </UI.TableCell>
              </UI.TableRow>
            );
          })}
        </tbody>
      </UI.Table>
    </UI.PaymentTable>
  );
}
