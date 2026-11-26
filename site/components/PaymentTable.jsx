export function PaymentTable({ bills, scope, dueDate, money }) {
  return <div className="payment-table"><table><thead><tr><th>Due date</th><th>Amount</th><th>Status</th><th/></tr></thead>
    <tbody>{bills.map(bill=>{
      const settled=bill.confirmed && bill.paid>=bill.amount;
      return <tr key={bill.key}><td>{dueDate(bill.key)}<small>{bill.kind || 'Monthly rent'}</small></td>
        <td>{money(bill.amount)}{!!bill.credit && <small>{money(bill.credit)} credit</small>}</td>
        <td><span className={'payment-status'+(settled?' paid':'')}>{settled?'Paid / settled':bill.confirmed?'Upcoming':'Projected'}</span>
        {!!bill.paid && <small>Demo receipt · {bill.key.replace('-','')}</small>}</td>
        <td>{bill.confirmed && !settled && <button className="plain-button" type="button" data-pay={bill.key} data-scope={scope}>Simulate payment</button>}</td></tr>;
    })}</tbody></table></div>;
}
