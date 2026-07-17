import { useSeo } from '../hooks/useSeo';

export default function PrivacyPolicyScreen() {
  useSeo({
    title: 'Privacy Policy | Viora Media',
    description: 'Read the privacy policy of Viora Media to understand how we collect, use, and protect your personal data on our cinema platform.'
  });

  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <span className="text-xs tracking-[0.3em] text-secondary font-semibold uppercase">Legal Statement</span>
        <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide mt-4 mb-2">
          Privacy <span className="text-gold-gradient font-italic font-normal">Policy</span>
        </h1>
        <p className="text-xs text-accent-muted mb-12 font-light uppercase tracking-widest">
          Last Updated: July 17, 2026
        </p>

        <div className="space-y-12 text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide font-sans">
          
          <div className="space-y-4">
            <p>
              This Privacy Policy describes how and why we might access, collect, store, use, and/or share (<span className="text-white font-medium">"process"</span>) your personal information when you use our services (<span className="text-white font-medium">"Services"</span>) at <span className="text-secondary font-medium">vioramedia.in</span>, or engage with us in other related ways including marketing, events, or partnerships.
            </p>
            <p>
              Reading this notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you have questions or concerns, contact us at <a href="mailto:contact@vioramedia.in" className="text-secondary underline hover:text-white transition-colors duration-300">contact@vioramedia.in</a>.
            </p>
          </div>

          <hr className="border-white/10" />

          {/* Section 1 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">1. What Information Do We Collect?</h2>
            <div className="space-y-3">
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">Personal Information You Disclose to Us</h3>
              <p>
                We collect personal information that you voluntarily provide to us when you express interest in obtaining information about us or our Services, contact us through our forms, or participate in activities on our platform.
              </p>
              <p>
                The personal information we collect may include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><span className="text-white">Names</span></li>
                <li><span className="text-white">Email addresses</span></li>
                <li><span className="text-white">Phone numbers</span></li>
                <li><span className="text-white">Billing addresses</span></li>
              </ul>
              <h3 className="text-white font-medium text-sm uppercase tracking-wider mt-4">Sensitive Information</h3>
              <p>We do not process sensitive personal information (such as racial or ethnic origins, religious beliefs, or sexual orientation).</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">2. How Do We Process Your Information?</h2>
            <p>
              We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong className="text-white">To deliver services:</strong> To process and provide you with requested cinema and festival services.</li>
              <li><strong className="text-white">To respond to inquiries:</strong> To reply to briefing forms, requests, and solve potential support issues.</li>
              <li><strong className="text-white">To send administrative details:</strong> To update you about products, changes to terms, and policies.</li>
              <li><strong className="text-white">To enable communication:</strong> To facilitate user-to-user messaging if you use social features.</li>
              <li><strong className="text-white">To request feedback:</strong> To contact you regarding your experience with Viora.</li>
              <li><strong className="text-white">To send marketing materials:</strong> For marketing and promotional emails (which you can opt out of at any time).</li>
              <li><strong className="text-white">To administer contests:</strong> To run prize draws, awards, and film submissions.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">3. When and With Whom Do We Share Your Information?</h2>
            <p>
              We do not sell, trade, or share your personal data with third parties for marketing purposes. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">4. Do We Use Cookies and Tracking Technologies?</h2>
            <p>
              We may use cookies, pixels, and similar tracking technologies to store configuration settings, manage user sessions, and analyze site usage traffic to provide a better browsing experience.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">5. How Long Do We Keep Your Information?</h2>
            <p>
              We retain your personal details only for as long as necessary to fulfill the operational purposes outlined in this notice, or as required by law (such as tax or accounting rules). When we have no ongoing legitimate business need to process your data, we will securely delete or anonymize it.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">6. How Do We Keep Your Information Safe?</h2>
            <p>
              We have implemented appropriate organizational and technical security measures designed to protect the safety of any personal information we process. However, despite our safeguards, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that unauthorized third parties will not be able to defeat our security and improperly collect your information.
            </p>
          </div>

          {/* Section 7 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">7. What Are Your Privacy Rights?</h2>
            <p>
              Depending on your geographical location, you have certain rights regarding your personal information. These may include the right to request access, obtain a copy, correct errors, or request deletion of your data. You can exercise these rights by contacting us directly.
            </p>
          </div>

          {/* Section 8 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">8. Controls for Do-Not-Track Features</h2>
            <p>
              Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored. At this stage, no uniform technology standard for recognizing DNT signals has been finalized, so we do not currently respond to DNT signals.
            </p>
          </div>

          {/* Section 9 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">9. Do We Make Updates to This Notice?</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by a revised "Last Updated" date at the top of this page. We encourage you to review this notice frequently to stay informed of how we protect your information.
            </p>
          </div>

          {/* Section 10 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">10. How Can You Contact Us About This Notice?</h2>
            <p>
              If you have questions, comments, or complaints regarding this policy or our data practices, please email us directly at:
            </p>
            <a 
              href="mailto:contact@vioramedia.in" 
              className="inline-block text-secondary hover:text-white transition-colors duration-300 font-serif italic text-lg"
            >
              contact@vioramedia.in
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
