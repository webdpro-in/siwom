import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Draft privacy policy for the SIWOM website: what we collect through the contact form, why, and your choices.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="18 Oct 2026"
      intro={<p>This policy explains what information the SIWOM website collects, why, and what you can do about it.</p>}
      sections={[
        {
          id: "who",
          title: "Who we are",
          body: (
            <p>
              SIWOM is a software company based in India. [Legal entity name, registered address and
              contact details to be added before publication.] You can reach us through the{" "}
              <a href="/contact">contact form</a>.
            </p>
          ),
        },
        {
          id: "collect",
          title: "What we collect",
          body: (
            <>
              <p>When you use the contact form, we collect the details you enter:</p>
              <ul>
                <li>Full name, company and work email</li>
                <li>Industry, area of interest and whether you are interested in a pilot</li>
                <li>Your message</li>
              </ul>
              <p>
                Our servers also process technical data needed to deliver the site and protect the form from abuse, such
                as your IP address, which is used for rate limiting and not stored with your message.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: <p>Contact submissions are processed through Web3Forms for delivery to the inbox configured by SIWOM. We use contact form details only to reply to you and to discuss the topic you raised. We do not sell your information or use it for unrelated marketing.</p>,
        },
        {
          id: "analytics",
          title: "Analytics and cookies",
          body: (
            <p>
              The site does not set tracking cookies. Your light or dark theme preference is stored locally in your browser. If privacy-friendly, cookieless analytics are enabled, they record
              aggregate page views and interactions such as button clicks, without identifying you. [Confirm the
              analytics provider before publication.]
            </p>
          ),
        },
        {
          id: "sharing",
          title: "Who we share it with",
          body: (
            <p>
              Messages are delivered through an email delivery provider acting on our behalf. [List processors, such as
              the hosting and email providers, and where data is processed, before publication.]
            </p>
          ),
        },
        {
          id: "retention",
          title: "How long we keep it",
          body: <p>We keep enquiries for as long as needed to respond and follow up, and then delete them. [Set a specific retention period before publication.]</p>,
        },
        {
          id: "rights",
          title: "Your choices and rights",
          body: (
            <p>
              You can ask us to access, correct or delete the information you sent us through the{" "}
              <a href="/contact">contact form</a>. [Align this section with India&apos;s Digital Personal
              Data Protection Act, 2023 and any other applicable law before publication.]
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes to this policy",
          body: <p>We will update this page if our practices change and show the date of the latest version at the top.</p>,
        },
      ]}
    />
  );
}
