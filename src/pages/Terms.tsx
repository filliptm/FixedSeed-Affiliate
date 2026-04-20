import { Link } from "react-router-dom";
import PortalTopBar from "../components/PortalTopBar";
import PortalFooter from "../components/PortalFooter";
import type { ThemeContext } from "../App";

const EFFECTIVE_DATE = "April 20, 2026";
const LAST_UPDATED = "April 20, 2026";

export default function Terms({ themeCtx }: { themeCtx: ThemeContext }) {
  return (
    <div className="app-shell">
      <PortalTopBar
        subtitle="Affiliates · Terms"
        theme={themeCtx.theme}
        onThemeChange={themeCtx.setTheme}
      />

      <main className="container terms">
        <Link to="/" className="btn btn-sm" style={{ marginBottom: 24 }}>
          ← Back
        </Link>

        <div className="card terms-card">
          <h1>Fixed Seed Affiliate Program</h1>
          <p className="terms-meta">
            Terms and Conditions · Effective {EFFECTIVE_DATE} · Last updated{" "}
            {LAST_UPDATED}
          </p>

          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By applying to or participating in the Fixed Seed Affiliate
              Program (the "Program"), you ("Affiliate" or "you") agree to
              these Terms and Conditions (the "Agreement") between you and{" "}
              [COMPANY LEGAL NAME] ("Fixed Seed," "we," "us," or "our"). If you
              do not agree to these Terms, do not apply to or participate in
              the Program.
            </p>
          </section>

          <section>
            <h2>2. The Program</h2>
            <p>
              The Program allows approved individuals to share a unique
              referral link to Fixed Seed products. When a customer clicks your
              link and completes a qualifying purchase within the attribution
              window described below, you earn a commission on that sale,
              subject to this Agreement.
            </p>
            <p>
              Participation is entirely voluntary and opt-in. Nothing in this
              Agreement obligates either party to continue the relationship
              beyond the terms explicitly stated.
            </p>
          </section>

          <section>
            <h2>3. Independent Contractor — Not an Employee or Agent</h2>
            <p>
              You and Fixed Seed are independent parties. Nothing in this
              Agreement creates an employer-employee relationship, partnership,
              joint venture, franchise, or agency relationship between you and
              Fixed Seed. You are <strong>not</strong> a sales representative,
              sales contractor, or employee of Fixed Seed.
            </p>
            <p>
              You have no authority to make commitments, enter contracts, or
              otherwise bind Fixed Seed. You are solely responsible for your
              own conduct, your own taxes, your own business expenses, and any
              benefits you may wish to obtain. Fixed Seed does not provide
              wages, benefits, training, equipment, or supervision.
            </p>
          </section>

          <section>
            <h2>4. Application and Approval</h2>
            <p>
              Enrollment in the Program is by application only. We review each
              application manually. We may approve or reject any application
              for any reason or no reason, in our sole discretion. Submission
              of an application does not guarantee approval. If approved, you
              will be assigned a unique referral code.
            </p>
          </section>

          <section>
            <h2>5. Referral Links and Attribution</h2>
            <p>
              Your referral link contains your unique code (for example,{" "}
              <code>fixedseed.com/?ref=YOURCODE</code>). When a visitor clicks
              your link, we set a cookie on their browser that remains valid
              for <strong>30 days</strong> (the "Attribution Window"). If that
              visitor completes a qualifying purchase within the Attribution
              Window, on the same browser and device, the sale is credited to
              you.
            </p>
            <p>
              Attribution is last-click within the Attribution Window — if a
              different affiliate's cookie later overwrites yours, that
              affiliate receives credit. Attribution requires the cookie to
              persist until checkout; we cannot credit sales where the cookie
              was cleared, blocked, lost due to a private/incognito session, or
              where the customer completes checkout on a different browser or
              device.
            </p>
          </section>

          <section>
            <h2>6. Commissions</h2>
            <p>
              Your commission rate is set individually at the time of your
              approval. Rates may be expressed as a percentage of the sale
              amount or as a flat amount per sale, as we agreed at the time of
              approval. Your current rate is always visible on your affiliate
              dashboard.
            </p>
            <p>
              <strong>Rate snapshot.</strong> Each conversion is recorded with
              the commission rate in effect at the time of that specific sale.
              If we later adjust your rate, the adjustment applies only to
              future sales — past commissions are not retroactively
              recalculated.
            </p>
            <p>
              <strong>Calculation basis.</strong> Commissions are calculated on
              the net sale amount — the amount actually paid by the customer,
              net of taxes, fees, refunds, and chargebacks.
            </p>
            <p>
              <strong>Refunds, chargebacks, and revocations.</strong> If a sale
              is refunded, charged back, or the associated license is revoked
              for any reason, the corresponding commission is forfeited. If
              commission on a refunded sale was already paid out, we reserve
              the right to deduct the amount from your next payout or, at our
              discretion, require repayment.
            </p>
          </section>

          <section>
            <h2>7. Payouts</h2>
            <p>
              Commissions are paid in U.S. dollars. <strong>We reserve the
              right to take up to 30 days</strong> to process and send payment
              after the close of a payout period or after you submit a payout
              request, whichever our current workflow requires. Payout cadence
              (for example, monthly, quarterly, or by request) will be
              communicated via your dashboard or by email.
            </p>
            <p>
              <strong>Minimum payout threshold.</strong> [OPTIONAL — e.g., "A
              minimum balance of $50 USD must accrue before a payout is issued;
              balances below the threshold roll over to the next period."]
            </p>
            <p>
              <strong>Payment method and details.</strong> You are responsible
              for providing accurate payment information (such as PayPal
              account, bank details, or other method we support). Payments are
              sent to the details on file at the time of payout. We are not
              liable for delays, losses, or failed transfers caused by
              incorrect, out-of-date, or incomplete information you provided.
            </p>
            <p>
              <strong>Taxes.</strong> You are solely responsible for reporting
              and paying any taxes owed on commissions. For U.S. residents,
              Fixed Seed may issue IRS Form 1099 where annual earnings meet or
              exceed reporting thresholds, and we may require a completed Form
              W-9 before issuing payment. Non-U.S. residents may be required to
              provide a Form W-8BEN or equivalent documentation. We may
              withhold payments until required tax documentation is on file.
            </p>
          </section>

          <section>
            <h2>8. Acceptable Use</h2>
            <p>You agree that you will not:</p>
            <ul>
              <li>
                Promote your referral link through spam, including unsolicited
                email, SMS, forum posts, comment spam, or any messaging channel
                where the recipient has not consented to receive marketing.
              </li>
              <li>
                Use your own referral link to purchase products for yourself,
                for your household members, or for anyone you coordinate with
                for the purpose of generating a commission.
              </li>
              <li>
                Bid on Fixed Seed trademarks (including "Fixed Seed" and
                product names such as "Echo") in paid search campaigns, or use
                them in domain names, social handles, or account names in a
                way that implies ownership, endorsement, or official
                affiliation.
              </li>
              <li>
                Make misleading, deceptive, or false claims about Fixed Seed,
                our products, pricing, features, or support.
              </li>
              <li>
                Cloak, mask, or obscure the destination of your referral link
                in a manner intended to deceive the visitor.
              </li>
              <li>
                Use cookie stuffing, malware, browser extensions, bots, or any
                automated or deceptive means of generating clicks or
                conversions.
              </li>
              <li>
                Violate any applicable law, including consumer protection law,
                advertising disclosure rules, anti-spam legislation (CAN-SPAM,
                CASL, GDPR, etc.), or export regulations.
              </li>
              <li>
                Disclose your specific commission rate, internal Program
                correspondence, or other non-public Program information to
                third parties, except as required by law or as necessary to
                your accountant, attorney, or similar advisor bound by
                confidentiality.
              </li>
            </ul>
            <p>
              <strong>Disclosure.</strong> Whenever you promote Fixed Seed, you
              must clearly disclose that you may earn a commission, in
              compliance with the FTC's Endorsement Guides (for U.S.-based
              promotion) and any equivalent rules in your jurisdiction. A
              statement such as "I earn a commission if you purchase through my
              link" is sufficient.
            </p>
          </section>

          <section>
            <h2>9. Intellectual Property</h2>
            <p>
              Fixed Seed grants you a limited, revocable, non-exclusive,
              non-transferable license to display the Fixed Seed name, logos,
              product images, and other promotional assets we provide, solely
              for the purpose of promoting the Program. You acquire no
              ownership of any Fixed Seed intellectual property. You must use
              our marks and assets as provided, without modification,
              recoloring, or derivative works, unless we grant written
              permission.
            </p>
            <p>
              You retain ownership of your own content (articles, videos,
              social posts, and so on). By participating, you grant Fixed Seed
              a non-exclusive, worldwide, royalty-free license to quote,
              screenshot, link to, or otherwise reference your public
              promotion of Fixed Seed in our own marketing materials.
            </p>
          </section>

          <section>
            <h2>10. Modifications to the Program and Terms</h2>
            <p>
              We reserve the right to modify these Terms, your commission rate,
              the structure of the Program, or to pause, restructure, or end
              the Program at any time.
            </p>
            <p>
              For changes that <strong>materially reduce</strong> your
              compensation or add material obligations on you, we will make
              reasonable efforts to notify you by email and/or through a
              dashboard notice at least <strong>30 days before</strong> the
              change takes effect. We reserve the right to take up to{" "}
              <strong>30 days</strong> to implement announced changes.
            </p>
            <p>
              For non-material changes (including clarifications, typo fixes,
              and changes to non-compensation operational details), we may
              update these Terms without prior notice, and the updated Terms
              become effective on posting. Your continued participation in the
              Program after an update constitutes your acceptance of the
              revised Terms. If you do not agree to an update, your remedy is
              to cease participation.
            </p>
          </section>

          <section>
            <h2>11. Suspension and Termination</h2>
            <p>
              Either party may end this Agreement at any time. You may end
              your participation by ceasing use of your referral link and
              notifying us at the contact email below; your account will be
              marked inactive.
            </p>
            <p>
              We may suspend or terminate your account at any time, with or
              without notice and with or without cause, for violation of this
              Agreement, suspected fraud or abuse, or any reason we in good
              faith believe is necessary to protect the Program, Fixed Seed,
              our customers, or our other affiliates.
            </p>
            <p>
              On ordinary termination without cause, unpaid commissions earned
              through legitimate activity before termination will be paid out
              at the next regular payout cycle, subject to the standard
              minimum-threshold and tax-documentation rules.
            </p>
            <p>
              On termination for cause (including for fraud, cookie stuffing,
              self-referral abuse, or material breach of this Agreement), we
              reserve the right to forfeit unpaid commissions associated with
              the violating activity and to reclaim amounts previously paid on
              such activity.
            </p>
            <p>
              Provisions that by their nature should survive termination
              (including payment obligations for earned legitimate commissions,
              confidentiality, intellectual property terms, indemnification,
              limitations of liability, and dispute resolution) survive
              termination of this Agreement.
            </p>
          </section>

          <section>
            <h2>12. Confidentiality</h2>
            <p>
              Non-public information about the Program — including your
              specific commission rate, dashboard content not meant for public
              sharing, and any private correspondence with Fixed Seed — is
              confidential. You agree not to disclose this information to
              third parties without our written consent, except as required by
              law or to professional advisors bound by duties of
              confidentiality.
            </p>
          </section>

          <section>
            <h2>13. No Warranties</h2>
            <p>
              The Program is provided "as is" and "as available." To the
              maximum extent permitted by law, Fixed Seed disclaims all
              warranties, express or implied, including implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement. We do not warrant that the tracking system
              will be uninterrupted, error-free, or free of data loss. In the
              event of a tracking failure or dispute, our sole obligation is
              to investigate in good faith and, where we can clearly
              substantiate a missed conversion, make a reasonable correction.
            </p>
            <p>
              We make no representation or guarantee about the amount of
              income or sales you will generate through the Program. Your
              results depend entirely on your own efforts, audience, and
              conversion quality.
            </p>
          </section>

          <section>
            <h2>14. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Fixed Seed's total
              cumulative liability to you arising out of or related to this
              Agreement or the Program — whether in contract, tort, or any
              other legal theory — is limited to the <strong>total
              commissions actually paid to you during the three (3) months
              immediately preceding the event giving rise to the claim</strong>
              , or one hundred U.S. dollars ($100), whichever is greater.
            </p>
            <p>
              Under no circumstances will Fixed Seed be liable for indirect,
              consequential, incidental, special, exemplary, or punitive
              damages, lost profits, lost goodwill, or lost data, even if
              advised of the possibility.
            </p>
          </section>

          <section>
            <h2>15. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Fixed Seed,
              its owners, officers, employees, contractors, and affiliates
              from and against any third-party claim, loss, liability, damage,
              or expense (including reasonable attorneys' fees) arising from
              or related to: (a) your participation in the Program, (b) your
              breach of this Agreement, (c) your violation of any law, or (d)
              your infringement of any third party's rights (including
              intellectual-property and publicity rights).
            </p>
          </section>

          <section>
            <h2>16. Governing Law and Disputes</h2>
            <p>
              This Agreement is governed by the laws of the State of [STATE],
              without regard to its conflict-of-laws rules. Any dispute
              arising out of or relating to this Agreement will be resolved
              exclusively in the state or federal courts located in [COUNTY,
              STATE], and you consent to personal jurisdiction and venue
              there. Both parties waive the right to a jury trial to the
              extent permitted by law.
            </p>
          </section>

          <section>
            <h2>17. Miscellaneous</h2>
            <ul>
              <li>
                <strong>Entire Agreement.</strong> This Agreement is the
                complete understanding between you and Fixed Seed regarding
                the Program and supersedes any prior agreements or
                communications on the same subject.
              </li>
              <li>
                <strong>Severability.</strong> If any provision of this
                Agreement is found to be unenforceable, the remaining
                provisions remain in full force and effect.
              </li>
              <li>
                <strong>No Waiver.</strong> Our failure to enforce any
                provision is not a waiver of our right to enforce it in the
                future.
              </li>
              <li>
                <strong>Assignment.</strong> You may not assign this Agreement
                without our prior written consent. We may assign this
                Agreement in connection with a merger, acquisition, or sale
                of assets.
              </li>
              <li>
                <strong>Notices.</strong> We will send notices to the email
                address on your affiliate account; please keep it current.
                Notices to us should be sent to the contact email below.
              </li>
            </ul>
          </section>

          <section>
            <h2>18. Contact</h2>
            <p>
              Questions about this Agreement or the Program can be sent to{" "}
              <a href="mailto:machinedelusions@gmail.com">
                machinedelusions@gmail.com
              </a>
              .
            </p>
          </section>

          <p className="terms-sig">[COMPANY LEGAL NAME]</p>
        </div>
      </main>

      <PortalFooter />

      <style>{`
        .terms-card h1 {
          font-family: var(--font-headline);
          font-size: 24px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .terms-meta {
          font-family: var(--font-headline);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 32px;
        }
        .terms section { margin-bottom: 24px; }
        .terms section:last-of-type { margin-bottom: 0; }
        .terms h2 {
          font-family: var(--font-headline);
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-primary);
          margin: 24px 0 12px;
        }
        .terms p {
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 12px;
          font-size: 14px;
        }
        .terms ul {
          color: var(--text-secondary);
          padding-left: 20px;
          margin-bottom: 12px;
        }
        .terms li {
          line-height: 1.7;
          margin-bottom: 6px;
          font-size: 14px;
        }
        .terms code {
          font-family: "SF Mono", Menlo, monospace;
          font-size: 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          padding: 2px 6px;
          color: var(--text-primary);
        }
        .terms a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .terms a:hover {
          color: var(--complement);
        }
        .terms-sig {
          font-family: var(--font-headline);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-primary);
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
