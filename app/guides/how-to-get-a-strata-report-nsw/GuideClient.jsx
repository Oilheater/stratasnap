"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, Search, Download, Building2 } from "lucide-react";

export default function GuideClient() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* NAV */}
      <nav className="border-b border-ink/15 bg-cream sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="serif text-2xl font-bold tracking-tight">
            StrataSnap
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="underline-grow">Home</Link>
            <Link
              href="/#tool"
              className="bg-ink text-cream px-4 py-2 hover:bg-red transition-colors"
            >
              Upload a report →
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-4">
          Guide · For NSW apartment buyers
        </div>
        <h1 className="serif text-4xl md:text-5xl font-bold leading-tight mb-6">
          How to get a strata report in NSW.
        </h1>
        <p className="text-lg text-ink/75 leading-relaxed mb-12">
          If you're buying an apartment, townhouse, or unit in NSW, the strata
          records tell you the financial health of the building, what the by-laws
          say, whether there are outstanding defects or levies, and what insurance
          is in place. This guide explains what documents exist, how to get them,
          and what they cost.
        </p>

        {/* Disclaimer */}
        <div className="border border-ink/20 bg-ink/[0.03] p-4 mb-12">
          <div className="text-xs text-ink/75 leading-relaxed">
            <span className="font-bold">Note. </span>
            This guide is general information about NSW strata records for
            prospective buyers. It is not legal advice. Fees and processes may
            change — verify current figures with the relevant body before relying
            on them. Always consult a qualified conveyancer or solicitor before
            making a property purchase decision.
          </div>
        </div>

        {/* Section: Two different things */}
        <Section n="01" title="First — two different things people call a 'strata report'">
          <p>
            There are two separate documents, and most guides (and most buyers)
            blur the distinction. Getting this right matters because they cost
            different amounts, contain different information, and come from
            different places.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="border border-ink/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText size={20} className="text-red shrink-0" />
                <div className="serif text-lg font-bold">
                  Section 182 — Records inspection
                </div>
              </div>
              <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-3">
                "The strata search"
              </div>
              <p className="text-sm text-ink/75 leading-relaxed mb-3">
                A deep inspection of the owners corporation's actual records —
                financial statements, minutes, correspondence, maintenance
                history, insurance certificates, by-laws, and more. This is
                what a professional strata searcher does when you hire them for
                $250–450.
              </p>
              <p className="text-sm text-ink/75 leading-relaxed">
                <span className="font-medium">Who provides it:</span> the
                strata managing agent makes the records available for
                inspection.
              </p>
              <p className="text-sm text-ink/75 leading-relaxed">
                <span className="font-medium">Cost:</span> approximately $60
                per hour for non-owners (verify with the managing agent).
              </p>
              <p className="text-sm text-ink/75 leading-relaxed">
                <span className="font-medium">Legal basis:</span> Strata
                Schemes Management Act 2015 (NSW), section 182.
              </p>
            </div>

            <div className="border-2 border-red p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText size={20} className="text-red shrink-0" />
                <div className="serif text-lg font-bold">
                  Section 184 — Information certificate
                </div>
              </div>
              <div className="mono text-[10px] uppercase tracking-widest text-red mb-3">
                "The s.184 certificate"
              </div>
              <p className="text-sm text-ink/75 leading-relaxed mb-3">
                A standardised form published by NSW Fair Trading that the
                owners corporation must provide on request. It contains a
                defined set of information: strata committee members, managing
                agent, levy amounts, outstanding levies on the specific lot,
                10-year capital works fund proposals, recent by-laws, embedded
                network status, and — critically — any outstanding orders
                (item 12A), including cladding rectification orders, Residential
                Apartment Buildings Act orders, and EP&A development control
                orders.
              </p>
              <p className="text-sm text-ink/75 leading-relaxed mb-3">
                Under section 185 of the SSM Act, a s.184 certificate is
                <span className="font-medium"> conclusive evidence</span> of
                the matters stated in it. This means the information carries
                legal weight — if a levy isn't shown on the certificate, the
                purchaser is not liable for it.
              </p>
              <p className="text-sm text-ink/75 leading-relaxed">
                <span className="font-medium">Cost:</span> approximately $109
                (verify with the managing agent — the fee is set under
                Schedule 4 of the SSM Regulation 2016).
              </p>
              <p className="text-sm text-ink/75 leading-relaxed">
                <span className="font-medium">Legal basis:</span> SSM Act
                2015, sections 184–185.
              </p>
            </div>
          </div>

          <p>
            Most buyers need one or both. The s.184 certificate gives you the
            key financial and compliance facts in a predictable format. The
            s.182 records inspection gives you the full picture — minutes,
            correspondence, maintenance history — but takes more time and costs
            more.
          </p>
        </Section>

        {/* Section: Three ways */}
        <Section n="02" title="Three ways to get strata records as a buyer">
          <p className="mb-8">
            You don't have to hire a $300 professional strata searcher. There
            are three paths, and most buyers don't know about all of them.
          </p>

          {/* Path 1 */}
          <Path
            n="1"
            icon={Download}
            title="Get the vendor's report (free)"
            body={
              <>
                <p>
                  Many vendors provide a strata report to prospective buyers as
                  part of the marketing package. Ask the selling agent: "Do you
                  have a strata report or strata records available for this
                  property?" In many cases, the vendor has already commissioned
                  one, or has one from a previous inspection.
                </p>
                <p className="mt-3">
                  This is the fastest path. It's also the one where you have the
                  least control over what's included and how current it is. Check
                  the date of the report — strata records change, and a report
                  from 18 months ago may not reflect a recent special levy or
                  defect claim.
                </p>
              </>
            }
          />

          {/* Path 2 */}
          <Path
            n="2"
            icon={Search}
            title="Download a pre-existing report ($29–70)"
            body={
              <>
                <p>
                  When a professional strata searcher prepares a report for one
                  buyer, it often becomes available for other buyers to download
                  at a reduced price — typically $29–70 — through databases like
                  BeforeYouBuy. Ask the selling agent whether a pre-existing
                  report is available for the property.
                </p>
                <p className="mt-3">
                  NSW Fair Trading explicitly suggests this path:{" "}
                  <em>
                    "You can find out if any existing pre-purchase inspection
                    reports have been completed for somebody else. Ask the real
                    estate agent about this. This can save you money."
                  </em>
                </p>
                <p className="mt-3">
                  A pre-existing report is independent (it was prepared for a
                  different buyer, not the vendor), and it's substantially
                  cheaper than commissioning your own. The trade-off is that it
                  may be weeks or months old.
                </p>
              </>
            }
          />

          {/* Path 3 */}
          <Path
            n="3"
            icon={Building2}
            title="Request the records directly from the strata manager (~$109 for s.184)"
            body={
              <>
                <p>
                  You can request a Section 184 certificate (or arrange a
                  Section 182 records inspection) directly from the strata
                  managing agent. Here's the process:
                </p>

                <ol className="list-decimal pl-6 mt-4 space-y-4 text-sm text-ink/80 leading-relaxed">
                  <li>
                    <span className="font-medium">
                      Find the strata managing agent.
                    </span>{" "}
                    Use the free{" "}
                    <ExtLink href="https://www.service.nsw.gov.au/referral/search-for-a-strata-scheme">
                      NSW Strata Search
                    </ExtLink>{" "}
                    — enter the property address or strata plan number and it
                    returns the managing agent's name, licence number, strata
                    plan number, and last AGM date. You can also use the{" "}
                    <ExtLink href="https://portal.spatial.nsw.gov.au/portal/apps/webappviewer/index.html?id=cb153150a28c4f40b66b682e7dc3ff86&query=StrataHub">
                      NSW Strata Hub map
                    </ExtLink>{" "}
                    to find the strata plan number from an address visually.
                  </li>
                  <li>
                    <span className="font-medium">
                      Contact the managing agent.
                    </span>{" "}
                    The search above returns the agent's name and licence
                    number. Visit the agent's website for their records-request
                    process — many strata managers offer an online request form.
                  </li>
                  <li>
                    <span className="font-medium">
                      Provide evidence of your interest.
                    </span>{" "}
                    You'll need the vendor's written authority (which the
                    selling agent provides) or evidence you're a genuine
                    prospective purchaser (such as a copy of the contract of
                    sale). A genuine purchaser's request cannot reasonably be
                    withheld.
                  </li>
                  <li>
                    <span className="font-medium">
                      Pay the fee and receive the certificate.
                    </span>{" "}
                    The s.184 certificate fee is approximately $109 (set under
                    Schedule 4 of the SSM Regulation 2016 — verify the current
                    amount with the managing agent). The certificate is issued
                    as a PDF, typically within 14 days.
                  </li>
                </ol>

                <div className="border-l-2 border-gold bg-gold/5 pl-5 py-3 mt-6">
                  <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">
                    Important — standing requirement
                  </div>
                  <p className="text-sm text-ink/75 leading-relaxed">
                    To request a s.184 certificate, you need to be (or be
                    authorised by) a lot owner. As a prospective buyer, you
                    apply as an authorised person — the selling agent
                    facilitates this. In practice, this is a formality for
                    genuine purchasers. However, you typically can't pull a
                    s.184 cold at the casual-browsing stage without any
                    relationship to the vendor. That's why paths 1 and 2
                    (vendor-supplied reports and pre-existing downloads) are
                    often faster for early shortlisting.
                  </p>
                </div>
              </>
            }
          />
        </Section>

        {/* Section: Free tools */}
        <Section n="03" title="Free NSW government tools for strata buyers">
          <p className="mb-8">
            Before you spend anything, these free tools give you basic
            information about any strata scheme in NSW.
          </p>

          <div className="space-y-4">
            <ToolLink
              title="NSW Strata Search"
              url="https://www.service.nsw.gov.au/referral/search-for-a-strata-scheme"
              body="Enter an address or strata plan number. Returns the managing agent's name and licence, SP number, registration date, lot count, and last AGM date. Free, no login."
            />
            <ToolLink
              title="NSW Strata Hub (map)"
              url="https://portal.spatial.nsw.gov.au/portal/apps/webappviewer/index.html?id=cb153150a28c4f40b66b682e7dc3ff86&query=StrataHub"
              body="Interactive map of all 85,000+ strata schemes in NSW. Click any building to see its details. Useful when you know the building but not the strata plan number."
            />
            <ToolLink
              title="NSW Land Registry Services (free searches)"
              url="https://online.nswlrs.com.au/"
              body="Free street-address-to-title lookup, plan inquiry (lot numbers, registration date), and cadastral records. More comprehensive searches available via approved information brokers."
            />
          </div>
        </Section>

        {/* Section: What the s.184 contains */}
        <Section n="04" title="What's in a Section 184 certificate">
          <p className="mb-6">
            The s.184 certificate is a standardised form published by NSW Fair
            Trading. Every certificate follows the same structure, which means
            the contents are predictable. Here's what it covers:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              "Strata committee members and managing agent",
              "Levy amounts (administrative + capital works fund)",
              "Outstanding levies on the specific lot you're buying",
              "10-year capital works fund plan proposals",
              "Recently registered by-laws",
              "Embedded network / exclusive supply arrangements",
              "Item 12A — outstanding orders (cladding, RAB Act, EP&A)",
              "Strata renewal committee status",
            ].map((item) => (
              <div
                key={item}
                className="border border-ink/15 p-4 text-sm text-ink/80 leading-relaxed flex gap-3"
              >
                <span className="text-red font-bold shrink-0">·</span>
                {item}
              </div>
            ))}
          </div>

          <div className="border-l-2 border-red bg-red/5 pl-5 py-3 mb-6">
            <div className="mono text-[10px] uppercase tracking-widest text-red mb-2">
              Why item 12A matters
            </div>
            <p className="text-sm text-ink/75 leading-relaxed">
              Item 12A is the highest-value red-flag field on any s.184
              certificate. It discloses outstanding rectification orders,
              including combustible cladding orders (post-Lacrosse/Grenfell),
              Residential Apartment Buildings Act building work rectification
              orders, and EP&A Act development control orders. If this field
              shows any outstanding orders, that's a finding you need to discuss
              with your conveyancer immediately.
            </p>
          </div>

          <div className="border-l-2 border-ink/40 pl-5 py-3">
            <div className="mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">
              Conclusive evidence (s.185)
            </div>
            <p className="text-sm text-ink/75 leading-relaxed">
              Under section 185 of the SSM Act, a s.184 certificate is
              conclusive evidence of the matters stated in it. If a levy is
              outstanding before the certificate is issued but isn't shown on the
              certificate, the purchaser is not liable for it. This makes the
              s.184 one of the most legally significant documents in any
              apartment purchase.
            </p>
          </div>
        </Section>

        {/* Section: Then what */}
        <Section n="05" title="Once you have the documents">
          <p className="mb-6">
            Whether you got the vendor's report, downloaded a pre-existing one
            for $29, or requested a s.184 certificate directly — you now have a
            PDF full of strata records.
          </p>
          <p className="mb-8">
            The problem is reading it. A typical strata report runs 100–200+
            pages of financial statements, committee minutes, by-laws, and
            insurance certificates. The s.184 certificate is shorter but dense
            with legal and financial detail.
          </p>
          <p className="mb-8">
            StrataSnap reads any NSW strata document and gives you a
            plain-English summary in about three minutes — with page citations
            and references to the relevant sections of the Strata Schemes
            Management Act 2015. It surfaces the things that matter: fund
            balances, special levies, by-law restrictions on pets and Airbnb,
            building defect claims, insurance status, compliance issues, and
            outstanding orders.
          </p>

          <div className="bg-ink text-cream p-8 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-gold mb-2">
                Ready to upload?
              </div>
              <div className="serif text-2xl font-bold">
                Upload your strata document for a plain-English summary.
              </div>
              <div className="text-sm text-cream/60 mt-2">
                $14.99 single report · $74.99 for 10-pack
              </div>
            </div>
            <Link
              href="/#tool"
              className="bg-gold text-ink px-8 py-4 font-medium hover:bg-cream transition-colors flex items-center gap-2 shrink-0"
            >
              Upload now <ArrowRight size={18} />
            </Link>
          </div>
        </Section>

        {/* Section: What StrataSnap is not */}
        <Section n="06" title="What StrataSnap is — and isn't">
          <p>
            StrataSnap is an information tool. It reads strata documents and
            explains them in plain English. It is not legal advice, financial
            advice, or a formal strata inspection report. It does not tell you
            whether to buy a property. It does not replace a qualified
            conveyancer or solicitor.
          </p>
          <p className="mt-4">
            Take the summary to your conveyancer. Use it as a starting point for
            a better conversation — not as a substitute for professional advice.
          </p>
        </Section>
      </article>

      {/* Footer */}
      <footer className="bg-ink text-cream py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <Link href="/" className="serif text-2xl font-bold">
                StrataSnap
              </Link>
              <p className="text-sm text-cream/60 mt-2 mono">
                / Strata reports, in plain English.
              </p>
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-cream/40 mb-3">
                Explore
              </div>
              <div className="flex flex-col gap-2 text-sm text-cream/80">
                <Link href="/" className="hover:text-gold">For buyers</Link>
                <Link href="/conveyancers" className="hover:text-gold">For conveyancers</Link>
                <Link href="/buyers-agents" className="hover:text-gold">For buyers' agents</Link>
                <Link href="/privacy" className="hover:text-gold">Privacy</Link>
                <Link href="/terms" className="hover:text-gold">Terms</Link>
              </div>
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-cream/40 mb-3">
                Contact
              </div>
              <p className="text-sm text-cream/80">
                hello@stratasnap.com.au
                <br />
                Sydney, NSW
              </p>
            </div>
          </div>
          <div className="border-t border-cream/15 pt-6 mono text-[10px] uppercase tracking-widest text-cream/40">
            © 2026 Vapour Film Lighting Pty Ltd · trading as StrataSnap
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ n, title, children }) {
  return (
    <div className="mb-16">
      <div className="mono text-xs uppercase tracking-[0.2em] text-red mb-3">
        § {n}
      </div>
      <h2 className="serif text-3xl font-bold leading-tight mb-6">{title}</h2>
      <div className="text-ink/80 leading-relaxed space-y-4">{children}</div>
    </div>
  );
}

function Path({ n, icon: Icon, title, body }) {
  return (
    <div className="border-l-2 border-ink/40 pl-6 mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="mono text-xs text-red font-bold">Path {n}</div>
        <Icon size={18} className="text-ink/40" />
      </div>
      <div className="serif text-xl font-bold mb-3">{title}</div>
      <div className="text-sm text-ink/75 leading-relaxed">{body}</div>
    </div>
  );
}

function ToolLink({ title, url, body }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-ink/20 p-6 hover:border-ink transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="serif text-lg font-bold group-hover:text-red transition-colors">
          {title}
        </div>
        <ExternalLink size={16} className="text-ink/40 group-hover:text-red transition-colors shrink-0" />
      </div>
      <p className="text-sm text-ink/70 leading-relaxed">{body}</p>
    </a>
  );
}

function ExtLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:text-red"
    >
      {children}
    </a>
  );
}
