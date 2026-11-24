import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  Phone, 
  User, 
  UserCheck, 
  GraduationCap, 
  FileText, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { formService } from '../../services/formService';
import { useToast } from '../../context/ToastContext';

interface HeroBannerSectionProps {
  onOpenAdmissions?: () => void;
}

interface BannerSlide {
  id: string;
  type: 'featured' | 'graphic';
  src: string;
  fallbackSrc?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  tagline?: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'campus-excellence',
    type: 'featured',
    src: '/images/01-home-hero/banner-1.webp',
    fallbackSrc: '/images/01-home-hero/banner-1.jpg',
    badge: 'CBSE AFFILIATED NO. 1130058 • ESTD. 1995',
    title: 'CHINMAYA VIDYALAYA TARAPUR',
    subtitle: 'Nurturing Academic Excellence, Noble Character & Vedantic Values from Nursery to Class XII',
    tagline: '31+ Years of Holistic Child Transformation'
  },
  {
    id: 'toppers-arts-commerce',
    type: 'graphic',
    src: '/1.jpeg?v=20261022_arts_commerce',
    title: 'CBSE Class XII Board Toppers 2026 - Arts and Commerce',
    subtitle: 'Celebrating 100% First Class CBSE Results'
  },
  {
    id: 'toppers-science',
    type: 'graphic',
    src: '/2.jpeg?v=20261022_science',
    title: 'CBSE Class XII Board Toppers 2026 - Science Stream',
    subtitle: 'State-of-the-Art Labs & Mentorship for Future Leaders'
  },
  {
    id: 'matru-pitru-pujan',
    type: 'graphic',
    src: '/matru_pitru_pujan_banner.webp?v=20261206_final',
    fallbackSrc: '/matru_pitru_pujan_banner.png',
    title: 'Grand Matru Pitru Pujan Ceremony - Cultural Sanskars',
    subtitle: 'Instilling Reverence, Gratitude and Family Values'
  },
  {
    id: 'sports-excellence',
    type: 'graphic',
    src: '/sports-banner.webp',
    fallbackSrc: '/sports-banner.png',
    title: 'Sports & Co-Curricular Distinction',
    subtitle: 'World-Class Playgrounds, Athletics & Holistic Development'
  }
];

export const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({ onOpenAdmissions }) => {
  const { showSuccess } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Quick form state
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    grade: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-advance banner slides every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  // Form submit handler
  const handleQuickFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const nameRegex = /^[a-zA-Z\s.]+$/;
    if (!nameRegex.test(formData.studentName.trim()) || formData.studentName.trim().length < 2) {
      setSubmitError('Please enter a valid student name (letters only).');
      return;
    }

    if (!nameRegex.test(formData.parentName.trim()) || formData.parentName.trim().length < 2) {
      setSubmitError('Please enter a valid parent or guardian name (letters only).');
      return;
    }

    const cleanedPhone = formData.phone.replace(/[\s\-]/g, '');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.grade) {
      setSubmitError('Please select a grade/class applying for.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await formService.submitAdmission({
        studentName: formData.studentName.trim(),
        parentName: formData.parentName.trim(),
        gradeApplyingFor: formData.grade,
        phone: cleanedPhone,
        notes: 'Submitted via Homepage Hero Quick Enquiry Form'
      });

      setIsSubmitting(false);

      if (res.success) {
        showSuccess(
          'Enquiry Submitted Successfully!',
          'Our admissions coordinator will contact you shortly.'
        );
        setIsSubmitted(true);
      } else {
        setSubmitError(res.message || 'Submission failed. Please call our admissions desk.');
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError('Unable to connect to the server. Please call 9322054713.');
    }
  };

  const handleResetForm = () => {
    setFormData({
      studentName: '',
      parentName: '',
      phone: '',
      grade: '',
    });
    setSubmitError(null);
    setIsSubmitted(false);
  };

  return (
    <section 
      className="w-full bg-[#FAF8F5] border-b border-[#E7E2D8] py-3 sm:py-5 lg:py-6 select-none"
      aria-label="Institutional Banner and Quick Admission Desk"
    >
      <div className="max-w-[1480px] mx-auto px-3 sm:px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          
          {/* ====================================================
              LEFT COLUMN: BANNER CAROUSEL (8 COLS ON DESKTOP)
             ==================================================== */}
          <div 
            className="lg:col-span-8 flex flex-col justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[390px] md:h-[440px] lg:h-[490px] xl:h-[510px] rounded-2xl overflow-hidden bg-[#0A1626] shadow-md border border-slate-200/90 group">
              
              {/* Slides Container */}
              {BANNER_SLIDES.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    {slide.type === 'featured' ? (
                      /* Featured Campus Slide with rich typography overlay */
                      <div className="relative w-full h-full">
                        <picture>
                          <source srcSet={slide.src} type="image/webp" />
                          <img
                            src={slide.fallbackSrc || slide.src}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center"
                            loading={idx === 0 ? 'eager' : 'lazy'}
                          />
                        </picture>

                        {/* Dual cinematic gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050C14] via-[#050C14]/60 to-black/30 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />

                        {/* Slide Content Overlay */}
                        <div className="absolute inset-0 p-4 sm:p-7 lg:p-9 flex flex-col justify-end text-white z-10">
                          {slide.badge && (
                            <div className="mb-2 sm:mb-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DF711B]/90 backdrop-blur-md text-[#FFF0D4] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border border-amber-300/30 shadow-sm">
                                <Sparkles className="w-3 h-3 text-amber-200" />
                                {slide.badge}
                              </span>
                            </div>
                          )}

                          <h2 className="font-display font-black text-xl xs:text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight uppercase drop-shadow-md">
                            {slide.title}
                          </h2>

                          {slide.subtitle && (
                            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-sans mt-1 sm:mt-2 max-w-2xl leading-relaxed drop-shadow line-clamp-2">
                              {slide.subtitle}
                            </p>
                          )}

                          {/* Quick Stats Badges on First Slide */}
                          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/20 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-amber-100 font-medium">
                            <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB740]" />
                              31+ Years Legacy
                            </span>
                            <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB740]" />
                              100% CBSE Results
                            </span>
                            <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB740]" />
                              1600+ Students
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Graphic Topper / Event Banners */
                      <div className="relative w-full h-full flex items-center justify-center bg-[#07111D]">
                        <picture>
                          {slide.src.endsWith('.webp') && (
                            <source srcSet={slide.src} type="image/webp" />
                          )}
                          <img
                            src={slide.fallbackSrc || slide.src}
                            alt={slide.title}
                            className="w-full h-full object-contain object-center"
                            loading="lazy"
                          />
                        </picture>

                        {/* Subtle bottom caption ribbon for context */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 text-white z-10 flex items-center justify-between">
                          <p className="text-xs sm:text-sm font-semibold truncate drop-shadow">
                            {slide.title}
                          </p>
                          <span className="hidden sm:inline-block text-[10px] font-mono text-amber-300 uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded">
                            Official Announcement
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Prev / Next Controls */}
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95 border border-white/20 hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95 border border-white/20 hover:scale-105"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Slide Indicators / Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                {BANNER_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentSlide
                        ? 'w-6 sm:w-8 h-2 bg-[#DF711B]'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT COLUMN: SMALL QUICK FORM (4 COLS ON DESKTOP)
             ==================================================== */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200/90 p-4 sm:p-5 lg:p-5 xl:p-6 flex flex-col justify-between relative overflow-hidden">
              
              {/* Decorative top accent brand bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#DF711B] via-[#FFB740] to-[#DF711B]" />

              {/* Form Content / State Switcher */}
              {isSubmitted ? (
                /* Success Confirmation State */
                <div className="py-8 sm:py-10 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-lg text-[#0B1E34]">
                      Enquiry Received!
                    </h3>
                    <p className="text-xs text-[#555] max-w-xs leading-relaxed">
                      Thank you, <strong className="text-[#181C20]">{formData.parentName}</strong>. Our admissions counselor will contact you shortly regarding admission for <strong className="text-[#181C20]">{formData.studentName}</strong> ({formData.grade}).
                    </p>
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E7E2D8] text-[11px] text-[#666] w-full text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-500">Registered Phone:</span>
                      <span className="font-mono font-bold text-slate-800">+91 {formData.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-500">Grade Applying:</span>
                      <span className="font-bold text-[#DF711B]">{formData.grade}</span>
                    </div>
                  </div>

                  <div className="pt-2 w-full space-y-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full py-2.5 px-4 bg-[#DF711B] hover:bg-[#C45B0E] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                    {onOpenAdmissions && (
                      <button
                        type="button"
                        onClick={onOpenAdmissions}
                        className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-[#0B1E34] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Guidelines & Forms</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Active Quick Admission Form */
                <form onSubmit={handleQuickFormSubmit} className="space-y-3 sm:space-y-3.5">
                  
                  {/* Form Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-[#DF711B] border border-amber-200/80 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ADMISSIONS 2026-27
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Quick Enquiry
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg sm:text-xl text-[#0B1E34] tracking-tight">
                      Enquire for Admissions
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1">
                      Direct callback from our official admissions desk
                    </p>
                  </div>

                  {/* Error Notification Alert */}
                  {submitError && (
                    <div className="p-2 sm:p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5 leading-snug">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Field 1: Student Name */}
                  <div>
                    <label className="block text-[10.5px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
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
                        placeholder="Child's Full Name"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#D5CEC2] text-[#181C20] placeholder-slate-400 rounded-xl focus:bg-white focus:border-[#DF711B] focus:ring-2 focus:ring-[#DF711B]/15 focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Field 2: Parent Name */}
                  <div>
                    <label className="block text-[10.5px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
                      Parent / Guardian Name <span className="text-[#DF711B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Parent / Guardian Full Name"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#D5CEC2] text-[#181C20] placeholder-slate-400 rounded-xl focus:bg-white focus:border-[#DF711B] focus:ring-2 focus:ring-[#DF711B]/15 focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Field 3: Phone Number */}
                  <div>
                    <label className="block text-[10.5px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
                      Mobile Number <span className="text-[#DF711B]">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-[#D5CEC2] bg-slate-100 text-slate-600 text-xs font-mono font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#D5CEC2] text-[#181C20] placeholder-slate-400 rounded-r-xl focus:bg-white focus:border-[#DF711B] focus:ring-2 focus:ring-[#DF711B]/15 focus:outline-none transition-all shadow-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Field 4: Grade Applying For */}
                  <div>
                    <label className="block text-[10.5px] font-sans font-bold text-[#0B1E34] uppercase tracking-wider mb-1">
                      Grade Applying For <span className="text-[#DF711B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <select
                        required
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#D5CEC2] text-[#181C20] rounded-xl focus:bg-white focus:border-[#DF711B] focus:ring-2 focus:ring-[#DF711B]/15 focus:outline-none transition-all shadow-xs cursor-pointer"
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
                        <optgroup label="Senior Secondary (CBSE)">
                          <option value="Class 11 - Science">Class 11 (Science Stream)</option>
                          <option value="Class 11 - Commerce">Class 11 (Commerce Stream)</option>
                          <option value="Class 11 - Arts">Class 11 (Arts / Humanities)</option>
                          <option value="Class 12">Class 12</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#DF711B] via-[#E8873E] to-[#DF711B] hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#DF711B]/20 cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                      <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Quick Enquiry'}</span>
                    </button>
                  </div>

                  {/* Helpline & Quick Links Strip */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <a 
                      href="tel:9322054713" 
                      className="inline-flex items-center gap-1 font-mono hover:text-[#DF711B] transition-colors"
                      title="Direct Admissions Helpline"
                    >
                      <Phone className="w-3 h-3 text-[#DF711B]" />
                      <span>9322054713</span>
                    </a>

                    {onOpenAdmissions ? (
                      <button
                        type="button"
                        onClick={onOpenAdmissions}
                        className="inline-flex items-center gap-1 text-[#DF711B] hover:text-[#C45B0E] font-semibold cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Download Forms ›</span>
                      </button>
                    ) : (
                      <Link
                        to="/admissions"
                        className="inline-flex items-center gap-1 text-[#DF711B] hover:text-[#C45B0E] font-semibold"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Admissions Info ›</span>
                      </Link>
                    )}
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
