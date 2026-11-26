export function PageHead({ title, description, back='home', backLabel='Home' }) {
  return <div className="page-head"><a className="back" href={'#'+back}>← {backLabel}</a><h1 className="page-title">{title}</h1><p className="lede">{description}</p></div>;
}

export function StudentCheck() {
  return <><PageHead title="Verify student status" description="Only current students can list a home they personally lease. Anyone can browse."/>
    <div className="layout"><section className="panel"><h2>Student eligibility check</h2><p>Try a fictional profile to see how an enrolment check would work. No ID or personal details are collected in this demo.</p>
    <form id="verify-form" noValidate><label>Demo profile<select name="profile" required defaultValue="">
      <option value="">Choose a profile</option><option value="student">Alex · Currently enrolled</option><option value="unconfirmed">Enrolment unconfirmed</option><option value="business">Company or property manager</option></select></label>
    <label className="check-line"><input type="checkbox" name="personal"/><span>I’m a student posting my own leased place.</span></label>
    <p role="alert" id="verify-error" className="error"/><button type="submit" className="btn">Check eligibility and continue</button></form></section>
    <aside className="panel side"><h2>Why check?</h2><p>The proposed service would use an enrolment verifier such as SheerID. A separate listing review would check the leaseholder’s right to sublet before the room appeared in search.</p>
    <a className="btn alt" href="#guide">Read the student guide <span aria-hidden="true" className="arrow">↗</span></a></aside></div></>;
}
