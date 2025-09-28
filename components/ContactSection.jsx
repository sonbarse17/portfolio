"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ContactGlobe } from "./ContactGlobe";
import emailjs from '@emailjs/browser';

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'Sushant Sonbarse',
        to_email: 'sushantsonbarse07@gmail.com'
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-black relative w-full overflow-hidden py-16 md:py-24 transition-colors duration-300">
      {/* Background gradients */}
      <div
        className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: `radial-gradient(circle at center, #3b82f6, transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px]"
        style={{
          background: `radial-gradient(circle at center, #3b82f6, transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/20 mx-auto max-w-6xl overflow-hidden rounded-[28px] border shadow-xl backdrop-blur-sm transition-colors duration-300">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            
            {/* Contact Form */}
            <div className="relative p-6 md:p-10" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex w-full gap-2"
              >
                <h2 className="text-gray-800 dark:text-white mb-2 text-4xl md:text-5xl font-bold tracking-tight">
                  Contact
                </h2>
                <span className="text-blue-600 dark:text-blue-400 text-4xl md:text-5xl font-bold italic tracking-tight">
                  Me
                </span>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 space-y-6"
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    required
                    className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-b from-blue-500 to-blue-700 text-white py-3 px-6 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center justify-center">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Message Sent!
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </motion.div>
              </motion.form>
            </div>

            {/* Globe Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative my-8 flex items-center justify-center overflow-hidden pr-8"
            >
              <div className="w-full min-h-[600px] flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Let&apos;s Connect Globally
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Ready to collaborate on DevOps projects worldwide. Reach out from anywhere!
                  </p>
                </div>
                <div className="flex-1 w-full overflow-visible">
                  <ContactGlobe /> {/* ✅ Clean separation */}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
