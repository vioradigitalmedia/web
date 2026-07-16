
export default function PrivacyPolicyScreen() {
  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <span className="text-xs tracking-[0.3em] text-secondary font-semibold uppercase">Legal Statement</span>
        <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide mt-4 mb-8">
          Privacy <span className="text-gold-gradient font-italic font-normal">Policy</span>
        </h1>
        <p className="text-xs text-accent-muted mb-12 font-light uppercase tracking-widest">
          Last Updated: July 16, 2026
        </p>

        <div className="space-y-10 text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide font-sans">
          
          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">1. Introduction</h2>
            <p>
              Viora ("we," "our," or "us") operates as a creative media platform dedicated to storytelling, short film festivals, academy programs, and building a trusted community. We respect your privacy and are committed to protecting the personal data you share with us.
            </p>
          </div>

          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">2. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when using our platform. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Contact & Inquiry Information:</strong> Your name, email address, and message contents provided through our briefing forms or email links.
              </li>
              <li>
                <strong className="text-white">Submission Materials:</strong> Information relating to your submissions for film festivals or educational programs when registration becomes available.
              </li>
            </ul>
          </div>

          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">3. How We Use Your Information</h2>
            <p>
              Your data is processed under strict confidentiality standards to serve your specific creative objectives, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reviewing and responding to briefing inquiries and contact forms.</li>
              <li>Providing updates regarding upcoming festivals, academy workshops, and new opportunities.</li>
              <li>Fulfilling legal requirements and ensuring platform security.</li>
            </ul>
          </div>

          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">4. Data Sharing & Custody</h2>
            <p>
              We do not sell, trade, or distribute your personal details to external third parties. We may share information with trusted operational partners only to host events or fulfill workshop schedules, under strict privacy agreements.
            </p>
          </div>

          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">5. Security of Information</h2>
            <p>
              We apply industry-standard electronic safeguards, encryption, and operational controls to prevent unauthorized access, theft, or misuse of your communication logs.
            </p>
          </div>

          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">6. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, or request deletion of your information by contacting our support line.
            </p>
          </div>

          <div className="border-l border-secondary/20 pl-6 space-y-4">
            <h2 className="font-serif text-xl text-white tracking-wide">7. Contact Us</h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, please contact us directly at:
            </p>
            <a 
              href="mailto:contact@vioramedia.in" 
              className="inline-block text-secondary hover:text-white transition-colors duration-300 font-serif italic"
            >
              contact@vioramedia.in
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
