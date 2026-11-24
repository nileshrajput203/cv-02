import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Phone, 
  GraduationCap, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { formService } from '../../services/formService';
import { useToast } from '../../context/ToastContext';

interface HeroBannerWithFormProps {
  onOpenAdmissions?: () => void;
}

interface BannerSlide {
  id: string;
  type: 'custom' | 'image';
  title?: string;
  subtitle?: string;
  badge?: string;
  imageSrc: string;
  alt: string;
  link?: string;
  linkText?: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'campus-excellence',
    type: 'custom',
    badge: 'CBSE AFFILIATED NO. 1130058 • ESTD. 1995',
    title: 'NURTURING EXCELLENCE & VEDANTIC VALUES',
    subtitle: 'Palghar District’s premier senior secondary institution dedicated to holistic human excellence from Nursery to Std XII.',
    imageSrc: '/images/01-home-hero/banner-1.jpg',
    alt: 'Chinmaya Vidyalaya Tarapur Campus Building',
    link: '/admissions',
    linkText: 'Explore Admissions 2026-27'
  },
  {
    id: 'toppers-arts-commerce',
    type: 'image',
    title: 'Class XII Board Toppers - Arts & Commerce',
    imageSrc: '/1.jpeg?v=20261022_arts_commerce',
    alt: 'Chinmaya Vidyalaya 12th Toppers 2026 - Arts and Commerce',
  },
  {
    id: 'toppers-science',
    type: 'image',
    title: 'Class XII Board Toppers - Science Stream',
    imageSrc: '/2.jpeg?v=20261022_science',
    alt: 'Chinmaya Vidyalaya 12th Toppers 2026 - Science Stream',
  },
  {
    id: 'matru-pitru-pujan',
    type: 'image',
    title: 'Grand Matru Pitru Pujan Ceremony',
    imageSrc: '/matru_pitru_pujan_banner.webp?v=20261206_final',
    alt: 'Grand Matru Pitru Pujan Ceremony in the presence of Pujya Swami Anukoolananda ji',
  },
  {
    id: 'sports-excellence',
    type: 'image',
    title: 'Annual Sports & Athletic Distinction',
    imageSrc: '/sports-banner.webp?v=2026_sports',
    alt: 'Chinmaya Vidyalaya Sports & Co-Curricular Excellence',
  }
];

export const HeroBannerWithForm: React.FC<HeroBannerWithFormProps> = ({ onOpenAdmissions }) => {
  const { showSuccess } = useToast();

  // Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    grade: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-advance banner slides
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  // Quick Admission Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    const nameRegex = /^[a-zA-Z\s.]+$/;
    if (!nameRegex.test(formData.studentName.trim()) || formData.studentName.trim().length < 2) {
      setSubmitError('Please enter a valid student name containing only letters.');
      return;
    }

    if (!nameRegex.test(formData.parentName.trim()) || formData.parentName.trim().length < 2) {
      setSubmitError('Please enter a valid parent/guardian name containing only letters.');
      return;
    }

    if (!formData.grade) {
      setSubmitError('Please select the grade / class applying for.');
      return;
    }

    const cleanedPhone = formData.phone.replace(/[\s\-]/g, '');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await formService.submitAdmission({
        studentName: formData.studentName.trim(),
        parentName: formData.parentName.trim(),
        gradeApplyingFor: formData.grade,
        phone: cleanedPhone,
        message: 'Quick Enquiry from Homepage Hero Banner',
      });

      setIsSubmitting(false);

      if (res.success) {
        showSuccess(
          'Enquiry Submitted Successfully!',
          'Thank you! Our admissions coordinator will reach out to you shortly.'
        );
        setIsSubmitted(true);
      } else {
        setSubmitError(res.message || 'Unable to submit enquiry. Please try again or call the office.');
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError('Connection error. Please try again or contact the admissions office.');
    }
  };

  const handleResetForm = () => {
    setFormData({
      studentName: '',
      parentName: '',
      phone: '',
      grade: '',
    });
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <section 
      className="w-full bg-gradient-to-b from-[#FAF8F5] to-white border-b border-[#E7E2D8] py-3 sm:py-5 lg:py-6 select-none"
      aria-label="Campus Hero Showcase"
    >
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Banner (8 cols) + Right Quick Form (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          
          {/* ----------------------------------------------------
              LEFT COLUMN: BANNER CAROUSEL (lg:col-span-8)
             ---------------------------------------------------- */}
          <div 
            className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-md border border-[#E7E2D8] bg-slate-900 group flex flex-col min-h-[320px] sm:min-h-[400px] lg:min-h-[490px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Banner Slides Container */}
            <div className="relative w-full h-full flex-1 overflow-hidden min-h-[300px] sm:min-h-[380px] lg:min-h-[460px]">
              {BANNER_SLIDES.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    {slide.type === 'custom' ? (
                      /* Custom High-Impact Photographic Campus Banner */
                      <div className="relative w-full h-full bg-[#0A1626] flex items-end">
                        <img
                          src={slide.imageSrc}
                          alt={slide.alt}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          fetchPriority={idx === 0 ? 'high' : 'auto'}
                        />
                        {/* Contrast Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                        {/* Top Accreditation Pill */}
                        <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FFB740] border border-amber-400/30 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase shadow-md">
                            <Sparkles className="w-3 h-3 text-[#FFB740]" />
                            {slide.badge}
                          </span>
                        </div>

                        {/* Slide Caption & Call-to-action */}
                        <div className="relative z-20 p-4 sm:p-7 max-w-xl text-white space-y-2.5">
                          <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl tracking-tight leading-tight uppercase drop-shadow-md text-white">
                            <span className="text-[#FFB740]">PALGHAR'S</span> MOST ICONIC CBSE SCHOOL
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow">
                            {slide.subtitle}
                          </p>

                          {/* Stat Highlights Pills */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[11px] font-semibold">
                              🎓 31+ Years of Schooling
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-[#FFB740] text-[11px] font-semibold">
                              ⭐ 100% CBSE Results
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[11px] font-semibold">
                              🏛️ 1600+ Students
                            </span>
                          </div>

                          {slide.link && (
                            <div className="pt-2">
                              <Link
                                to={slide.link}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#DF711B] hover:bg-[#C45B0E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                              >
                                <span>{slide.linkText}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Graphic Topper / Event Banner (Cleanly centered & aspect-fitted) */
                      <div className="relative w-full h-full bg-[#0F172A] flex items-center justify-center">
                        <img
                          src={slide.imageSrc}
                          alt={slide.alt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain object-center block"
                        />
                        {/* Subtle banner label on bottom-left */}
                        <div className="absolute bottom-2.5 left-3 z-10 hidden sm:block">
                          <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-sans border border-white/10">
                            {slide.title}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Prev Slide Navigation Button */}
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-90 border border-white/20 hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Next Slide Navigation Button */}
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-90 border border-white/20 hover:scale-105"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Dot Indicators & Slide Counter (Bottom Center) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
                {BANNER_SLIDES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentSlide(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIdx === currentSlide 
                        ? 'w-6 bg-[#FFB740]' 
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-white/80 font-mono pl-1.5 border-l border-white/20">
                  {currentSlide + 1}/{BANNER_SLIDES.length}
                </span>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT COLUMN: SMALL QUICK ADMISSION ENQUIRY FORM (lg:col-span-4)
             ---------------------------------------------------- */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E2D8] shadow-md p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#DF711B] via-[#FFB740] to-[#DF711B]" />

            <div>
              {/* Form Card Header */}
              <div className="pb-3 border-b border-[#E7E2D8]">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DF711B]/10 text-[#DF711B] text-[10px] font-mono font-bold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ADMISSIONS 2026-27
                  </span>
                  <span className="text-[10px] text-[#666] font-sans font-medium">
                    Quick Callback
                  </span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-[#0B1E34] tracking-tight leading-snug">
                  Quick Admission Enquiry
                </h3>
                <p className="text-[11px] text-[#666666] font-sans mt-0.5">
                  Fill below to receive syllabus, fee structure & counselor call.
                </p>
              </div>

              {/* Form Content / Success Message */}
              {isSubmitted ? (
                <div className="py-8 text-center space-y-3.5">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[#0B1E34]">
                      Enquiry Received!
                    </h4>
                    <p className="text-xs text-[#555] font-sans max-w-xs mx-auto mt-1 leading-relaxed">
                      Thank you! Our admissions coordinator will call you on your registered phone number shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1.5 text-xs text-[#DF711B] font-bold hover:underline cursor-pointer pt-2"
                  >
                    <span>Submit another enquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5 pt-3">
                  {/* Error Notification */}
                  {submitError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-700 text-[11px]">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Field 1: Student Full Name */}
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
                      Student Name <span className="text-[#DF711B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="Child's full name"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] text-[#181C20] placeholder-[#9E988D] rounded-xl focus:border-[#DF711B] focus:bg-white focus:ring-2 focus:ring-[#DF711B]/20 focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Field 2: Parent / Guardian Name */}
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
                      Parent / Guardian Name <span className="text-[#DF711B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Parent / Guardian full name"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] text-[#181C20] placeholder-[#9E988D] rounded-xl focus:border-[#DF711B] focus:bg-white focus:ring-2 focus:ring-[#DF711B]/20 focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Field 3: Phone Number */}
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
                      Phone Number (10 Digits) <span className="text-[#DF711B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] text-[#181C20] placeholder-[#9E988D] rounded-xl focus:border-[#DF711B] focus:bg-white focus:ring-2 focus:ring-[#DF711B]/20 focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Field 4: Grade Applying For */}
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
                      Grade / Class Applying For <span className="text-[#DF711B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <select
                        required
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] text-[#181C20] rounded-xl focus:border-[#DF711B] focus:bg-white focus:ring-2 focus:ring-[#DF711B]/20 focus:outline-none transition-all shadow-xs cursor-pointer"
                      >
                        <option value="">Select Grade / Class</option>
                        <optgroup label="Foundational Stage">
                          <option value="Nursery">Nursery</option>
                          <option value="Junior KG">Junior KG</option>
                          <option value="Senior KG">Senior KG</option>
                          <option value="Class 1">Class 1</option>
                          <option value="Class 2">Class 2</option>
                        </optgroup>
                        <optgroup label="Preparatory Stage">
                          <option value="Class 3">Class 3</option>
                          <option value="Class 4">Class 4</option>
                          <option value="Class 5">Class 5</option>
                        </optgroup>
                        <optgroup label="Middle Stage">
                          <option value="Class 6">Class 6</option>
                          <option value="Class 7">Class 7</option>
                          <option value="Class 8">Class 8</option>
                        </optgroup>
                        <optgroup label="Secondary Stage">
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                        </optgroup>
                        <optgroup label="Senior Secondary (XI - XII)">
                          <option value="Class 11 Science">Class 11 - Science</option>
                          <option value="Class 11 Commerce">Class 11 - Commerce</option>
                          <option value="Class 11 Arts">Class 11 - Arts</option>
                          <option value="Class 12">Class 12 (Transfer Cases)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-gradient-to-r from-[#DF711B] via-[#E8873E] to-[#DF711B] hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#DF711B]/20 cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                      <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Quick Enquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Assistance & Links Footer */}
            <div className="pt-3 mt-3 border-t border-[#E7E2D8] flex items-center justify-between text-[11px] text-[#555]">
              <a 
                href="tel:9322054713" 
                className="flex items-center gap-1.5 font-mono text-[11px] text-[#0B1E34] hover:text-[#DF711B] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#DF711B]" />
                <span>9322054713</span>
              </a>

              {onOpenAdmissions ? (
                <button
                  type="button"
                  onClick={onOpenAdmissions}
                  className="inline-flex items-center gap-1 text-[#DF711B] hover:text-[#C45B0E] font-sans font-bold hover:underline cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Forms ›</span>
                </button>
              ) : (
                <Link
                  to="/admissions"
                  className="inline-flex items-center gap-1 text-[#DF711B] hover:text-[#C45B0E] font-sans font-bold hover:underline cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Admissions Info ›</span>
                </Link>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
