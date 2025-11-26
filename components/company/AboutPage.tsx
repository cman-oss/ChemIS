import React from 'react';
import PageHeader from '../common/PageHeader';

const teamMembers = [
  { name: 'Dr. Evelyn Reed', role: 'CEO & Co-Founder', imageUrl: 'https://picsum.photos/seed/evelyn/200' },
  { name: 'Dr. Kenji Tanaka', role: 'CTO & Co-Founder', imageUrl: 'https://picsum.photos/seed/kenji/200' },
  { name: 'Dr. Fatima Ahmed', role: 'Chief Scientific Officer', imageUrl: 'https://picsum.photos/seed/fatima/200' },
  { name: 'Dr. Ben Carter', role: 'Head of AI Research', imageUrl: 'https://picsum.photos/seed/ben/200' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="About ChemXGen"
        subtitle="We are a team of scientists, engineers, and innovators dedicated to solving humanity's greatest challenges at the molecular level."
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-deep-blue mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in a university lab by a team of computational chemists and AI researchers, ChemXGen was born from a shared frustration with the slow, expensive, and often unpredictable nature of traditional chemical R&D. We saw the immense potential for artificial intelligence to break through these barriers and fundamentally reshape the landscape of molecular discovery.
              </p>
              <p className="text-gray-600">
                Our journey began with a single question: "Can we teach a machine to think like a chemist?" Today, that question has evolved into the XGen AI platform, a powerful tool that empowers researchers worldwide to design better molecules, faster.
              </p>
            </div>
            <div>
              <img src="https://picsum.photos/seed/lab/600/400" alt="Science Lab" className="rounded-lg shadow-xl"/>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-deep-blue mb-4">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-molecular-teal mb-2">Mission</h3>
              <p className="text-gray-600">To empower scientists and researchers with intelligent tools that accelerate the discovery and development of novel molecules for a healthier, more sustainable world.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-molecular-teal mb-2">Vision</h3>
              <p className="text-gray-600">We envision a future where the design of life-saving drugs, sustainable materials, and revolutionary chemicals is no longer a matter of decades, but of months.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-deep-blue mb-8">Leadership Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {teamMembers.map(member => (
                    <div key={member.name}>
                        <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md"/>
                        <h3 className="font-bold text-lg text-deep-blue">{member.name}</h3>
                        <p className="text-gray-500">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
