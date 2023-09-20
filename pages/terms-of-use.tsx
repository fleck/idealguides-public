import { Heading } from "app/core/components/Heading"
import Layout from "app/core/layouts/Layout"
import ct from "class-types.macro"

const headingClass = ct("mt-3")

export default function TermsOfUse() {
  return (
    <Layout>
      <Heading className={ct("mb-4", "mt-3")}>Website Terms of Use</Heading>
      <p>
        These terms of use govern your access to and use of our website{" "}
        <a href="https://idealguides.com">idealguides.com</a> and any services,
        features, content, or applications offered by us through the Website .
        Please read these Terms carefully before using our Website or Services.
        By using our Website or Services, you agree to be bound by these Terms.
        If you do not agree to these Terms, you must not use our Website or
        Services.
      </p>
      <Heading className={headingClass} size="xl">
        Who we are
      </Heading>
      <p>
        We are idealguides.com, a website registered in The United States. You
        can contact us by email at jonathan@idealguides.com.
      </p>
      <Heading className={headingClass} size="xl">
        What we do
      </Heading>
      <p>We provide how tos and comparisons content.</p>
      <Heading className={headingClass} size="xl">
        Who you are
      </Heading>
      <p>
        You are a user of our Website or Services. You may be a visitor who
        browses our Website without creating an account, or a member who
        registers an account with us and accesses our Services.
      </p>
      <Heading className={headingClass} size="xl">
        Your responsibilities
      </Heading>
      <p>You are responsible for:</p>
      <ul className={ct("ml-4", "list-disc")}>
        <li>
          Using our Website and Services in accordance with these Terms and
          applicable laws and regulations
        </li>
        <li>
          Providing accurate and complete information when creating an account,
          making a purchase, or contacting us
        </li>
        <li>Keeping your account information secure and confidential</li>
        <li>
          Notifying us immediately if you suspect any unauthorized use of your
          account or any breach of security
        </li>
        <li>
          Respecting the rights and privacy of other users and third parties
        </li>
        <li>
          Not using our Website or Services for any illegal, fraudulent,
          harmful, or abusive purposes
        </li>
        <li>
          Not interfering with the proper functioning of our Website or Services
          or the security or integrity of our systems or networks
        </li>
        <li>
          Not violating our intellectual property rights or those of others
        </li>
        <li>
          Not posting, transmitting, or distributing any content that is
          unlawful, defamatory, obscene, harassing, threatening, invasive of
          privacy, hateful, or otherwise objectionable
        </li>
        <li>
          Not sending any unsolicited or unauthorized advertising, promotional
          materials, spam, or other forms of solicitation
        </li>
        <li>
          Not introducing any viruses, malware, or other harmful code or
          material to our Website or Services
        </li>
      </ul>
      <Heading className={headingClass} size="xl">
        Our rights
      </Heading>
      <p>We reserve the right to:</p>
      <ul className={ct("ml-4", "list-disc")}>
        <li>
          Modify, suspend, or terminate our Website or Services or any part
          thereof at any time without notice or liability to you
        </li>
        <li>
          Monitor and review your use of our Website and Services and any
          content you post, transmit, or distribute through our Website or
          Services
        </li>
        <li>
          Remove or edit any content that we deem inappropriate, offensive,
          illegal, or in violation of these Terms
        </li>
        <li>
          Disclose your identity and information to law enforcement authorities
          or other parties if required by law or to protect our rights and
          interests
        </li>
        <li>Charge fees for certain features or services on our Website</li>
        <li>
          Change these Terms at any time by posting the updated version on our
          Website and notifying you by email
        </li>
        <li>
          Enforce these Terms and take any legal action against you if you
          breach these Terms
        </li>
      </ul>
      <Heading className={headingClass} size="xl">
        Intellectual property rights
      </Heading>
      <p>
        We own all intellectual property rights in our Website and Services and
        the content we provide through them. This includes but is not limited to
        trademarks, logos, designs, graphics, text, images, videos, audio,
        software, code, data, and other materials. Nothing in these Terms grants
        you any right to use our intellectual property rights without our prior
        written consent.
      </p>
      <p>
        You retain all intellectual property rights in the content you post,
        transmit, or distribute through our Website or Services. However, by
        doing so, you grant us a non-exclusive, royalty-free, worldwide,
        perpetual, irrevocable, and sublicensable license to use, copy, modify,
        distribute, transmit, display, perform, publish, license, create
        derivative works from, transfer, or sell such content for any purpose.
        You also waive any moral rights you may have in such content.
      </p>
      <p>
        You represent and warrant that you have the right to post, transmit, or
        distribute such content and that such content does not infringe any
        intellectual property rights or other rights of others.
      </p>
      <Heading className={headingClass} size="xl">
        Third-party links and content
      </Heading>
      <p>
        Our Website and Services may contain links to third-party websites,
        services, or resources that are not owned or controlled by us. These
        links are provided for your convenience and information only. We do not
        endorse, sponsor, or assume any responsibility for such third-party
        websites, services, or resources. Your access to and use of such
        third-party websites, services, or resources is at your own risk and
        subject to their own terms and policies.
      </p>
      <p>
        Our Website and Services may also display or allow you to access content
        from third-party sources, such as advertisers, affiliates, partners, or
        users. We do not control, verify, or endorse such content and we are not
        liable for any loss or damage arising from your reliance on such
        content.
      </p>
      <Heading className={headingClass} size="xl">
        Disclaimer of warranties
      </Heading>
      <p>
        Our Website and Services are provided “as is” and “as available” without
        any warranties of any kind, either express or implied. To the fullest
        extent permitted by law, we disclaim all warranties, including but not
        limited to warranties of merchantability, fitness for a particular
        purpose, non-infringement, accuracy, completeness, reliability,
        security, availability, or compatibility.
      </p>
      <p>
        We do not warrant that our Website or Services will meet your
        requirements or expectations, that they will be uninterrupted,
        error-free, or free of viruses or other harmful components, or that any
        defects will be corrected. We do not warrant that the content we provide
        through our Website or Services is accurate, complete, reliable,
        current, or error-free. We do not warrant that the products or services
        we offer through our Website or Services are of satisfactory quality or
        fit for any purpose.
      </p>
      <p>
        You acknowledge and agree that your use of our Website and Services is
        at your own risk and discretion and that you are solely responsible for
        any loss or damage resulting from such use.
      </p>
      <Heading className={headingClass} size="xl">
        Limitation of liability
      </Heading>
      <p>
        To the fullest extent permitted by law, we and our affiliates,
        directors, officers, employees, agents, contractors, licensors,
        suppliers, partners, and representatives shall not be liable for any
        direct, indirect, incidental, consequential, special, exemplary,
        punitive, or other damages of any kind arising out of or in connection
        with your access to or use of our Website or Services or your inability
        to access or use them, even if we have been advised of the possibility
        of such damages. This includes but is not limited to damages for loss of
        profits, goodwill, data, reputation, or other intangible losses.
      </p>
      <p>
        In no event shall our total liability to you for all claims arising out
        of or in connection with your access to or use of our Website or
        Services exceed the amount paid by you to us for accessing or using our
        Website or Services in the 12 months preceding the event giving rise to
        the claim.
      </p>
      <p>
        Some jurisdictions do not allow the exclusion or limitation of certain
        warranties or liabilities. Accordingly, some of the above disclaimers
        and limitations may not apply to you. In such cases, our liability will
        be limited to the maximum extent permitted by law.
      </p>
      <Heading className={headingClass} size="xl">
        Indemnification
      </Heading>
      <p>
        You agree to indemnify, defend, and hold harmless us and our affiliates,
        directors, officers, employees, agents, contractors, licensors,
        suppliers, partners, and representatives from and against any and all
        claims, demands, actions, suits, proceedings, liabilities, damages,
        losses, costs, and expenses (including reasonable attorneys’ fees)
        arising out of or in connection with:
      </p>
      <ul className={ct("ml-4", "list-disc")}>
        <li>Your access to or use of our Website or Services</li>
        <li>Your breach of these Terms</li>
        <li>Your violation of any law or regulation or the rights of others</li>
        <li>
          Any content you post, transmit, or distribute through our Website or
          Services
        </li>
        <li>Any dispute between you and another user or third party</li>
      </ul>
      <p>
        We reserve the right to assume the exclusive defense and control of any
        matter subject to indemnification by you. You agree to cooperate with us
        in such defense and not to settle any claim without our prior written
        consent.
      </p>
      <Heading className={headingClass} size="xl">
        Governing law and jurisdiction
      </Heading>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of The United States without regard to its conflict of laws
        principles. You agree to submit to the exclusive jurisdiction of the
        courts located in The United States for any dispute arising out of or in
        connection with these Terms. You waive any objection to the venue or
        jurisdiction of such courts.
      </p>
      <Heading className={headingClass} size="xl">
        Changes to these Terms
      </Heading>
      <p>
        We may change these Terms at any time by posting the updated version on
        our Website and notifying you by email. The updated Terms will take
        effect immediately upon posting. Your continued use of our Website or
        Services after the effective date of the updated Terms will constitute
        your acceptance of the updated Terms. If you do not agree to the updated
        Terms, you must stop using our Website or Services.
      </p>
      <Heading className={headingClass} size="xl">
        Contact us
      </Heading>
      <p>
        If you have any questions or feedback about these Terms or our Website
        or Services, please contact us at jonathan@idealguides.com.
      </p>
    </Layout>
  )
}
