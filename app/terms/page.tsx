import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "Draft terms of use for the SIWOM website, including how to read our demos, status labels and representative photography.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="18 Oct 2026"
      intro={<p>These terms apply to your use of the SIWOM website. By using the site, you agree to them.</p>}
      sections={[
        {
          id: "site",
          title: "About this website",
          body: (
            <p>
              This website describes SIWOM&apos;s work and intended direction. [Legal entity name and registered address
              to be added before publication.]
            </p>
          ),
        },
        {
          id: "status",
          title: "Status labels, demos and photography",
          body: (
            <>
              <p>Products and roadmap items are labelled In development, Research or Long-term vision. These labels describe intent, not availability.</p>
              <ul>
                <li>Demos use illustrative data and are not connected to live operations.</li>
                <li>Detections shown in the Safety AI demo are samples, not measured performance.</li>
                <li>Industry photographs are representative. They do not establish SIWOM ownership, partnerships, deployments or endorsements.</li>
              </ul>
              <p>Nothing on this site is an offer, a commitment to deliver a product, or a promise of launch dates.</p>
            </>
          ),
        },
        {
          id: "safety",
          title: "No safety advice",
          body: (
            <p>
              Content about safety is general information. It is not safety, engineering or legal advice. Follow your
              site&apos;s procedures and consult qualified professionals for safety decisions.
            </p>
          ),
        },
        {
          id: "ip",
          title: "Intellectual property",
          body: <p>The SIWOM name, logo, text, illustrations and code on this site belong to SIWOM unless stated otherwise. Third-party photography remains the property of its respective creators and is used under the licences documented in CREDITS.md. Fonts are used under the SIL Open Font License.</p>,
        },
        {
          id: "use",
          title: "Acceptable use",
          body: <p>Do not misuse the site, including by attempting to disrupt it, bypass its security or send automated messages through the contact form.</p>,
        },
        {
          id: "liability",
          title: "Liability",
          body: <p>[Limitation of liability and warranty wording to be drafted by qualified legal counsel.]</p>,
        },
        {
          id: "law",
          title: "Governing law",
          body: <p>[Governing law and jurisdiction, expected to be India, to be confirmed by legal counsel.]</p>,
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about these terms: <a href="/contact">contact form</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
