import { useSeo } from '../hooks/useSeo';

export default function TermsConditionsScreen() {
  useSeo({
    title: 'Terms & Conditions | Viora Media',
    description: 'Read the Terms and Conditions of Viora Media. Understand the rules, film festival submission regulations, intellectual property agreements, and user responsibilities.'
  });

  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <span className="text-xs tracking-[0.3em] text-secondary font-semibold uppercase">Legal Statement</span>
        <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide mt-4 mb-2">
          Terms & <span className="text-gold-gradient font-italic font-normal">Conditions</span>
        </h1>
        <p className="text-xs text-accent-muted mb-12 font-light uppercase tracking-widest">
          Last Updated: July 21, 2026
        </p>

        <div className="space-y-12 text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide font-sans">
          
          <div className="space-y-4">
            <p>
              Welcome to <span className="text-secondary font-medium">vioramedia.in</span> ("Website"). These Terms & Conditions ("Terms") govern your access to and use of our platform, services, events, and short film festival submission modules provided by Viora Media ("Viora", "we", "our", or "us").
            </p>
            <p>
              By accessing this Website or submitting a film, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not access or use our Website or Services. If you have any inquiries, you can reach out to us at <a href="mailto:contact@vioramedia.in" className="text-secondary underline hover:text-white transition-colors duration-300">contact@vioramedia.in</a>.
            </p>
          </div>

          <hr className="border-white/10" />

          {/* Section 1 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">1. Use of the Site & Eligibility</h2>
            <p>
              You must be at least 18 years of age (or the age of majority in your jurisdiction) to submit short films, make payments, or engage in contract-based briefs on our platform. By using this Website, you warrant that you possess the legal authority to enter into these Terms.
            </p>
          </div>

          {/* Section 2 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">2. Festival Submissions & Regulations</h2>
            <div className="space-y-3">
              <p>
                When submitting short films to the Viora Short Film Festival, you represent and warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>You are the sole creator, director, or authorized representative of the submitted film.</li>
                <li>The film does not infringe upon any third-party copyrights, intellectual property, trademarks, privacy rights, or trade secrets.</li>
                <li>All necessary permissions, agreements, licenses, and releases (including music clearance, talent releases, and location releases) have been fully obtained and cleared.</li>
              </ul>
              <p>
                Viora Media reserves the right, at its sole discretion, to disqualify any submission that violates these parameters or fails to meet the technical standards of the festival.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">3. Intellectual Property Rights & Licenses</h2>
            <p>
              Viora Media does not claim ownership over your submitted short films. You retain full copyright ownership of your intellectual work. 
            </p>
            <p>
              However, by submitting your work, you grant Viora Media a worldwide, non-exclusive, royalty-free license to host, display, stream, and exhibit portions of your film (including trailers, posters, screen cuts, and stills) solely for promotional, marketing, and festival programming purposes.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">4. Payments, Fees & Refund Policy</h2>
            <p>
              Submission entries require payment of a registration fee (typically ₹999.00 or as indicated on the submission page). Payments are processed securely via third-party payment gateways (Razorpay). 
            </p>
            <p>
              Once a payment has been captured and a file submission has been completed, **all registration fees are strictly non-refundable**. Refunds will not be issued under any circumstances, including disqualification, withdrawal of the film, or failure of the entry to secure an official selection.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">5. Prohibited Content</h2>
            <p>
              You agree not to submit any content, films, or messages that contain material that is defamatory, obscene, pornographic, promoting violence, hate speech, illegal activities, or violates local and international laws. Any breach of this clause will lead to immediate disqualification and potential reporting to governing legal authorities.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">6. Limitation of Liability</h2>
            <p>
              In no event shall Viora Media, its partners, team members, or sponsors be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this Website, the outcome of any film festival decisions, or the security of uploaded files. We store files securely on private Cloudflare R2 bucket systems, but we recommend you retain backup copies of all original masters.
            </p>
          </div>

          {/* Section 7 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">7. Modifications to Terms</h2>
            <p>
              We reserve the right to revise these Terms & Conditions at any time. When updates are published, the "Last Updated" date at the top of this page will be revised. Your continued use of the Website following any changes signifies your acceptance of the updated Terms.
            </p>
          </div>

          {/* Section 8 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">8. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflicts of law principles. Any dispute arising out of or related to these Terms or the services of Viora Media shall be subject to the exclusive jurisdiction of the courts located in Chennai, Tamil Nadu, India.
            </p>
          </div>

          {/* Section 9 */}
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">9. Questions & Contact Information</h2>
            <p>
              If you have any questions or require clarification regarding these Terms & Conditions, please contact us:
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
