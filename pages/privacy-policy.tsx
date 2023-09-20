import { Heading } from "app/core/components/Heading"
import Layout from "app/core/layouts/Layout"
import { linkStyles } from "app/items/components/linkStyles"
import ct from "class-types.macro"

const headingClass = ct("mt-3")

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Heading className={ct("mb-4", "mt-3")}>Privacy Policy</Heading>
      <p>
        This privacy policy explains how we collect, use, and share your
        personal information when you visit our website or click on our
        affiliate links. Please read this policy carefully before using our
        website or services.
      </p>
      <Heading className={headingClass} size="xl">
        What information do we collect?
      </Heading>
      <p>
        {" "}
        When you visit our website, we may collect some information
        automatically from your device, such as your IP address, device type,
        browser type, operating system, and other technical information. We may
        also collect information about your online activity, such as the pages
        you visit, the links you click, the time and duration of your visit, and
        other information about your interaction with our website or our
        affiliate partners.
      </p>
      <p>
        We may also collect some information directly from you when you contact
        us, or sign up for an account. This may include your name, email
        address, and any other information you choose to provide.
      </p>
      <p>
        We may use cookies and other tracking technologies to collect some of
        the information described above. Cookies are small files that are stored
        on your device when you visit a website. They help us to remember your
        preferences, improve your user experience, and deliver relevant ads or
        offers. You can manage your cookie settings in your browser or device
        settings.
      </p>
      <Heading className={headingClass} size="xl">
        How do we use your information?
      </Heading>
      <p>We may use your information for various purposes, such as:</p>
      <ul className={ct("ml-4", "list-disc")}>
        <li>To provide and maintain our website and services</li>
        <li>To communicate with you and respond to your inquiries</li>
        <li>
          To measure and analyze the performance and effectiveness of our
          website and services
        </li>
        <li>
          To comply with legal obligations and protect our rights and interests
        </li>
      </ul>{" "}
      <Heading className={headingClass} size="xl">
        How do we share your information?
      </Heading>
      <p>
        We may share your information with third parties in certain
        circumstances, such as:
      </p>
      <ul className={ct("ml-4", "list-disc")}>
        <li>
          With our affiliate partners, such as Sovrn and Amazon Associates
          Program, when you click on their links on our website. These partners
          may use your information to track and process your purchases, pay us
          commissions, and deliver relevant ads or offers to you. You can learn
          more about their privacy practices by visiting their websites:{" "}
          <a
            className={ct(linkStyles)}
            href="https://www.sovrn.com/privacy-policy/privacy-policy/"
          >
            Sovrn
          </a>
          ,{" "}
          <a
            className={ct(linkStyles)}
            href="https://affiliate-program.amazon.com/help/operating/policies"
          >
            Amazon Associates Program
          </a>
          .
        </li>
        <li>
          With service providers who help us with various functions, such as
          hosting, analytics etc. These providers only access your information
          to perform their services for us and are bound by contractual
          obligations to protect your information.
        </li>
        <li>
          With law enforcement or other authorities if required by law or to
          protect our rights and interests.
        </li>
      </ul>
      <Heading className={headingClass} size="xl">
        What are your choices and rights?
      </Heading>
      <p>
        You have certain choices and rights regarding your information, such as:
      </p>{" "}
      <ul className={ct("ml-4", "list-disc")}>
        <li>
          You can request to access, correct, delete, or obtain a copy of your
          personal information by contacting us at{" "}
          <a href="mailto:jonathan@idealguides.com">jonathan@idealguides.com</a>
          .
        </li>
        <li>
          You can lodge a complaint with a supervisory authority if you are not
          satisfied with how we handle your personal information.
        </li>
      </ul>
      <Heading className={headingClass} size="xl">
        How do we protect your information?
      </Heading>
      <p>
        We take reasonable measures to protect your information from
        unauthorized access, use, disclosure, alteration, or destruction.
        However, no method of transmission or storage is completely secure, and
        we cannot guarantee the absolute security of your information. We
        encourage you to use caution when using the internet and avoid providing
        sensitive information through unsecured channels.
      </p>
      <Heading className={headingClass} size="xl">
        How do we update this policy?
      </Heading>
      <p>
        We may update this policy from time to time to reflect changes in our
        practices or applicable laws. We will notify you of any material changes
        by posting the updated policy on our website or sending you an email.
        Your continued use of our website or services after the update
        constitutes your acceptance of the updated policy.
      </p>
      <Heading className={headingClass} size="xl">
        How can you contact us?
      </Heading>
      <p>
        If you have any questions or concerns about this policy or our privacy
        practices, please contact us at{" "}
        <a href="mailto:jonathan@idealguides.com">jonathan@idealguides.com</a>.
      </p>
    </Layout>
  )
}
