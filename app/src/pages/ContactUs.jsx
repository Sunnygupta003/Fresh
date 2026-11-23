import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('http://localhost:3001/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mb-8 text-center">
        <Link to="/" className="text-green-600 font-semibold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-900"
        >
          Contact Us
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-gray-600"
        >
          We'd love to hear from you. Please fill out the form below or reach out via email or phone.
        </motion.p>
      </div>

      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Contact Info Side */}
        <div className="bg-green-600 p-8 text-white md:w-2/5 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-green-200" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-green-100">support@freshproduce.com</p>
                <p className="text-green-100">demo@freshproduce.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-green-200" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-green-100">+91 98765 43210</p>
                <p className="text-green-100">+91 12345 67890 (Demo)</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-green-200" />
              <div>
                <p className="font-medium">Office</p>
                <p className="text-green-100">123 Fresh Produce Lane</p>
                <p className="text-green-100">New Delhi, India 110001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:w-3/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-3 border"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-3 border"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                id="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-3 border"
                placeholder="How can we help you?"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </motion.button>

            {status === 'success' && (
              <p className="text-green-600 text-center font-medium text-sm mt-2">Message sent successfully! We'll get back to you soon.</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-center font-medium text-sm mt-2">Failed to send message. Is the local server running?</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
