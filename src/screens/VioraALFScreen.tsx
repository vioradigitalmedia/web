import { motion } from 'motion/react';
import { Camera, Sparkles, Award } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

export default function VioraALFScreen() {
  useSeo({
    title: 'Viora Art & Light Photo Fest 2026 | Visual Storytelling & Photography',
    description: 'Celebrating visual storytelling, photography, and the art of light. Submit your photo entries today.'
  });

  return (
    <div className="w-full bg-black min-h-screen pb-24 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative overflow-hidden mb-12 border-b border-white/10">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-white/10 text-secondary border border-secondary/30 font-bold text-[10px] tracking-widest uppercase rounded-sm mb-2">
            Art & Light Photo Fest 2026
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide leading-tight">
            Art & Light <span className="text-gold-gradient font-italic font-normal">Photo Fest</span>
          </h1>

          <p className="text-base md:text-lg text-accent-muted font-light leading-relaxed tracking-wide">
            Celebrating visual storytelling, photography, and the art of light. Submit your photographic works to participate in the festival.
          </p>
        </div>
      </section>


      {/* Results Announcement Section */}
      <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <div className="border border-white/10 bg-zinc-950 p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(197,160,89,0.08)] relative overflow-hidden">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Submissions Closed</h2>
          <p className="text-sm md:text-base text-accent-muted font-light leading-relaxed max-w-2xl mx-auto">
            Thank you for your overwhelming response. The results will be announced on the <strong className="text-secondary font-medium">19th of August</strong> celebrating World Photography Month.
          </p>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-white/10 bg-zinc-950 p-8 rounded-sm text-center flex flex-col items-center space-y-4 hover:border-secondary/40 transition-colors"
          >
            <div className="p-4 bg-secondary/10 rounded-full border border-secondary/20 text-secondary">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl text-white">Visual Storytelling</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Capturing moments, emotions, and narratives through the medium of photography and creative lighting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-white/10 bg-zinc-950 p-8 rounded-sm text-center flex flex-col items-center space-y-4 hover:border-secondary/40 transition-colors"
          >
            <div className="p-4 bg-secondary/10 rounded-full border border-secondary/20 text-secondary">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl text-white">Exhibitions & Laurels</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Featured galleries, digital laurels, and curated exhibitions recognizing outstanding photographic works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/10 bg-zinc-950 p-8 rounded-sm text-center flex flex-col items-center space-y-4 hover:border-secondary/40 transition-colors"
          >
            <div className="p-4 bg-secondary/10 rounded-full border border-secondary/20 text-secondary">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl text-white">Creative Community</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Connecting emerging and professional photographers with curators, visual directors, and photography lovers.
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
