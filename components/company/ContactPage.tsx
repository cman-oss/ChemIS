import React from 'react';
import PageHeader from '../common/PageHeader';
import { MailIcon } from '../icons/MailIcon';

const ContactPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Get In Touch"
        subtitle="Have a question, a partnership proposal, or just want to learn more? We'd love to hear from you."
      />
      
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-2xl font-bold text-deep-blue mb-4">Contact Form</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-deep-blue focus:border-deep-blue" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-deep-blue focus:border-deep-blue" />
                    </div>
                     <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                        <input type="text" id="company" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-deep-blue focus:border-deep-blue" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea id="message" rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-deep-blue focus:border-deep-blue"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-deep-blue text-white font-semibold py-3 rounded-md hover:opacity-90 transition-opacity">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-deep-blue mb-6">Our Headquarters</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        <strong>ChemXGen Inc.</strong><br/>
                        123 Molecule Lane<br/>
                        Synthesis City, 10110
                    </p>
                    <div>
                        <h3 className="font-semibold text-deep-blue">General Inquiries:</h3>
                        <a href="mailto:contact@chemxgen.com" className="text-molecular-teal hover:underline">contact@chemxgen.com</a>
                    </div>
                     <div>
                        <h3 className="font-semibold text-deep-blue">Partnerships:</h3>
                        <a href="mailto:partners@chemxgen.com" className="text-molecular-teal hover:underline">partners@chemxgen.com</a>
                    </div>
                </div>

                <div className="mt-8 h-64 bg-gray-300 rounded-md">
                     {/* Placeholder for map */}
                     <div className="w-full h-full flex items-center justify-center text-gray-500">Map Placeholder</div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
