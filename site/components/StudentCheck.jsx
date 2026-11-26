import { MarketSelect } from './Picker';
import { UI } from './UI';
export function PageHead({ title, description, back = 'home', backLabel = 'Home' }) {
  return (
    <UI.PageHead as="div">
      <UI.Back href={'#' + back}>← {backLabel}</UI.Back>
      <UI.PageTitle>{title}</UI.PageTitle>
      <UI.Lede>{description}</UI.Lede>
    </UI.PageHead>
  );
}

export function StudentCheck() {
  return (
    <>
      <PageHead
        title="Verify student status"
        description="Only current students can list a home they personally lease. Anyone can browse."
      />
      <UI.Columns>
        <UI.Panel>
          <UI.Heading>Student eligibility check</UI.Heading>
          <UI.Text>
            Try a fictional profile to see how an enrolment check would work. No ID or personal details are
            collected in this demo.
          </UI.Text>
          <UI.Form id="verify-form" noValidate>
            <UI.Label>
              Demo profile
              <MarketSelect name="profile" required defaultValue="">
                <option value="">Choose a profile</option>
                <option value="student">Alex · Currently enrolled</option>
                <option value="unconfirmed">Enrolment unconfirmed</option>
                <option value="business">Company or property manager</option>
              </MarketSelect>
            </UI.Label>
            <UI.CheckLine>
              <UI.Checkbox type="checkbox" name="personal" />
              <span>I’m a student posting my own leased place.</span>
            </UI.CheckLine>
            <UI.Error role="alert" id="verify-error" />
            <UI.PrimaryButton type="submit">Check eligibility and continue</UI.PrimaryButton>
          </UI.Form>
        </UI.Panel>
        <UI.Side as="aside">
          <UI.Heading>Why check?</UI.Heading>
          <UI.Text>
            The proposed service would use an enrolment verifier such as SheerID. A separate listing review
            would check the leaseholder’s right to sublet before the room appeared in search.
          </UI.Text>
          <UI.SecondaryButton as="a" href="#guide">
            Read the student guide <UI.Arrow aria-hidden="true">↗</UI.Arrow>
          </UI.SecondaryButton>
        </UI.Side>
      </UI.Columns>
    </>
  );
}
