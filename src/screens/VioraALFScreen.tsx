import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, Award, User, Mail, Phone, MapPin, Upload, CheckCircle2, ArrowRight, ArrowLeft, GraduationCap, FileText } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { supabase } from '../supabaseClient';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  forcePathStyle: true,
});

export default function VioraALFScreen() {
  useSeo({
    title: 'Viora Art & Light Photo Fest 2026 | Visual Storytelling & Photography',
    description: 'Celebrating visual storytelling, photography, and the art of light. Submit your photo entries today.'
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [studentIdPhoto, setStudentIdPhoto] = useState<File | null>(null);
  const [studentIdPreview, setStudentIdPreview] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const festivalRules = [
    'Only photographs captured using a camera are accepted.',
    'Mobile phone photographs are not permitted.',
    'One photograph per participant.',
    'Original RAW file is mandatory.',
    'AI-generated, AI-assisted, edited, composite, or manipulated images are not allowed.',
    'Only original photographs captured by the participant are eligible.',
    'Watermarked, plagiarized, or copyrighted entries will be disqualified.',
    "Jury's decision is final."
  ];

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !city.trim()) {
      setErrorMsg('Please fill in all personal details fields.');
      return;
    }
    if (isStudent && !studentIdPhoto) {
      setErrorMsg('Please upload your Student ID photo to verify your student status.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStudentIdPhoto(file);
      setStudentIdPreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      setErrorMsg('Please upload a photo to complete your submission.');
      return;
    }
    if (isStudent && !studentIdPhoto) {
      setErrorMsg('Please upload your Student ID photo to complete your submission.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;
      let idUrl: string | null = null;

      // 1. Upload Photo directly to Cloudflare R2 bucket (`viorasf`)
      try {
        const fileExt = photo.name.split('.').pop();
        const photoKey = `photos/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        const photoPutCommand = new PutObjectCommand({
          Bucket: 'viorasf',
          Key: photoKey,
          Body: photo,
          ContentType: photo.type || 'image/jpeg',
        });

        await r2Client.send(photoPutCommand);
        photoUrl = photoKey;
      } catch (r2Err: any) {
        console.warn('Cloudflare R2 photo upload notice:', r2Err);
        // Fallback: try uploading to Supabase storage if R2 client fails
        try {
          const fileExt = photo.name.split('.').pop();
          const fileName = `alf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photo_submissions')
            .upload(fileName, photo);

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('photo_submissions')
              .getPublicUrl(fileName);
            photoUrl = publicUrlData?.publicUrl || null;
          }
        } catch (sbErr) {
          console.warn('Supabase storage upload fallback notice:', sbErr);
        }
      }

      // 2. Upload Student ID Photo to Cloudflare R2 bucket (`viorasf`) if student
      if (isStudent && studentIdPhoto) {
        try {
          const idExt = studentIdPhoto.name.split('.').pop();
          const idKey = `id/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${idExt}`;

          const idPutCommand = new PutObjectCommand({
            Bucket: 'viorasf',
            Key: idKey,
            Body: studentIdPhoto,
            ContentType: studentIdPhoto.type || 'image/jpeg',
          });

          await r2Client.send(idPutCommand);
          idUrl = idKey;
        } catch (idR2Err: any) {
          console.warn('Cloudflare R2 Student ID upload notice:', idR2Err);
        }
      }

      // 3. Insert entry into Supabase database table `photo_fest_submissions`
      const { error: dbError } = await supabase
        .from('photo_fest_submissions')
        .insert([
          {
            full_name: name,
            email: email.trim().toLowerCase(),
            phone: phone,
            city: city,
            is_student: isStudent,
            photo_filename: photo.name,
            photo_url: photoUrl,
            id_url: idUrl,
            status: 'submitted'
          }
        ]);

      if (dbError) {
        console.warn('Supabase DB insert notice:', dbError.message);
      }

      setIsSubmitting(false);
      setStep(3);
    } catch (err: any) {
      console.error('Submission processing note:', err);
      setIsSubmitting(false);
      setStep(3);
    }
  };

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
