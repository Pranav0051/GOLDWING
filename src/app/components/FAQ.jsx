"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search } from "lucide-react";
const faqs = [
  {
    question: "What is paramotoring?",
    answer: "Paramotoring is a form of ultralight aviation where a pilot wears a motor on their back that provides thrust to a paraglider wing. It's one of the easiest and most affordable ways to experience powered flight.",
  },
  {
    question: "What is the best time for paramotoring?",
    answer: "The best time is early morning (6 AM - 9 AM) or late evening (4 PM - 6 PM) when winds are calm. Sunrise flights offer spectacular views and cooler temperatures.",
  },
  {
    question: "What is the age limit?",
    answer: "Participants must be at least 12 years old. Minors (12-17 years) require parental consent. There's no upper age limit as long as you're physically fit.",
  },
  {
    question: "Is prior experience required?",
    answer: "No prior experience is needed! Our certified pilots handle all the flying. You simply enjoy the ride while safely harnessed with the pilot.",
  },
  {
    question: "Is paramotoring safe?",
    answer: "Yes! We maintain an excellent safety record. All pilots are highly experienced with 500+ flight hours. We use premium equipment and never fly in unsafe weather conditions.",
  },
  {
    question: "Is booking compulsory?",
    answer: "Yes, advance booking is required to reserve your slot. Pay ₹500 to confirm your booking, with the balance due on arrival. This ensures availability and proper planning.",
  },
  {
    question: "What should I wear?",
    answer: "Wear comfortable, loose-fitting clothes and closed-toe shoes. Avoid loose accessories like scarves or jewelry. We provide all safety gear including helmets and harnesses.",
  },
  {
    question: "What is the weather cancellation policy?",
    answer: "Safety first! If weather conditions are unsuitable, we'll reschedule your flight or provide a 100% refund. We monitor weather conditions daily and will notify you in advance.",
  },
];
export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredFaqs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));
  return (<section className="py-20 md:py-32 bg-[#0B0F19] relative overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px]" />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
          Everything you need to know about your paramotor adventure
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input type="text" placeholder="Search your questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full pl-12 pr-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-all" />
        </div>
      </motion.div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        {filteredFaqs.map((faq, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05, duration: 0.5 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all">
          <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left">
            <span className="text-white font-semibold pr-4">{faq.question}</span>
            <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
              <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === index && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
              <div className="px-6 pb-6 text-white/70 leading-relaxed">
                {faq.answer}
              </div>
            </motion.div>)}
          </AnimatePresence>
        </motion.div>))}

        {filteredFaqs.length === 0 && (<div className="text-center py-12">
          <p className="text-white/60">No matching questions found. Try a different search.</p>
        </div>)}
      </div>
    </div>
  </section>);
}
