import React, { useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { ContactGlobe } from './ContactGlobe';

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ContactSection = () => {
    const form = useRef();
    const [isLoading, setIsLoading] = React.useState(false);
    const [status, setStatus] = React.useState('');

    useEffect(() => {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('');

        // Validate form data
        const formData = new FormData(form.current);
        if (!formData.get('user_name') || !formData.get('user_email') || !formData.get('message')) {
            setStatus('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        console.log('Sending email with config:', {
            serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        });

        emailjs.sendForm(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            form.current,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )
            .then((result) => {
                console.log('EmailJS Success:', result);
                setStatus('Message sent successfully!');
                form.current.reset();
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                console.error('Error details:', {
                    status: error.status,
                    text: error.text,
                    message: error.message
                });
                
                if (error.status === 422) {
                    setStatus('Invalid EmailJS configuration.');
                } else if (error.status === 400) {
                    setStatus('Bad request. Please check your form data.');
                } else if (error.status === 403) {
                    setStatus('Access denied. Please check your EmailJS settings.');
                } else {
                    setStatus(`Failed to send message: ${error.text || error.message || 'Unknown error'}`);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <motion.section 
            className="py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-black transition-colors duration-300"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-300">Get in Touch</h2>
                
                <ContactGlobe />
                
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.</p>
                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-12 transition-colors duration-300">📬 Feel free to reach out to me below.</p>
                
                <div className="max-w-2xl mx-auto">
                    <motion.form 
                        ref={form}
                        onSubmit={sendEmail}
                        className="space-y-6"
                        variants={{
                            visible: { transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        <motion.input 
                            type="text" 
                            name="user_name"
                            placeholder="Your Name" 
                            required 
                            variants={itemVariants}
                            className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/20 backdrop-blur-md focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/30 transition-all duration-200 hover:bg-white/25"
                        />
                        <motion.input 
                            type="email" 
                            name="user_email"
                            placeholder="Your Email" 
                            required 
                            variants={itemVariants}
                            className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/20 backdrop-blur-md focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/30 transition-all duration-200 hover:bg-white/25"
                        />
                        <motion.textarea 
                            name="message"
                            placeholder="Your Message" 
                            required 
                            rows="5"
                            variants={itemVariants}
                            className="w-full px-4 py-3 border border-white/30 rounded-xl bg-white/20 backdrop-blur-md focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/30 transition-all duration-200 hover:bg-white/25 resize-none"
                        ></motion.textarea>
                        <motion.button 
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variants={itemVariants}
                            className={`w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] ${isLoading ? 'opacity-70' : ''}`}
                        >
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </motion.button>
                        {status && <p className={`mt-4 text-sm ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
                    </motion.form>
                </div>

                <div className="flex justify-center space-x-6 mt-12">
                    <motion.a href="https://github.com/sonbarse17" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, rotate: 10 }} aria-label="GitHub Profile" className="p-3 rounded-xl text-gray-600 hover:text-gray-800">
                        <FaGithub size={30} />
                    </motion.a>
                    <motion.a href="https://www.linkedin.com/in/sushant-sonbarse" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, rotate: -10 }} aria-label="LinkedIn Profile" className="p-3 rounded-xl text-gray-600 hover:text-blue-600">
                        <FaLinkedin size={30} />
                    </motion.a>
                    <motion.a href="mailto:sushantsonbarse07@gmail.com" whileHover={{ scale: 1.2 }} aria-label="Send Email" className="p-3 rounded-xl text-gray-600 hover:text-red-600">
                        <FaEnvelope size={30} />
                    </motion.a>
                </div>
            </div>
        </motion.section>
    );
};

export default ContactSection;