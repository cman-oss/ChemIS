import React from 'react';
import PageHeader from '../common/PageHeader';

const PrivacyPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Privacy Policy" subtitle={`Last Updated: ${new Date().toLocaleDateString()}`} />
      
      <div className="container mx-auto px-6 py-16">
        <div className="prose lg:prose-lg max-w-4xl mx-auto">
          <h2>1. Introduction</h2>
          <p>
            Welcome to ChemXGen ("Company", "we", "our", "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@chemxgen.com.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the XGen AI platform, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials.</li>
            <li>To manage user accounts.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
            <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          </ul>

          <h2>4. Will Your Information Be Shared With Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>

          <h2>5. How Long Do We Keep Your Information?</h2>
          <p>
            We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
          </p>

          <h2>6. How Do We Keep Your Information Safe?</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
          </p>

          <h2>7. Do We Collect Information From Minors?</h2>
          <p>
            We do not knowingly solicit data from or market to children under 18 years of age.
          </p>

          <h2>8. What Are Your Privacy Rights?</h2>
          <p>
            In some regions (like the European Economic Area and the United Kingdom), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
